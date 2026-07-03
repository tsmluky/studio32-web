#!/usr/bin/env python3
"""
personalizar_demo.py — Studio32 · Digital Systems
Personaliza un template HTML/CSS/JS para un cliente concreto.

Uso:
    python Tools/personalizar_demo.py clientes/cliente.json

El script:
  1. Lee el JSON del cliente
  2. Selecciona el template correcto según "vertical"
  3. Copia los archivos del template a Demos-Clientes/{slug}/
  4. Sustituye todos los {{PLACEHOLDERS}} en HTML, CSS y JS
  5. Actualiza las variables CSS de :root con los colores del cliente
  6. Genera assets/README.txt con la lista de imágenes pendientes
  7. Imprime un resumen detallado de la operación

Requisitos: Python 3.9+. Sin dependencias externas.
"""
from __future__ import annotations  # compatibilidad de type hints con Python 3.9

import sys
import json
import re
import unicodedata
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

# ─────────────────────────────────────────────────────────────────────────────
# RUTAS
# ─────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR    = Path(__file__).resolve().parent
ROOT_DIR      = SCRIPT_DIR.parent
TEMPLATES_DIR = ROOT_DIR / "Templates"
OUTPUT_DIR    = ROOT_DIR / "Demos-Clientes"

# ─────────────────────────────────────────────────────────────────────────────
# VERTICALES SOPORTADAS
# ─────────────────────────────────────────────────────────────────────────────

VERTICALES = ["restaurante", "food-brand", "clinica", "arquitectura"]

# ─────────────────────────────────────────────────────────────────────────────
# MAPA DE PLACEHOLDERS  →  {{NOMBRE}} : "clave_json"
#
# Claves que empiezan con "_" son valores computados internamente por el script.
# El mapa cubre SOLO los placeholders de identidad/contacto.
# El contenido editorial (HISTORIA_P1, PLATO_1_NOMBRE, etc.) se deja intacto
# y se reporta como pendiente de edición manual.
# ─────────────────────────────────────────────────────────────────────────────

PLACEHOLDER_MAP: dict[str, str] = {
    # Identidad
    "NOMBRE_NEGOCIO":          "nombre",
    "NOMBRE_CORTO":            "nombre_corto",     # fallback: primera palabra de nombre
    "LOGO_TEXTO":              "logo_texto",        # fallback: nombre
    "LOGO_ACENTO":             "logo_acento",

    # Hero / tagline
    "TAGLINE_SUBTITULO":       "tagline",
    "TAGLINE_L1":              "tagline_l1",        # fallback: auto-split de tagline
    "TAGLINE_L2":              "tagline_l2",        # fallback: auto-split de tagline
    "EYEBROW_HERO":            "eyebrow_hero",
    "ESPECIALIDAD_EYEBROW":    "eyebrow_hero",      # alias clinica

    # Contacto
    "TELEFONO":                "telefono",
    "TELEFONO_DISPLAY":        "telefono",
    "WHATSAPP_NUMERO":         "whatsapp",
    "WHATSAPP_MENSAJE":        "_whatsapp_encoded",  # computado: URL-encoded

    # Ubicación
    "DIRECCION":               "direccion",
    "HORARIOS":                "horarios",
    "MAPS_URL":                "_maps_url",          # computado desde direccion si no existe

    # Social / digital
    "INSTAGRAM_URL":           "instagram",
    "FACEBOOK_URL":            "facebook",
    "EMAIL":                   "email",
    "WEB_URL":                 "web",

    # Meta
    "AÑO":                     "_year",              # computado: año actual
}

# Subconjunto de placeholders que corresponden a datos de identidad del cliente.
# Si quedan sin resolver, se muestran como advertencia prioritaria.
IDENTITY_PLACEHOLDERS: frozenset[str] = frozenset({
    "NOMBRE_NEGOCIO", "NOMBRE_CORTO", "LOGO_TEXTO",
    "TAGLINE_SUBTITULO", "TAGLINE_L1", "TAGLINE_L2",
    "TELEFONO", "TELEFONO_DISPLAY",
    "WHATSAPP_NUMERO", "WHATSAPP_MENSAJE",
    "DIRECCION", "HORARIOS", "MAPS_URL",
    "INSTAGRAM_URL", "FACEBOOK_URL", "EMAIL",
    "AÑO",
})

