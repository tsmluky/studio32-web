const WHATSAPP =
  "https://wa.me/34694293166?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20el%20agente%20de%20WhatsApp%20para%20centros%20de%20est%C3%A9tica";

const SENALES = [
  {
    n: "Señal 01",
    titulo: "La reserva que obliga a elegir",
    texto:
      "El widget pide tratamiento antes de dejar preguntar. Quien no sabe cómo se llama lo que necesita, cierra la pestaña.",
  },
  {
    n: "Señal 02",
    titulo: "Cabina ocupada, mensaje esperando",
    texto:
      "Quien podría contestar está trabajando con alguien delante. El mensaje espera horas, y para entonces ya han preguntado en otro sitio.",
  },
  {
    n: "Señal 03",
    titulo: "Los días que cierras",
    texto:
      "Domingo y lunes se acumulan consultas que se contestan el martes. La decisión de quien preguntaba ya está tomada.",
  },
];

const HACE = [
  {
    titulo: "Deja contar el problema, no elegir del menú",
    texto:
      'Quien escribe "me están saliendo manchas" no tiene por qué saber cómo se llama ese tratamiento. Pregunta un par de cosas y propone el primer paso.',
  },
  {
    titulo: "Sostiene tu política de precios",
    texto:
      'Da cerrados los del catálogo. Del láser, los bonos y los faciales personalizados explica de qué dependen y ofrece la valoración. Nunca suelta un "suele rondar".',
  },
  {
    titulo: "Reserva con la profesional que piden",
    texto:
      "Si vienen por Carmen, busca hueco con Carmen. Y si no lo tiene, lo dice antes de ofrecer otra cosa, en vez de colocar la cita y que se descubra al llegar.",
  },
  {
    titulo: "Deja la ficha hecha",
    texto:
      "Cada cita llega con lo que preocupa, si ya se han hecho antes ese tratamiento, si hay una boda o un viaje de por medio y a quién pidieron.",
  },
];

const LIMITES = [
  {
    titulo: "No promete resultados ni sesiones",
    texto:
      'Ni "te va a quedar perfecto" ni "en tres sesiones lo tienes". Cuántas hacen falta se ve con la piel delante, y decirlo antes crea una reclamación.',
  },
  {
    titulo: "No decide sobre contraindicaciones",
    texto:
      "Ante embarazo, lactancia, medicación fotosensibilizante o una lesión en la zona, no dice ni que sí ni que no. Lo anota y lo lleva a valoración.",
  },
  {
    titulo: "No entra en médico-estética",
    texto:
      "Bótox, rellenos, hilos o mesoterapia los pasa a una persona. Eso lo valora un médico, no una recepción.",
  },
];

const FAQ = [
  {
    q: "¿Puede decir cuánto cuesta el láser o un bono?",
    a: "No, y es deliberado. Da cerrados los precios que están en tu catálogo y explica que el láser y los bonos dependen de la zona y de las sesiones. Después ofrece la valoración, que es lo que de verdad resuelve la duda. Una cifra dicha por chat se convierte en una discusión el día de pagar.",
  },
  {
    q: "¿Y si piden hora con una profesional concreta?",
    a: "Busca hueco con esa persona, no con el centro. Si no lo tiene, lo dice claro antes de ofrecer alternativa. En estética buena parte de la clientela viene por el nombre de quien la atiende, así que tratarlo como un detalle sería un error.",
  },
  {
    q: "¿Se conecta a mi agenda o lleva una lista aparte?",
    a: "Reserva sobre tu agenda real y consulta la disponibilidad antes de ofrecer una hora, teniendo en cuenta la duración de cada tratamiento y los días que cierras. No apunta en una lista paralela que luego haya que cuadrar a mano.",
  },
  {
    q: "¿Qué hace si preguntan por un tratamiento estando embarazadas?",
    a: "No decide. Lo dice con naturalidad, agenda la valoración gratuita y deja anotado el motivo para que quien atienda lo sepa antes de empezar. Lo mismo con lactancia, medicación fotosensibilizante o una lesión en la zona.",
  },
  {
    q: "¿Y con el bótox, los rellenos o los hilos?",
    a: "No los trata. Cualquier cosa con aguja la pasa a una persona del equipo con el contexto recogido, porque eso lo valora un médico y no una recepción.",
  },
  {
    q: "¿Sustituye a quien está en recepción?",
    a: "No. Cubre las horas de cabina, los días que cierras y las noches. Cuando la conversación necesita una persona, la pasa con todo delante.",
  },
];

