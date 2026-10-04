"""Resuelve URLs limpias de Cloudflare a HTML fuente sin seguir alias."""
from pathlib import Path
from urllib.parse import unquote, urlsplit


def html_target(site, url):
    site = Path(site).resolve()
    target = (site / unquote(urlsplit(url).path).lstrip('/')).resolve()
    if not target.is_relative_to(site):
        raise ValueError('URL fuera del sitio')
    if target.is_dir():
        target /= 'index.html'
    elif not target.suffix and target.with_suffix('.html').is_file():
        target = target.with_suffix('.html')
    return target
