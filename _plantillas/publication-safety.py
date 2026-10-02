"""Guardas de publicación estática; solo muestra rutas/tipos, nunca secretos."""
from html.parser import HTMLParser
from pathlib import Path
import re
from urllib.parse import urlsplit


class PublicURLs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.errors = []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name not in ('href', 'src', 'action') or not value:
                continue
            parts = urlsplit(value)
            if parts.hostname in ('localhost', '127.0.0.1', '0.0.0.0', '::1'):
                self.errors.append('URL local activa')
            if parts.hostname and parts.hostname.endswith('.pages.dev'):
                self.errors.append('URL de staging activa')


def check_site(site):
    errors = []
    forbidden = {'.env', '.pem', '.key', '.sqlite', '.sqlite3', '.db'}
    signatures = (
        re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----'),
        re.compile(r'\b(?:ghp_|github_pat_|sk_live_|sk-proj-)[A-Za-z0-9_\-]{20,}'),
        re.compile(r'\bsb_secret_[A-Za-z0-9_\-]{15,}'),
    )
    for path in site.rglob('*'):
        if not path.is_file(): continue
        name = path.relative_to(site).as_posix()
        if path.name == '.env' or path.name.startswith('.env.') or path.suffix.lower() in forbidden:
            errors.append(name + ': archivo privado en salida pública')
        if path.suffix.lower() not in ('.html', '.js', '.json', '.css', '.txt', '.svg'): continue
        source = path.read_text(encoding='utf-8')
        if any(pattern.search(source) for pattern in signatures):
            errors.append(name + ': firma de credencial privada')
        if path.suffix.lower() == '.html':
            parser = PublicURLs()
            parser.feed(source)
            errors.extend(name + ': ' + error for error in parser.errors)
    return errors
