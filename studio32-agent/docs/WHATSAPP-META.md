# WhatsApp por Meta Cloud API (sin Twilio)

El agente ya tiene el canal listo (`src/channels/whatsapp.meta.js`, ruta
`/whatsapp/meta/webhook`). No hay que programar nada más: solo dar de alta la app
en Meta y pegar 3 datos en el `.env`. Es gratis y directo contra Meta.

## Lo que necesita el agente (solo 3 datos)
```
META_VERIFY_TOKEN     ← lo eliges tú (cualquier texto). Ej: studio32-verify
META_ACCESS_TOKEN     ← token de la app de Meta
META_PHONE_NUMBER_ID  ← el ID del número (NO el número), lo da Meta
```
Y una **URL pública** para el webhook (porque Meta tiene que poder llamar a tu
servidor). En local: `npx ngrok http 3000` → te da una URL https.

---

## CAMINO A — Probarlo YA (desarrollo, sin verificación, gratis)
Meta te da un **número de prueba** y **1.000 conversaciones/mes gratis**. Ideal
para validar todo entre nosotros antes de papeleo.

### Pasos (los puede hacer Pancho)
1. Entra en **developers.facebook.com** con tu cuenta y crea una **App** (tipo
   "Business").
2. En la app, **Add product → WhatsApp → Set up**.
3. En **WhatsApp → API Setup** verás:
   - un **número de prueba** ya creado,
   - el **Phone number ID** → eso es `META_PHONE_NUMBER_ID`,
   - un botón **Generate access token** (token temporal de 24h) → `META_ACCESS_TOKEN`.
4. En esa misma pantalla, añade **tu móvil** (y el de Juanma) como destinatarios
   de prueba (Meta solo deja enviar a números que añadas en modo prueba).
5. Configura el **Webhook**:
   - Arranca el server: `npm run dev`, y en otra terminal `npx ngrok http 3000`.
   - En la app de Meta → **WhatsApp → Configuration → Webhook → Edit**:
     - **Callback URL**: `https://TU-URL-NGROK/whatsapp/meta/webhook`
     - **Verify token**: el mismo `META_VERIFY_TOKEN` que pusiste en `.env`
   - Guarda (Meta hará un GET para verificar; nuestro server responde solo).
   - En **Webhook fields**, suscríbete a **messages**.
6. Pega los 3 valores en `.env`, reinicia `npm run dev`, y escribe desde tu móvil
   al número de prueba → el agente responde y agenda. ✅

> El token de 24h caduca; para pruebas largas o producción se usa uno permanente
> (System User, ver Camino B).

---

## CAMINO B — Producción (tu número propio de Studio32)
Aquí sí hay verificación de Meta. Se puede ir haciendo en paralelo.

### Para JUANMA (verificación del negocio en Meta)
1. Asegurar que existe un **Meta Business Portfolio** de Studio32 en
   **business.facebook.com**, y que Juanma (y/o Pancho) tiene **acceso de
   administrador**.
2. Completar la **verificación del negocio** (Business Verification): Meta pide
   documentación de la empresa (nombre, web studio32.es, etc.). Este paso es el
   que más tarda (de horas a varios días).
3. Dar a Pancho acceso de administrador a la app/WABA si la crea Juanma.

### Para PANCHO (configuración técnica)
1. En la app de Meta, añadir el **número de teléfono propio** de Studio32
   (uno que **NO esté ya en WhatsApp** — ni en la app normal). Lo más limpio es
   un número nuevo dedicado.
2. **Verificación del número**: Meta envía un **código por SMS o llamada** a ese
   número. Quien tenga el teléfono (Juanma o quien sea el titular) lee el código
   y lo metemos en Meta. → *Aquí es cuando le pides el código a Juanma.*
3. Generar un **token permanente** con un **System User**:
   Business Settings → Users → System Users → crear uno → asignarle la app y la
   WABA → **Generate token** con permisos `whatsapp_business_messaging` y
   `whatsapp_business_management`. Ese token es `META_ACCESS_TOKEN` definitivo.
4. Coger el **Phone number ID** del número propio → `META_PHONE_NUMBER_ID`.
5. Apuntar el webhook al servidor de producción:
   `https://TU-DOMINIO/whatsapp/meta/webhook` (cuando despleguemos).

---

## Resumen de qué pedirle a Juanma
- Acceso **admin** al Meta Business Portfolio de Studio32 (o que lo cree).
- Que complete la **verificación del negocio** en Meta.
- Cuando registremos el número: que nos pase el **código de verificación** que
  llegue por SMS/llamada al teléfono.
- (Si la cuenta de OpenAI es suya) la API key, opcional — con DeepSeek ya responde.

## Qué traer de vuelta para encender WhatsApp
`META_ACCESS_TOKEN`, `META_PHONE_NUMBER_ID` y el `META_VERIFY_TOKEN` que elijamos.
Se pegan en `.env`, `npm run check` lo confirma en verde, y listo.
