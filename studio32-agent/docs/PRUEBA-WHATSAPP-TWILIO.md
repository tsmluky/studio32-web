# Probar WhatsApp HOY con Twilio (sandbox)

Sin comprar nada y sin verificación de Meta. El sandbox te da un número de prueba
compartido (+14155238886) para validar el flujo entre nosotros.

## Requisitos
- `.env` ya tiene `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN` y
  `TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886`.
- DeepSeek activo (`LLM_PROVIDER=deepseek`).

## Pasos
1. Instala y arranca:
   ```
   npm install
   npm run dev
   ```
2. Expón el puerto 3000 a internet:
   ```
   npx ngrok http 3000
   ```
   Copia la URL https que te da (p. ej. https://abc123.ngrok-free.app).
3. En la consola de Twilio → **Messaging → Try it out → Send a WhatsApp message
   → Sandbox settings**:
   - **When a message comes in**: `https://TU-URL-NGROK/whatsapp/webhook`
   - Método: **POST** → Guarda.
4. Une tu móvil al sandbox: envía por WhatsApp el mensaje `join <código>` (el que
   te muestra Twilio) al número **+1 415 523 8886**.
5. Escríbele algo (“hola, ¿qué hacéis?”). Responde el agente del tenant por
   defecto (**studio32**) con DeepSeek. Pídele una auditoría y la agenda; el aviso
   te llega por email a info@studio32.es.

> Para que conteste OTRO tenant (p. ej. una barbería) en vez de studio32, hay que
> tener un número propio por cliente (producción). En el sandbox solo hay un número,
> así que responde el `DEFAULT_TENANT`.

## Pasar a un número real (más adelante)
- Comprar/registrar un número en Twilio como **WhatsApp sender** (sigue requiriendo
  una cuenta de WhatsApp Business y verificación de Meta para producción).
- Poner ese número en `TWILIO_WHATSAPP_NUMBER` y en el `business.json` del cliente
  (`whatsapp_number`) para que el agente resuelva su tenant.
- Apuntar el webhook de ese número a `https://TU-DOMINIO/whatsapp/webhook`.

## ¿Twilio o Meta?
Los dos canales están montados (Twilio en `/whatsapp/webhook`, Meta en
`/whatsapp/meta/webhook`). Comparación de costes y cuándo usar cada uno: el agente
responde gratis dentro de la ventana de 24h en ambos; Twilio añade un pequeño
recargo y alquiler de número pero te lo gestiona todo; Meta directo es más barato
pero provisionas tú el número.
