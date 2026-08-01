# -*- coding: utf-8 -*-
"""Genera las páginas por vertical de studio32.es.

Por qué un generador y no tres archivos a mano: las tres páginas comparten
cabecera, navegación, pie y bloque de demo. Escribirlas por separado garantiza
que diverjan a la tercera edición. Aquí el armazón vive una sola vez y lo que
cambia por vertical son datos.

  python _plantillas/generar-verticales.py

Salida: site/<slug>/index.html  (se commitea; no hay paso de build en el deploy)
"""
import io
import os

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = os.path.join(RAIZ, "site")
VERSION = "20260801-verticales-6"

# ── Datos por vertical ───────────────────────────────────────────────────────
VERTICALES = [
    {
        "slug": "agente-whatsapp-clinicas-dentales",
        "sector": "clinica",
        "titulo": "Agente de WhatsApp para clínicas dentales · Citas 24/7 | Studio32",
        "descripcion": (
            "Un agente de IA que atiende el WhatsApp de tu clínica dental cuando no hay nadie "
            "en recepción: filtra urgencias, informa según tu política de precios y cierra citas "
            "sobre tu agenda real. Con panel e intervención humana."
        ),
        "etiqueta": "CLÍNICAS DENTALES",
        "h1_a": "El paciente con dolor",
        "h1_em": "no espera",
        "h1_b": "a que abras.",
        "entrada": (
            "A las once de la noche, alguien con una muela que no le deja dormir busca clínica y "
            "escribe a tres. Contesta la que contesta. Este agente atiende ese mensaje con el "
            "criterio de tu clínica: pregunta lo que hay que preguntar, respeta tu política de "
            "precios y deja la cita cerrada sobre tu agenda real."
        ),
        "senales": [
            ("Urgencias fuera de horario",
             "El dolor no entiende de horarios comerciales, y quien no obtiene respuesta escribe a la clínica siguiente."),
            ("Recepción desbordada",
             "El teléfono suena mientras atiendes a quien tienes delante en el mostrador. Alguien pierde siempre."),
            ("Primera visita perdida",
             "La mayoría de quien pregunta precio no está comparando cifras: está decidiendo si se fía de ti."),
        ],
        "hace_titulo": "Lo que hace en una clínica",
        "hace": [
            ("Filtra la urgencia antes de dar hora",
             "Pregunta si el dolor es constante o solo al morder, y prioriza en consecuencia. No manda a todo el mundo al primer hueco libre."),
            ("Respeta tu política de precios",
             "Si tu clínica no da precios por chat, no los da. Deriva a la valoración y explica que el presupuesto sale por escrito."),
            ("Cierra sobre tu agenda real",
             "Consulta la disponibilidad de verdad antes de ofrecer una hora. No apunta en una lista paralela que luego hay que cuadrar."),
            ("Deja al equipo el contexto hecho",
             "Cada cita llega con el motivo anotado: qué le duele, desde cuándo, si viene con miedo y si preguntó por mutua."),
        ],
        "no_hace_titulo": "Y lo que no hace, que en una clínica importa más",
        "no_hace": [
            ("No diagnostica", "Recoge síntomas y prioriza, pero no dice qué tienes ni qué tratamiento necesitas. Eso es del profesional."),
            ("No confirma mutuas por su cuenta", "Si preguntan por una aseguradora que no está por escrito, dice que se confirma con los datos de la póliza. Afirmarlo hace que el paciente se presente creyendo que tiene cobertura."),
            ("No inventa precios ni plazos", "Lo que no está en tu catálogo, no se lo saca de la manga. Lo pasa a valoración."),
        ],
        "faq": [
            ("¿Puede distinguir una urgencia real de una consulta normal?",
             "Pregunta lo que preguntaría alguien de recepción: si el dolor es constante o solo al morder, desde cuándo, si hay inflamación. Con eso prioriza el hueco. No diagnostica: ordena."),
            ("¿Y si el paciente pregunta por el precio de un implante?",
             "Depende de lo que tú decidas. Si tu política es no dar precios cerrados por chat, explica de qué depende y ofrece la primera visita con presupuesto por escrito. Si tienes precios de catálogo, los da tal cual están."),
            ("¿Se conecta a mi agenda o lleva una lista aparte?",
             "A tu agenda. Consulta la disponibilidad real antes de ofrecer una hora, así que no hay dos pacientes citados a la vez ni cuadres manuales a final del día."),
            ("¿Qué pasa con los datos de los pacientes?",
             "Quedan en el panel de tu clínica, accesible para tu equipo y para Studio32 mientras dure el acompañamiento. Firmamos el contrato de encargado de tratamiento que exige el RGPD, y al terminar te los entregamos o los eliminamos."),
            ("¿Puede llevar el WhatsApp que ya usamos?",
             "Sí. Tus pacientes siguen escribiendo al mismo número de siempre, pero ese número deja de funcionar en la app del móvil y pasa a atenderse desde el panel. Lo hablamos antes de decidir."),
            ("¿Sustituye a la recepcionista?",
             "No. Cubre las horas en las que no hay nadie y descarga el mostrador cuando hay cola. Cuando la conversación necesita una persona, la pasa con todo el contexto delante."),
        ],
    },
    {
        "slug": "agente-whatsapp-restaurantes",
        "sector": "restaurante",
        "titulo": "Agente de WhatsApp para restaurantes · Reservas y alérgenos | Studio32",
        "descripcion": (
            "Un agente de IA que coge el WhatsApp de tu restaurante en pleno servicio: reserva "
            "sobre tu aforo real por turno, responde de la carta y los alérgenos, y pasa los "
            "grupos grandes a una persona."
        ),
        "etiqueta": "RESTAURANTES",
        "h1_a": "Las reservas entran",
        "h1_em": "cuando la sala",
        "h1_b": "está llena.",
        "entrada": (
            "Justo cuando nadie puede coger el teléfono. Este agente atiende ese mensaje con tu "
            "aforo real por turno, conoce tu carta y sus alérgenos, y deja la mesa reservada con "
            "lo que cocina necesita saber ya anotado."
        ),
        "senales": [
            ("En pleno servicio",
             "Nadie va a soltar una bandeja para coger el teléfono a las nueve y media de la noche."),
            ("La alergia que se pierde",
             "Se avisa al reservar y no llega a cocina. Es la queja que más caro sale."),
            ("El grupo que no cabe",
             "Doce personas un sábado no es una reserva, es una negociación. Y hay que responderla igual."),
        ],
        "hace_titulo": "Lo que hace en un restaurante",
        "hace": [
            ("Reserva sobre tu aforo real",
             "Sabe cuántas mesas tienes por turno y no acepta más de las que caben. Pregunta siempre el número de comensales."),
            ("Responde de tu carta, no de una genérica",
             "Consulta tus platos y sus alérgenos antes de contestar. Lo que no está en la carta, no existe: no se lo inventa."),
            ("Pasa la alergia a cocina por escrito",
             "La anota en la reserva y se lo dice al cliente, para que sepa que ha quedado registrada."),
            ("Deriva los grupos grandes",
             "A partir del número que tú marques, no cierra por chat: recoge datos y avisa al equipo para cuadrar menú y hora."),
        ],
        "no_hace_titulo": "Y lo que no hace, porque aquí un error se paga caro",
        "no_hace": [
            ("No improvisa con los alérgenos", "Si la carta no resuelve la duda, no deduce: la pasa a cocina. Una respuesta de más aquí manda a alguien al hospital."),
            ("No confirma grupos por su cuenta", "Los grupos grandes cambian el servicio. Los cierra una persona."),
            ("No inventa platos ni disponibilidad", "Ni sugiere lo que no está en carta ni acepta mesas que no tienes."),
        ],
        "faq": [
            ("¿Sabe cuántas mesas tengo libres?",
             "Sí, trabaja con tu aforo real por turno. Pregunta el número de comensales antes de confirmar y no acepta reservas que no caben."),
            ("¿Puede responder dudas de la carta?",
             "Consulta tu carta antes de contestar: platos, precios y alérgenos. Si la carta no resuelve la duda, avisa a una persona en lugar de improvisar."),
            ("¿Y los alérgenos? Me da miedo delegar eso.",
             "Y hace bien en darle miedo. Por eso el agente solo dice lo que está por escrito en tu carta, anota la alergia en la reserva y, ante cualquier duda que la carta no cubra, deriva a cocina."),
            ("¿Qué hace con una reserva de quince personas?",
             "No la cierra por chat. Recoge nombre, contacto y fecha, y avisa al equipo para que cuadre menú y hora contigo. El límite lo pones tú."),
            ("¿Puede cancelar y cambiar reservas?",
             "Sí, crea, mueve y cancela sobre la misma agenda. Si el cliente tiene más de una reserva, pregunta cuál antes de tocar nada."),
            ("¿Funciona con el número que ya tenemos?",
             "Sí, o con uno nuevo. Si migras el vuestro, los clientes siguen escribiendo al mismo sitio pero el número pasa a atenderse desde el panel."),
        ],
    },
    {
        "slug": "agente-whatsapp-servicios-locales",
        "sector": "servicios",
        "titulo": "Agente de WhatsApp para servicios locales · Presupuestos cualificados | Studio32",
        "descripcion": (
            "Un agente de IA que atiende el WhatsApp de tu taller o empresa de servicios: hace las "
            "preguntas técnicas que condicionan el precio y pasa el aviso al técnico con todo el "
            "contexto. Sin dar cifras a ciegas."
        ),
        "etiqueta": "SERVICIOS LOCALES",
        "h1_a": "El presupuesto",
        "h1_em": "lo cierra",
        "h1_b": "una persona.",
        "entrada": (
            "Pero las preguntas que hacen falta para prepararlo se pueden hacer antes. Este agente "
            "averigua lo que condiciona el precio —tipo de vivienda, aparato, antigüedad, zona— y "
            "le pasa el aviso a tu técnico con todo delante. El cliente no repite su caso dos veces."
        ),
        "senales": [
            ("La avería a primera hora",
             "Sin agua caliente y con niños en casa. Quiere saber cuándo va alguien, no cómo funciona una caldera."),
            ("El presupuesto imposible",
             "«Cuánto me cuesta» sin más datos no se puede responder, y contestar a ciegas es una discusión el día de la factura."),
            ("El aviso sin contexto",
             "El técnico llega sin saber a qué va, y la visita se convierte en una toma de datos."),
        ],
        "hace_titulo": "Lo que hace en una empresa de servicios",
        "hace": [
            ("Pregunta lo que condiciona el precio",
             "Piso o unifamiliar, qué aparato hay ahora y su antigüedad, si es solo calefacción o también agua caliente, y la zona."),
            ("Prioriza lo urgente como urgente",
             "Sin agua caliente o con fuga no rellena un cuestionario: busca hueco el mismo día o avisa al equipo."),
            ("Ofrece llamada o visita, no una promesa vaga",
             "Cierra con una franja horaria concreta y un nombre, no con un «te contactaremos»."),
            ("Entrega el aviso con todo escrito",
             "El técnico abre la ficha y ya sabe a qué va. El cliente no tiene que contar su problema otra vez."),
        ],
        "no_hace_titulo": "Y lo que no hace, que es justo lo que te protege",
        "no_hace": [
            ("No da precios a ciegas", "Ni «aproximados» ni «suele rondar». Un número dicho por chat se convierte en una discusión el día de la factura."),
            ("No promete plazos de material", "Ni compatibilidades ni condiciones de garantía. Eso lo concreta el técnico."),
            ("No gestiona un aviso de gas", "Ante olor a gas no agenda nada: indica cerrar la llave, salir y llamar al 112, y avisa al equipo de inmediato."),
        ],
        "faq": [
            ("¿Va a dar precios sin que yo lo controle?",
             "No. Solo da cerrados los que tú tengas en catálogo. Todo lo demás lo valora el técnico, y el agente lo dice explícitamente en lugar de soltar una cifra orientativa."),
            ("¿Qué preguntas hace antes de pasarme el aviso?",
             "Las que tú le digas que condicionan el trabajo. Por defecto: tipo de vivienda, aparato actual y antigüedad, alcance del servicio, código de error si lo hay, y zona."),
            ("¿Distingue una urgencia?",
             "Sí. Sin agua caliente, sin calefacción en invierno o una fuga tienen prioridad, y busca hueco el mismo día o avisa al equipo si no lo hay."),
            ("¿Y si el cliente está fuera de nuestra zona?",
             "Lo dice con naturalidad y pasa el aviso por si queréis hacer una excepción, en lugar de cerrarle la puerta sin más."),
            ("¿Puede agendar visitas directamente?",
             "Sí, sobre vuestra agenda real: visita de valoración, llamada del técnico o reparación. Con la franja horaria concreta."),
            ("¿Sirve para fontanería, clima, electricidad, reformas…?",
             "Sí. Lo que cambia son las preguntas que hace y las políticas, y eso se configura con vuestra información en la puesta en marcha."),
        ],
    },
]


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def faq_jsonld(v):
    entradas = ",\n".join(
        """        {
          "@type": "Question",
          "name": "%s",
          "acceptedAnswer": { "@type": "Answer", "text": "%s" }
        }""" % (esc(p).replace('"', "&quot;"), esc(r).replace('"', "&quot;"))
        for p, r in v["faq"]
    )
    return """    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": "https://www.studio32.es/%s/#faq",
      "mainEntity": [
%s
      ]
    }
    </script>""" % (v["slug"], entradas)


