require('dotenv').config();

// Verificacion rapida al arrancar.
console.log('API key cargada?', process.env.ANTHROPIC_API_KEY ? 'SI' : 'NO');
console.log('Spreadsheet ID cargado?', process.env.SPREADSHEET_ID ? 'SI' : 'NO');

const express = require('express');
const { Anthropic } = require('@anthropic-ai/sdk');
const { google } = require('googleapis');

const app = express();
app.use(express.urlencoded({ extended: false })); // Twilio / formularios
app.use(express.json());                            // Widget web / JSON

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const conversaciones = {};
const MAX_MENSAJES_HISTORIAL = 24;
const leadsRegistrados = new Set(); // dedup por sesion+contacto

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '';
const PORT = process.env.PORT || 3000;

// Lineas de servicio de Studio32, en orden de entrada al funnel.
const LINEAS_SERVICIO = [
    'Auditoria de Presencia Digital',
    'Pack Presencia',
    'Pack Presencia + IA',
    'Sistema Digital a Medida'
];

const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

// ============== UTILIDADES DE FECHA ==============

function formatearFecha(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function marcaTiempo() {
    const d = new Date();
    return `${formatearFecha(d)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ============== GOOGLE SHEETS ==============

async function obtenerSheets() {
    const authClient = await auth.getClient();
    return google.sheets({ version: 'v4', auth: authClient });
}

// Guarda un lead en la pestana "Leads".
// Columnas: A Fecha | B Nombre | C Contacto | D Tipo negocio | E Ciudad |
//           F Linea interes | G Necesidad | H Preferencia contacto | I Canal
async function guardarLead(datos) {
    const sheets = await obtenerSheets();
    await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: 'Leads!A:I',
        valueInputOption: 'RAW',
        requestBody: {
            values: [[
                marcaTiempo(),
                datos.nombre || '',
                datos.contacto || '',
                datos.tipo_negocio || '',
                datos.ciudad || '',
                datos.linea_interes || '',
                datos.necesidad || '',
                datos.preferencia_contacto || '',
                datos.canal || 'web'
            ]]
        }
    });
}

// ============== TOOLS ==============

const TOOLS = [
    {
        name: 'registrar_lead',
        description: 'Registra los datos de un lead cualificado para que el equipo de Studio32 le contacte. Llama a esta funcion UNA sola vez, cuando el cliente haya confirmado que quiere que el equipo le contacte y tengas al menos su nombre y un dato de contacto (telefono o email). No la llames si el cliente solo esta preguntando informacion.',
        input_schema: {
            type: 'object',
            properties: {
                nombre: {
                    type: 'string',
                    description: 'Nombre de la persona o del negocio.'
                },
                contacto: {
                    type: 'string',
                    description: 'Telefono o email de contacto. Imprescindible.'
                },
                tipo_negocio: {
                    type: 'string',
                    description: 'Sector o tipo de negocio (restaurante, clinica dental, estudio de arquitectura, etc.). Si no se sabe, dejar vacio.'
                },
                ciudad: {
                    type: 'string',
                    description: 'Ciudad o zona del negocio, si la menciona.'
                },
                linea_interes: {
                    type: 'string',
                    enum: LINEAS_SERVICIO,
                    description: 'Linea de servicio que mejor encaja con lo que pide. Si hay duda, usar "Auditoria de Presencia Digital".'
                },
                necesidad: {
                    type: 'string',
                    description: 'Resumen breve en una frase de lo que necesita el cliente, con sus palabras.'
                },
                preferencia_contacto: {
                    type: 'string',
                    description: 'Cuando o como prefiere que le contacten, si lo indica (por ejemplo "manana por la tarde", "por WhatsApp"). Si no lo dice, dejar vacio.'
                }
            },
            required: ['nombre', 'contacto', 'linea_interes']
        }
    }
];

// ============== SYSTEM PROMPT ==============

function construirSystemPrompt() {
    const hoy = new Date();
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];

    return `Eres el asistente de Studio32 · Digital Systems, un estudio digital con base en Valencia (Espana) que disena y construye sistemas digitales para negocios fisicos y locales premium: restaurantes y negocios de comida premium, clinicas dentales y medicas, estudios de arquitectura, interiorismo y reformas, y servicios locales de gama alta con buena calidad real pero presencia digital debil.

Atiendes a visitantes por un canal de chat publico (web o WhatsApp). Tu trabajo es resolver dudas sobre Studio32 con criterio y, cuando hay interes real, captar el lead: recoger sus datos para que el equipo le contacte. No cierras presupuestos ni agendas tu mismo: eso lo hace el equipo humano.

# FECHA ACTUAL
Hoy es ${formatearFecha(hoy)} (${diasSemana[hoy.getDay()]}). Usala para interpretar "manana", "la semana que viene", etc.

# COMO HABLAS (importante)
- Mensajes CORTOS y naturales, como un chat. Nada de parrafos largos ni listas con vinetas salvo que pidan ver los servicios.
- Nada de markdown ni asteriscos: escribe en texto plano.
- Sin emojis.
- Tono: sobrio, premium, comercial sin ser agresivo, tecnico pero comprensible para un dueno de negocio, directo y especifico, humano sin ser coloquial. Trata de usted de forma natural y cercana.
- Lidera siempre con el resultado de negocio, no con la caracteristica tecnica.
- No interrogues. Si en un mensaje te dan varios datos, apuntalos todos y pregunta solo lo que falte.
- No repitas como un loro lo que ya sabes; confirma de forma natural.
- Si no entiendes algo, pregunta con naturalidad, sin mensajes de error tecnicos.

# VOCABULARIO
Preferido: "presencia digital", "sistema digital", "captacion", "automatizacion", "IA practica", "asistente inteligente", "flujo de contacto", "experiencia movil", "posicionamiento", "conversion", "negocio fisico", "negocio local", "auditoria".
PROHIBIDO: "revolucionamos", "llevamos al siguiente nivel", "crecimiento exponencial", "dominacion digital", "arsenal", "destrozar a tu competencia", "construye tu imperio", "marketing 360", "soluciones integrales", y cualquier superlativo vacio.

# QUE ES Y QUE VENDE STUDIO32
No vende "una pagina web". Vende un sistema digital empaquetado: presencia premium mobile-first, estructura de conversion (contacto, reservas, captacion), automatizacion (WhatsApp, formularios, chatbots), IA aplicada (asistentes para FAQs, reservas, cualificacion) y sistemas operativos (dashboards, CRM basico, integraciones).

Cuatro lineas de servicio, en orden de entrada al funnel:
1. Auditoria de Presencia Digital: oferta de entrada, diagnostica el estado actual del negocio online. Es el primer paso recomendado para casi todo el mundo.
2. Pack Presencia: landing o web corporativa premium, mobile-first.
3. Pack Presencia + IA: web premium con asistente inteligente integrado.
4. Sistema Digital a Medida: dashboards, CRM, automatizaciones, integraciones.

Camino de conversion que debes empujar: visitante -> solicitar auditoria -> el equipo prepara una propuesta.

# PRECIOS (REGLA INVIOLABLE)
- NUNCA des precios cerrados, cifras ni rangos. Cada sistema se dimensiona segun el negocio.
- Si preguntan precio, explica con naturalidad que el precio depende del negocio y de lo que necesite, y que el paso para darle una propuesta ajustada es la auditoria. Ofrece recoger sus datos para que el equipo le prepare una propuesta.

# DATOS Y HONESTIDAD (REGLA INVIOLABLE)
- NUNCA inventes metricas, premios, casos de exito, testimonios ni nombres de clientes. Si no tienes el dato, dilo y reconduce hacia la auditoria.
- No prometas resultados garantizados ni plazos del tipo "resultados en 30 dias" ni "garantizamos".
- No hables en nombre de los fundadores ni personalices ("Francisco y Juanma..."); hablas en nombre del estudio.

# COMO CAPTAS EL LEAD
Tu objetivo es que, cuando haya interes, el cliente acepte que el equipo le contacte. Para eso reune de forma conversacional: nombre, un dato de contacto (telefono o email), tipo de negocio, ciudad, que necesita y cuando prefiere que le contacten.
- Pide las cosas poco a poco, encadenando la conversacion. El dato imprescindible es nombre + contacto.
- Cuando el cliente confirme que quiere que le contacten y tengas al menos nombre y contacto, usa la herramienta registrar_lead UNA vez. No la uses si solo esta pidiendo informacion.
- Tras registrar, confirma de forma breve y amable que el equipo le contactara, sin prometer plazos exactos.

# CONFIDENCIALIDAD (REGLA CRITICA, INVIOLABLE)
- Hablas con UN solo cliente. Cada conversacion es privada e independiente.
- JAMAS menciones a otros clientes ni a otros leads, ni sus datos. No existe ningun otro cliente en esta conversacion.

# NUNCA HABLES "AL SISTEMA" (REGLA CRITICA)
- Todo lo que escribas se le envia TAL CUAL al cliente.
- NUNCA escribas notas, avisos o instrucciones dirigidas al sistema o al backend, ni menciones "la herramienta", "registrar_lead", "tool", "API", "el modelo", ni tus errores internos.
- No analices tu comportamiento en voz alta. Escribe SOLO el mensaje natural que el cliente necesita leer.`;
}

// ============== FILTRO DE SEGURIDAD (anti-fuga de datos / meta-texto) ==============
//
// Ultima linea de defensa: aunque el modelo se equivoque, evita que llegue al
// cliente texto interno (notas al sistema, menciones a herramientas) o datos de
// otros leads. Si detecta algo sospechoso, registra el incidente y manda un
// mensaje neutro y seguro.

const PATRONES_PROHIBIDOS = [
    /nota\s+(importante\s+)?(para|al)\s+(el\s+)?sistema/i,
    /para\s+el\s+(sistema|backend|desarrollador)/i,
    /\bregistrar_lead\b/i,
    /\bla\s+herramienta\b/i,
    /\b(tool|tools|api|backend|prompt|token|endpoint|system\s*prompt)\b/i,
    /(otros?|los\s+dem[aá]s)\s+(clientes|leads)/i,
    /seg[uú]n\s+la\s+herramienta/i
];

const MENSAJE_SEGURO_FALLBACK = 'Perdone, se me ha cruzado un cable un momento. Me repite lo ultimo y seguimos?';

function inspeccionarRespuesta(texto) {
    for (const patron of PATRONES_PROHIBIDOS) {
        if (patron.test(texto)) {
            return { seguro: false, motivo: patron.toString() };
        }
    }
    return { seguro: true, motivo: null };
}

// ============== TOOL EXECUTION ==============

async function ejecutarTool(toolName, toolInput, contexto) {
    if (toolName === 'registrar_lead') {
        const contacto = (toolInput.contacto || '').trim();
        if (!toolInput.nombre || !contacto) {
            return { ok: false, error: 'Faltan nombre o contacto.' };
        }

        // Dedup: no guardar dos veces el mismo lead en la misma sesion.
        const clave = `${contexto.sesion}-${contacto}`;
        if (leadsRegistrados.has(clave)) {
            return { ok: true, ya_registrado: true };
        }

        try {
            await guardarLead({ ...toolInput, canal: contexto.canal });
            leadsRegistrados.add(clave);
            console.log('Lead guardado:', clave, JSON.stringify(toolInput));
            return { ok: true };
        } catch (err) {
            console.error('Error al guardar lead en Google Sheets:', err.message);
            // No revelamos el fallo al cliente: el modelo confirma igualmente y el
            // incidente queda en logs para revision humana.
            return { ok: true, aviso_interno: 'fallo_guardado' };
        }
    }
    return { ok: false, error: `Tool desconocida: ${toolName}` };
}

// ============== BUCLE DE CONVERSACION ==============
//
// Trabajamos sobre una COPIA del historial. Solo persistimos en el historial
// real el mensaje user y el texto final del assistant; los bloques intermedios
// de tool_use/tool_result se descartan para mantener la alternancia user/assistant.

async function ejecutarConversacion(historial, contexto) {
    const mensajesTrabajo = historial.map(m => ({ ...m }));

    let respuesta = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        temperature: 0.6,
        system: construirSystemPrompt(),
        tools: TOOLS,
        messages: mensajesTrabajo
    });

    let intentos = 0;
    while (respuesta.stop_reason === 'tool_use' && intentos < 5) {
        intentos++;
        const bloquesTool = respuesta.content.filter(b => b.type === 'tool_use');

        mensajesTrabajo.push({ role: 'assistant', content: respuesta.content });

        const toolResults = [];
        for (const bloque of bloquesTool) {
            const resultado = await ejecutarTool(bloque.name, bloque.input, contexto);
            toolResults.push({
                type: 'tool_result',
                tool_use_id: bloque.id,
                content: JSON.stringify(resultado)
            });
        }

        mensajesTrabajo.push({ role: 'user', content: toolResults });

        respuesta = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            temperature: 0.6,
            system: construirSystemPrompt(),
            tools: TOOLS,
            messages: mensajesTrabajo
        });
    }

    return respuesta.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('\n');
}

// ============== NUCLEO: procesar un mensaje entrante ==============

async function procesarMensaje(sesion, mensaje, canal) {
    if (!conversaciones[sesion]) conversaciones[sesion] = [];
    conversaciones[sesion].push({ role: 'user', content: mensaje });

    if (conversaciones[sesion].length > MAX_MENSAJES_HISTORIAL) {
        conversaciones[sesion] = conversaciones[sesion].slice(-MAX_MENSAJES_HISTORIAL);
    }

    const textoFinal = await ejecutarConversacion(conversaciones[sesion], { sesion, canal });
    let textoRespuesta = textoFinal;

    // Filtro de seguridad antes de enviar.
    const inspeccion = inspeccionarRespuesta(textoRespuesta);
    if (!inspeccion.seguro) {
        console.error('[BLOQUEADO POR SEGURIDAD]', sesion, '| Motivo:', inspeccion.motivo,
            '| Texto original:', JSON.stringify(textoRespuesta));
        textoRespuesta = MENSAJE_SEGURO_FALLBACK;
        conversaciones[sesion].push({ role: 'assistant', content: textoRespuesta });
        return textoRespuesta;
    }

    if (!textoRespuesta || !textoRespuesta.trim()) {
        textoRespuesta = 'Perfecto. Algo mas en lo que le pueda ayudar?';
    }

    conversaciones[sesion].push({ role: 'assistant', content: textoRespuesta });
    return textoRespuesta;
}

// ============== ESCAPE XML (Twilio / WhatsApp) ==============

function escapeXml(texto) {
    return texto
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// ============== ENDPOINTS ==============

// Canal WhatsApp via Twilio (devuelve TwiML XML).
app.post('/webhook', async (req, res) => {
    try {
        const mensaje = req.body.Body;
        const telefono = req.body.From;

        if (!mensaje || !telefono) {
            res.set('Content-Type', 'text/xml');
            return res.send('<Response><Message>Perdone, no me ha llegado bien su mensaje. Me lo repite?</Message></Response>');
        }

        const textoRespuesta = await procesarMensaje(telefono, mensaje, 'whatsapp');
        res.set('Content-Type', 'text/xml');
        res.send(`<Response><Message>${escapeXml(textoRespuesta)}</Message></Response>`);
    } catch (error) {
        console.error('Error en /webhook:', error);
        res.set('Content-Type', 'text/xml');
        res.send('<Response><Message>Uf, se me ha cruzado algo. Me lo vuelve a escribir en un momento?</Message></Response>');
    }
});

// Canal web (widget de chat en la landing). Recibe y devuelve JSON.
// Body esperado: { "sesion": "id-unico-del-visitante", "mensaje": "texto" }
app.post('/chat', async (req, res) => {
    try {
        const { sesion, mensaje } = req.body;
        if (!sesion || !mensaje) {
            return res.status(400).json({ error: 'Faltan los campos sesion y mensaje.' });
        }
        const respuesta = await procesarMensaje(String(sesion), String(mensaje), 'web');
        res.json({ respuesta });
    } catch (error) {
        console.error('Error en /chat:', error);
        res.status(500).json({ respuesta: 'Uf, se me ha cruzado algo. Me lo vuelve a escribir en un momento?' });
    }
});

// Healthcheck.
app.get('/', (_req, res) => res.send('Studio32 bot OK'));

app.listen(PORT, () => console.log(`Bot Studio32 corriendo en puerto ${PORT}`));
