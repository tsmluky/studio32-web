"""Grafo de enlaces HTML canónicos. Sin red ni dependencias externas."""
import json
from collections import deque
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'site'
HOSTS = {'www.studio32.es', 'studio32.es'}


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        if tag == 'a':
            href = dict(attrs).get('href')
            if href:
                self.hrefs.append(href)


def destination(base, href, site=SITE):
    url = urlsplit(urljoin(base, href))
    if url.scheme not in ('http', 'https') or url.hostname not in HOSTS:
        return None
    path = (site / unquote(url.path).lstrip('/')).resolve()
    if not path.is_relative_to(site.resolve()):
        return None
    if path.is_dir():
        path /= 'index.html'
    return path


def analyse(edges, home):
    incoming = {node: set() for node in edges}
    for source, targets in edges.items():
        for target in targets:
            if target != source and target in incoming:
                incoming[target].add(source)
    depth = {home: 0}
    queue = deque([home])
    while queue:
        source = queue.popleft()
        for target in sorted(edges[source]):
            if target not in depth:
                depth[target] = depth[source] + 1
                queue.append(target)
    return incoming, depth


def main():
    urls = [node.text for node in ET.parse(SITE / 'sitemap.xml').getroot().iter()
            if node.tag.rsplit('}', 1)[-1] == 'loc']
    files = {destination(url, url): url for url in urls}
    edges = {url: set() for url in urls}
    for file, url in files.items():
        parser = Links()
        parser.feed(file.read_text(encoding='utf-8'))
        for href in parser.hrefs:
            target = files.get(destination(url, href))
            if target and target != url:
                edges[url].add(target)
    home = 'https://www.studio32.es/'
    incoming, depth = analyse(edges, home)
    important = {home} | {'https://www.studio32.es/' + slug + '/' for slug in (
        'recursos', 'problemas', 'herramientas', 'panel-de-control', 'precio-agente-whatsapp',
        'agente-whatsapp-clinicas-dentales', 'agente-whatsapp-restaurantes',
        'agente-whatsapp-centros-esteticos', 'agente-whatsapp-servicios-locales')}
    registry = json.loads((ROOT / 'docs/seo/CONTENT_REGISTRY.json').read_text(encoding='utf-8'))
    important.update(page['canonical'] for page in registry if page['status'] == 'published' and page['index'])
    errors = []
    for url in sorted(important):
        if url not in edges:
            errors.append('Página importante ausente del sitemap: ' + url)
        elif url not in depth:
            errors.append('Inalcanzable desde portada: ' + url)
        elif depth[url] > 3:
            errors.append('Más de tres clics desde portada: ' + url)
    for url in urls:
        if url != home and not incoming[url]:
            errors.append('Página canónica sin enlaces entrantes: ' + url)
        if not edges[url]:
            errors.append('Página canónica sin salida interna: ' + url)
    report = {
        'scope': 'Enlaces a de HTML estático entre las URL del sitemap; no prueba rastreo ni indexación.',
        'pages': len(urls), 'edges': sum(map(len, edges.values())),
        'important_pages': len(important), 'errors': errors,
        'routes': [{'url': url, 'depth': depth.get(url), 'incoming_pages': len(incoming[url]),
                    'outgoing_pages': len(edges[url]), 'important': url in important} for url in sorted(urls)]
    }
    output = ROOT / 'docs/seo/qa/internal-link-graph.json'
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{len(urls)} páginas canónicas; {report["edges"]} conexiones distintas; {len(important)} importantes; {len(errors)} errores.')
    print('Profundidad máxima desde portada: ' + str(max(depth.values())))
    for error in errors:
        print(error)
    return bool(errors)


if __name__ == '__main__':
    raise SystemExit(main())
