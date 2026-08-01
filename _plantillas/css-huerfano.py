# -*- coding: utf-8 -*-
"""Detecta clases CSS que ya no usa nadie.

IMPORTANTE: no basta con mirar el HTML. Parte de la interfaz se genera desde
JavaScript (la demo en vivo vive en una plantilla dentro de `script.js`), así que
hay clases que no aparecen en ningún `.html` y sin embargo se usan. Borrar por
ese criterio rompe la web en silencio.

Aquí se recogen las referencias de:
  - atributos class="..." de los .html
  - atributos class="..." dentro de los .js (plantillas)
  - classList.add/toggle/remove y className = '...' de los .js

  python _plantillas/css-huerfano.py

⚠️ LA SALIDA NO ES UNA LISTA PARA BORRAR. Tiene falsos positivos conocidos:

  - `.s32w-*` las inyecta `widget.js` desde el repo `studio32-agent`. Existen en
    tiempo de ejecución aunque no estén en este repo. NO borrar.
  - Las clases construidas dentro de plantillas con interpolación
    (`class="panel-conv${...}"`) se cortan al leerlas y salen como huérfanas.
    Casi todo `panel.css` cae aquí.
  - Trozos de URL y de selectores (`.jpg`, `.webp`, `.w3`, `.org`, `.lenis*`)
    se cuelan como si fueran clases.

Sirve para SOSPECHAR, no para decidir. Comprobar a mano antes de tocar nada.
"""
import io
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(RAIZ, "site")

# Solo las hojas propias de la web nueva; las demos antiguas van por su cuenta.
HOJAS = ["styles.css", "vertical.css", "panel.css"]
FUENTES_JS = ["script.js", "panel.js"]

RE_CLASS_ATTR = re.compile(r'class\s*=\s*["\']([^"\']+)["\']')
RE_CLASSLIST = re.compile(r"classList\.(?:add|remove|toggle|contains)\(\s*['\"]([^'\"]+)['\"]")
RE_CLASSNAME = re.compile(r"className\s*=\s*['\"]([^'\"]+)['\"]")
# Concatenaciones tipo 'chat-msg chat-msg--' + kind
RE_CONCAT = re.compile(r"['\"]([a-z][a-z0-9-]*(?:\s+[a-z][a-z0-9-]*)*--?)['\"]\s*\+")
RE_SELECTOR = re.compile(r"\.(-?[_a-zA-Z][\w-]*)")


def usadas():
    encontradas = set()
    parciales = set()

    for base, _, ficheros in os.walk(SITE):
        for f in ficheros:
            ruta = os.path.join(base, f)
            if not (f.endswith(".html") or f in FUENTES_JS):
                continue
            texto = io.open(ruta, encoding="utf-8", errors="ignore").read()

            for grupo in RE_CLASS_ATTR.findall(texto):
                encontradas.update(grupo.split())
            for m in RE_CLASSLIST.findall(texto):
                encontradas.update(m.split())
            for m in RE_CLASSNAME.findall(texto):
                encontradas.update(m.split())
            # Prefijos construidos por concatenación: se marcan como parciales
            for m in RE_CONCAT.findall(texto):
                parciales.update(m.split())

    return encontradas, parciales


def definidas():
    porhoja = {}
    for hoja in HOJAS:
        ruta = os.path.join(SITE, hoja)
        if not os.path.exists(ruta):
            continue
        texto = io.open(ruta, encoding="utf-8", errors="ignore").read()
        # Fuera comentarios, para no recoger clases citadas en la documentación
        texto = re.sub(r"/\*.*?\*/", "", texto, flags=re.S)
        porhoja[hoja] = set(RE_SELECTOR.findall(texto))
    return porhoja


def main():
    encontradas, parciales = usadas()
    porhoja = definidas()

    print("clases referenciadas :", len(encontradas))
    print("prefijos construidos :", ", ".join(sorted(parciales)) or "ninguno")
    print()

    for hoja, clases in porhoja.items():
        huerfanas = sorted(
            c for c in clases
            if c not in encontradas
            and not any(c.startswith(p) for p in parciales)
        )
        print("{} · {} definidas · {} sin usar".format(hoja, len(clases), len(huerfanas)))
        for c in huerfanas:
            print("    .{}".format(c))
        print()


if __name__ == "__main__":
    main()
