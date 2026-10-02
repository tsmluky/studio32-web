"""Bundle estático exclusivo de portada; fuentes y hojas originales intactas."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
site = root / 'site'
css = '/* Generado con _plantillas/generar-home-css.py. No editar a mano. */\n'
for name in ('styles.css', 'home-foundation.css'):
    css += '\n/* Fuente: ' + name + ' */\n' + (site/name).read_text(encoding='utf-8')
(site/'home-bundle.css').write_text(css, encoding='utf-8')
print('home-bundle.css generado; orden de cascada y URLs relativas preservados.')
