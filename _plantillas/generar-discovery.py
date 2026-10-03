"""Render editorial estático con biblioteca estándar. No ejecuta HTML del contenido.

python _plantillas/generar-discovery.py
Salida versionada; no añade un paso de build al proveedor de hosting.
"""
import html
import importlib.util
import json
import os
import re
from pathlib import Path
from urllib.parse import quote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
_spec = importlib.util.spec_from_file_location('editorial_maintenance', Path(__file__).with_name('editorial-maintenance.py'))
maintenance = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(maintenance)
SITE = ROOT / 'site'
DATA = json.loads((Path(__file__).with_name('discovery-content.json')).read_text(encoding='utf-8'))
HOST = 'https://www.studio32.es/'
VERSION = DATA['version']
EVENT_VERSION = '20261002-events-2'
PAGES = {p['slug']: p for p in DATA['pages']}
HUBS = {
    'recursos': ('Recursos', 'Decisiones claras para una recepción conectada.', 'Guías para elegir el canal, conectar la agenda y mantener el control del equipo.'),
    'problemas': ('Problemas de recepción', 'Empieza por lo que queda pendiente.', 'Identifica dónde se atasca la atención y compara opciones antes de automatizar.'),
    'herramientas': ('Herramientas', 'Pon a prueba tus supuestos.', 'Una herramienta para explorar el problema con tus cifras, sin pedirte un email.')
}


def esc(value):
    return html.escape(str(value), quote=True)


def safe_slug(value):
    if not isinstance(value, str) or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*(?:/[a-z0-9]+(?:-[a-z0-9]+)*)*', value):
        raise ValueError('Ruta editorial no válida')
    if not (SITE / value).resolve().is_relative_to(SITE.resolve()):
        raise ValueError('Ruta editorial fuera del sitio')
    return value


def safe_source_url(value):
    if not isinstance(value, str) or any(c.isspace() or ord(c) < 32 for c in value):
        raise ValueError('URL de fuente no válida')
    parts = urlsplit(value)
    if parts.scheme != 'https' or not parts.hostname or parts.username or parts.password or '\\' in value:
        raise ValueError('La fuente necesita HTTPS y no puede contener credenciales')
    return value


def validate_content(data):
    maintenance.validate(data)
    seen = set()
    for page in data['pages']:
        slug = safe_slug(page['slug'])
        if slug in seen:
            raise ValueError('Ruta editorial duplicada')
        seen.add(slug)
        if slug.split('/')[0] not in HUBS or len(slug.split('/')) != 2:
            raise ValueError('Contenido fuera de los hubs editoriales')
        safe_slug(page['commercialTarget'])
        for target in page['related']:
            safe_slug(target)
    for source in data['sources'].values():
        safe_source_url(source['url'])
    for page in data['pages']:
        if any(target not in seen for target in page['related']):
            raise ValueError('Contenido relacionado ausente')
        if any(key not in data['sources'] for key in page['sources']):
            raise ValueError('Fuente editorial ausente')


def relative(slug, target):
    if slug: safe_slug(slug)
    if target: safe_slug(target)
    depth = len(slug.split('/')) if slug else 0
    # Pages live in slug/index.html; root-relative paths are avoided by convention.
    return '../' * depth + target.strip('/') + ('/' if target else '')


def text(value, slug):
    result, end = [], 0
    for match in re.finditer(r'\[\[([a-z0-9/-]+)\|([^\]]+)\]\]', value):
        result.append(esc(value[end:match.start()]))
        result.append(f'<a href="{relative(slug, match[1])}">{esc(match[2])}</a>')
        end = match.end()
    result.append(esc(value[end:]))
    return ''.join(result)


def jsonld(data):
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False).replace('<', '\\u003c') + '</script>'


