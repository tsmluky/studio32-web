/* =============================================================================
   Página "El panel" · tour de producto interactivo
   =============================================================================
   Reproduce el panel REAL (repo studio32-panel): cinco secciones, las métricas
   del resumen, el calendario mensual y los servicios editables.

   Los datos son de Clínica Cobalto, el mismo negocio ficticio de la demo de la
   portada, para que quien venga de allí reconozca las conversaciones. Está
   marcado como demostración en la propia página: no se presenta como datos
   reales de nadie.

   Si el panel de verdad cambia, esto hay que actualizarlo. Un tour que enseña
   algo que no existe es peor que no tener tour.
   ========================================================================== */
(() => {
    const app = document.querySelector('[data-panel]');
    if (!app) return;

    // ── Datos ────────────────────────────────────────────────────────────────
    const CONVERSACIONES = [
        {
            id: 'marta',
            nombre: 'Marta García',
            asunto: 'Dolor · urgencia',
            hora: '21:49',
            estado: 'agente',
            control: 'Agente',
            mensajes: [
                { tipo: 'in', texto: 'Buenas noches, llevo dos días con dolor en una muela y no sé si aguantar hasta el lunes.' },
                { tipo: 'out', texto: 'Vaya, lo siento. ¿Te duele todo el rato o solo al morder?' },
                { tipo: 'in', texto: 'Todo el rato, y por la noche va a peor.' },
                { tipo: 'out', texto: 'Con ese dolor mejor no esperar al lunes. Mañana me queda a las 9:30 o a las 12.' },
                { tipo: 'in', texto: 'A las 9:30.' },
                { tipo: 'out', texto: 'Hecho, Marta: mañana a las 9:30. Si esta noche va a peor, escríbeme y aviso al equipo.' },
                { tipo: 'nota', texto: 'Cita creada · Mañana 9:30 · Primera visita' }
            ]
        },
        {
            id: 'david',
            nombre: 'David López',
            asunto: 'Presupuesto ortodoncia',
            hora: '20:32',
            estado: 'equipo',
            control: 'Equipo',
            mensajes: [
                { tipo: 'in', texto: 'Hola, quería saber cuánto cuesta la ortodoncia invisible.' },
                { tipo: 'out', texto: 'Depende del caso y de cuántos alineadores hagan falta, así que darte una cifra por aquí sería inventármela. En la primera visita te lo miran y sales con el presupuesto por escrito, sin coste.' },
                { tipo: 'in', texto: 'Es que ya tengo un presupuesto de otra clínica y quería comparar.' },
                { tipo: 'nota', texto: 'El agente ha pasado la conversación a una persona · comparación de presupuestos' },
                { tipo: 'out', texto: 'Soy Laura, de recepción. Si me pasas el presupuesto que tienes, lo miramos y te digo qué incluye cada cosa.' }
            ]
        },
        {
            id: 'ana',
            nombre: 'Ana Pérez',
            asunto: 'Cambio de cita',
            hora: '18:15',
            estado: 'resuelta',
            control: 'Resuelta',
            mensajes: [
                { tipo: 'in', texto: 'Tengo cita el jueves a las 18:00 y me ha surgido algo. ¿Puedo cambiarla?' },
                { tipo: 'out', texto: 'Sin problema, Ana. ¿Te va mejor esta misma semana o la siguiente?' },
                { tipo: 'in', texto: 'La siguiente, por la mañana si puede ser.' },
                { tipo: 'out', texto: 'Queda el martes a las 10:00 o el miércoles a las 11:30.' },
                { tipo: 'in', texto: 'El martes.' },
                { tipo: 'out', texto: 'Cambiada: martes a las 10:00. Tu hueco del jueves queda libre para otro paciente.' },
                { tipo: 'nota', texto: 'Cita reprogramada · hueco anterior liberado' }
            ]
        }
    ];

    const SERVICIOS = [
        { nombre: 'Primera visita (valoración)', precio: 0, duracion: 30, activo: true },
        { nombre: 'Higiene dental', precio: 45, duracion: 40, activo: true },
        { nombre: 'Revisión general', precio: null, duracion: 30, activo: true },
        { nombre: 'Ortodoncia invisible', precio: null, duracion: 45, activo: true },
        { nombre: 'Implantes', precio: null, duracion: 60, activo: true },
        { nombre: 'Blanqueamiento', precio: 279, duracion: 45, activo: true },
        { nombre: 'Odontopediatría', precio: null, duracion: 30, activo: false }
    ];

    // Citas repartidas por el mes: día del mes → lista.
    const CITAS = {
        3: [['9:30', 'Marta García'], ['12:00', 'Sergio Ruiz']],
        4: [['10:00', 'Ana Pérez']],
        5: [['16:30', 'Elena Vidal'], ['18:00', 'Pau Roig']],
        6: [['11:30', 'Nuria Salas']],
        10: [['9:00', 'Iván Costa'], ['13:00', 'Clara Mena'], ['19:00', 'Toni Ferrer']],
        11: [['17:15', 'Rosa Gil']],
        12: [['10:30', 'Marc Puig']],
        17: [['9:30', 'Lucía Bravo'], ['12:30', 'Hugo Nadal']],
        18: [['18:45', 'Sara Lloret']],
        19: [['11:00', 'Álex Terol']],
        24: [['10:00', 'Berta Sanz'], ['16:00', 'Nacho Prats']],
        25: [['9:30', 'Iría Otero']]
    };

    // ── Utilidades ───────────────────────────────────────────────────────────
    const $ = (sel, raiz = app) => raiz.querySelector(sel);
    const $$ = (sel, raiz = app) => [...raiz.querySelectorAll(sel)];
    const iniciales = (n) => n.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

    // ── Navegación entre vistas ──────────────────────────────────────────────
    const botones = $$('[data-vista-btn]');
    const vistas = $$('[data-vista]');

    function mostrar(id) {
        botones.forEach(b => b.classList.toggle('is-active', b.dataset.vistaBtn === id));
        vistas.forEach(v => v.classList.toggle('is-active', v.dataset.vista === id));
    }

    botones.forEach(b => b.addEventListener('click', () => mostrar(b.dataset.vistaBtn)));

    // ── Inbox ────────────────────────────────────────────────────────────────
    const listaConv = $('[data-conversaciones]');
    const detalle = $('[data-detalle]');

    function pintarConversaciones(activaId) {
        listaConv.innerHTML = CONVERSACIONES.map(c => `
            <button type="button" class="panel-conv${c.id === activaId ? ' is-active' : ''}" data-conv="${c.id}">
                <span class="panel-avatar">${iniciales(c.nombre)}</span>
                <span>
                    <strong>${c.nombre}</strong>
                    <small>${c.asunto} · ${c.hora}</small>
                </span>
                <span class="panel-chip panel-chip--${c.estado}">${c.control}</span>
            </button>
        `).join('');

        $$('[data-conv]', listaConv).forEach(b => {
            b.addEventListener('click', () => {
                pintarConversaciones(b.dataset.conv);
                pintarDetalle(b.dataset.conv);
            });
        });
    }

    function pintarDetalle(id) {
        const c = CONVERSACIONES.find(x => x.id === id) || CONVERSACIONES[0];
        const humano = c.estado === 'equipo';

        detalle.innerHTML = `
            <div class="panel-detalle-top">
                <div>
                    <strong>${c.nombre}</strong>
                    <small>WhatsApp · ${c.mensajes.length} mensajes</small>
                </div>
                <button type="button" class="panel-accion${humano ? ' is-on' : ''}" data-relevo>
                    ${humano ? 'Devolver al agente' : 'Intervenir'}
                </button>
            </div>
            <div class="panel-hilo">
                ${c.mensajes.map(m => `<p class="panel-msg panel-msg--${m.tipo}">${m.texto}</p>`).join('')}
            </div>
            <div class="panel-compositor">
                <input type="text" placeholder="${humano ? 'Escribe como el equipo…' : 'Toma el relevo para escribir'}"
                    ${humano ? '' : 'disabled'} aria-label="Mensaje del equipo">
            </div>
        `;

        // El relevo cambia quién lleva la conversación, igual que en el panel real:
        // mientras el agente la lleva, el equipo no escribe.
        $('[data-relevo]', detalle).addEventListener('click', () => {
            c.estado = c.estado === 'equipo' ? 'agente' : 'equipo';
            c.control = c.estado === 'equipo' ? 'Equipo' : 'Agente';
            pintarConversaciones(c.id);
            pintarDetalle(c.id);
        });

        const hilo = $('.panel-hilo', detalle);
        hilo.scrollTop = hilo.scrollHeight;
    }

    // ── Servicios ────────────────────────────────────────────────────────────
    const cuerpoServicios = $('[data-servicios]');

    function pintarServicios() {
        cuerpoServicios.innerHTML = SERVICIOS.map((s, i) => `
            <tr>
                <td>${s.nombre}</td>
                <td><input type="number" value="${s.precio === null ? '' : s.precio}" placeholder="—"
                    aria-label="Precio de ${s.nombre}"> €</td>
                <td><input type="number" value="${s.duracion}" aria-label="Duración de ${s.nombre}"> min</td>
                <td>
                    <label class="panel-switch">
                        <input type="checkbox" ${s.activo ? 'checked' : ''} data-activo="${i}"
                            aria-label="Servicio activo: ${s.nombre}">
                        <span></span>
                    </label>
                </td>
            </tr>
        `).join('');

        $$('[data-activo]', cuerpoServicios).forEach(inp => {
            inp.addEventListener('change', () => {
                SERVICIOS[Number(inp.dataset.activo)].activo = inp.checked;
            });
        });
    }

    // ── Citas: calendario mensual ────────────────────────────────────────────
    const cal = $('[data-calendario]');
    const mesEtiqueta = $('[data-mes]');
    // Mes fijo: la página es un tour, no una agenda viva. Agosto de 2026 empieza
    // en sábado, así que el desfase inicial es 5 (lunes como primer día).
    const DIAS_MES = 31;
    const DESFASE = 5;

    function pintarCalendario() {
        const cabeceras = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
            .map(d => `<div class="panel-cal-cab">${d}</div>`).join('');

        let celdas = '';
        for (let i = 0; i < DESFASE; i++) celdas += '<div class="panel-cal-dia is-fuera"></div>';

        for (let d = 1; d <= DIAS_MES; d++) {
            const citas = (CITAS[d] || [])
                .map(([h, n], idx) => `<span class="panel-cita${idx === 1 ? ' panel-cita--equipo' : ''}">${h} ${n}</span>`)
                .join('');
            celdas += `<div class="panel-cal-dia${d === 3 ? ' is-hoy' : ''}"><b>${d}</b>${citas}</div>`;
        }

        const resto = (7 - ((DESFASE + DIAS_MES) % 7)) % 7;
        for (let i = 0; i < resto; i++) celdas += '<div class="panel-cal-dia is-fuera"></div>';

        cal.innerHTML = cabeceras + celdas;
        mesEtiqueta.textContent = 'Agosto 2026';
    }

    // ── Arranque ─────────────────────────────────────────────────────────────
    pintarConversaciones('marta');
    pintarDetalle('marta');
    pintarServicios();
    pintarCalendario();
    mostrar('resumen');
})();
