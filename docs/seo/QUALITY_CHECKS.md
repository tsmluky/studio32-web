# Controles continuos · apartados 61–64

`Calidad SEO y recorridos` se ejecuta en pull requests y cambios de main que
afectan site/, _plantillas/, el workflow o manifiestos JSON de SEO. Un solo job,
máximo cinco minutos, cancela ejecuciones anteriores de la misma rama. No
instala paquetes, no usa secretos, no llama al backend ni publica el sitio.
Checkout oficial fijado a commit; permisos de lectura. Las comprobaciones son
un estado visible de la PR; no se han cambiado reglas de protección de rama.

Incluye SEO/canonical/schema/sitemap, hashes de fuentes y bases comerciales,
enlaces/fragmentos, grafo, calculadora, privacidad/consentimiento, ciclo de demo,
sintaxis JS y espacios/conflictos de edición. El CI usa Python y Node existentes
en el runner. Para ejecutar localmente, los mismos comandos figuran en el workflow.

## Grafo de enlaces

`python _plantillas/revisar-grafo.py` escribe
`qa/internal-link-graph.json` (ignorado). Solo enlaces a reales del HTML entre URL
canónicas del sitemap; ignora comentarios, assets, enlaces externos y autoenlaces.
Normaliza relativos, absolutos, query y fragmentos. Cuenta páginas de origen
distintas, no repeticiones del mismo footer. No interpreta interfaces JS.

Falla ante páginas importantes ausentes/inalcanzables o a más de tres clics;
también ante canónicas sin entrada o salida interna. Importantes: portada,
páginas comerciales/hubs definidos en el script y colección publicada del registro.
Esto aplica el presupuesto de esta colección, no una ley universal de SEO.

Baseline 02/10/2026 tras corrección de atribuciones: 24 canónicas, 21 importantes,
203 conexiones distintas, profundidad máxima dos; cero errores. El control
detectó tres demos sin salida a Studio32: sus atribuciones existentes ahora
enlazan a ../, preservando bloques, CSS, fuentes y JS.

Tres pruebas del grafo cubren ciclos/ruta mínima/orfandad, normalización de
enlaces y exclusión de comentarios/recursos. Esto previene regresiones de
estructura; no demuestra indexación, rankings, demanda ni conversión.

Primera ejecución real en PR #9: success, job de seis segundos, run
37027708024. El workflow se guardó desde la sesión web autorizada existente
porque la credencial de Git no permite modificar workflows. No se amplió su
scope ni se cambiaron permisos/protección de rama. Copia web/local idénticas.
