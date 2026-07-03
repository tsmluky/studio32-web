# Conectar Google Calendar (la agenda real de las citas)

Modelo elegido: las reservas caen en el Google Calendar de cada cliente y a su
móvil le llega la notificación nativa. Studio32 no mantiene ningún gestor: se
apoya en el calendario que el cliente ya usa.

## El concepto (multi-cliente)
- Studio32 tiene **UNA** "service account" (una identidad de robot de Google).
- **Cada cliente comparte su calendario** con el email de esa service account.
- En la ficha de cada cliente pones el **ID de su calendario**.
Así, un solo robot escribe en el calendario de cada negocio, cada uno en el suyo.

## Parte 1 — Crear la service account (una sola vez, lo hace Pancho)
1. Entra en **console.cloud.google.com** y crea un proyecto (o usa uno).
2. **APIs y servicios → Biblioteca →** busca **Google Calendar API → Habilitar**.
3. **APIs y servicios → Credenciales → Crear credenciales → Cuenta de servicio**.
   Ponle un nombre (ej. "studio32-agent") y créala.
4. Entra en esa cuenta de servicio → pestaña **Claves → Agregar clave → Crear
   nueva clave → JSON**. Se descarga un archivo `.json`. **Guárdalo bien** (es
   secreto, no lo subas a git).
5. Copia el **email** de la service account (algo como
   `studio32-agent@tu-proyecto.iam.gserviceaccount.com`).

## Parte 2 — Dárselo al agente
En `.env`, una de las dos opciones:
```
# Local (ruta al archivo descargado):
GOOGLE_CREDENTIALS_FILE=C:\ruta\a\la\clave.json
# O bien, pegando el JSON entero en una línea (para hosting):
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}
```
`npm run check` debe mostrar Google Calendar en verde.

## Parte 3 — Conectar el calendario de un cliente (por cada cliente)
1. En el **Google Calendar del cliente** → ajustes del calendario →
   **Compartir con determinadas personas** → añade el **email de la service
   account** con permiso **"Hacer cambios en eventos"**.
2. En ese mismo sitio, **Integrar calendario → ID del calendario** (suele ser el
   email del cliente para su calendario principal, o uno tipo `...@group.calendar.google.com`).
3. Pega ese ID en `tenants/<cliente>/business.json`:
   ```json
   "calendar": { "calendar_id": "AQUI_EL_ID", "timezone": "Europe/Madrid" }
   ```
4. Reinicia el servidor. Desde ahora, las reservas de ese cliente se crean como
   eventos en SU calendario (y se mueven/cancelan también).

> Mientras `calendar_id` esté vacío o no haya credenciales, las reservas se
> guardan en JSON y nada se rompe; al conectar el calendario, empiezan a caer ahí.

## El "parte" para el encargado (sin coste)
- Las citas le llegan por la **notificación del propio Google Calendar** en el móvil.
- Y puede **preguntarle al agente** "¿qué tengo hoy / mañana?": eso es modo dueño.
  Funciona desde su **enlace privado** (`/demo/?tenant=<id>&owner=<token>`) o, por
  WhatsApp, desde su **número** si está en `business.owner.whatsapp`.

## Qué traer de vuelta
- El **email de la service account** (para compartir los calendarios).
- El **JSON de la clave** (para `.env`).
- El **ID del calendario** de cada cliente.