def servicio_jsonld(v):
    return """    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": "https://www.studio32.es/%s/#servicio",
      "name": "%s",
      "serviceType": "Agente de recepción por WhatsApp",
      "description": "%s",
      "provider": {
        "@type": "ProfessionalService",
        "name": "Studio32",
        "url": "https://www.studio32.es/",
        "telephone": "+34 694 29 31 66",
        "email": "info@studio32.es"
      },
      "areaServed": { "@type": "Country", "name": "España" }
    }
    </script>""" % (v["slug"], esc(v["titulo"].split(" | ")[0]), esc(v["descripcion"]))


def bloque_lista(items, clase):
    return "\n".join(
        """                <article>
                    <h3>%s</h3>
                    <p>%s</p>
                </article>""" % (esc(t), esc(d))
        for t, d in items
    )


def bloque_faq(v):
    return "\n".join(
        """                <details class="faq-item"%s>
                    <summary>
                        <span class="faq-q">%s</span>
                        <span class="faq-icon" aria-hidden="true"></span>
                    </summary>
                    <div class="faq-a">
                        <p>%s</p>
                    </div>
                </details>""" % (" open" if i == 0 else "", esc(p), esc(r))
        for i, (p, r) in enumerate(v["faq"])
    )


def bloque_senales(v):
    return "\n".join(
        """                <div>
                    <span>Señal %02d</span>
                    <strong>%s</strong>
                    <p>%s</p>
                </div>""" % (i + 1, esc(t), esc(d))
        for i, (t, d) in enumerate(v["senales"])
    )


