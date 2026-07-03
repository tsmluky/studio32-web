# Reporte de estado · studio32-agent
Fecha: 25/06/2026

## En una frase
El agente está **terminado a nivel de software** para operar por WhatsApp. Lo
único que falta para encenderlo son credenciales (la API de OpenAI y los datos de
Twilio). Hoy ya se puede probar entero en modo simulación (sin coste).

---

## 1. Qué tendríamos OPERATIVO mañana
Con la `OPENAI_API_KEY` + WhatsApp conectado, el agente, por WhatsApp, sabe:

- Saludar y conversar con el tono del negocio (configurable por cliente).
- Responder dudas: servicios, **precios**, duración, horarios, FAQ, políticas.
- **Consultar disponibilidad real** (nunca inventa huecos).
- **Crear reservas** en firme.
- **Cancelar** citas.
- **Reprogramar / mover** citas (validando horario y que el hueco esté libre).
- **Captar leads** (cuando no es reserva sino interés comercial).
- **Derivar a una persona** del equipo (handoff) cuando hace falta.
- **Avisar al equipo** de cada reserva / cancelación / cambio / lead (email y/o WhatsApp).
- Guardar **historial de conversación, reservas y logs** (persistentes).
- Funcionar **multi-cliente** (cada negocio = una carpeta de configuración).

---

## 1.c NOVEDAD: operativo por WEB hoy con DeepSeek (sin teléfono)
El agente ya soporta **DeepSeek** (compatible con OpenAI). Con la API key de
DeepSeek + el **widget web** podemos ponerlo a funcionar de verdad **sin número de
teléfono**: chat flotante en studio32.es que capta leads y agenda auditorías en
vuestro calendario, con aviso por email.

Para encender el widget hoy:
1. \`DEEPSEEK_API_KEY=...\` en \`.env\` (y \`LLM_PROVIDER=deepseek\`).
2. (Opcional, recomendado) SMTP en \`.env\` → os llega el email de cada lead/cita.
3. (Opcional) Google Calendar de Studio32 → las auditorías caen en vuestra agenda.
4. \`npm install && npm run dev\` → probar en \`/widget-demo\`.
5. Incrustar en studio32.es: \`<script src="https://TU-DOMINIO/widget.js" data-tenant="studio32" defer></script>\`

Tenant \`studio32\` ya creado (captador de leads + reserva de auditoría, tono
comercial sobrio). El \`/chat\` está protegido (CORS + rate limit + tope de longitud).

## 2. Lo que de verdad hay que pegar (mínimo para WhatsApp)
Aclaración importante: "un número de teléfono" por sí solo no basta. WhatsApp tiene
que pasar por **Twilio** (o por la WhatsApp Cloud API). Para empezar, lo más rápido
es el **sandbox de Twilio**, que no necesita número propio.

En el archivo `.env` hacen falta solo estas claves:

```
OPENAI_API_KEY=...            (la que tiene Juanma)
TWILIO_ACCOUNT_SID=...        (de la cuenta de Twilio)
TWILIO_AUTH_TOKEN=...         (de la cuenta de Twilio)
TWILIO_WHATSAPP_NUMBER=...    (sandbox: whatsapp:+14155238886; o el número propio)
```

Con eso ya responde y reserva por WhatsApp. El almacenamiento de citas, de momento,
es en archivos (JSON) — suficiente para arrancar y probar entre nosotros.

---

## 3. Checklist para mañana con Juanma (~30–45 min)
1. `npm install` (una vez).
2. Pegar `OPENAI_API_KEY` en `.env`.
3. Crear cuenta de Twilio → copiar `TWILIO_ACCOUNT_SID` y `TWILIO_AUTH_TOKEN`.
4. Activar el **WhatsApp sandbox** de Twilio y unir vuestros móviles.
5. Arrancar: `npm run dev` y exponer el puerto con un túnel (`npx ngrok http 3000`).
6. En Twilio, poner el webhook: `https://TU-URL/whatsapp/webhook` (POST).
7. `npm run check` → debe salir todo en verde para "Operar por WhatsApp".
8. Probar desde el móvil: pedir precio, reservar, cancelar, mover. ✅

(Detalle ampliado en `docs/SETUP.md`.)

---

## 4. Dos niveles (para no mezclar "probar" con "vender")
**Nivel 1 — operativo entre nosotros (mañana):** OpenAI + Twilio sandbox. Citas en
JSON. Sirve para validar todo el flujo real por WhatsApp.

**Nivel 2 — listo para un cliente real (siguiente):**
- Número de **WhatsApp Business propio** dado de alta en Twilio (requiere aprobar perfil).
- **Google Calendar** como agenda compartida de citas (ya integrado; solo hay que
  crear la service account, compartir el calendario y pegar su ID). Recomendado
  porque el JSON se pierde al redesplegar en hosting.
- **Despliegue 24/7** en Railway (config ya incluida).

---

## 4.b Onboarding como herramienta de venta (YA disponible, sin credenciales)
En /onboarding hay un formulario guiado con **plantillas por vertical** (clínica,
restaurante, barbería). En una reunión: eliges sector → el dueño retoca datos y su
**email** → su agente queda creado (borrador) → lo probáis en el acto en /demo.

El diferencial: al reservar en la demo, **le llega el aviso al email del dueño**
(a su móvil). Esto funciona HOY en modo simulación, SIN la API de OpenAI — solo
necesita el **SMTP configurado** en `.env` (un Gmail con App Password vale, y lo
puedes montar tú sin Juanma). Es decir, la demo que "vende sola" no depende de
las claves que tiene Juanma.

## 5. Qué queda FUERA (consciente, no es deuda oculta)
- **Widget web** embebible en studio32.es → planificado, después de WhatsApp.
- **Base de datos PostgreSQL** (para leads/logs/escala) → v0.3. Hoy JSON + Calendar.
- **Voz / llamadas** → más adelante; el diseño ya lo permite (otro canal).
- **Panel de administración** → v0.3.

---

## 6. Estado
- Probar/demostrar HOY (simulación, sin coste): **LISTO**.
- Conversación con IA real: falta `OPENAI_API_KEY`.
- Operar por WhatsApp: faltan datos de Twilio.
- Madurez del producto vs. visión completa: **~82/100** (añadido onboarding + plantillas por vertical).

Comando útil en cualquier momento: `npm run check` (dice qué falta).
