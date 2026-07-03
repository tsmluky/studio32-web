# Checklist · Sesión de configuración (60–90 min)
Uso interno Studio32 · Se rellena CON el dueño delante. Al terminar, el agente queda operativo en modo piloto.

## A. Datos del negocio → `business.json`
- [ ] Nombre exacto del restaurante y ciudad.
- [ ] Nombre del agente (por defecto "Reservas"; puede ser un nombre de persona si él prefiere).
- [ ] Horario real por turnos: días de apertura, franja de comidas, franja de cenas. Ojo con: día de cierre, viernes/sábado con cena más larga, festivos.
- [ ] **Capacidad**: ¿cuántas mesas quiere que sean reservables por el agente a la vez? (no tiene por qué ser el total del local — empezar conservador, p. ej. el 60–70%, y subir durante el piloto).
- [ ] **Máximo de comensales por reserva** por chat (a partir de ahí el agente toma los datos y avisa a Antonio). Típico: 8.
- [ ] Duración de mesa: comida y cena (por defecto 90/120 min — preguntarle si rota más rápido).

## B. Conocimiento del negocio → `faq.md`, `policies.md`, `tone.md`
- [ ] Carta: foto/PDF de la carta actual. Platos estrella, menú del día si hay, precios orientativos.
- [ ] Alérgenos y opciones (celiacos, vegetarianos, vegano): qué quiere que responda el agente.
- [ ] FAQs reales: ¿parking? ¿terraza? ¿niños/tronas? ¿mascotas? ¿se puede llevar tarta? ¿aceptan grupos?
- [ ] Políticas: antelación mínima de reserva, tolerancia de retraso, cómo gestiona los no-shows, eventos privados.
- [ ] Tono: pedirle que conteste él a 3 mensajes de ejemplo ("¿tenéis mesa para hoy?", "¿hay opción sin gluten?", "somos 15 personas") y destilar su forma de hablar a `tone.md`.

## C. Conexiones
- [ ] **Google Calendar**: crear calendario "Reservas — [Restaurante]" en la cuenta Google de Antonio → compartirlo con el service account de Studio32 (permiso "Realizar cambios") → pegar el `calendar_id` en `business.json` → hacer una reserva de prueba y verla aparecer en su móvil.
- [ ] **Reservas de otros canales** (TheFork, teléfono): acordar que el equipo las apunta en ESE mismo calendario — así el agente descuenta aforo automáticamente y no hay doble-booking.
- [ ] **Avisos**: email(s) donde quiere recibir cada reserva/cancelación/handoff. Verificar que llega.
- [ ] **Canal del piloto**: widget en su web si tiene (una línea de script) y/o WhatsApp — para WhatsApp, decidir número: sandbox de Twilio para el piloto; número propio requiere alta en Meta (explicárselo sin tecnicismos: "para producción hace falta verificar tu negocio con Meta, tarda unos días").
- [ ] **Modo dueño**: guardar su número/token de dueño para que pueda preguntarle al agente "¿qué tengo esta noche?".

## D. Antes de irte (verificación en vivo)
- [ ] Reserva completa de prueba desde el móvil de Antonio: pedir mesa → confirmar → aviso en su email → cita en su Calendar con "· N pax".
- [ ] Cancelación y cambio de hora de esa misma reserva.
- [ ] Grupo grande (más del máximo) → el agente deriva y llega el aviso de handoff.
- [ ] Pregunta de carta/alérgenos → responde según su FAQ, sin inventar.
- [ ] Borrar las pruebas del calendario.
- [ ] Acordar día/hora de la llamada semanal de feedback.

## E. Durante el piloto (nosotros)
- [ ] Revisar transcripciones en `/panel` cada 2–3 días; ajustar FAQs y políticas con lo que pregunte la gente real.
- [ ] Apuntar cada corrección: es la base de conocimiento del producto para los siguientes restaurantes.
- [ ] Criterio de éxito: 20+ conversaciones reales sin errores de reserva y Antonio dispuesto a recomendarlo.