PAGINA = """<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{titulo}</title>
    <meta name="description" content="{descripcion}">
    <meta name="theme-color" content="#f7f4ee">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Studio32">
    <meta property="og:title" content="{titulo}">
    <meta property="og:description" content="{descripcion}">
    <meta property="og:locale" content="es_ES">
    <meta property="og:url" content="https://www.studio32.es/{slug}/">
    <meta property="og:image" content="https://www.studio32.es/assets/og-cover.png">
    <meta name="twitter:card" content="summary_large_image">

    <link rel="canonical" href="https://www.studio32.es/{slug}/">
    <link rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' fill='%23f7f4ee'/><text x='50%' y='56%' dominant-baseline='middle' text-anchor='middle' font-family='serif' font-size='18' fill='%238a6421'>32</text></svg>">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&display=swap"
        rel="stylesheet">

    <link rel="stylesheet" href="../styles.css?v={version}">
    <link rel="stylesheet" href="../vertical.css?v={version}">

{servicio_jsonld}
{faq_jsonld}
</head>

<body class="pagina-vertical">
    <a class="skip-link" href="#contenido">Saltar al contenido</a>

    <nav class="navbar">
        <div class="container nav-inner">
            <a href="../" class="logo" aria-label="Studio32 · Digital Systems">
                <span class="logo-mark">STUDIO32</span>
                <span class="logo-sub">Digital Systems</span>
            </a>
            <div class="nav-right">
                <a href="#demo" class="nav-link">Pruébalo</a>
                <a href="#hace" class="nav-link">Qué hace</a>
                <a href="#faq" class="nav-link">Preguntas</a>
                <a href="../#tarifas" class="nav-link">Tarifas</a>
                <a href="https://wa.me/34694293166?text={wa}" target="_blank" rel="noopener" class="nav-btn">Hablemos</a>
            </div>
        </div>
    </nav>

    <header class="vertical-hero">
        <div class="container">
            <nav class="migas" aria-label="Ruta">
                <a href="../">Studio32</a> <span aria-hidden="true">/</span> <span>{etiqueta_llana}</span>
            </nav>
            <p class="section-label">[ {etiqueta} ]</p>
            <h1>{h1_a}<br><em>{h1_em}</em><br>{h1_b}</h1>
            <p class="vertical-entrada">{entrada}</p>
            <div class="hero-actions">
                <a href="#demo" class="hero-cta">Hablar con el agente</a>
                <a href="https://wa.me/34694293166?text={wa}" target="_blank" rel="noopener" class="hero-link">Pedir
                    presupuesto</a>
            </div>
        </div>
    </header>

    <main id="contenido">
        <section class="section">
            <div class="container">
                <div class="verticals-header">
                    <p class="section-label">[ EL COSTE INVISIBLE ]</p>
                    <h2 class="headline-med">Lo que no atiendes<br>también <em>cuesta</em>.</h2>
                    <p>Ninguna de estas consultas aparece en la contabilidad. Todas tienen coste.</p>
                </div>
                <div class="signal-list">
{senales}
                </div>
            </div>
        </section>

        <section class="section" id="demo">
            <div class="container">
                <div class="verticals-header">
                    <p class="section-label">[ PRUÉBALO AQUÍ ]</p>
                    <h2 class="headline-med">No te lo contamos.<br>Te lo <em>enseñamos</em>.</h2>
                    <p>Esto no es un vídeo ni una captura. Escribe como lo haría un cliente tuyo y mira en el panel
                        lo que vería el negocio: la conversación entrando, la cita creándose y el momento en que una
                        persona toma el relevo.</p>
                </div>
                <div class="live-demo" data-live-demo="{sector}"></div>
            </div>
        </section>

        <section class="section" id="hace">
            <div class="container">
                <div class="verticals-header">
                    <p class="section-label">[ EN CONCRETO ]</p>
                    <h2 class="headline-med">{hace_titulo_a}<br>en <em>{hace_titulo_b}</em>.</h2>
                </div>
                <div class="bloque-hace">
{hace}
                </div>
            </div>
        </section>

        <section class="section seccion-limites">
            <div class="container">
                <div class="verticals-header">
                    <p class="section-label">[ LÍMITES ]</p>
                    <h2 class="headline-med">{no_hace_titulo}</h2>
                    <p>Un agente que se inventa cosas no te ahorra trabajo: te lo multiplica. Estas reglas son parte
                        de la configuración, no una promesa.</p>
                </div>
                <div class="bloque-limites">
{no_hace}
                </div>
            </div>
        </section>

        <section class="section faq" id="faq">
            <div class="container">
                <div class="faq-layout">
                    <div class="faq-header">
                        <p class="section-label">[ PREGUNTAS FRECUENTES ]</p>
                        <h2 class="headline-med">Antes de ponerlo<br><em>en marcha</em>.</h2>
                        <p>Lo que suele preguntarse quien está a punto de delegar su WhatsApp.</p>
                        <a class="faq-contact" href="https://wa.me/34694293166?text={wa}" target="_blank"
                            rel="noopener">¿Otra pregunta? Hablemos <span>↗</span></a>
                    </div>
                    <div class="faq-list">
{faq}
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="section footer-cta" id="contact">
        <div class="container">
            <div class="cta-panel">
                <p class="section-label centered">[ HABLEMOS DE TU NEGOCIO ]</p>
                <h2 class="huge-text">Lo montamos con tu información.<br>Y te lo <em>enseñamos funcionando.</em></h2>
                <p class="cta-sub">Antes de que decidas nada, verás tu propio agente respondiendo con tus servicios,
                    tus horarios y tus normas.</p>
                <div class="cta-wrapper">
                    <a href="https://wa.me/34694293166?text={wa}" target="_blank" rel="noopener"
                        class="btn-massive">Pedir una demo con mis datos ↗</a>
                </div>
            </div>

            <div class="contact-grid">
                <div class="footer-marca">
                    <p class="section-label">[ STUDIO32 ]</p>
                    <h3>Sistemas digitales que atienden y dejan el control en el negocio.</h3>
                    <p>Studio32 Agent Platform es el producto principal: agente de recepción por WhatsApp, citas,
                        panel e intervención humana.</p>
                </div>
                <nav class="footer-col" aria-label="Otros sectores">
                    <p class="footer-col-titulo">Por sector</p>
                    <a href="../agente-whatsapp-clinicas-dentales/">Clínicas dentales</a>
                    <a href="../agente-whatsapp-restaurantes/">Restaurantes</a>
                    <a href="../agente-whatsapp-servicios-locales/">Servicios locales</a>
                </nav>
                <nav class="footer-col" aria-label="El agente">
                    <p class="footer-col-titulo">El agente</p>
                    <a href="../#control">Probar el agente</a>
                    <a href="../panel-de-control/">El panel de control</a>
                    <a href="../precio-agente-whatsapp/">Cuánto cuesta</a>
                    <a href="../#process">Implantación</a>
                    <a href="../#faq">Preguntas frecuentes</a>
                </nav>
                <div class="footer-col">
                    <p class="footer-col-titulo">Contacto</p>
                    <a href="mailto:info@studio32.es">info@studio32.es</a>
                    <a href="https://wa.me/34694293166" target="_blank" rel="noopener">+34 694 29 31 66</a>
                    <a href="../legal/aviso-legal.html">Aviso legal</a>
                    <a href="../legal/privacidad.html">Privacidad</a>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="brand">Studio32 · Digital Systems ©2026</div>
                <div class="footer-services">Agent Platform · Presence · Systems</div>
            </div>
        </div>
    </footer>

    <script src="../script.js?v={version}" defer></script>
</body>

</html>
"""


