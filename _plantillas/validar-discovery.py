"""Checks de rutas, contenido editorial, sitemap, fuentes y regresiones comerciales."""
import json
import re
import sys
import xml.etree.ElementTree as ET
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT/'site'
DATA = json.loads((ROOT/'_plantillas/discovery-content.json').read_text(encoding='utf-8'))
HOST = 'https://www.studio32.es'


class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.meta={}; self.links=[]; self.canonical=[]; self.h1=0; self.ids=[]; self.text=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a: self.ids.append(a['id'])
        if tag=='h1': self.h1+=1
        if tag=='meta': self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href'))
        if tag=='a' and a.get('href'): self.links.append(a['href'])
    def handle_data(self,data): self.text.append(data)


def main():
    errors=[]
    import importlib.util
    import subprocess
    guard_spec = importlib.util.spec_from_file_location('publication_safety', ROOT/'_plantillas/publication-safety.py')
    guard = importlib.util.module_from_spec(guard_spec)
    guard_spec.loader.exec_module(guard)
    errors.extend(guard.check_site(SITE))
    security_test = subprocess.run([sys.executable, str(ROOT/'_plantillas/test-content-security.py')])
    editorial_test = subprocess.run([sys.executable, str(ROOT/'_plantillas/test-editorial-maintenance.py')])
    editorial_check = subprocess.run([sys.executable, str(ROOT/'_plantillas/editorial-maintenance.py')], capture_output=True, text=True)
    if editorial_test.returncode or editorial_check.returncode:
        errors.append('fechas o estado editorial no válidos')
    if security_test.returncode: errors.append('pruebas de seguridad editorial fallan')
    files={f.relative_to(SITE).as_posix():f for f in SITE.rglob('*.html')}
    parsed={}
    for name,file in files.items():
        p=Parser(); p.feed(file.read_text(encoding='utf-8')); parsed[name]=p
    names=['index.html']+[s+'/index.html' for s in ('panel-de-control','precio-agente-whatsapp','agente-whatsapp-clinicas-dentales','agente-whatsapp-restaurantes','agente-whatsapp-centros-esteticos','agente-whatsapp-servicios-locales','recursos','problemas','herramientas')]+[p['slug']+'/index.html' for p in DATA['pages']]
    titles=[]; descriptions=[]
    for name in names:
        p=parsed[name]; source=files[name].read_text(encoding='utf-8')
        def require(condition,message):
            if not condition: errors.append(name+': '+message)
        require(p.h1==1,'H1 único')
        require(len(p.ids)==len(set(p.ids)),'IDs duplicados')
        title=re.search(r'<title>(.*?)</title>',source,re.S)
        require(bool(title),'title ausente')
        if title: titles.append(title[1])
        require(bool(p.meta.get('description')),'description ausente'); descriptions.append(p.meta.get('description',''))
        expected=HOST+'/'+name.removesuffix('index.html')
        require(p.canonical==[expected],'canonical incorrecta')
        require(p.meta.get('og:url')==expected,'og:url no coincide')
        require('noindex' not in p.meta.get('robots',''),'noindex accidental')
        for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',source,re.S):
            try:
                schema=json.loads(raw)
                for entity in schema.get('@graph',[schema]):
                    if entity.get('@type')=='Article':
                        from datetime import datetime
                        stamp=datetime.fromisoformat(entity['dateModified'])
                        require(stamp.tzinfo is not None,'Article dateModified necesita zona horaria')
            except ValueError: errors.append(name+': JSON-LD no parseable')
        if name.startswith(('recursos/','problemas/','herramientas/')):
            require('script.js?' not in source,'recurso carga backend/animaciones globales')
            require('localhost' not in source and '127.0.0.1' not in source,'URL local')
            require(not re.search(r'\{\{|lorem ipsum|\[\[',source,re.I),'marcador no renderizado')
        for href in p.links:
            parts=urlsplit(href)
            if parts.scheme or parts.netloc: continue
            dest=files[name].parent/unquote(parts.path) if not parts.path.startswith('/') else SITE/unquote(parts.path.lstrip('/'))
            if not parts.path: dest=files[name]
            if dest.is_dir(): dest/='index.html'
            require(dest.exists(),'enlace roto: '+href)
            if parts.fragment and dest.exists():
                target=Parser(); target.feed(dest.read_text(encoding='utf-8'))
                require(unquote(parts.fragment) in target.ids,'ancla rota: '+href)
    for kind,values in [('title',titles),('description',descriptions)]:
        for value,count in Counter(values).items():
            if count>1: errors.append(kind+' duplicado: '+value)
    urls=[e.text for e in ET.parse(SITE/'sitemap.xml').getroot().iter() if e.tag.endswith('}loc') or e.tag=='loc']
    if len(urls)!=len(set(urls)): errors.append('sitemap duplicado')
    for url in urls:
        dest=SITE/unquote(urlsplit(url).path.lstrip('/'))
        if dest.is_dir(): dest/='index.html'
        name=dest.relative_to(SITE).as_posix()
        if name not in parsed: errors.append('sitemap destino ausente: '+url); continue
        if 'noindex' in parsed[name].meta.get('robots','') or parsed[name].canonical!=[url]: errors.append('sitemap no canónico/indexable: '+url)
    for name in names:
        if parsed[name].canonical[0] not in urls: errors.append('falta sitemap: '+name)
    incoming=Counter()
    for name in names:
        for href in parsed[name].links:
            parts=urlsplit(href)
            if parts.scheme or parts.netloc: continue
            dest=(files[name].parent/unquote(parts.path)).resolve()
            if dest.is_dir(): dest/='index.html'
            if dest!=files[name].resolve(): incoming[str(dest)]+=1
    for p in DATA['pages']:
        if incoming[str((SITE/p['slug']/'index.html').resolve())]<2: errors.append('menos de 2 entradas: '+p['slug'])
        for key in p['sources']:
            if key not in DATA['sources']: errors.append('fuente ausente: '+key)
    price=(SITE/'precio-agente-whatsapp/index.html').read_text(encoding='utf-8')
    if re.search(r'1\.000|80 y 400|19 €/mes',price): errors.append('tarifas antiguas o cifras sin fuente')
    robots=(SITE/'robots.txt').read_text(encoding='utf-8')
    if 'User-agent: GPTBot' in robots: errors.append('política GPTBot alterada')
    if 'User-agent: OAI-SearchBot\nAllow: /' not in robots: errors.append('OAI-SearchBot no permitido')
    # Las mismas fuentes de marca, ahora locales: comprobar referencias y trazabilidad.
    font_manifest=SITE/'assets/fonts/SOURCES.json'
    if font_manifest.exists():
        import hashlib
        for font in json.loads(font_manifest.read_text(encoding='utf-8')):
            file=font_manifest.parent/font['file']
            if not file.exists() or hashlib.sha256(file.read_bytes()).hexdigest()!=font['sha256']:
                errors.append('fuente ausente o modificada: '+font['file'])
        css=(SITE/'discovery.css').read_text(encoding='utf-8') + ((SITE/'home-foundation.css').read_text(encoding='utf-8') if (SITE/'home-foundation.css').exists() else '')
        for url in re.findall(r'url\(([^)]+)\)',css):
            if url.startswith('assets/fonts/') and not (SITE/url).exists(): errors.append('CSS fuente rota: '+url)
        for license in ('inter-OFL.txt','playfairdisplay-OFL.txt','syne-OFL.txt'):
            if 'SIL OPEN FONT LICENSE' not in (font_manifest.parent/license).read_text(encoding='utf-8'):
                errors.append('licencia OFL ausente: '+license)
    old=json.loads((ROOT/'docs/seo/PERFORMANCE_BASELINE.json').read_text())
    approved=json.loads((ROOT/'docs/seo/PERFORMANCE_APPROVED.json').read_text()) if (ROOT/'docs/seo/PERFORMANCE_APPROVED.json').exists() else {}
    for name in ('script.js','styles.css','vertical.css'):
        import hashlib
        expected=old[name]['sha256']
        if name in approved:
            if approved[name]['original_sha256']!=expected: errors.append('baseline historica alterada: '+name)
            expected=approved[name]['sha256']
        raw=(SITE/name).read_bytes()
        matches=hashlib.sha256(raw).hexdigest()==expected
        if name in approved and approved[name].get('sha256_lf'):
            matches=matches or hashlib.sha256(raw.replace(b'\r\n',b'\n')).hexdigest()==approved[name]['sha256_lf']
        if not matches: errors.append('base comercial alterada: '+name)
    print(f'{len(names)} páginas de producto/discovery verificadas; {len(urls)} URL de sitemap; {len(errors)} errores.')
    for error in errors: print(error)
    return bool(errors)


if __name__=='__main__': sys.exit(main())
