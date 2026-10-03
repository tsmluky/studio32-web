"""Instancia estática 400 de Inter original; solo al regenerar el asset.

Requiere fonttools y brotli en el entorno local, no en CI ni en hosting.
Conserva todos los caracteres originales, métricas y curvas del peso 400.
"""
from pathlib import Path
import hashlib
import json
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
folder = root/'site/assets/fonts'
source = folder/'inter-normal-latin.woff2'
font = TTFont(source)
original_chars = font.getBestCmap()
static = instantiateVariableFont(font, {'wght':400}, inplace=False)
assert static.getBestCmap() == original_chars
assert 'fvar' not in static
destination = folder/'inter-text-400-latin.woff2'
static.flavor = 'woff2'
static.save(destination)
saved = TTFont(destination)
assert saved.getBestCmap() == original_chars
assert saved['hmtx'].metrics == static['hmtx'].metrics
manifest_path = folder/'SOURCES.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
manifest = [item for item in manifest if item['file'] != destination.name]
manifest.append({'file':destination.name,'source':'Local instance of inter-normal-latin.woff2 at wght=400',
                 'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),
                 'sha256':hashlib.sha256(destination.read_bytes()).hexdigest(),
                 'bytes':destination.stat().st_size,'accessedAt':'2026-10-03',
                 'license':'inter-OFL.txt','generator':'_plantillas/generar-inter-texto.py'})
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Inter 400: {source.stat().st_size} -> {destination.stat().st_size} bytes; {len(original_chars)} caracteres conservados.')
