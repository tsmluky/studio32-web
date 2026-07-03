# Bot de atención y captación de leads · Studio32 · Digital Systems

Bot de canal público (web o WhatsApp) que atiende dudas sobre Studio32 con el
tono y el contexto de la marca, y capta leads guardándolos en una hoja de Google
Sheets para que el equipo los contacte. **No da precios ni agenda: recoge
información.** Los presupuestos y las citas los gestiona el equipo humano.

Hereda la arquitectura del bot de ejemplo (bucle de `tool_use`, filtro de
seguridad anti-fuga, confidencialidad por conversación) y la adapta al funnel de
Studio32: visitante → registrar lead → el equipo prepara propuesta.

## Qué hace

- Responde con el tono de marca (sobrio, premium, español, sin emojis, sin precios).
- Explica las cuatro líneas de servicio y empuja la auditoría como primer paso.
- Cuando hay interés real, recoge nombre + contacto (y, si puede, sector, ciudad,
  necesidad y preferencia de contacto) y lo guarda en Google Sheets.
- Filtro de seguridad: nunca filtra datos de otros leads ni "texto interno".

## Requisitos

- Node.js 18 o superior.
- Una clave de API de Anthropic.
- Una hoja de Google Sheets y una cuenta de servicio de Google Cloud.

## Instalación

1. Entra en la carpeta e instala dependencias:

   ```
   cd bot-atencion-leads
   npm install
   ```

2. Copia `.env.example` como `.env` y rellena:
   - `ANTHROPIC_API_KEY` — desde console.anthropic.com
   - `SPREADSHEET_ID` — el ID en la URL de tu hoja:
     `docs.google.com/spreadsheets/d/ESTE_ID/edit`
   - `PORT` — opcional (3000 por defecto)

## Conectar Google Sheets

1. En Google Cloud Console crea un proyecto y activa la **Google Sheets API**.
2. Crea una **cuenta de servicio** y genera una clave JSON.
3. Guarda esa clave como `credentials.json` dentro de esta carpeta.
4. Abre tu hoja de Google Sheets y **compártela** (con permiso de editor) con el
   email de la cuenta de servicio (algo como `...@...iam.gserviceaccount.com`).
5. Crea una pestaña llamada **`Leads`** con esta cabecera en la fila 1:

   | Fecha | Nombre | Contacto | Tipo negocio | Ciudad | Línea interés | Necesidad | Preferencia contacto | Canal |

   El bot añade una fila nueva por cada lead (rango `Leads!A:I`).

## Arrancar

```
npm start
```

Verás en consola si la API key y el Spreadsheet ID se han cargado.

## Endpoints

El bot expone dos canales sobre el mismo cerebro:

- **`POST /chat`** — para el widget de chat de la web. Recibe y devuelve JSON:

  ```json
  // petición
  { "sesion": "id-unico-del-visitante", "mensaje": "Hola, ¿qué hacéis?" }
  // respuesta
  { "respuesta": "..." }
  ```

  `sesion` debe ser un identificador estable por visitante (por ejemplo un UUID
  guardado en el navegador) para mantener el hilo de la conversación.

- **`POST /webhook`** — para WhatsApp vía Twilio. Recibe `Body` y `From` y
  devuelve TwiML (XML). Apunta aquí el webhook de tu número de Twilio.

- **`GET /`** — healthcheck.

## Conectar WhatsApp (Twilio)

1. En Twilio activa WhatsApp (sandbox para pruebas o número propio en producción).
2. En la config del número, pon como webhook de mensajes entrantes la URL pública
   de tu servidor + `/webhook` (usa un túnel como ngrok en local, o tu dominio en
   producción).

## Notas técnicas

- El historial de conversación se guarda en memoria (`conversaciones`). Si
  reinicias el proceso, se pierde. Para producción conviene moverlo a Redis o BD.
- El dedup de leads (`leadsRegistrados`) también es en memoria.
- El modelo usado es `claude-sonnet-4-6`. Se puede cambiar en `index.js`.
- Reglas de marca, tono y prohibiciones viven en `construirSystemPrompt()`.
  Edita ahí para ajustar el comportamiento; el resto del flujo no hace falta tocarlo.

## Qué NO incluye (a propósito)

- No da precios ni rangos: deriva a auditoría/propuesta del equipo.
- No agenda citas: solo capta el lead.
- No usa las skills internas del estudio (auditoría, prospección, n8n, etc.):
  esas son para el futuro agente interno, no para este bot público.
