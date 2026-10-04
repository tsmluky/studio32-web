"""Diagnóstico técnico público acotado. Python estándar, sin cuentas ni pagos."""
import argparse
from datetime import datetime, timezone
from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, urlunsplit, unquote
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

AGENT = 'Studio32-Public-SEO-Audit/1.0'
MAX_BYTES = 2_000_000


def public_url(value):
    parts = urlsplit(value)
    if parts.scheme not in ('http', 'https') or not parts.hostname or parts.username or parts.password:
        raise ValueError('Introduce una URL HTTP/HTTPS pública sin credenciales.')
    return urlunsplit((parts.scheme, parts.netloc, parts.path or '/', '', ''))


class Redirects(HTTPRedirectHandler):
    def __init__(self): self.hops = []
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        self.hops.append({'from': req.full_url, 'status': code, 'to': newurl})
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def fetch(url):
    redirects = Redirects()
    start = time.perf_counter()
    result = {'requested_url': url, 'redirects': redirects.hops}
    try:
        with build_opener(redirects).open(Request(url, headers={'User-Agent': AGENT}), timeout=15) as response:
            body = response.read(MAX_BYTES + 1)
            result.update(status=response.status, final_url=response.url, headers=dict(response.headers), elapsed_ms=round((time.perf_counter()-start)*1000), truncated=len(body)>MAX_BYTES)
            result['body'] = body[:MAX_BYTES].decode(response.headers.get_content_charset() or 'utf-8', 'replace')
    except HTTPError as error:
        result.update(status=error.code, final_url=error.url, error=str(error))
    except (URLError, TimeoutError, OSError, ValueError) as error:
        result.update(status=None, error=str(error))
    return result


class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=[]; self.in_title=False; self.description=None; self.canonicals=[]; self.robots=''; self.h1=0; self.links=[]; self.viewport=False; self.lang=None; self.jsonld=[]; self.in_jsonld=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='html': self.lang=a.get('lang')
        if tag=='h1': self.h1+=1
        if tag=='meta':
            name=a.get('name','').lower()
            if name=='description': self.description=a.get('content','')
            if name=='robots': self.robots=a.get('content','')
            if name=='viewport': self.viewport=True
        if tag=='link' and 'canonical' in a.get('rel','').split(): self.canonicals.append(a.get('href',''))
        if tag=='a' and a.get('href'): self.links.append(a['href'])
        if tag=='script' and a.get('type')=='application/ld+json': self.in_jsonld=True
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
        if tag=='script': self.in_jsonld=False
    def handle_data(self, data):
        if self.in_title: self.title.append(data)
        if self.in_jsonld: self.jsonld.append(data)


def analyse(result):
    findings=[]
    if result.get('status') != 200:
        return [{'priority':'Alta', 'finding':'Respuesta no satisfactoria o acceso no verificado', 'evidence':str(result.get('status')) + ': ' + result.get('error',''), 'action':'Comprobar servidor, ruta y acceso. Un 403 puede depender del agente usado.'}]
    headers={k.lower():v for k,v in result.get('headers',{}).items()}
    if 'html' not in headers.get('content-type','').lower():
        return [{'priority':'Revisar','finding':'El destino no es HTML','evidence':headers.get('content-type',''),'action':'Confirmar que esta URL debe ser una página web.'}]
    page=Page(); page.feed(result.get('body',''))
    result.update(title=''.join(page.title).strip(), description=page.description, canonicals=page.canonicals, robots=page.robots, h1_count=page.h1, viewport=page.viewport, lang=page.lang, internal_links=[urljoin(result['final_url'],href) for href in page.links if urlsplit(urljoin(result['final_url'],href)).hostname==urlsplit(result['final_url']).hostname])
    def add(priority, finding, evidence, action): findings.append(dict(priority=priority,finding=finding,evidence=evidence,action=action))
    if result.get('truncated'): add('Revisar','Respuesta recortada por límite de tamaño','2 MB máximo','Revisar manualmente antes de dar por completas las comprobaciones.')
    if 'noindex' in (page.robots+' '+headers.get('x-robots-tag','')).lower(): add('Revisar','Instrucción noindex detectada',page.robots or headers.get('x-robots-tag',''),'Confirmar intención. Demos y páginas legales pueden excluirse correctamente.')
    if not result['title']: add('Media','Título ausente','','Escribir un título específico de la página.')
    if not page.description: add('Media','Metadescripción ausente','','Describir la página sin prometer resultados inventados.')
    if len(page.canonicals)!=1: add('Media','Canónica ausente o múltiple',str(page.canonicals),'Declarar una dirección canónica única cuando proceda.')
    elif unquote(urljoin(result['final_url'],page.canonicals[0]))!=unquote(result['final_url']): add('Revisar','Canónica distinta al destino final',page.canonicals[0],'Comprobar duplicado intencionado o dirección que redirige; no cambiar automáticamente.')
    if page.h1!=1: add('Baja','Revisar jerarquía principal',str(page.h1)+' H1','Revisar semántica y diseño. No equivale a una penalización.')
    if not page.viewport: add('Media','Viewport ausente','','Revisar adaptación móvil en navegador.')
    if len(result['redirects'])>1: add('Media','Cadena de redirecciones',str(len(result['redirects']))+' saltos','Apuntar los enlaces al destino final estable.')
    if not result['final_url'].startswith('https://'): add('Alta','Destino servido por HTTP',result['final_url'],'Revisar HTTPS y redirección segura.')
    return findings


