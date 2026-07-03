from pathlib import Path
import shutil
from datetime import datetime

ROOT = Path(".")
FILES = [
    ROOT / "index.html",
    ROOT / "styles.css",
    ROOT / "script.js",
]

BACKUP_DIR = ROOT / "_backups"
BACKUP_DIR.mkdir(exist_ok=True)

timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")


def fix_mojibake(text: str) -> str:
    """
    Repairs common UTF-8 mojibake like:
    automatizaci??n -> automatizaci?n
    dise??ado -> dise?ado
    ?? -> ?
    """
    previous = None
    current = text

    # Try repeated latin1 -> utf8 repair.
    # This fixes most Spanish mojibake caused by UTF-8 being read as ANSI/Latin-1.
    for _ in range(3):
        if current == previous:
            break
        previous = current
        try:
            current = current.encode("latin1").decode("utf-8")
        except UnicodeError:
            break

    # ASCII-safe fallback replacements for cases not fixed above.
    replacements = {
        "\u00c2\u00b7": "\u00b7",
        "\u00c3\u00a1": "\u00e1",
        "\u00c3\u00a9": "\u00e9",
        "\u00c3\u00ad": "\u00ed",
        "\u00c3\u00b3": "\u00f3",
        "\u00c3\u00ba": "\u00fa",
        "\u00c3\u00b1": "\u00f1",
        "\u00c3\u0081": "\u00c1",
        "\u00c3\u0089": "\u00c9",
        "\u00c3\u008d": "\u00cd",
        "\u00c3\u0093": "\u00d3",
        "\u00c3\u009a": "\u00da",
        "\u00c3\u0091": "\u00d1",
        "\u00c2\u00bf": "\u00bf",
        "\u00c2\u00a1": "\u00a1",
        "\u00e2\u20ac\u201c": "\u2013",
        "\u00e2\u20ac\u201d": "\u2014",
        "\u00e2\u20ac\u0153": "\u201c",
        "\u00e2\u20ac\u009d": "\u201d",
        "\u00e2\u20ac\u02dc": "\u2018",
        "\u00e2\u20ac\u2122": "\u2019",
        "\u00e2\u20ac\u00a6": "\u2026",
    }

    for bad, good in replacements.items():
        current = current.replace(bad, good)

    return current


for file in FILES:
    if not file.exists():
        print(f"SKIP: {file} does not exist")
        continue

    backup = BACKUP_DIR / f"{file.name}.before-encoding-fix.{timestamp}"
    shutil.copy2(file, backup)

    raw = file.read_text(encoding="utf-8", errors="replace")
    fixed = fix_mojibake(raw)

    file.write_text(fixed, encoding="utf-8", newline="\n")

    print(f"OK: fixed {file}")
    print(f"    backup: {backup}")

print("")
print("Encoding repair finished.")
