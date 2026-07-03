# Seguridad y aislamiento multi-agente

Cada cliente de Studio32 tiene su propio agente (tenant). Este documento explica
cómo se garantiza que **no se mezclan** datos entre agentes y que **solo el dueño**
ve la información sensible. Verificado con `npm run test:sec` (12 comprobaciones).

## 1. Un agente por empresa, totalmente aislado
- La configuración vive en `tenants/<id>/` y los datos en `data/<id>/`.
- TODA operación va con el `tenantId`: las reservas, leads, conversaciones y logs
  se leen y escriben SOLO en la carpeta de ese agente.
- Resultado: el agente de una clínica no puede ver ni tocar el calendario ni las
  reservas de un restaurante. Físicamente están separados.
- Verificado: una reserva creada en un agente no aparece en otro.

## 2. Cómo se reconoce al DUEÑO (sin contraseña que recordar)
Dos vías, según el canal:
- **Por WhatsApp**: el dueño se identifica por su **número de teléfono** (el que
  WhatsApp verifica). La comparación es **exacta** (no por subcadena), así que un
  número parecido no cuela. El número del dueño está en
  `tenants/<id>/business.json` → `owner.whatsapp`.
- **Por web**: con un **enlace privado** que lleva un token largo aleatorio
  (`/demo/?tenant=<id>&owner=<token>`). El token está en `owner.token`, es único
  por agente y se genera con criptografía (48 caracteres).

Reglas que lo sellan:
- El token de un agente **no sirve** en otro (cada uno valida el suyo).
- Las herramientas de dueño (ver la agenda, etc.) **solo existen** en modo dueño:
  un cliente normal ni siquiera las tiene disponibles, y si se intentara forzar,
  la herramienta lo rechaza igual (doble barrera).
- Un cliente que pide una reserva **nunca** puede listar las citas de otros ni
  hacerse pasar por el dueño: no tiene ni el número ni el token.

## 3. El panel interno de Studio32
- `/panel` es SOLO para Studio32 y va **fail-closed**: si no defines `PANEL_TOKEN`
  en `.env`, la API del panel se niega a responder (no expone nada).
- Con `PANEL_TOKEN` definido, hay que enviarlo para ver o editar agentes.
- Antes de publicar el panel en internet, define un `PANEL_TOKEN` fuerte.

## 4. Buenas prácticas para producción
- `PANEL_TOKEN` fuerte y, si puede ser, el panel detrás de una IP/VPN.
- `CORS_ORIGINS` acotado a tus dominios (no `*`) cuando el widget esté en producción.
- Rotar claves (DeepSeek/OpenAI, SMTP, Meta/Twilio) periódicamente; `.env` y
  `credentials.json` nunca a git (ya en `.gitignore`).
- Tokens de dueño: si uno se filtra, basta regenerar `owner.token` de ese agente.

## 5. Pruebas
- `npm run test:sec` — aislamiento, tokens y modo dueño (12 casos).
- `npm run test:qa` — lógica de reservas y guardrails (22 casos).
