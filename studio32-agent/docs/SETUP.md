# SETUP — poner studio32-agent operativo por WhatsApp

Guía paso a paso para pasar de "código listo" a "reservando de verdad por
WhatsApp con las citas en Google Calendar". Orden recomendado.

Tiempo aproximado: 30–45 min la primera vez.

---

## 0. Requisitos
- Node 18+ instalado.
- Una cuenta de Google (para el calendario del negocio).
- Una cuenta de Twilio (gratis para el sandbox de WhatsApp).
- Tu clave de OpenAI.

```bash
cd studio32-agent
npm install
cp .env.example .env
```

---

## 1. Probar HOY sin credenciales (modo simulación)
No necesitas API key para validar el flujo: si no hay `OPENAI_API_KEY`, el agente
usa un motor simulado que hace las reservas de verdad (sin coste).

```bash
npm run check     # te dice qué está puesto y qué falta
npm run chat      # conversación por terminal
npm run dev       # servidor → webchat en http://localhost:3000/demo
```
Prueba: "hola, cuánto cuesta un corte?" → "quiero reservar mañana con Jose" →
elige una hora → da nombre y teléfono. La cita queda guardada en `data/`.

Cuando tengas la `OPENAI_API_KEY`, ponla en `.env` y vuelve a arrancar: pasa
automáticamente a la IA real. (Forzar modo: `LLM_PROVIDER=mock` o `=openai`.)

> En esta fase las reservas se guardan en JSON (`data/`). El calendario se conecta
> en el paso 2.

---

## 2. Google Calendar como agenda (15 min)
La idea: el agente lee/escribe en un Google Calendar que el equipo ya mira.

1. **Crear la service account** (la "identidad" del bot):
   - Ve a Google Cloud Console → crea un proyecto (o usa uno).
   - Habilita la **Google Calendar API**.
   - Crea una **Service Account** → genera una **clave JSON** y descárgala.
   - Apunta el email de la service account (algo como
     `bot@tu-proyecto.iam.gserviceaccount.com`).
2. **Dar de alta las credenciales** (elige una opción):
   - Local: guarda el JSON fuera del repo y pon la ruta en `GOOGLE_CREDENTIALS_FILE`.
   - Hosting: pega el contenido del JSON en `GOOGLE_CREDENTIALS_JSON` (una línea).
   - NO subas ese JSON a git (ya está en `.gitignore` como `credentials.json`,
     pero guárdalo donde no lo arrastres por error).
3. **Compartir el calendario del negocio** con el email de la service account:
   - En Google Calendar → ajustes del calendario del negocio → *Compartir con
     determinadas personas* → añade el email de la service account con permiso
     **"Hacer cambios en eventos"**.
4. **Pegar el ID del calendario** en `tenants/barberia_demo/business.json` →
   `calendar.calendar_id`:
   - Ese ID está en *Configuración del calendario → Integrar calendario → ID del
     calendario* (para tu calendario principal suele ser tu propio email).
5. Reinicia y prueba `npm run chat`: al confirmar una cita, debe aparecer el
   evento en el calendario. (En la confirmación verás "añadida al calendario".)

> Si `calendar_id` está vacío o no hay credenciales, el agente sigue funcionando
> con JSON: no se rompe nada, simplemente no escribe en el calendario.

---

## 3. Avisos al equipo (5 min)
Cada reserva/lead/handoff avisa al equipo del negocio. Destino en
`tenants/barberia_demo/handoff.json` (`email` y/o `whatsapp`).
- Email: rellena los `SMTP_*` en `.env` (Gmail necesita una *App Password*).
- WhatsApp: necesita Twilio configurado (paso 4) y el `whatsapp` del handoff.
- Si no configuras ningún canal, los avisos salen por consola (útil para probar).

---

## 4. WhatsApp (Meta Cloud API, sin Twilio)
El canal de WhatsApp es directo contra Meta (Twilio se retiró). Los pasos
completos están en **docs/WHATSAPP-META.md**: crear la app en Meta, sacar
`META_ACCESS_TOKEN` y `META_PHONE_NUMBER_ID`, elegir `META_VERIFY_TOKEN`, y
apuntar el webhook a `https://TU-URL/whatsapp/meta/webhook`.

## 5. Producción (cuando ya funcione entre vosotros)
- **Número propio:** da de alta tu número de WhatsApp Business en Twilio
  (*WhatsApp senders*; requiere aprobar el perfil) y pon ese número en
  `TWILIO_WHATSAPP_NUMBER` y en `business.json` → `whatsapp_number`.
- **Despliegue 24/7:** sube el repo a GitHub y conéctalo a Railway
  (*Deploy from GitHub*). Añade en *Variables* las mismas claves del `.env`
  (incluido `GOOGLE_CREDENTIALS_JSON`). Railway te da una URL pública; el webhook
  de Twilio apunta a `https://...up.railway.app/whatsapp/webhook`.
- **Datos:** en Railway el disco es efímero (el JSON de `data/` se pierde al
  redesplegar). Con Calendar las CITAS están a salvo. Para leads/logs persistentes
  a largo plazo, migrar `src/store/` a PostgreSQL (ver roadmap v0.3).

---

## Alta de un cliente nuevo (resumen)
1. Copia `tenants/barberia_demo/` a `tenants/<cliente>/`.
2. Edita business/services/faq/policies/tone/handoff.
3. Crea/elige su calendario, compártelo con la service account y pon su `calendar_id`.
4. Da de alta su número de WhatsApp y apunta el webhook a `/whatsapp/webhook`.