def layout(slug, title, description, answer, content, page_type='hub', reviewed=None):
    prefix = '../' * len(slug.split('/')) if slug else ''
    hub = slug.split('/')[0] if slug else ''
    crumb = '<a href="' + (prefix or './') + '">Studio32</a>'
    crumbs = [{'@type': 'ListItem', 'position': 1, 'name': 'Studio32', 'item': HOST}]
    if hub in HUBS:
        name = HUBS[hub][0]
        if '/' in slug:
            crumb += f'<span aria-hidden="true">/</span><a href="../">{esc(name)}</a>'
            crumbs.append({'@type': 'ListItem', 'position': 2, 'name': name, 'item': HOST + hub + '/'})
        crumb += f'<span aria-hidden="true">/</span><span aria-current="page">{esc(title if "/" in slug else name)}</span>'
        crumbs.append({'@type': 'ListItem', 'position': len(crumbs)+1, 'name': title, 'item': HOST+slug+'/'})
    graph = [{'@type': 'BreadcrumbList', 'itemListElement': crumbs}]
    if page_type in ('guide', 'problem'):
        graph.append({'@type': 'Article', 'headline': title, 'description': description,
                      'mainEntityOfPage': HOST+slug+'/', 'author': {'@type': 'Organization', 'name': 'Studio32', 'url': HOST},
                      'publisher': {'@type':'Organization', 'name':'Studio32', 'url':HOST, '@id': HOST+'#studio32'}, 'dateModified': DATA['modifiedAt'], 'inLanguage': 'es'})
    else:
        graph.append({'@type': 'WebPage', 'name': title, 'url': HOST+slug+'/', 'description': description, 'inLanguage': 'es'})
    date = f'<p class="resource-review">Criterio editorial: Studio32 · Revisión <time datetime="{reviewed}">{maintenance.display_date(reviewed)}</time></p>' if reviewed else ''
    return f'''<!DOCTYPE html>
<html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)} | Studio32</title><meta name="description" content="{esc(description)}">
<meta name="theme-color" content="#f7f4ee"><link rel="canonical" href="{HOST+slug}/">
<meta property="og:type" content="{'article' if page_type in ('guide','problem') else 'website'}">
<meta property="og:site_name" content="Studio32"><meta property="og:locale" content="es_ES">
<meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}">
<meta property="og:url" content="{HOST+slug}/"><meta property="og:image" content="{HOST}assets/og-cover.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ctext x='2' y='24' font-size='24'%3E32%3C/text%3E%3C/svg%3E">
<link rel="preload" href="{prefix}assets/fonts/playfair-display-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="{prefix}styles.css?v=20260904-verticales-7">
<link rel="stylesheet" href="{prefix}vertical.css?v=20260904-verticales-7">
<link rel="stylesheet" href="{prefix}discovery.css?v={VERSION}">
{jsonld({'@context':'https://schema.org','@graph':graph})}
<script src="{prefix}discovery-events.js?v={EVENT_VERSION}" defer></script>
{chr(10) if page_type!='tool' else ''}<link rel="stylesheet" href="{prefix}measurement-consent.css?v=20261002-measurement-1">
<script src="{prefix}measurement-consent.js?v=20261002-measurement-1" defer></script>
{'<script src="'+prefix+'consultas-calculator.js?v='+VERSION+'" defer></script>'+chr(10) if page_type=='tool' else ''}</head><body class="pagina-vertical pagina-resource" data-page-type="{page_type}">
<a class="skip-link" href="#contenido">Saltar al contenido</a>
<nav class="navbar" aria-label="Principal"><div class="container nav-inner">
<a href="{prefix}" class="logo" aria-label="Studio32 · Digital Systems"><span class="logo-mark">STUDIO32</span><span class="logo-sub">Digital Systems</span></a>
<div class="nav-right"><a class="nav-link" href="{prefix}recursos/">Recursos</a><a class="nav-link" href="{prefix}herramientas/">Herramientas</a><a class="nav-btn" href="{prefix}#control" data-cta="demo">Probar el agente</a></div></div></nav>
<header class="vertical-hero resource-hero"><div class="container"><nav class="migas" aria-label="Ruta">{crumb}</nav>
<p class="section-label">[ {esc(HUBS.get(hub, ('Studio32',))[0]).upper()} ]</p>
<h1>{esc(title)}</h1><p class="vertical-entrada">{esc(answer)}</p>{date}</div></header>
<main id="contenido" class="resource-main container">{content}</main>
<footer class="resource-footer"><div class="container"><a href="{prefix}" class="logo-mark">STUDIO32</a><nav aria-label="Pie de página">
<a href="{prefix}recursos/">Recursos</a><a href="{prefix}problemas/">Problemas de recepción</a><a href="{prefix}herramientas/">Herramientas</a><a href="{prefix}panel-de-control/">Panel</a><a href="{prefix}precio-agente-whatsapp/">Precio</a><a href="{prefix}legal/privacidad.html">Privacidad</a><a href="{prefix}legal/aviso-legal.html">Aviso legal</a></nav><p>Studio32 · Digital Systems</p></div></footer>
</body></html>'''