def main():
    for v in VERTICALES:
        carpeta = os.path.join(SITE, v["slug"])
        os.makedirs(carpeta, exist_ok=True)

        partes = v["hace_titulo"].split(" en ")
        wa = ("Hola,%20quiero%20informaci%C3%B3n%20sobre%20el%20agente%20de%20WhatsApp%20para%20"
              + v["etiqueta"].lower().replace(" ", "%20"))

        html = PAGINA.format(
            titulo=esc(v["titulo"]),
            descripcion=esc(v["descripcion"]),
            slug=v["slug"],
            version=VERSION,
            sector=v["sector"],
            etiqueta=v["etiqueta"],
            etiqueta_llana=v["etiqueta"].capitalize(),
            h1_a=esc(v["h1_a"]),
            h1_em=esc(v["h1_em"]),
            h1_b=esc(v["h1_b"]),
            entrada=esc(v["entrada"]),
            senales=bloque_senales(v),
            hace_titulo_a=esc(partes[0]),
            hace_titulo_b=esc(partes[1] if len(partes) > 1 else "tu negocio"),
            hace=bloque_lista(v["hace"], "hace"),
            no_hace_titulo=esc(v["no_hace_titulo"]),
            no_hace=bloque_lista(v["no_hace"], "limite"),
            faq=bloque_faq(v),
            faq_jsonld=faq_jsonld(v),
            servicio_jsonld=servicio_jsonld(v),
            wa=wa,
        )

        destino = os.path.join(carpeta, "index.html")
        io.open(destino, "w", encoding="utf-8").write(html)
        print("generada:", v["slug"] + "/index.html", "|", len(html), "caracteres")


if __name__ == "__main__":
    main()