# ─────────────────────────────────────────────────────────────────────────────
# MAPA DE VARIABLES CSS  →  vertical : { "--css-var": "clave_json" }
# Solo se actualizan las variables de :root documentadas como PERSONALIZAR.
# ─────────────────────────────────────────────────────────────────────────────

CSS_VAR_MAP: dict[str, dict[str, str]] = {
    "restaurante": {
        "--accent-color": "color_acento",
        "--bg-color":     "color_primario",
    },
    "food-brand": {
        "--accent-color": "color_acento",
        "--bg-color":     "color_primario",
    },
    "clinica": {
        "--color-secondary": "color_acento",
        "--color-primary":   "color_primario",
    },
    "arquitectura": {
        "--accent":       "color_acento",
        "--text-primary": "color_primario",
    },
}

# ─────────────────────────────────────────────────────────────────────────────
# ESPECIFICACIONES DE IMÁGENES POR VERTICAL
# ─────────────────────────────────────────────────────────────────────────────

ASSETS_SPECS: dict[str, list[dict[str, str]]] = {
    "restaurante": [
        {
            "file": "placeholder-hero.jpg",
            "uso": "Foto de portada (hero, fondo completo)",
            "formato": "16:9 horizontal",
            "resolucion": "1920 × 1080 px mínimo",
            "consejo": "Plato principal o ambiente del local. Iluminación cálida, fondo oscuro.",
        },
        {
            "file": "placeholder-interior.jpg",
            "uso": "Sección historia / identidad",
            "formato": "2:3 vertical (portrait)",
            "resolucion": "800 × 1200 px mínimo",
            "consejo": "Interior del restaurante: sala en servicio, cocina o detalle de mesa.",
        },
        {
            "file": "placeholder-plato-1.jpg",
            "uso": "Carta — plato 1",
            "formato": "2:3 vertical",
            "resolucion": "600 × 900 px mínimo",
            "consejo": "Foto de producto con fondo oscuro o neutro, iluminación de estudio.",
        },
        {
            "file": "placeholder-plato-2.jpg",
            "uso": "Carta — plato 2",
            "formato": "2:3 vertical",
            "resolucion": "600 × 900 px mínimo",
            "consejo": "Mismas especificaciones que plato-1.",
        },
        {
            "file": "placeholder-plato-3.jpg",
            "uso": "Carta — plato 3 (OPCIONAL — ver comentario en index.html)",
            "formato": "2:3 vertical",
            "resolucion": "600 × 900 px mínimo",
            "consejo": "Si no hay foto, el template incluye un bloque gráfico alternativo (III).",
        },
    ],
    "food-brand": [
        {
            "file": "placeholder-hero.jpg",
            "uso": "Fondo hero (variable CSS --img-hero)",
            "formato": "16:9 horizontal",
            "resolucion": "1920 × 1080 px mínimo",
            "consejo": "Producto o ambiente. Alta saturación y contraste para tema oscuro.",
        },
        {
            "file": "placeholder-concepto.jpg",
            "uso": "Fondo sección concepto (variable CSS --img-concepto)",
            "formato": "16:9 horizontal",
            "resolucion": "1920 × 1080 px mínimo",
            "consejo": "Proceso de elaboración, cocina en acción o textura de producto.",
        },
        {
            "file": "placeholder-local.jpg",
            "uso": "Fondo sección ubicación (variable CSS --img-local)",
            "formato": "4:3 horizontal",
            "resolucion": "1200 × 900 px mínimo",
            "consejo": "Exterior o interior del local, fachada, atmósfera.",
        },
        {
            "file": "placeholder-producto-1.jpg",
            "uso": "Tarjeta de producto 1",
            "formato": "2:3 vertical",
            "resolucion": "600 × 900 px mínimo",
            "consejo": "Foto del producto sobre fondo oscuro o textura industrial.",
        },
        {
            "file": "placeholder-producto-2.jpg",
            "uso": "Tarjeta de producto 2",
            "formato": "2:3 vertical",
            "resolucion": "600 × 900 px mínimo",
            "consejo": "Mismas especificaciones que producto-1.",
        },
        {
            "file": "placeholder-producto-3.jpg",
            "uso": "Tarjeta de producto 3",
            "formato": "2:3 vertical",
            "resolucion": "600 × 900 px mínimo",
            "consejo": "Mismas especificaciones que producto-1.",
        },
    ],
    "clinica": [
        {
            "file": "placeholder-hero.jpg",
            "uso": "Foto lateral del hero (fondo CSS, lado derecho)",
            "formato": "16:9 horizontal o portrait",
            "resolucion": "1920 × 1080 px mínimo",
            "consejo": "Equipo médico, sala o material clínico premium. Fondo claro y neutro.",
        },
        {
            "file": "placeholder-equipo.jpg",
            "uso": "Sección equipo / por qué nosotros",
            "formato": "4:5 vertical (portrait)",
            "resolucion": "800 × 1000 px mínimo",
            "consejo": "Foto del equipo médico o de la sala clínica. Ambiente profesional.",
        },
        {
            "file": "placeholder-caso-1.jpg",
            "uso": "Slider casos de éxito — caso 1",
            "formato": "4:3 horizontal",
            "resolucion": "800 × 600 px mínimo",
            "consejo": "Resultado del tratamiento o imagen de paciente (con consentimiento).",
        },
        {
            "file": "placeholder-caso-2.jpg",
            "uso": "Slider casos de éxito — caso 2",
            "formato": "4:3 horizontal",
            "resolucion": "800 × 600 px mínimo",
            "consejo": "Mismas especificaciones que caso-1.",
        },
        {
            "file": "placeholder-caso-3.jpg",
            "uso": "Slider casos de éxito — caso 3",
            "formato": "4:3 horizontal",
            "resolucion": "800 × 600 px mínimo",
            "consejo": "Mismas especificaciones que caso-1.",
        },
    ],
    "arquitectura": [
        {
            "file": "placeholder-hero.jpg",
            "uso": "Foto de portada (hero, lado izquierdo, variable CSS --img-hero)",
            "formato": "16:9 horizontal",
            "resolucion": "1920 × 1080 px mínimo",
            "consejo": "Espacio reformado de alta calidad. Luz natural, composición limpia.",
        },
        {
            "file": "placeholder-antes-1.jpg",
            "uso": "Slider antes/después 1 — foto ANTES",
            "formato": "4:3 horizontal",
            "resolucion": "1200 × 900 px mínimo",
            "consejo": "Estado original. CRÍTICO: misma perspectiva y encuadre que la foto 'después'.",
        },
        {
            "file": "placeholder-despues-1.jpg",
            "uso": "Slider antes/después 1 — foto DESPUÉS",
            "formato": "4:3 horizontal",
            "resolucion": "1200 × 900 px mínimo",
            "consejo": "Resultado final. Misma perspectiva que 'antes' para el efecto slider.",
        },
        {
            "file": "placeholder-antes-2.jpg",
            "uso": "Slider antes/después 2 — foto ANTES",
            "formato": "4:3 horizontal",
            "resolucion": "1200 × 900 px mínimo",
            "consejo": "Segundo proyecto, estado original.",
        },
        {
            "file": "placeholder-despues-2.jpg",
            "uso": "Slider antes/después 2 — foto DESPUÉS",
            "formato": "4:3 horizontal",
            "resolucion": "1200 × 900 px mínimo",
            "consejo": "Segundo proyecto, resultado final.",
        },
    ],
}

# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    """
    Convierte un nombre a slug web-safe.
    "La Taberna de Ruzafa" → "la-taberna-de-ruzafa"
    """
    normalized = unicodedata.normalize("NFD", text)
    ascii_only = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-z0-9]+", "-", ascii_only.lower())
    return slug.strip("-")


def build_values(data: dict) -> tuple[dict, list[str]]:
    """
    Construye el diccionario completo de valores para sustitución.
    Aplica fallbacks y calcula valores derivados.
    Devuelve (valores, lista_de_advertencias).
    """
    values: dict = dict(data)
    warnings: list[str] = []

    # ── Valores computados ────────────────────────────────────────────────────

    values["_year"] = str(datetime.now().year)

    # MAPS_URL: usar el del JSON o construir desde dirección
    if data.get("maps_url"):
        values["_maps_url"] = data["maps_url"]
    elif data.get("direccion"):
        values["_maps_url"] = (
            "https://www.google.com/maps/search/?api=1&query="
            + quote(data["direccion"], safe="")
        )
    else:
        values["_maps_url"] = "#"
        warnings.append("'maps_url' y 'direccion' ausentes — MAPS_URL quedará como '#'.")

    # WhatsApp mensaje URL-encoded
    msg = data.get("whatsapp_mensaje", "")
    values["_whatsapp_encoded"] = quote(msg, safe="") if msg else ""

    # ── Fallbacks de identidad ────────────────────────────────────────────────

    nombre = data.get("nombre", "")

    if not data.get("nombre_corto") and nombre:
        parts = nombre.split()
        values["nombre_corto"] = parts[0] if len(parts) > 1 else nombre

    if not data.get("logo_texto") and nombre:
        values["logo_texto"] = nombre

    # Auto-split de tagline en dos líneas para el hero
    tagline = data.get("tagline", "")
    if tagline and not data.get("tagline_l1"):
        words = tagline.split()
        if len(words) <= 2:
            values["tagline_l1"] = tagline
            values.setdefault("tagline_l2", tagline)
        elif len(words) <= 4:
            mid = len(words) // 2
            values["tagline_l1"] = " ".join(words[:mid])
            values.setdefault("tagline_l2", " ".join(words[mid:]))
        else:
            # Línea 1 corta (2 palabras) para impacto visual del hero
            values["tagline_l1"] = " ".join(words[:2])
            values.setdefault("tagline_l2", " ".join(words[2:]))

    return values, warnings


def resolve_placeholder(name: str, values: dict) -> str | None:
    """
    Resuelve el valor de un placeholder por su nombre (sin llaves).
    Devuelve None si no existe mapeo o el valor no está disponible.
    """
    json_key = PLACEHOLDER_MAP.get(name)
    if json_key is None:
        return None  # Placeholder de contenido editorial — no manejado aquí
    if json_key.startswith("_"):
        val = values.get(json_key)
    else:
        val = values.get(json_key)
    return str(val) if val is not None else None


def replace_placeholders(
    content: str,
    values: dict,
) -> tuple[str, list[str], list[str], int]:
    """
    Sustituye {{PLACEHOLDER}} en content usando values.
    Devuelve (nuevo_contenido, pendientes_identidad, pendientes_contenido, num_reemplazos).
    """
    pending_identity: list[str] = []
    pending_content:  list[str] = []
    count = 0

    def replacer(match: re.Match) -> str:
        nonlocal count
        name = match.group(1).strip()
        value = resolve_placeholder(name, values)
        if value is not None:
            count += 1
            return value
        # No resuelto — categorizar para el informe
        if name in IDENTITY_PLACEHOLDERS:
            if name not in pending_identity:
                pending_identity.append(name)
        else:
            if name not in pending_content:
                pending_content.append(name)
        return match.group(0)  # Dejar el placeholder intacto

    new_content = re.sub(r"\{\{([^}]+)\}\}", replacer, content)
    return new_content, pending_identity, pending_content, count


def replace_css_vars(
    content: str,
    vertical: str,
    values: dict,
) -> tuple[str, list[str]]:
    """
    Actualiza los valores de variables CSS en :root para el vertical dado.
    Solo modifica las variables documentadas en CSS_VAR_MAP.
    Devuelve (nuevo_contenido, lista_de_variables_actualizadas).
    """
    var_map = CSS_VAR_MAP.get(vertical, {})
    updated: list[str] = []

    for css_var, json_key in var_map.items():
        new_value = values.get(json_key)
        if not new_value:
            continue

        # Patrón: --var-name: VALOR_ACTUAL; (con posibles espacios alrededor)
        pattern = re.compile(
            r"(" + re.escape(css_var) + r"\s*:\s*)([^;]+)(;)"
        )

        def make_replacer(v: str):
            return lambda m: m.group(1) + v + m.group(3)

        new_content, n = pattern.subn(make_replacer(new_value), content)
        if n > 0:
            updated.append(f"{css_var}: {new_value}")
            content = new_content

    return content, updated


def generate_assets_readme(vertical: str, nombre: str) -> str:
    """Genera el contenido de assets/README.txt con las especificaciones de imagen."""
    specs = ASSETS_SPECS.get(vertical, [])
    titulo = f"IMÁGENES NECESARIAS — {nombre}"
    lines = [
        titulo,
        "=" * len(titulo),
        "",
        "Sustituye cada archivo placeholder por la imagen real del cliente.",
        "IMPORTANTE: el nombre del archivo debe mantenerse exactamente igual.",
        "",
    ]
    for i, spec in enumerate(specs, 1):
        lines += [
            f"[ ] {spec['file']}",
            f"    Uso       : {spec['uso']}",
            f"    Formato   : {spec['formato']}",
            f"    Resolución: {spec['resolucion']}",
            f"    Consejo   : {spec['consejo']}",
            "",
        ]
    lines += [
        "─" * 60,
        "",
        "SUBIR LA DEMO",
        "─────────────",
        "Una vez añadidas las imágenes, la demo está lista para subir.",
        "",
        "Opción A — Netlify Drop (más rápido):",
        "  1. Ve a app.netlify.com/drop",
        "  2. Arrastra la carpeta completa al navegador.",
        "  3. Obtén una URL pública en segundos.",
        "",
        "Opción B — Compartir por email:",
        "  1. Comprime la carpeta en un .zip.",
        "  2. Adjunta al correo de prospección.",
        "",
        "Generado por Studio32 · Digital Systems",
    ]
    return "\n".join(lines)


# ─────────────────────────────────────────────────────────────────────────────
# IMPRESIÓN DE RESUMEN
# ─────────────────────────────────────────────────────────────────────────────

def print_summary(
    nombre:           str,
    vertical:         str,
    output_path:      Path,
    file_results:     list[dict],
    css_updated:      list[str],
    pending_identity: list[str],
    pending_content:  list[str],
    warnings:         list[str],
) -> None:
    SEP  = "─" * 60
    SEP2 = "═" * 58

    total_replacements = sum(r["count"] for r in file_results)
    total_pending = len(pending_identity) + len(pending_content)

    print()
    print(f"╔{SEP2}╗")
    print(f"║  Studio32 — Personalizador de Demos v1.0               ║")
    print(f"╚{SEP2}╝")
    print()
    print(f"  Cliente  : {nombre}")
    print(f"  Vertical : {vertical}")
    print(f"  Salida   : {output_path.relative_to(ROOT_DIR)!s}")
    print()

    print(SEP)
    print("ARCHIVOS GENERADOS")
    print(SEP)
    for r in file_results:
        print(f"  → {r['file']:<20}  ({r['count']} reemplazos)")
    print(f"  → {'assets/README.txt':<20}  (generado)")
    print()

    if css_updated:
        print(SEP)
        print("VARIABLES CSS ACTUALIZADAS")
        print(SEP)
        for v in css_updated:
            print(f"  ✓  {v}")
        print()

    print(SEP)
    print(
        f"RESUMEN  —  {total_replacements} reemplazo(s) realizados, "
        f"{total_pending} pendiente(s)"
    )
    print(SEP)

    if warnings:
        print()
        print("  ⚠  Advertencias:")
        for w in warnings:
            print(f"     • {w}")

    if pending_identity:
        print()
        print("  ⚠  IDENTIDAD sin resolver — añadir al cliente.json:")
        for name in sorted(pending_identity):
            key = PLACEHOLDER_MAP.get(name, name.lower())
            if key.startswith("_"):
                key = "(valor computado — revisar campos fuente)"
            print(f"     {{{{ {name} }}}}  →  clave JSON: \"{key}\"")

    if pending_content:
        print()
        print(
            f"  ℹ  {len(pending_content)} placeholder(s) de CONTENIDO pendientes "
            f"de edición manual."
        )
        print("     Abre index.html y busca '{{' para localizarlos.")
        print("     Ejemplos:", ", ".join(f"{{{{{p}}}}}" for p in pending_content[:4]),
              ("..." if len(pending_content) > 4 else ""))

    print()
    print(SEP)
    print("IMÁGENES PENDIENTES  —  ver assets/README.txt")
    print(SEP)
    specs = ASSETS_SPECS.get(vertical, [])
    for s in specs:
        print(f"  [ ] {s['file']}")
    print()
    print("  Demo lista cuando todas las imágenes estén en assets/.")
    print()


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────

def main() -> None:

    # ── Argumentos ────────────────────────────────────────────────────────────
    if len(sys.argv) != 2:
        print("Uso: python Tools/personalizar_demo.py clientes/cliente.json")
        sys.exit(1)

    client_path = Path(sys.argv[1]).resolve()
    if not client_path.exists():
        print(f"Error: no se encuentra el archivo «{client_path}»")
        sys.exit(1)

    # ── Leer JSON ─────────────────────────────────────────────────────────────
    try:
        with open(client_path, encoding="utf-8") as f:
            raw_data: dict = json.load(f)
    except json.JSONDecodeError as e:
        print(f"Error: JSON inválido en «{client_path.name}»: {e}")
        sys.exit(1)

    # Filtrar claves de documentación (empiezan por "_")
    data = {k: v for k, v in raw_data.items() if not k.startswith("_")}

    # ── Validar campos obligatorios ───────────────────────────────────────────
    errors: list[str] = []
    for field in ("nombre", "vertical"):
        if not data.get(field):
            errors.append(f"  • Campo obligatorio ausente o vacío: \"{field}\"")
    if errors:
        print("Error en el JSON del cliente:")
        print("\n".join(errors))
        sys.exit(1)

    nombre   = str(data["nombre"]).strip()
    vertical = str(data["vertical"]).strip()

    if vertical not in VERTICALES:
        print(f"Error: vertical «{vertical}» no reconocida.")
        print(f"Verticales disponibles: {', '.join(VERTICALES)}")
        sys.exit(1)

    # ── Localizar template ────────────────────────────────────────────────────
    template_dir = TEMPLATES_DIR / vertical
    if not template_dir.exists():
        print(f"Error: template no encontrado en «{template_dir}»")
        sys.exit(1)

    # ── Preparar directorio de salida ─────────────────────────────────────────
    slug       = slugify(nombre)
    output_dir = OUTPUT_DIR / slug
    if output_dir.exists():
        print(f"Aviso: la carpeta «{output_dir.name}» ya existe — se sobreescribirá.")
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "assets").mkdir(exist_ok=True)

    # ── Construir valores resueltos ───────────────────────────────────────────
    values, build_warnings = build_values(data)

    # ── Procesar archivos del template ────────────────────────────────────────
    all_pending_identity: list[str] = []
    all_pending_content:  list[str] = []
    all_css_updated:      list[str] = []
    file_results:         list[dict] = []

    for filename in ("index.html", "styles.css", "script.js"):
        src = template_dir / filename
        if not src.exists():
            continue

        content = src.read_text(encoding="utf-8")

        # 1. Reemplazar {{PLACEHOLDERS}}
        content, pending_id, pending_ct, count = replace_placeholders(content, values)

        for p in pending_id:
            if p not in all_pending_identity:
                all_pending_identity.append(p)
        for p in pending_ct:
            if p not in all_pending_content:
                all_pending_content.append(p)

        # 2. Actualizar variables CSS (solo styles.css)
        css_updated: list[str] = []
        if filename == "styles.css":
            content, css_updated = replace_css_vars(content, vertical, values)
            all_css_updated.extend(css_updated)

        # Escribir archivo procesado
        (output_dir / filename).write_text(content, encoding="utf-8")
        file_results.append({"file": filename, "count": count})

    # ── Generar assets/README.txt ─────────────────────────────────────────────
    readme = generate_assets_readme(vertical, nombre)
    (output_dir / "assets" / "README.txt").write_text(readme, encoding="utf-8")

    # ── Imprimir resumen ──────────────────────────────────────────────────────
    print_summary(
        nombre=nombre,
        vertical=vertical,
        output_path=output_dir,
        file_results=file_results,
        css_updated=all_css_updated,
        pending_identity=all_pending_identity,
        pending_content=all_pending_content,
        warnings=build_warnings,
    )


if __name__ == "__main__":
    main()