def section(block, slug):
    result = f'<section class="resource-section" id="{esc(block["id"])}"><h2>{esc(block["title"])}</h2>'
    for p in block.get('paragraphs', []):
        result += '<p>' + text(p, slug) + '</p>'
    if 'list' in block:
        result += '<ul>' + ''.join('<li>'+text(item, slug)+'</li>' for item in block['list']) + '</ul>'
    if 'flow' in block:
        result += '<ol class="resource-flow" aria-label="Pasos del proceso">' + ''.join('<li>'+esc(item)+'</li>' for item in block['flow']) + '</ol>'
    if 'table' in block:
        t = block['table']
        result += '<div class="resource-table" role="region" tabindex="0" aria-label="Tabla: '+esc(block['title'])+'"><table><caption>'+esc(block['title'])+'</caption><thead><tr>'
        result += ''.join('<th scope="col">'+esc(cell)+'</th>' for cell in t['headers']) + '</tr></thead><tbody>'
        for row in t['rows']:
            result += '<tr><th scope="row">'+esc(row[0])+'</th>' + ''.join('<td>'+esc(cell)+'</td>' for cell in row[1:]) + '</tr>'
        result += '</tbody></table></div>'
    if 'example' in block:
        result += '<aside class="resource-example" aria-label="Ejemplo operativo">' + ''.join('<p>'+esc(line)+'</p>' for line in block['example']) + '</aside>'
    return result + '</section>'


def calculator():
    fields = [('enquiries','Consultas únicas al mes',200,0,1000000,1),
              ('outside','Consultas fuera de horario (%)',40,0,100,0.1),
              ('unresolved','Sin resolver a tiempo dentro de esa franja (%)',50,0,100,0.1),
              ('conversion','Conversión supuesta a cliente (%)',20,0,100,0.1),
              ('value','Valor medio por cliente (€)',100,0,1000000,0.01)]
    inputs = ''.join(f'<div class="calculator-field"><label for="{name}">{label}</label><input type="number" id="{name}" name="{name}" value="{value}" min="{low}" max="{high}" step="{step}" required aria-describedby="calculator-help"></div>' for name,label,value,low,high,step in fields)
    return f'''<section class="resource-section calculator" aria-labelledby="calculator-title"><h2 id="calculator-title">Explora tu escenario</h2>
<p id="calculator-help">Las cifras iniciales son un ejemplo editable. No se guardan ni se envían. Los porcentajes van de 0 a 100; las consultas y el valor no pueden ser negativos.</p>
<form id="consultas-calculator"><div class="calculator-inputs">{inputs}</div><button type="submit" class="hero-cta">Calcular estimación</button><p id="calculator-error" role="alert"></p></form>
<noscript><p>Para calcular aquí necesitas JavaScript. La fórmula completa y los supuestos están explicados debajo; puedes aplicarlos en una hoja de cálculo.</p></noscript>
<div id="calculator-result" class="calculator-result" hidden aria-live="polite" aria-atomic="true">
<p class="section-label">[ SEGÚN TUS SUPUESTOS ]</p><h3>Valor potencial asociado a esas consultas</h3><p class="calculator-amount"><output id="monthly-value"></output><span> al mes</span></p>
<dl><div><dt>Consultas en riesgo / mes</dt><dd id="risk-enquiries"></dd></div><div><dt>Clientes potenciales / mes</dt><dd id="potential-clients"></dd></div><div><dt>Valor central anual</dt><dd id="annual-value"></dd></div><div><dt>Rango anual de escenarios</dt><dd id="annual-range"></dd></div></dl>
<p>Es una estimación de oportunidad, no una pérdida demostrada ni beneficio. El rango varía el porcentaje sin resolver en ±10 puntos, manteniendo los demás supuestos.</p>
<p>Studio32 permite evaluar el recorrido de recepción, reserva y control del equipo. Comprueba esas tareas en la demo antes de decidir.</p><a href="../../#control" class="hero-link" data-cta="calculator_demo">Probar el agente</a></div></section>'''


