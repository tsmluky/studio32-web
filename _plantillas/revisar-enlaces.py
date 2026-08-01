# -*- coding: utf-8 -*-
"""Auditoría de enlaces internos de site/.

Recorre todos los .html publicados, extrae sus href/src locales y comprueba que
el destino existe en disco. Detecta también anclas (#id) que no existen en la
página de destino, que es el fallo silencioso más habitual al reorganizar
secciones.

  python _plantillas/revisar-enlaces.py
"""
import io
import os
import re
from urllib.parse import unquote, urldefrag

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(RAIZ, "site")

RE_HREF = re.compile(r'(?:href|src)\s*=\s*"([^"]+)"', re.I)
RE_ID = re.compile(r'\bid\s*=\s*"([^"]+)"')

EXTERNO = ("http://", "https://", "mailto:", "tel:", "data:", "//")


def paginas():
    for base, _, ficheros in os.walk(SITE):
        for f in ficheros:
            if f.endswith(".html"):
                yield os.path.join(base, f)


def ids_de(ruta):
    try:
        return set(RE_ID.findall(io.open(ruta, encoding="utf-8", errors="ignore").read()))
    except OSError:
        return set()


def resolver(pagina, destino):
    """Devuelve la ruta en disco a la que apunta un href.

    Quita la cadena de consulta (`?v=...`, que es cache-busting y no forma parte
    del fichero) y resuelve las rutas absolutas desde la raiz publicada, no desde
    la carpeta de la pagina."""
    destino = destino.split("?")[0]
    if not destino:
        return SITE
    if destino.startswith("/"):
        ruta = os.path.normpath(os.path.join(SITE, unquote(destino.lstrip("/"))))
    else:
        carpeta = os.path.dirname(pagina)
        ruta = os.path.normpath(os.path.join(carpeta, unquote(destino)))
    if os.path.isdir(ruta):
        ruta = os.path.join(ruta, "index.html")
    return ruta


def main():
    fallos = []
    total = 0
    revisadas = 0

    for pagina in paginas():
        revisadas += 1
        rel_pagina = os.path.relpath(pagina, SITE).replace("\\", "/")
        html = io.open(pagina, encoding="utf-8", errors="ignore").read()
        propios = set(RE_ID.findall(html))

        for href in RE_HREF.findall(html):
            href = href.strip()
            if not href or href.startswith(EXTERNO) or href.startswith("#") and href == "#":
                continue
            total += 1

            # Ancla dentro de la misma página
            if href.startswith("#"):
                if href[1:] not in propios:
                    fallos.append((rel_pagina, href, "ancla inexistente en esta pagina"))
                continue

            ruta, ancla = urldefrag(href)
            if not ruta.split("?")[0]:
                continue

            destino = resolver(pagina, ruta)
            if not os.path.exists(destino):
                fallos.append((rel_pagina, href, "destino no existe"))
                continue

            if ancla and destino.endswith(".html") and ancla not in ids_de(destino):
                fallos.append((rel_pagina, href, "ancla inexistente en el destino"))

    print("paginas revisadas :", revisadas)
    print("enlaces internos  :", total)
    print("fallos            :", len(fallos))
    if fallos:
        print()
        for pagina, href, motivo in fallos:
            print("  {:<44} -> {:<38} {}".format(pagina, href, motivo))
    else:
        print("\nsin enlaces rotos")


if __name__ == "__main__":
    main()