const SHOWREEL = [
  {
    kind: "in" as const,
    texto:
      "Hola, me están saliendo manchas en la cara y no sé muy bien qué me haría falta.",
    estado: "Conversación entrante · domingo, centro cerrado",
  },
  {
    kind: "out" as const,
    texto:
      "Te leo. ¿Desde cuándo lo notas, y has hecho antes algún tratamiento facial?",
    estado: "El agente está entendiendo el caso",
  },
  { kind: "in" as const, texto: "Desde el verano, y nunca me he hecho nada." },
  {
    kind: "out" as const,
    texto:
      "Entonces yo empezaría por la valoración, que es gratuita y sales sabiendo qué se puede hacer y cuánto cuesta.",
  },
  { kind: "in" as const, texto: "¿Y no me puedes decir un precio ahora?" },
  {
    kind: "out" as const,
    texto:
      "De un facial personalizado no, porque cambia según lo que se vea, y prefiero no darte una cifra que luego no sea. La valoración no cuesta nada.",
    estado: "Política de precios del centro respetada",
  },
  {
    kind: "in" as const,
    texto: "Vale. ¿Puede ser con Carmen el sábado? Soy Lucía Ferrer.",
  },
  {
    kind: "out" as const,
    texto:
      "Hecho, Lucía: el sábado a las 10:30 con Carmen. Ojo que los sábados cerramos a las 14:00.",
    estado: "Cita confirmada · agenda actualizada",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4">
      [ {children} ]
    </p>
  );
}

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex flex-col leading-none">
            <span className="font-heading font-bold tracking-wide">
              STUDIO32
            </span>
            <span className="text-[10px] tracking-[0.25em] text-ink-subtle uppercase">
              Digital Systems
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#demo" className="text-ink-muted hover:text-ink">
              Pruébalo
            </a>
            <a href="#hace" className="text-ink-muted hover:text-ink">
              Qué hace
            </a>
            <a href="#faq" className="text-ink-muted hover:text-ink">
              Preguntas
            </a>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener"
              className="rounded-full bg-accent-fill text-accent-deep font-semibold px-5 py-2.5 shadow-1 hover:shadow-2 transition-shadow"
            >
              Hablemos
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-20">
        <nav className="text-sm text-ink-subtle mb-6">
          Studio32 <span aria-hidden>/</span> Centros de estética
        </nav>
        <SectionLabel>Centros de estética</SectionLabel>
        <h1 className="font-heading text-5xl md:text-6xl leading-[1.05] mb-6">
          Para pedir hora
          <br />
          <em className="italic">hay que saber</em>
          <br />
          qué pedir.
        </h1>
        <p className="max-w-2xl text-lg text-ink-muted leading-relaxed mb-8">
          Tu reserva online pide tratamiento, día y hora antes de dejar
          preguntar nada. Pero quien escribe casi nunca llega con el nombre
          del tratamiento: llega con un problema —manchas, la piel apagada,
          la espalda cargada— y con la duda del precio. Este agente atiende
          ese mensaje con el criterio de tu centro: deja que lo cuenten con
          sus palabras, no promete lo que no puede y cierra la cita con la
          profesional que piden.
        </p>
        <div className="flex flex-wrap gap-6 items-center">
          <a
            href="#demo"
            className="rounded-full bg-ink text-bg font-semibold px-7 py-3.5 shadow-2 hover:shadow-3 transition-shadow"
          >
            Hablar con el agente
          </a>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="text-accent font-medium underline underline-offset-4"
          >
            Pedir presupuesto
          </a>
        </div>
      </header>

      <main>
        {/* SEÑALES */}
        <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border">
          <div className="max-w-2xl mb-12">
            <SectionLabel>El coste invisible</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              Lo que no atiendes
              <br />
              también <em className="italic">cuesta</em>.
            </h2>
            <p className="text-ink-muted">
              Ninguna de estas consultas aparece en la contabilidad. Todas
              tienen coste.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {SENALES.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl bg-surface border border-border p-6 shadow-1"
              >
                <span className="text-xs font-semibold text-accent">
                  {s.n}
                </span>
                <strong className="block font-heading text-xl mt-2 mb-2">
                  {s.titulo}
                </strong>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {s.texto}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DEMO (mock visual — sin conexión al agente real todavía) */}
        <section id="demo" className="mx-auto max-w-6xl px-6 py-20 border-t border-border">
          <div className="max-w-2xl mb-12">
            <SectionLabel>Pruébalo aquí</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              No te lo contamos.
              <br />
              Te lo <em className="italic">enseñamos</em>.
            </h2>
            <p className="text-ink-muted">
              Cuéntale un problema sin decir el nombre del tratamiento,
              pregúntale el precio del láser o pide hora con una profesional
              concreta, y mira lo que vería el negocio: la conversación
              entrando, la cita creándose y el momento en que una persona
              toma el relevo.
            </p>
          </div>

          <div className="rounded-3xl bg-surface border border-border shadow-2 overflow-hidden max-w-xl">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-bg-warm">
              <div className="h-9 w-9 rounded-full bg-accent-fill flex items-center justify-center font-heading font-bold text-accent-deep text-sm">
                EA
              </div>
              <div>
                <p className="font-semibold text-sm">Estudio Áurea</p>
                <p className="text-xs text-ink-subtle">
                  domingo, con el centro cerrado
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 p-5">
              {SHOWREEL.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] ${m.kind === "out" ? "self-end items-end" : "self-start items-start"} flex flex-col gap-1`}
                >
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.kind === "out"
                        ? "bg-ink text-bg rounded-br-sm"
                        : "bg-bg-warm text-ink rounded-bl-sm"
                    }`}
                  >
                    {m.texto}
                  </div>
                  {m.estado && (
                    <span className="text-[11px] text-ink-subtle px-1">
                      {m.estado}
                    </span>
                  )}
                </div>
              ))}
              <div className="mt-2 rounded-xl border border-border-strong bg-bg-warm px-4 py-3 text-sm">
                <span className="text-accent font-semibold">
                  Cita confirmada ·
                </span>{" "}
                Sábado · 10:30 — Valoración con Carmen · Gratuita
              </div>
            </div>
          </div>
          <p className="text-xs text-ink-subtle mt-4 max-w-xl">
            Nota de montaje: esto es la conversación de muestra ya escrita
            para el sector. La versión publicada en <code>studio32.es</code>{" "}
            habla con el agente real por <code>POST /chat</code>; aquí queda
            como mock estático mientras se pule el diseño en Onlook.
          </p>
        </section>

        {/* LO QUE HACE */}
        <section id="hace" className="mx-auto max-w-6xl px-6 py-20 border-t border-border">
          <div className="max-w-2xl mb-12">
            <SectionLabel>En concreto</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl">
              Lo que hace
              <br />
              en <em className="italic">un centro</em>.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {HACE.map((h) => (
              <article key={h.titulo}>
                <h3 className="font-heading text-xl mb-2">{h.titulo}</h3>
                <p className="text-ink-muted leading-relaxed">{h.texto}</p>
              </article>
            ))}
          </div>
        </section>

        {/* LÍMITES */}
        <section className="mx-auto max-w-6xl px-6 py-20 border-t border-border bg-bg-warm">
          <div className="max-w-2xl mb-12">
            <SectionLabel>Límites</SectionLabel>
            <h2 className="font-heading text-3xl md:text-4xl mb-4">
              Y lo que no hace, que aquí importa más
            </h2>
            <p className="text-ink-muted">
              Un agente que promete resultados no te ahorra trabajo: te llena
              la agenda de gente con la expectativa equivocada. Estas reglas
              son parte de la configuración, no una promesa.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {LIMITES.map((l) => (
              <article
                key={l.titulo}
                className="rounded-2xl bg-surface border border-border p-6"
              >
                <h3 className="font-heading text-lg mb-2">{l.titulo}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {l.texto}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-6xl px-6 py-20 border-t border-border">
          <div className="grid md:grid-cols-[1fr_1.4fr] gap-12">
            <div>
              <SectionLabel>Preguntas frecuentes</SectionLabel>
              <h2 className="font-heading text-3xl md:text-4xl mb-4">
                Antes de ponerlo
                <br />
                <em className="italic">en marcha</em>.
              </h2>
              <p className="text-ink-muted mb-6">
                Y si falta la tuya, pregúntala directamente.
              </p>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener"
                className="text-accent font-medium underline underline-offset-4"
              >
                Escríbenos por WhatsApp ↗
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {FAQ.map((f, i) => (
                <details
                  key={f.q}
                  open={i === 0}
                  className="group rounded-xl border border-border bg-surface px-5 py-4"
                >
                  <summary className="flex items-center justify-between cursor-pointer font-medium list-none">
                    <span>{f.q}</span>
                    <span className="text-accent transition-transform group-open:rotate-45 text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <p className="text-sm text-ink-muted leading-relaxed mt-3">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER CTA */}
      <footer className="border-t border-border bg-ink text-bg">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent-fill mb-4">
            [ Hablemos de tu negocio ]
          </p>
          <h2 className="font-heading text-3xl md:text-5xl mb-4">
            Lo montamos con tu información.
            <br />Y te lo <em className="italic">enseñamos funcionando.</em>
          </h2>
          <p className="text-bg/70 max-w-xl mx-auto mb-8">
            Antes de que decidas nada, verás tu propio agente respondiendo
            con tus tratamientos, tus horarios y tus normas.
          </p>
          <a
            href={WHATSAPP}
            target="_blank"
            rel="noopener"
            className="inline-block rounded-full bg-accent-fill text-accent-deep font-semibold px-8 py-4 shadow-2"
          >
            Pedir una demo con mis datos ↗
          </a>
        </div>
        <div className="border-t border-bg/10 py-6 text-center text-xs text-bg/50">
          Studio32 · Digital Systems ©2026
        </div>
      </footer>
    </>
  );
}