def sitemap_urls(result, host):
    if result.get('status')!=200 or result.get('truncated'): return []
    try:
        root=ET.fromstring(result.get('body',''))
        if root.tag.rsplit('}',1)[-1]!='urlset': return []
        return list(dict.fromkeys(public_url(node.text) for node in root.iter() if node.tag.rsplit('}',1)[-1]=='loc' and node.text and urlsplit(node.text).hostname==host))
    except (ET.ParseError, ValueError): return []


def run(site, name, sector, out, limit=25):
    home=fetch(public_url(site)); findings=analyse(home)
    base=home.get('final_url', public_url(site)); parts=urlsplit(base)
    origin=urlunsplit((parts.scheme,parts.netloc,'/','',''))
    robots=fetch(urljoin(origin,'robots.txt')); sitemap=fetch(urljoin(origin,'sitemap.xml'))
    robot=RobotFileParser(); robot.parse(robots.get('body','').splitlines())
    urls=sitemap_urls(sitemap,parts.hostname)
    # Sin mapa utilizable: muestra acotada de enlaces que sí aparecen en portada.
    candidates=list(dict.fromkeys([base]+urls+(home.get('internal_links',[]) if not urls else [])))
    candidates=list(dict.fromkeys(public_url(url) for url in candidates if urlsplit(url).hostname==parts.hostname))[:limit]
    pages=[]
    for url in candidates:
        if robots.get('status')==200 and not robot.can_fetch(AGENT,url):
            pages.append({'requested_url':url,'status':None,'skipped':'robots.txt'});continue
        item=home if url==base else fetch(url)
        page_findings=analyse(item)
        for finding in page_findings: finding['url']=url
        pages.append({key:value for key,value in item.items() if key!='body'})
        if url!=base: findings.extend(page_findings)
    for finding in findings: finding.setdefault('url',base)
    if not urls: findings.append({'priority':'Revisar','finding':'Sitemap no verificado como urlset','evidence':str(sitemap.get('status')),'action':'Comprobar sitemap alternativo o sitemap index manualmente; esta versión no los recorre.','url':sitemap['requested_url']})
    report={'schema_version':1,'business':name,'sector':sector,'created_utc':datetime.now(timezone.utc).isoformat(),'site':site,'scope':{'limit':limit,'checked':len(pages),'sitemap_urls':len(urls),'google_data':'No conectado; pendiente Search Console','performance':'Tiempo HTTP de descarga; no LCP ni Core Web Vitals','limitations':['HTML estático; no ejecuta JavaScript','No evalúa posiciones, conversiones, competencia, Google Business Profile ni accesibilidad completa','No valida indexación Google; una respuesta 200 no acredita indexación','No rastrea todos los enlaces internos ni sitemaps anidados','No cambia el sitio ni cuentas del cliente']},'robots':{key:value for key,value in robots.items() if key!='body'},'sitemap':{key:value for key,value in sitemap.items() if key!='body'},'pages':pages,'findings':findings}
    out=Path(out);out.mkdir(parents=True,exist_ok=True)
    # Mantener cada ejecución; no sobrescribir una baseline del cliente.
    destination=out/datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ');destination.mkdir()
    (destination/'evidencia.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
    rows=''.join('<tr>'+''.join('<td>'+escape(str(finding[key]))+'</td>' for key in ('priority','finding','url','evidence','action'))+'</tr>' for finding in findings)
    counts=f'{len(pages)} páginas revisadas · {len(urls)} URLs del sitemap · {len(findings)} puntos para revisar'
    content=f'''<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Studio32 · Diagnóstico de {escape(name)}</title><style>body{{background:#f6f0e5;color:#1c1812;font:16px/1.6 system-ui;margin:0}}main{{max-width:1100px;margin:auto;padding:32px}}h1{{font:40px/1.2 Georgia,serif}}.label{{color:#8a6421}}section{{background:#fffaf2;padding:24px;margin:24px 0;border:1px solid #d4c7b2;border-radius:12px}}table{{border-collapse:collapse;width:100%;font-size:14px}}td,th{{padding:12px;border-bottom:1px solid #d4c7b2;text-align:left;vertical-align:top;overflow-wrap:anywhere}}.scroll{{overflow:auto}}@media(max-width:600px){{main{{padding:16px}}h1{{font-size:30px}}table{{min-width:800px}}}}</style><main><p class="label">STUDIO32 · PRESENCIA Y DESCUBRIMIENTO</p><h1>Diagnóstico de {escape(name)}</h1><p>{escape(sector)} · {escape(site)}</p><p>{escape(counts)}</p><section><h2>Qué podemos acreditar</h2><p>Este informe recoge respuestas y HTML públicos. Los puntos detectados requieren interpretar la intención de cada página antes de corregir.</p><p><strong>Posicionamiento y resultados comerciales: pendientes de datos de Google y del negocio.</strong> No ofrecemos una puntuación que pueda confundirse con visitas o ventas.</p></section><section><h2>Trabajo propuesto</h2><div class="scroll"><table><thead><tr><th>Prioridad</th><th>Hallazgo</th><th>URL</th><th>Evidencia</th><th>Acción</th></tr></thead><tbody>{rows}</tbody></table></div></section><section><h2>Siguiente revisión con el negocio</h2><ol><li>Search Console: consultas, páginas, indexación y periodo de comparación.</li><li>Google Business Profile: titularidad, datos reales, categoría, servicios y contacto.</li><li>Experiencia móvil: contacto, reservas, teclado y consentimiento.</li><li>Correcciones acordadas, prueba antes/después y publicación.</li><li>Seguimiento de consultas comerciales y contactos; definir qué se cuenta como contacto válido.</li></ol><p>Ni rankings ni un número de clientes están garantizados. La medición debe identificar periodo, fuente y volumen.</p></section><p>Alcance: {escape('; '.join(report['scope']['limitations']))}.</p><p>Fecha UTC: {escape(report['created_utc'])}. Evidencia junto al informe: evidencia.json.</p></main></html>'''
    (destination/'informe.html').write_text(content,encoding='utf-8')
    print(str((destination/'informe.html').resolve()))
    return report


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site');parser.add_argument('--name',default='Negocio');parser.add_argument('--sector',default='Por concretar');parser.add_argument('--out',default='diagnosticos');parser.add_argument('--limit',type=int,default=25);parser.add_argument('--interactive',action='store_true')
    args=parser.parse_args()
    if args.interactive:
        args.site=input('URL pública del negocio: ').strip();args.name=input('Nombre del negocio: ').strip() or 'Negocio';args.sector=input('Sector: ').strip() or 'Por concretar'
        args.out=str(Path(__file__).parent/'diagnosticos')
    if not args.site:parser.error('Falta --site o --interactive')
    if not 1<=args.limit<=50:parser.error('--limit debe estar entre 1 y 50')
    try:run(args.site,args.name,args.sector,args.out,args.limit)
    except ValueError as error:parser.error(str(error))


if __name__=='__main__':main()
