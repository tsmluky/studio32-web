"""Foundation idempotente para HTML existente y sitemap desde canonical reales."""
import hashlib
import html
import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import unquote, urlsplit
from datetime import date
from site_routes import html_target

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
HOST = 'https://www.studio32.es'
VERSION = '20261002-events-2'
COMMERCIAL = ['index.html'] + [p + '/index.html' for p in (
    'agente-whatsapp-clinicas-dentales', 'agente-whatsapp-restaurantes',
    'agente-whatsapp-centros-esteticos', 'agente-whatsapp-servicios-locales',
    'precio-agente-whatsapp', 'panel-de-control')]


def snapshot():
    rows = []
    for f in sorted(SITE.rglob('*.html')):
        source = f.read_text(encoding='utf-8')
        rows.append({'file': f.relative_to(SITE).as_posix(), 'canonical': re.findall(r'<link\s+rel="canonical"\s+href="([^"]+)"', source),
                     'noindex': bool(re.search(r'<meta[^>]+(?:name="robots"[^>]+content="[^"]*noindex|content="[^"]*noindex[^>]+name="robots")',source)),
                     'h1':len(re.findall(r'<h1\b',source)), 'bytes':f.stat().st_size,
                     'scripts':re.findall(r'<script[^>]+src="([^"]+)"',source)})
    (ROOT/'docs/seo/URL_INVENTORY.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    sizes = {name: {'bytes': (SITE/name).stat().st_size, 'sha256':hashlib.sha256((SITE/name).read_bytes()).hexdigest()} for name in ('index.html','styles.css','script.js','vertical.css')}
    (ROOT/'docs/seo/PERFORMANCE_BASELINE.json').write_text(json.dumps(sizes,indent=2)+'\n',encoding='utf-8')


def enhance(path):
    source = path.read_text(encoding='utf-8')
    canonical = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"',source)[1]
    slug = urlsplit(canonical).path.strip('/')
    prefix = '../' * len(slug.split('/')) if slug else ''
    if path.name == 'index.html' and not slug:
        def organization(match):
            data = json.loads(match[1])
            if data.get('@type') != 'ProfessionalService':
                return match[0]
            data['@type'] = 'Organization'
            for key in ('priceRange','availableChannel','serviceType','logo'):
                data.pop(key,None)
            return '<script type="application/ld+json">\n'+json.dumps(data,ensure_ascii=False,indent=2)+'\n</script>'
        source = re.sub(r'<script type="application/ld\+json">\s*(.*?)\s*</script>',organization,source,flags=re.S)
        source = re.sub(r'<!--\s*JSON-LD · Datos estructurados.*?-->', '<!-- JSON-LD: entidad Studio32, con datos de contacto reales. -->',source,flags=re.S)
    if slug and '"BreadcrumbList"' not in source:
        match = re.search(r'<title>(.*?)</title>',source,re.S)
        name = html.unescape(match[1].split('|')[0].strip())
        schema = {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
            {'@type':'ListItem','position':1,'name':'Studio32','item':HOST+'/'},
            {'@type':'ListItem','position':2,'name':name,'item':canonical}]}
        source = source.replace('</head>', '<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False)+'</script>\n</head>')
    if not re.search(r'discovery-events(?:\.min)?\.js', source):
        source = source.replace('</head>',f'<script src="{prefix}discovery-events.js?v={VERSION}" defer></script>\n</head>')
    if not re.search(r'measurement-consent(?:\.min)?\.js', source):
        source=source.replace('</head>', f'<link rel="stylesheet" href="{prefix}measurement-consent.css?v=20261004-cookies-1">\n<script src="{prefix}measurement-consent.js?v=20261004-cookies-1" defer></script>\n</head>')
    if 'data-discovery-links' not in source:
        links = f'<a href="{prefix}recursos/" data-discovery-links>Recursos de recepción</a>\n<a href="{prefix}herramientas/">Herramientas</a>'
        pattern = r'(<nav class="footer-col"[^>]*>\s*<p class="footer-col-titulo">El agente</p>)'
        if re.search(pattern,source):
            source = re.sub(pattern,lambda m: m[1]+'\n'+links,source,count=1)
        else:
            # Home uses a different footer heading; retain its current grouping.
            pattern = r'(<p class="footer-col-titulo">El agente</p>)'
            source = re.sub(pattern,lambda m: m[1]+'\n'+links,source,count=1)
    related = {
        '': [('problemas/llamadas-y-mensajes-perdidos','Revisar cómo medir consultas pendientes'),('herramientas/calculadora-consultas-perdidas','Estimar su valor potencial')],
        'agente-whatsapp-clinicas-dentales': [('recursos/automatizar-citas-whatsapp','Revisar el recorrido de una cita'),('recursos/integrar-whatsapp-con-agenda','Qué comprobar al conectar la agenda')],
        'agente-whatsapp-centros-esteticos': [('recursos/recepcionista-ia','Repartir tareas entre agente y equipo'),('recursos/automatizar-citas-whatsapp','Evaluar el recorrido de citas')],
        'agente-whatsapp-restaurantes': [('problemas/consultas-fuera-de-horario','Elegir cómo atender al cerrar'),('recursos/integrar-whatsapp-con-agenda','Revisar disponibilidad y reservas')],
        'agente-whatsapp-servicios-locales': [('problemas/recepcion-saturada','Ordenar una recepción saturada'),('recursos/handoff-humano-agente-ia','Definir cuándo interviene el equipo')],
        'panel-de-control': [('recursos/handoff-humano-agente-ia','Evaluar la toma de control humano'),('recursos/numero-actual-whatsapp-business-api','Revisar el número y el canal del equipo')],
        'precio-agente-whatsapp': [('recursos/whatsapp-business-api','Qué aporta la API de WhatsApp'),('recursos/chatbot-vs-agente-ia-whatsapp','Elegir el tipo de sistema')]
    }
    # Solo enlaces en el pie existente: no añadir una sección repetida a la portada.
    source = re.sub(r'<section class="section" id="criterio-recepcion">.*?</section>\s*','',source,flags=re.S)
    if 'data-discovery-context' not in source:
        contextual = ''.join(f'\n<a href="{prefix+target}/" data-discovery-context>{label}</a>' for target,label in related[slug])
        source = source.replace(f'<a href="{prefix}herramientas/">Herramientas</a>',f'<a href="{prefix}herramientas/">Herramientas</a>'+contextual)
    path.write_text(source,encoding='utf-8')


def correct_prices():
    path = SITE/'precio-agente-whatsapp/index.html'
    source = path.read_text(encoding='utf-8')
    answer = 'El presupuesto se divide en puesta en marcha y acompañamiento mensual. Se concreta tras revisar catálogo, agenda, canales y alcance de la implantación, y se cierra por escrito antes de empezar.'
    meta = 'Meta cobra por mensaje entregado según categoría y mercado. Los mensajes de servicio no tienen cargo de Meta; otros mensajes pueden tenerlo. El proveedor puede añadir costes propios. Consulta las tarifas vigentes y el alcance del presupuesto.'
    def fix_schema(match):
        data = json.loads(match[1])
        if data.get('@type')=='FAQPage':
            for question in data['mainEntity']:
                if question['name'].startswith('¿Cuánto cuesta'): question['acceptedAnswer']['text'] = answer
                if question['name'].startswith('¿Meta cobra'): question['acceptedAnswer']['text'] = meta
                if question['name'].startswith('¿De quién es el número'):
                    question['acceptedAnswer']['text'] = 'El número debe quedar bajo control del negocio. Antes de contratar, acuerda el acceso a la cuenta, la conservación o exportación del historial y el procedimiento para cambiar de proveedor.'
        return '<script type="application/ld+json">\n'+json.dumps(data,ensure_ascii=False,indent=2)+'\n</script>'
    source = re.sub(r'<script type="application/ld\+json">\s*(.*?)\s*</script>',fix_schema,source,flags=re.S)
    source = re.sub(r'<p>El mercado se mueve en dos tramos:.*?</p>', '<p>'+answer+'</p>',source,flags=re.S)
    source = re.sub(r'<p>Sí, pero en una recepción suele salir cero\..*?</p>', '<p>'+meta+'</p>',source,flags=re.S)
    source = re.sub(r'<h3>Si te escriben ellos, no se paga</h3>\s*<p>.*?</p>', '<h3>Servicio sin cargo de Meta</h3><p>Meta no cobra los mensajes de servicio. Eso no elimina los costes del proveedor o de la implantación.</p>',source,flags=re.S)
    source = re.sub(r'<h3>(?:Las primeras mil, gratis|Tarifas por mensaje)</h3>\s*<p>.*?</p>', '<h3>Tarifas por mensaje</h3><p>El modelo vigente cobra por mensaje entregado según categoría y mercado. Comprueba las condiciones aplicables al uso que hará tu negocio.</p>',source,flags=re.S)
    source = re.sub(r'<h3>Lo que sí cuesta</h3>\s*<p>.*?</p>', '<h3>Otros mensajes y proveedor</h3><p>Los mensajes de otras categorías pueden tener coste. Revisa también los cargos propios del proveedor antes de contratar.</p>',source,flags=re.S)
    source = re.sub(r'<p class="nota-fuente">Tarifas de Meta.*?</p>', '<p class="nota-fuente">Fuente: <a href="https://business.whatsapp.com/products/platform-pricing">tarifas oficiales de WhatsApp Business Platform</a>. Consultada el 2 de octubre de 2026. Comprueba las tarifas al contratar.</p>',source,flags=re.S)
    source = source.replace('los dos tramos, lo que cobra Meta aparte (y por qué en una recepción suele ser cero) y las trampas del sector.','puesta en marcha, acompañamiento y costes de plataforma y proveedor. Presupuesto según el alcance del negocio.')
    source = re.sub(r'<p>Una inversión inicial para dejarlo funcionando y una cuota mensual para que siga siéndolo\. No\s+hay más conceptos\.</p>', '<p>La propuesta de Studio32 separa la puesta en marcha del acompañamiento. El presupuesto detalla también los costes de plataforma y proveedor que correspondan.</p>',source)
    source = re.sub(r'<p>Tiene que ser tuyo\. Si está a nombre de la agencia,.*?</p>', '<p>El número debe quedar bajo control del negocio. Acuerda el acceso a la cuenta, qué historial se conserva o exporta y cómo cambiar de proveedor.</p>',source,flags=re.S)
    path.write_text(source,encoding='utf-8')


def sitemap():
    state_path = ROOT/'docs/seo/SITEMAP_STATE.json'
    previous = json.loads(state_path.read_text(encoding='utf-8')) if state_path.exists() else {}
    # Initial lastmod values refer to existing sitemap, not filesystem checkout dates.
    existing_dates = {}
    if (SITE/'sitemap.xml').exists():
        tree = ET.parse(SITE/'sitemap.xml')
        for url in tree.getroot():
            entries = {child.tag.split('}')[-1]:child.text for child in url}
            if 'loc' in entries and 'lastmod' in entries: existing_dates[entries['loc']] = entries['lastmod']
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    root = ET.Element('{http://www.sitemaps.org/schemas/sitemap/0.9}urlset')
    state = {}
    for file in sorted(SITE.rglob('*.html')):
        source = file.read_text(encoding='utf-8')
        if re.search(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex',source,re.I): continue
        match = re.search(r'<link\s+rel="canonical"\s+href="([^"]+)"',source)
        if not match: continue
        canonical = match[1]
        if not canonical.startswith(HOST+'/'): raise ValueError(f'Host canonical ajeno: {file}')
        slug = urlsplit(canonical).path
        target = html_target(SITE, canonical)
        if target.resolve() != file.resolve(): continue  # aliases are not canonical routes
        digest = hashlib.sha256(source.encode()).hexdigest()
        old = previous.get(canonical,{})
        lastmod = old.get('lastmod') if old.get('sha256')==digest else date.today().isoformat()
        if not previous and file.relative_to(SITE).as_posix() not in COMMERCIAL:
            lastmod = existing_dates.get(canonical,'2026-10-02')
        state[canonical] = {'sha256':digest,'lastmod':lastmod}
        url = ET.SubElement(root,'url'); ET.SubElement(url,'loc').text = canonical; ET.SubElement(url,'lastmod').text = lastmod
    ET.indent(root,space='  ')
    (SITE/'sitemap.xml').write_bytes(ET.tostring(root,encoding='utf-8',xml_declaration=True)+b'\n')
    state_path.write_text(json.dumps(state,indent=2)+'\n',encoding='utf-8')
    print(f'Sitemap: {len(state)} URL canónicas indexables.')


def main():
    if not (ROOT/'docs/seo/URL_INVENTORY.json').exists(): snapshot()
    correct_prices()
    for name in COMMERCIAL: enhance(SITE/name)
    # Preserve the public design demos already present in the original sitemap.
    # Cloudflare normaliza .html e index.html: canonical apunta al destino final.
    demos = {"Landing1-L'Obscur/restaurant_landing.html": "Landing1-L%27Obscur/restaurant_landing", 'Landing2-PrimeBurger/index.html': 'Landing2-PrimeBurger/', 'Landing4-Habitat/index.html': 'Landing4-Habitat/'}
    for name, route in demos.items():
        path = SITE/name
        source = path.read_bytes()
        addition = f'<link rel="canonical" href="{HOST}/{route}">'.encode()
        if b'rel="canonical"' not in source:
            addition += b'\n'
            source = source.replace(b'</head>',addition+b'</head>')
        else:
            source = re.sub(rb'<link\s+rel="canonical"[^>]*>', lambda _: addition, source)
        path.write_bytes(source)
    robots = (SITE/'robots.txt').read_text(encoding='utf-8')
    if 'User-agent: OAI-SearchBot' not in robots:
        robots += '\n# Descubrimiento en Search; no altera la política vigente de GPTBot.\nUser-agent: OAI-SearchBot\nAllow: /\n'
        (SITE/'robots.txt').write_text(robots,encoding='utf-8')
    sitemap()


if __name__=='__main__': main()