def render_page(page):
    slug = page['slug']
    toc = '<nav class="resource-toc" aria-label="En esta guía"><p class="section-label">EN ESTA PÁGINA</p>' + ''.join(f'<a href="#{esc(s["id"])}">{esc(s["title"])}</a>' for s in page['sections'])+'</nav>'
    body = calculator() if page['type']=='tool' else ''
    body += '<div class="resource-layout">' + toc + '<article class="resource-body">'
    body += ''.join(section(s, slug) for s in page['sections'])
    if page['sources']:
        body += '<section class="resource-section resource-sources" id="fuentes"><h2>Fuentes y alcance</h2><p>Las fuentes de proveedor describen su propia plataforma. Los criterios operativos de esta guía son de Studio32; la compatibilidad se valida para cada negocio.</p><ul>'
        for key in page['sources']:
            source = DATA['sources'][key]
            body += f'<li><a href="{esc(safe_source_url(source["url"]))}">{esc(source["publisher"])} · {esc(source["title"])}</a> <span>Consultada el {esc(source["accessed"])}.</span></li>'
        body += '</ul></section>'
    body += '</article></div><section class="resource-related resource-section"><h2>Para continuar</h2><div class="resource-links">'
    for key in page['related']:
        body += f'<a href="{relative(slug,key)}"><span>{esc(PAGES[key]["title"])}</span><span aria-hidden="true">↗</span></a>'
    body += '</div></section>'
    commercial = page['commercialTarget']
    labels = {'panel-de-control':'Ver cómo se organiza el panel', 'precio-agente-whatsapp':'Revisar qué incluye la implantación', 'agente-whatsapp-clinicas-dentales':'Ver el recorrido para una clínica dental', 'agente-whatsapp-restaurantes':'Ver el recorrido para restaurantes', 'agente-whatsapp-centros-esteticos':'Ver el recorrido para centros de estética', 'agente-whatsapp-servicios-locales':'Ver el recorrido para servicios locales'}
    body += f'<section class="resource-cta resource-section"><p class="section-label">[ DEL CRITERIO AL PRODUCTO ]</p><h2>Comprueba el recorrido en una demo.</h2><p>Empieza por una consulta habitual, una acción y una excepción. La implantación se revisa con la información y las reglas de tu negocio.</p><div class="hero-actions"><a class="hero-cta" href="{relative(slug,"")}#control" data-cta="demo">Probar el agente</a><a class="hero-link" href="{relative(slug,commercial)}">{labels[commercial]}</a></div></section>'
    return layout(slug,page['title'],page['description'],page['answer'],body,page['type'],DATA['reviewedAt'])


def write(slug, content):
    safe_slug(slug)
    destination = SITE / slug / 'index.html'
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(content, encoding='utf-8')


def main():
    validate_content(DATA)
    for page in PAGES.values():
        write(page['slug'], render_page(page))
    for hub, (name,title,answer) in HUBS.items():
        content = '<section class="resource-section"><h2>'+esc(name)+'</h2><div class="resource-links resource-directory">'
        for page in PAGES.values():
            if page['slug'].split('/')[0] == hub:
                content += f'<a href="{page["slug"].split("/")[1]}/"><span><strong>{esc(page["title"])}</strong><small>{esc(page["description"])}</small></span><span aria-hidden="true">↗</span></a>'
        content += '</div></section><section class="resource-section"><h2>De la duda a una decisión</h2><p>Empieza por el problema que quieres resolver. Después revisa el recorrido del producto y las reglas de tu negocio.</p><div class="resource-links">'
        for other,(other_name,_,_) in HUBS.items():
            if other != hub:
                content += f'<a href="../{other}/">{esc(other_name)}<span aria-hidden="true">↗</span></a>'
        content += '<a href="../panel-de-control/">Ver el panel de control<span aria-hidden="true">↗</span></a></div></section>'
        write(hub, layout(hub,title,answer,answer,content))
    registry = [{**{key: p[key] for key in ('slug','type','intent','title','description','related','commercialTarget')},
                 'canonical':HOST+p['slug']+'/', 'index':True, 'status':DATA.get('publicationStatus','review'), 'reviewedAt':DATA['reviewedAt'],
                 'owner':DATA['owner'], 'publishedAt':DATA['publishedAt'], 'sources':p['sources']} for p in PAGES.values()]
    (ROOT/'docs/seo/CONTENT_REGISTRY.json').write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(f"{len(PAGES)} contenidos + {len(HUBS)} hubs generados; estado: {DATA.get('publicationStatus','review')}.")


if __name__ == '__main__':
    main()
