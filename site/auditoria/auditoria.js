/* Auditoría · mapa del Índice Studio32.
   Datos estáticos generados por el motor (repo Visibilidad-IA → visibilidad/mapa_web.py):
   datos/puntos.json (un punto por restaurante, sin nota) y datos/r/<id>.json (el diagnóstico de cada medido o web sin leer). */
(() => {
  'use strict';

  const TRAMOS = [
    { nombre: 'Con mucho margen', color: '#c4553a' },
    { nombre: 'Mejorable', color: '#d9a441' },
    { nombre: 'Bien preparada', color: '#8fa85a' },
    { nombre: 'Muy bien preparada', color: '#2f7d5b' },
  ];
  const PLURAL = ['con mucho margen', 'mejorables', 'bien preparadas', 'muy bien preparadas'];
  const SIN_LEER = '#3b352c';         // anillo oscuro sobre blanco: «la IA no puede leer su web»
  const SIN_WEB = '#a3977f';
  // por qué un restaurante de los mapas no tiene nota (código del exportador → lo que se le dice)
  const OTROS = {
    s: { grupo: 5, corto: 'Sin web en los mapas', titulo: 'Para una IA, no tienes web',
      texto: 'En los mapas tu restaurante no tiene web. Cuando un turista pregunta, la IA busca webs: de ti solo sabe lo que diga tu ficha o alguna reseña, sin tu carta, tu horario ni tus idiomas.' },
    r: { grupo: 5, corto: 'Solo una red social o un portal', titulo: 'Tu web en los mapas es una red social',
      texto: 'En los mapas, la web de tu restaurante es una red social o un portal. Una IA casi no puede leer Instagram o Facebook: no encuentra tu carta, tu horario ni tus idiomas.' },
    c: { grupo: 6, corto: 'Cadena o web compartida', titulo: 'Tu web es la de una cadena',
      texto: 'La web que figura en los mapas la comparten varios locales o es de una cadena. El índice mide restaurantes con web propia, así que no te hemos puesto nota.' },
    n: { grupo: 6, corto: 'Tipo pendiente de medir', titulo: 'Todavía no medimos este tipo de local',
      texto: 'De momento el índice mide restaurantes. Bares, cafeterías y heladerías van a tener su propio ranking muy pronto, porque no compiten con un restaurante. Si es tu local, podemos leer tu web ya.' },
    x: { grupo: 6, corto: 'Web pendiente de medir', titulo: 'Tu web está pendiente de medir',
      texto: 'Tu restaurante tiene una web en los mapas que todavía no hemos medido. Si es el tuyo, pídenoslo y la leemos con las mismas reglas que a las demás.' },
  };
  const TIPOS = [   // mismo orden que el exportador (visibilidad/mapa_web.py → TIPOS)
    { plural: 'Restaurantes', uno: 'restaurante' }, { plural: 'Bares', uno: 'bar' }, { plural: 'Cafeterías', uno: 'cafetería' },
    { plural: 'Heladerías y hornos', uno: 'heladería u horno' }, { plural: 'Comida rápida', uno: 'local de comida rápida' }];
  const GRUPOS = [...TRAMOS.map((t) => t.nombre), 'La IA no puede leer su web', 'Sin web propia', 'Fuera del índice'];
  const CONTACTO = { whatsapp: '34657695181', telefono: '657 695 181', correo: 'francisco@studio32.es' };
  const URL_PUBLICA = 'https://www.studio32.es/auditoria/';
  // por lo que pesan para el turista de la Comunitat: inglés muy por delante; después italiano y francés; neerlandés y alemán
  const IDIOMAS = [['es', 'Español'], ['en', 'Inglés'], ['it', 'Italiano'], ['fr', 'Francés'], ['nl', 'Neerlandés'], ['de', 'Alemán']];
  const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const mesAno = (iso) => { const [a, m] = String(iso || '2026-10').split('-'); return `${MESES[(+m || 10) - 1]} de ${a}`; };
  const BLOQUES = [['acceso', 'Puede entrar'], ['entidad', 'Sabe quién eres'], ['contenido', 'Sabe qué ofreces'], ['idiomas', 'Te entiende en su idioma']];
  const CARTA = {
    texto: 'Tu carta está en texto: una IA puede leer tus platos y precios.',
    pdf: 'Tu carta está en PDF: a muchas IA les cuesta leerla o no la leen.',
    imagen: 'Tu carta está en imagen: una IA no puede leer tus platos ni tus precios.',
    no: 'No encontramos tu carta en la web: para una IA, no tienes carta.',
  };
  const VACIAS = new Set(['restaurante', 'restaurant', 'rest', 'bar', 'el', 'la', 'los', 'las', 'l', 'de', 'del', 'y', 'i', 'en']);
  const MOVIL = window.matchMedia('(max-width: 820px)');
  const QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)');

  const $ = (s, el = document) => el.querySelector(s);
  const panel = $('#panel');
  const dentro = $('#panel-dentro');
  let D = null;                 // puntos.json
  let lista = [];               // para buscar: medidos y sin leer
  const porId = new Map();
  let map = null, mapaListo = false, marcador = null, ventana = null;
  let filtroTipo = null;        // al buscar tu local, el mapa enseña solo los de tu tipo
  let turno = 0;                // cada búsqueda nueva cancela la animación anterior
  let pendiente = null;         // restaurante pedido antes de que el mapa estuviera listo

  // ---------------------------------------------------------------- utilidades
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const normaChar = (c) => { const b = c.normalize('NFD')[0].toLowerCase(); return /[a-z0-9]/.test(b) ? b : ' '; };
  const norma = (s) => Array.from(String(s || ''), normaChar).join('');   // misma longitud que el original
  const dominio = (u) => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch { return u; } };
  const km = (m) => (m >= 1000 ? `${m / 1000} km` : `${m} m`);
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const wa = (texto) => `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`;

  // ---------------------------------------------------------------- datos
  async function cargarDatos() {
    const r = await fetch('datos/puntos.json');
    if (!r.ok) throw new Error('puntos.json ' + r.status);
    D = await r.json();
    const meter = (e, alias = []) => {
      e.clave = norma(`${e.nombre} ${alias.join(' ')} ${e.mun}`); e.claveNombre = norma(e.nombre);
      lista.push(e); porId.set(e.id, e);
    };
    D.medidos.forEach(([id, nombre, mun, lat, lon, t, alias, k]) => meter({ id, nombre, mun, lat, lon, t, k: k || 0, g: t, tipo: 'medido' }, alias));
    D.sin_leer.forEach(([id, nombre, mun, lat, lon, alias, k]) => meter({ id, nombre, mun, lat, lon, k: k || 0, g: 4, tipo: 'sin_leer' }, alias));
    D.otros.forEach(([nombre, mun, lat, lon, m, k], i) => meter({ id: `o${i}`, nombre, mun, lat, lon, m, k: k || 0, g: OTROS[m].grupo, tipo: 'otro' }));
  }

  // ---------------------------------------------------------------- buscador
  function buscar(q) {
    const nq = norma(q).trim().replace(/\s+/g, ' ');
    if (nq.length < 2) return [];
    let tokens = nq.split(' ');
    const utiles = tokens.filter((t) => !VACIAS.has(t));
    if (utiles.length) tokens = utiles;
    const out = [];
    for (const e of lista) {
      if (!tokens.every((t) => e.clave.includes(t))) continue;
      const nombre = e.claveNombre.trim();
      let p = 3;
      if (nombre.startsWith(nq)) p = 0;
      else if ((' ' + nombre).includes(' ' + tokens[0])) p = 1;
      else if (nombre.includes(tokens[0])) p = 2;
      out.push([p, e.tipo === 'medido' ? 0 : e.tipo === 'sin_leer' ? 1 : 2, nombre.length, e]);
    }
    out.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
    return out.slice(0, 8).map((x) => x[3]);
  }

  function resaltar(nombre, q) {
    const nq = norma(q).trim();
    const nn = norma(nombre);
    const i = nq ? nn.indexOf(nq) : -1;
    if (i < 0) return esc(nombre);
    return esc(nombre.slice(0, i)) + '<mark>' + esc(nombre.slice(i, i + nq.length)) + '</mark>' + esc(nombre.slice(i + nq.length));
  }

  function montarBuscador() {
    const input = $('#q');
    const caja = $('#sugerencias');
    let actuales = [], marcado = -1;

    const cerrar = () => { caja.hidden = true; input.setAttribute('aria-expanded', 'false'); marcado = -1; };
    const marcar = (i) => {
      marcado = i;
      caja.querySelectorAll('.sugerencia').forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
      const li = caja.children[i];
      if (li) { input.setAttribute('aria-activedescendant', li.id); li.scrollIntoView({ block: 'nearest' }); }
    };
    const pintar = () => {
      const q = input.value;
      actuales = buscar(q);
      if (norma(q).trim().length < 2) { cerrar(); return; }
      if (!actuales.length) {
        caja.innerHTML = `<li class="sugerencia sugerencia--vacia" role="option" aria-disabled="true">No lo encontramos con ese nombre. Puede que tu web no figure en los mapas.
          <a href="${wa(`Hola, quiero añadir mi local al mapa de Studio32. Nombre: ${q}. Dirección: . Web: `)}" target="_blank" rel="noopener">Añade tu local</a> y medimos su web.</li>`;
      } else {
        caja.innerHTML = actuales.map((e, i) => `
          <li class="sugerencia" role="option" id="sug-${i}" data-i="${i}" aria-selected="false">
            <span class="sugerencia__punto sugerencia__punto--g${e.g}"${e.tipo === 'medido' ? ` style="background:${TRAMOS[e.t].color}"` : ''}></span>
            <span class="sugerencia__texto">
              <span class="sugerencia__nombre">${resaltar(e.nombre, q)}</span>
              <span class="sugerencia__lugar">${e.k ? TIPOS[e.k].uno.charAt(0).toUpperCase() + TIPOS[e.k].uno.slice(1) + ' · ' : ''}${esc(e.mun || 'Comunitat Valenciana')}${e.tipo === 'sin_leer' ? ' · la IA no puede leer su web' : e.tipo === 'otro' ? ' · ' + OTROS[e.m].corto.toLowerCase() : ''}</span>
            </span>
          </li>`).join('');
      }
      caja.hidden = false; input.setAttribute('aria-expanded', 'true'); marcado = -1;
    };

    input.addEventListener('input', pintar);
    input.addEventListener('focus', () => { if (input.value) pintar(); });
    input.addEventListener('keydown', (ev) => {
      if (caja.hidden && ev.key !== 'Enter') return;
      if (ev.key === 'ArrowDown') { ev.preventDefault(); marcar(Math.min(marcado + 1, actuales.length - 1)); }
      else if (ev.key === 'ArrowUp') { ev.preventDefault(); marcar(Math.max(marcado - 1, 0)); }
      else if (ev.key === 'Enter') {
        ev.preventDefault();
        const e = actuales[marcado >= 0 ? marcado : 0];
        if (e) { cerrar(); seleccionar(e.id); }
      } else if (ev.key === 'Escape') cerrar();
    });
    caja.addEventListener('mousedown', (ev) => ev.preventDefault());   // que el input no pierda el foco antes del clic
    caja.addEventListener('click', (ev) => {
      const li = ev.target.closest('.sugerencia[data-i]');
      if (li) { cerrar(); seleccionar(actuales[+li.dataset.i].id); }
    });
    input.addEventListener('blur', () => setTimeout(cerrar, 120));
  }

  // ---------------------------------------------------------------- panel: inicio
  function pintarInicio() {
    turno++;
    dentro.replaceChildren($('#t-inicio').content.cloneNode(true));
    document.querySelectorAll('[data-n]').forEach((el) => { el.textContent = miles(D[el.dataset.n]); });
    montarBuscador();
    if (!MOVIL.matches) $('#q').focus({ preventScroll: true });
    history.replaceState(null, '', location.pathname);
    if (marcador) { marcador.remove(); marcador = null; }
    if (mapaListo) { pintarZona(null); map.flyTo({ ...vistaInicial(), duration: 1600 }); }
    cartel('Toca cualquier punto o busca tu restaurante');
    ponerFiltro(null);
    panel.scrollTop = 0;
  }

  // ---------------------------------------------------------------- seleccionar un restaurante
  async function seleccionar(id) {
    const e = porId.get(id);
    if (!e) return;
    const yo = ++turno;
    ponerFiltro(e.k);
    if (ventana) ventana.remove();
    history.replaceState(null, '', e.tipo === 'otro' ? location.pathname : `${location.pathname}?r=${encodeURIComponent(id)}`);
    if (MOVIL.matches) window.scrollTo({ top: 0, behavior: QUIETO.matches ? 'auto' : 'smooth' });
    panel.scrollTop = 0;

    const pedido = e.tipo === 'otro'
      ? Promise.resolve({ tipo: 'otro', id: e.id, nombre: e.nombre, municipio: e.mun, lat: e.lat, lon: e.lon, motivo: e.m, k: e.k, zona: zonaLocal(e) })
      : fetch(`datos/r/${encodeURIComponent(id)}.json`).then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); });
    pintarLectura(e);
    let f;
    try { f = await pedido; } catch {
      if (yo === turno) dentro.innerHTML = `<p class="bloque__texto">No hemos podido cargar este diagnóstico. Prueba otra vez en unos segundos.</p>`;
      return;
    }
    if (yo !== turno) return;
    if (f.lat != null) { encuadrar(f); ponerMarcador(f); pintarZona(f); }
    await animarLectura(f, yo);
    if (yo !== turno) return;
    dentro.innerHTML = f.tipo === 'medido' ? fichaMedido(f) : f.tipo === 'sin_leer' ? fichaSinLeer(f) : fichaOtro(f);
    dentro.firstElementChild.classList.add('aparecer');
    conectarFicha(f);
    requestAnimationFrame(() => requestAnimationFrame(() => animarFicha(f)));
  }

  function pintarLectura(e) {
    dentro.innerHTML = `
      <section class="lectura" aria-label="Leyendo la web">
        <span class="etiqueta">Leyendo su web como una IA</span>
        <h2 class="lectura__nombre">${esc(e.nombre)}</h2>
        <p class="lectura__aviso">Repasamos la medición de octubre de 2026.</p>
        <ol class="pasos" id="pasos"></ol>
        <button class="saltar" id="saltar" type="button">Ver el resultado ya</button>
      </section>`;
  }

  async function animarLectura(f, yo) {
    const pasos = [['Buscando su web', f.web ? dominio(f.web) : 'no hay web propia']];
    if (f.tipo === 'otro') {
      if (f.motivo === 'c' || f.motivo === 'x') pasos.push(['Entrando como un robot de IA', 'no medida']);
    } else if (f.tipo === 'medido') {
      const grupos = Object.fromEntries(f.comprobaciones.map((g) => [g.id, g.comprobaciones]));
      const cuenta = (b) => { const c = grupos[b] || []; return `${c.filter((x) => x.estado === 'ok').length} de ${c.length} bien`; };
      pasos.push(['Entrando como un robot de IA', cuenta('acceso')], ['¿Sabe quién eres?', cuenta('entidad')],
        ['¿Sabe qué ofreces?', cuenta('contenido')], ['¿Te entiende en su idioma?', f.idiomas.includes('en') ? `${f.idiomas.length} idiomas, con inglés` : 'sin inglés']);
    } else {
      pasos.push(['Entrando como un robot de IA', 'no se puede leer']);
    }
    if (f.zona) pasos.push(['Comparando con su zona', `${miles(f.zona.medidas)} webs a ${km(f.zona.radio_m)}`]);
    const ol = $('#pasos');
    if (!ol) return;
    ol.innerHTML = pasos.map(([t]) => `<li class="paso"><span class="paso__icono"></span><span class="paso__texto">${esc(t)}</span><span class="paso__dato"></span></li>`).join('');
    let saltar = QUIETO.matches;
    $('#saltar').addEventListener('click', () => { saltar = true; });
    const lis = ol.children;
    for (let i = 0; i < pasos.length; i++) {
      if (yo !== turno) return;
      lis[i].classList.add('activo');
      if (!saltar) await espera(i === 0 ? 520 : 400);
      lis[i].classList.remove('activo'); lis[i].classList.add('hecho');
      lis[i].querySelector('.paso__dato').textContent = pasos[i][1];
    }
    if (!saltar) await espera(380);
  }

  // ---------------------------------------------------------------- fichas
  function cabeza(f) {
    const lugar = [f.direccion, f.municipio].filter(Boolean).map(esc).join(' · ');
    return `
      <button class="volver" type="button" data-volver>← Buscar otro restaurante</button>
      <header class="ficha__cabeza">
        <span class="etiqueta">${f.tipo === 'otro' ? 'Índice Studio32 · ' + esc(TIPOS[f.k || 0].uno) : 'Diagnóstico · ' + esc(mesAno(f.fecha))}</span>
        <h2 class="ficha__nombre">${esc(f.nombre)}</h2>
        <p class="ficha__lugar">${lugar}${f.web ? `${lugar ? '<br>' : ''}<a href="${esc(f.web)}" target="_blank" rel="noopener nofollow">${esc(dominio(f.web))}</a>` : ''}</p>
      </header>`;
  }
  function fichaOtro(f) {
    const o = OTROS[f.motivo];
    const sinWeb = o.grupo === 5;
    const vecinos = f.zona && f.zona.medidas ? `los ${miles(f.zona.medidas)} restaurantes de tu zona que sí la tienen` : 'los restaurantes que sí la tienen';
    return `<article class="ficha">
      ${cabeza(f)}
      <div class="alerta${sinWeb ? '' : ' alerta--neutra'}">
        <h3 class="alerta__titulo">${esc(o.titulo)}</h3>
        <p>${esc(o.texto)}</p>
      </div>
      ${sinWeb ? `<section class="bloque">
        <h3 class="bloque__titulo">Por qué importa</h3>
        <p class="bloque__texto">Cuando un turista le pregunta a una IA dónde comer, ella recomienda a quien puede leer: carta, horario, idiomas, dónde está. Sin una web propia compites en desventaja con ${vecinos}.</p>
      </section>` : ''}
      <section class="bloque">
        <h3 class="bloque__titulo">${sinWeb ? '¿Tienes web?' : '¿Es tu local?'}</h3>
        <p class="bloque__texto">${sinWeb ? 'Puede que los mapas no la tengan apuntada. Mándanosla' : 'Si tiene web propia, mándanosla'} y la medimos con las mismas reglas que a las ${miles(D.webs)}.</p>
        <p class="bloque__texto--sep"><a class="boton boton--linea" href="${wa(`Hola, he visto ${f.nombre} en el mapa de Studio32. Mi web es: `)}" target="_blank" rel="noopener">Mandar mi web</a></p>
      </section>
      ${f.zona ? zona(f.zona, false, f.k) : ''}
      ${oferta(f, sinWeb ? 'Sin web, una IA solo te conoce por tu ficha' : 'Te decimos cómo te ve una IA')}
      ${limites()}
    </article>`;
  }



  function fichaMedido(f) {
    const t = TRAMOS[f.tramo];
    const nota = Math.round(f.nota);
    const z = f.zona;
    const graves = f.fallos.map((x) => ({ titulo: x.texto.charAt(0).toUpperCase() + x.texto.slice(1), por: x.por_que, aviso: false }));
    const vistos = new Set(f.fallos.map((x) => x.id));
    const avisos = f.comprobaciones.flatMap((g) => g.comprobaciones)
      .filter((c) => c.estado !== 'ok' && c.por_que && !vistos.has(c.id))
      .map((c) => ({ titulo: c.nombre, por: c.por_que, aviso: true }));
    const fallos = [...graves, ...avisos].slice(0, Math.max(4, graves.length));
    const total = f.comprobaciones.reduce((n, g) => n + g.comprobaciones.length, 0);
    const bien = f.comprobaciones.reduce((n, g) => n + g.comprobaciones.filter((c) => c.estado === 'ok').length, 0);
    return `<article class="ficha">
      ${cabeza(f)}
      <div class="nota">
        <div class="anillo" role="img" aria-label="Nota ${nota} de 100">
          <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="anillo__fondo" cx="60" cy="60" r="52"/>
            <circle class="anillo__valor" cx="60" cy="60" r="52" stroke="${t.color}" stroke-dasharray="326.7" stroke-dashoffset="326.7" data-nota="${f.nota}"/></svg>
          <div class="anillo__num"><b>${nota}</b><span>de 100</span></div>
        </div>
        <div>
          <span class="nota__nivel"><i style="background:${t.color}"></i>${esc(t.nombre)}</span>
          <p class="nota__puesto">Puesto <strong>${miles(f.puesto)}</strong> de ${miles(f.de)} webs de restaurantes de la Comunitat.
            ${z ? `<br>La <strong>${z.puesto}.ª</strong> de ${z.medidas} a ${km(z.radio_m)}.` : ''}</p>
        </div>
      </div>

      <section class="bloque">
        <h3 class="bloque__titulo">Tu web frente a las ${miles(f.de)}</h3>
        ${histograma(f.nota)}
        <p class="bloque__texto">Lee mejor que el <strong>${Math.min(f.percentil, 99)} %</strong> de las webs medidas. La media es ${Math.round(D.media)}.</p>
      </section>

      <section class="bloque">
        <h3 class="bloque__titulo">Lo que entiende una IA, por partes</h3>
        <div class="barras">${BLOQUES.map(([b, nombre]) => `
          <div class="barra-b">
            <div class="barra-b__cab"><span>${nombre}</span><span><b>${f.bloques[b]}</b> / 100</span></div>
            <div class="barra-b__pista"><span class="barra-b__valor" style="width:0;background:${color(f.bloques[b])}" data-v="${f.bloques[b]}"></span>
              <span class="barra-b__media" style="left:${D.medias_bloques[b]}%" title="Media: ${D.medias_bloques[b]}"></span></div>
          </div>`).join('')}
        </div>
        <p class="leyenda-media"><i></i>La raya marca la media de las ${miles(f.de)} webs.</p>
      </section>

      ${fallos.length ? `<section class="bloque">
        <h3 class="bloque__titulo">${graves.length ? 'Lo primero que arreglaríamos' : 'Lo que todavía mejoraríamos'}</h3>
        <ul class="fallos">${fallos.map((x) => `<li class="fallo${x.aviso ? ' fallo--aviso' : ''}"><p class="fallo__titulo">${esc(x.titulo)}<span class="fallo__tag">${x.aviso ? 'Mejorable' : 'Falla'}</span></p><p class="fallo__por">${esc(x.por)}</p></li>`).join('')}</ul>
      </section>` : ''}

      <section class="bloque">
        <h3 class="bloque__titulo">En qué idiomas te entiende</h3>
        <div class="idiomas">${IDIOMAS.map(([c, n]) => `<div class="idioma ${f.idiomas.includes(c) ? 'si' : 'no'}"><b>${c.toUpperCase()}</b><span>${n}</span></div>`).join('')}</div>
        <p class="bloque__texto bloque__texto--sep">${!f.idiomas.includes('en')
          ? '<strong>Te falta el inglés, el idioma que más pesa:</strong> a quien pregunta en inglés, la IA le responde con páginas en inglés. Si no tienes, recomienda a otro.'
          : f.idiomas.length >= 6 ? 'Tu web habla los idiomas de los turistas que más vienen.'
            : `Tienes el inglés, que es lo que más pesa. El siguiente que te falta es el ${faltaUno(f.idiomas)}.`} ${esc(CARTA[f.carta] || '')}</p>
      </section>

      ${z ? zona(z, true) : ''}

      <details class="detalle">
        <summary>Las ${total} comprobaciones, una a una · ${bien} bien</summary>
        ${f.comprobaciones.map((g) => `<div class="grupo">
          <p class="grupo__titulo"><span>${esc(g.titulo)}</span><span>${f.bloques[g.id] ?? ''}</span></p>
          ${g.comprobaciones.map((c) => `<div class="comp"><span class="comp__estado ${c.estado}" aria-label="${c.estado === 'ok' ? 'Bien' : c.estado === 'aviso' ? 'Mejorable' : 'Falla'}"></span>
            <span>${esc(c.nombre)}<span class="comp__prueba">${esc(c.prueba)}</span></span></div>`).join('')}
        </div>`).join('')}
      </details>

      ${oferta(f, f.fallos.length ? 'Esto es el resumen. El análisis completo explica cada fallo y cómo arreglarlo' : 'Tu web está bien. El análisis completo te dice qué queda y qué pasa fuera de ella')}
      ${limites()}
    </article>`;
  }

  function fichaSinLeer(f) {
    const dudoso = f.motivo.startsWith('No pudimos confirmar');
    return `<article class="ficha">
      ${cabeza(f)}
      <div class="alerta">
        <h3 class="alerta__titulo">${dudoso ? 'No pudimos confirmar cuál es tu web' : 'Una IA no puede leer tu web'}</h3>
        <p>${esc(f.motivo)}</p>
        <p>Es la dirección que figura para tu restaurante en los mapas, la que encuentran Google y las IA cuando te buscan.</p>
      </div>
      <section class="bloque">
        <h3 class="bloque__titulo">Por qué importa</h3>
        <p class="bloque__texto">Cuando un turista pregunta dónde comer, la IA lee las webs de los restaurantes para recomendar. Si la tuya no carga o lleva a otro sitio, para ella no tienes carta, ni horario, ni idiomas: recomienda a otro.</p>
      </section>
      <section class="bloque">
        <h3 class="bloque__titulo">¿Tienes otra web?</h3>
        <p class="bloque__texto">Puede que la dirección de los mapas sea antigua. Mándanos la que usas ahora y la medimos con las mismas reglas que a las ${miles(D.webs)}. Y si el restaurante ya no abre, avísanos y lo quitamos.</p>
        <p class="bloque__texto--sep"><a class="boton boton--linea" href="${wa(`Hola, he visto en el mapa de Studio32 que la web de ${f.nombre} no se puede leer. Mi web actual es: `)}" target="_blank" rel="noopener">Mandar mi web actual</a></p>
      </section>
      ${f.zona ? zona(f.zona, false) : ''}
      ${oferta(f, 'Que la IA pueda leerte es lo primero')}
      ${limites()}
    </article>`;
  }

  function zonaLocal(e) {     // la zona de quien no tiene archivo propio, con los puntos que ya están cargados
    if (e.lat == null) return null;
    const rad = Math.PI / 180;
    const d = (a, b) => 6371000 * Math.hypot((b.lon - a.lon) * rad * Math.cos((a.lat + b.lat) * rad / 2), (b.lat - a.lat) * rad);
    const cerca = lista.filter((x) => x.lat != null && x.k === e.k && Math.abs(x.lat - e.lat) < 0.03 && Math.abs(x.lon - e.lon) < 0.04).map((x) => [x, d(e, x)]);
    let radio = 1000, dentro = [];
    for (radio of [1000, 2000, 3000]) {
      dentro = cerca.filter(([, m]) => m <= radio).map(([x]) => x);
      if (dentro.filter((x) => x.tipo === 'medido').length >= 8) break;
    }
    const med = dentro.filter((x) => x.tipo === 'medido');
    return { radio_m: radio, restaurantes: dentro.length,
      con_web: dentro.filter((x) => x.tipo !== 'otro' || x.m === 'c' || x.m === 'x').length,
      medidas: med.length, tramos: [0, 1, 2, 3].map((t) => med.filter((x) => x.t === t).length) };
  }

  function faltaUno(idiomas) {
    const falta = IDIOMAS.find(([c]) => c !== 'es' && !idiomas.includes(c));   // por orden de importancia
    return falta ? falta[1].toLowerCase() : 'otro idioma';
  }
  const color = (v) => TRAMOS[v >= 80 ? 3 : v >= 65 ? 2 : v >= 50 ? 1 : 0].color;

  function histograma(nota) {
    const h = D.histograma, max = Math.max(...h), mio = Math.min(Math.floor(nota / 5), 19);
    return `<div class="histo" aria-hidden="true">
        ${h.map((n, i) => `<span class="histo__barra${i === mio ? ' tu' : ''}" style="height:${Math.max(3, Math.round(70 * n / max))}px" title="${i * 5}-${i * 5 + 5}: ${miles(n)} webs"></span>`).join('')}
        <span class="histo__marca" style="left:${(mio + 0.5) * 5}%">Tu web</span>
      </div>
      <div class="histo__eje" aria-hidden="true"><span>0</span><span>50</span><span>100</span></div>`;
  }

  function filaZona(z, medido) {
    // una marca por web de la zona, de la mejor a la peor; la tuya, señalada
    const colores = [3, 2, 1, 0].flatMap((t) => Array(z.tramos[t]).fill(TRAMOS[t].color));
    if (!colores.length) return '';
    const tuya = medido && z.puesto ? Math.min(z.puesto, colores.length) - 1 : -1;
    const pos = tuya >= 0 ? ((tuya + .5) / colores.length) * 100 : 0;
    return `<div class="fila-zona" aria-hidden="true">
        ${tuya >= 0 ? `<span class="fila-zona__tu" style="left:${pos}%;transform:translateX(${pos < 10 ? '-12%' : pos > 90 ? '-88%' : '-50%'})">Tú · ${z.puesto}.ª</span>` : ''}
        ${colores.length <= 60
          ? `<div class="fila-zona__marcas">${colores.map((col, i) => `<i class="${i === tuya ? 'tu' : ''}" style="background:${col}"></i>`).join('')}</div>`
          // muchas webs (el centro de una ciudad): una barra por tramos y tu posición encima, para que nunca se salga de la caja
          : `<div class="fila-zona__barra">${[3, 2, 1, 0].map((t) => z.tramos[t] ? `<span style="flex:${z.tramos[t]};background:${TRAMOS[t].color}"></span>` : '').join('')}
              ${tuya >= 0 ? `<b class="fila-zona__aguja" style="left:${pos}%"></b>` : ''}</div>`}
        <div class="fila-zona__eje"><span>Mejor leída</span><span>Peor leída</span></div>
      </div>`;
  }

  function zona(z, medido, k = 0) {
    const tipo = TIPOS[k] || TIPOS[0];
    return `<section class="bloque">
      <h3 class="bloque__titulo">Tu zona · ${km(z.radio_m)} alrededor</h3>
      <div class="zona">
        <div class="embudo">
          <div><b>${miles(z.restaurantes)}</b>${tipo.plural.toLowerCase()} en los mapas</div>
          <div><b>${miles(z.con_web)}</b>con una web apuntada</div>
          <div><b>${miles(z.medidas)}</b>que una IA puede leer</div>
        </div>
        ${filaZona(z, medido)}
        <div class="pila-leyenda">${[3, 2, 1, 0].map((t) => `<span><i style="background:${TRAMOS[t].color}"></i>${z.tramos[t]} ${z.tramos[t] === 1 ? TRAMOS[t].nombre.toLowerCase() : PLURAL[t]}</span>`).join('')}</div>
        <p class="bloque__texto bloque__texto--sep">${medido
          ? `De las ${z.medidas} webs que una IA puede leer aquí, <strong>la tuya es la ${z.puesto}.ª</strong>. En el mapa tienes a tus vecinos por colores.`
          : z.medidas ? `Aquí hay ${z.medidas} ${z.medidas === 1 ? tipo.uno : tipo.plural.toLowerCase()} cuya web sí lee una IA. Cuando un turista pregunta, compites con ${z.medidas === 1 ? 'él' : 'ellos'}.`
            : `Todavía no hay ${tipo.plural.toLowerCase()} con web medida en esta zona.`}</p>
      </div>
    </section>`;
  }

  function oferta(f, titulo) {
    const texto = `Hola, he visto el diagnóstico de ${f.nombre} en Studio32 y quiero el análisis completo. ${URL_PUBLICA}?r=${f.id}`;
    return `<section class="oferta" id="oferta">
      <span class="etiqueta">Análisis completo</span>
      <h3 class="oferta__titulo">${esc(titulo)}.</h3>
      <p class="oferta__texto">Revisamos a fondo tu web y lo que encuentra un turista. Te llevas el plan aunque los arreglos los haga otra persona.</p>
      <ul class="oferta__lista">
        <li>Cada problema, con su arreglo, quién lo hace y cómo comprobar que está resuelto</li>
        <li>Lo que encuentra un turista cuando pregunta en su idioma</li>
        <li>Tu web con los arreglos aplicados, sin cambiar su diseño</li>
        <li>Tu zona y un plan por prioridades</li>
        <li>Un anexo técnico para quien te lleva la web</li>
      </ul>
      <span class="promo">Promoción de lanzamiento</span>
      <div class="precio"><span class="precio__num">0 €</span><s class="precio__antes">49&nbsp;€&nbsp;+&nbsp;IVA</s></div>
      <p class="precio__nota"><strong>Gratis para los primeros restaurantes</strong>, a cambio de poder contar su caso. Lo tienes en 48 horas.</p>
      <div class="oferta__botones">
        <a class="boton boton--oro boton--ancho" href="${wa(texto)}" target="_blank" rel="noopener">Pedir el análisis por WhatsApp</a>
        <a class="boton boton--linea boton--ancho" href="mailto:${CONTACTO.correo}?subject=${encodeURIComponent('Análisis completo · ' + f.nombre)}&body=${encodeURIComponent(texto)}">Escribir por correo</a>
      </div>
      <p class="oferta__firma">Te atiende Francisco · Studio32 · <a href="tel:+${CONTACTO.whatsapp}">${CONTACTO.telefono}</a></p>
    </section>`;
  }

  function limites() {
    return `<p class="limites">El Índice Studio32 mide cómo puede leer una IA la web de cada restaurante: si puede entrar, si sabe quién eres,
      qué ofreces y en qué idiomas. No mide la calidad del restaurante ni a quién recomienda ChatGPT, y no prometemos ponerte el primero:
      medimos y te decimos qué arreglar. Medición automática de octubre de 2026; si tu web ha cambiado, la medimos otra vez.
      ¿Ves un error o prefieres no aparecer? <a href="mailto:${CONTACTO.correo}?subject=${encodeURIComponent('Mapa del Índice Studio32')}">Escríbenos</a>.
      <a href="../metodologia/">Cómo medimos</a>.</p>`;
  }

  function conectarFicha() {
    dentro.querySelector('[data-volver]')?.addEventListener('click', pintarInicio);
  }

  function animarFicha() {
    const anillo = dentro.querySelector('.anillo__valor');
    if (anillo) anillo.style.strokeDashoffset = String(326.7 * (1 - Math.min(100, +anillo.dataset.nota) / 100));
    dentro.querySelectorAll('.barra-b__valor').forEach((b) => { b.style.width = b.dataset.v + '%'; });
  }

  // ---------------------------------------------------------------- mapa
  const vistaInicial = () => (MOVIL.matches ? { center: [-0.45, 39.25], zoom: 6.4 } : { center: [-0.25, 39.3], zoom: 7.3 });

  function cartel(texto) {
    const c = $('#cartel');
    if (c) c.querySelector('span').textContent = texto;
  }

  function montarMapa() {
    if (!window.maplibregl) { $('#cargando').innerHTML = '<p class="error-mapa">No hemos podido cargar el mapa. El buscador funciona igual.</p>'; return; }
    map = new maplibregl.Map({
      container: 'mapa', style: 'https://tiles.openfreemap.org/styles/positron', ...vistaInicial(),
      minZoom: 5, maxZoom: 18.5, attributionControl: false, dragRotate: false, pitchWithRotate: false,
    });
    map.touchZoomRotate.disableRotation();
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: 'Restaurantes: Overture Maps, OpenStreetMap · Índice Studio32' }), 'bottom-left');
    map.on('error', (ev) => console.warn('mapa:', ev && ev.error && ev.error.message));
    map.on('load', async () => {
      tonoStudio32();
      capas();
      mapaListo = true;
      ponerFiltro(filtroTipo);
      $('#cargando').classList.add('fuera');
      document.querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');   // créditos plegados
      if (pendiente) { const f = pendiente; pendiente = null; encuadrar(f); ponerMarcador(f); pintarZona(f); }
    });
  }

  function tonoStudio32() {   // el estilo libre de OpenFreeMap, en el papel cálido de la marca
    const p = (id, prop, v) => { try { if (map.getLayer(id)) map.setPaintProperty(id, prop, v); } catch { /* capa distinta */ } };
    p('background', 'background-color', '#f3eee4');
    p('park', 'fill-color', '#e6e5d5');
    p('landcover_wood', 'fill-color', '#e2e2d0');
    p('landuse_residential', 'fill-color', '#eee8dc');
    p('water', 'fill-color', '#cdd7d6');
    p('waterway', 'line-color', '#c3cfcf');
    p('building', 'fill-color', '#e8e0d2');
    p('building', 'fill-outline-color', '#ddd3c2');
    ['highway_minor', 'highway_path', 'highway_major_subtle', 'highway_motorway_subtle'].forEach((id) => p(id, 'line-color', '#e3dbcc'));
    ['highway_major_casing', 'highway_motorway_casing', 'tunnel_motorway_casing', 'highway_motorway_bridge_casing'].forEach((id) => p(id, 'line-color', '#d8cfbf'));
    ['boundary_2', 'boundary_3', 'boundary_disputed'].forEach((id) => p(id, 'line-color', '#bcb09c'));
    map.getStyle().layers.filter((l) => l.type === 'symbol').forEach((l) => {
      const agua = l.id.startsWith('water');
      if (l.layout && l.layout['text-field'] && !l.id.includes('shield')) {   // nombres en español (o el local), no en inglés
        try { map.setLayoutProperty(l.id, 'text-field', ['coalesce', ['get', 'name:es'], ['get', 'name']]); } catch { /* sin nombre */ }
      }
      p(l.id, 'text-color', agua ? '#6b8486' : l.id.startsWith('highway') ? '#857a6a' : '#3b352c');
      p(l.id, 'text-halo-color', 'rgba(247,244,238,.9)');
    });
  }

  const FILTRO_BASE = {
    'p-otros': ['>=', ['get', 'g'], 5], 'p-sinleer': ['==', ['get', 'g'], 4], 'p-medidos': ['<=', ['get', 'g'], 3], 'p-nombres': ['>=', ['get', 'g'], 0] };

  function ponerFiltro(k) {
    filtroTipo = k == null ? null : k;
    if (mapaListo) {
      Object.entries(FILTRO_BASE).forEach(([capa, base]) => {
        map.setFilter(capa, filtroTipo == null ? base : ['all', base, ['==', ['get', 'k'], filtroTipo]]);
      });
    }
    pintarTipos();
    pintarLeyenda();
  }

  function pintarTipos() {   // los botones de tipo encima del mapa, solo los que existen
    const caja = $('#tipos');
    if (!caja || !D) return;
    const n = TIPOS.map((_, k) => lista.filter((e) => e.k === k && e.lat != null).length);
    const boton = (k, texto, cuantos) => `<button type="button" class="tipo${filtroTipo === k ? ' activo' : ''}" data-tipo="${k ?? ''}"
      aria-pressed="${filtroTipo === k}">${texto}${cuantos != null ? ` <span>${miles(cuantos)}</span>` : ''}</button>`;
    caja.innerHTML = boton(null, 'Todos', null) + TIPOS.map((t, k) => n[k] ? boton(k, t.plural, n[k]) : '').join('');
  }

  function capas() {
    const antes = (map.getStyle().layers.find((l) => l.type === 'symbol') || {}).id;   // los nombres del mapa, encima
    // un punto por restaurante; g = grupo: 0-3 tramo de la nota, 4 la IA no puede leer su web, 5 sin web propia, 6 fuera
    const puntos = lista.filter((e) => e.lat != null).map((e) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [e.lon, e.lat] },
      properties: { id: e.id, g: e.g, k: e.k, n: e.nombre } }));
    map.addSource('puntos', { type: 'geojson', data: { type: 'FeatureCollection', features: puntos } });
    map.addSource('zona', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });

    const z = (...pares) => ['interpolate', ['linear'], ['zoom'], ...pares];
    map.addLayer({ id: 'zona-relleno', type: 'fill', source: 'zona', paint: { 'fill-color': '#c9a86a', 'fill-opacity': .08 } }, antes);
    map.addLayer({ id: 'zona-borde', type: 'line', source: 'zona', paint: { 'line-color': '#8a6421', 'line-width': 1.5, 'line-dasharray': [3, 3], 'line-opacity': .7 } }, antes);
    map.addLayer({ id: 'p-otros', type: 'circle', source: 'puntos', filter: FILTRO_BASE['p-otros'], paint: {
      'circle-radius': z(6, .8, 10, 1.6, 14, 3.4, 17, 5),
      'circle-color': ['match', ['get', 'g'], 5, SIN_WEB, '#e9e2d4'],
      'circle-stroke-color': ['match', ['get', 'g'], 5, 'rgba(255,255,255,.7)', '#b3a791'],
      'circle-stroke-width': z(6, 0, 12, .6, 16, 1.2), 'circle-opacity': z(6, .55, 12, .9) } }, antes);
    map.addLayer({ id: 'p-sinleer', type: 'circle', source: 'puntos', filter: FILTRO_BASE['p-sinleer'], paint: {
      'circle-radius': z(6, 1.4, 10, 2.6, 14, 5, 17, 7.5), 'circle-color': '#ffffff',
      'circle-stroke-color': SIN_LEER, 'circle-stroke-width': z(6, .6, 10, 1, 14, 1.8, 17, 2.4) } }, antes);
    map.addLayer({ id: 'p-medidos', type: 'circle', source: 'puntos', filter: FILTRO_BASE['p-medidos'], paint: {
      'circle-radius': z(6, 1.8, 10, 3.2, 14, 6, 17, 9),
      'circle-color': ['match', ['get', 'g'], 3, TRAMOS[3].color, 2, TRAMOS[2].color, 1, TRAMOS[1].color, TRAMOS[0].color],
      'circle-stroke-color': '#fff', 'circle-stroke-width': z(6, .3, 10, .8, 14, 1.6, 17, 2.2) },
      layout: { 'circle-sort-key': ['get', 'g'] } }, antes);
    map.addLayer({ id: 'p-nombres', type: 'symbol', source: 'puntos', minzoom: 15, filter: FILTRO_BASE['p-nombres'], layout: {
      'text-field': ['get', 'n'], 'text-font': ['Noto Sans Regular'], 'text-size': z(15, 10.5, 18, 12.5), 'text-offset': [0, 1.1],
      'text-anchor': 'top', 'text-max-width': 9, 'text-optional': true,
      'symbol-sort-key': ['get', 'g'] },          // si no caben todos, primero los medidos
      paint: { 'text-color': ['case', ['<=', ['get', 'g'], 4], '#3b352c', '#8a7f6d'],
        'text-halo-color': 'rgba(247,244,238,.95)', 'text-halo-width': 1.4 } });

    const capasPunto = ['p-medidos', 'p-sinleer', 'p-otros'];
    capasPunto.forEach((capa) => {
      map.on('mouseenter', capa, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', capa, () => { map.getCanvas().style.cursor = ''; });
    });
    map.on('click', (ev) => {
      const caja = [[ev.point.x - 6, ev.point.y - 6], [ev.point.x + 6, ev.point.y + 6]];   // dedo: un poco de margen
      const [hit] = map.queryRenderedFeatures(caja, { layers: capasPunto }).sort((a, b) => a.properties.g - b.properties.g);
      if (!hit) return;
      const e = porId.get(hit.properties.id);
      if (e) abrirVentana(e, hit.geometry.coordinates);
    });
  }

  function abrirVentana(e, coords) {
    if (ventana) ventana.remove();
    const div = document.createElement('div');
    div.className = 'vecino';
    const marca = e.tipo === 'medido' ? `<i style="background:${TRAMOS[e.t].color}"></i>${TRAMOS[e.t].nombre}`
      : e.tipo === 'sin_leer' ? '<i class="vecino__hueco"></i>La IA no puede leer su web'
        : `<i class="vecino__gris vecino__gris--g${e.g}"></i>${OTROS[e.m].corto}`;
    div.innerHTML = `<p class="vecino__nombre">${esc(e.nombre)}</p><p class="vecino__lugar">${esc(e.mun)}</p>
      <span class="vecino__tramo">${marca}</span>
      <button class="vecino__ver" type="button">¿Es tu restaurante? ${e.tipo === 'medido' ? 'Ver su diagnóstico' : 'Ver qué le pasa'}</button>`;
    div.querySelector('.vecino__ver').addEventListener('click', () => seleccionar(e.id));
    ventana = new maplibregl.Popup({ offset: 12, maxWidth: '270px', closeButton: true }).setLngLat(coords).setDOMContent(div).addTo(map);
  }

  function encuadrar(f) {     // el círculo de su zona entero en pantalla
    if (!mapaListo || f.lat == null) return;
    const r = (f.zona ? f.zona.radio_m : 800) * 1.08;
    const dLat = r / 111320, dLon = r / (111320 * Math.cos(f.lat * Math.PI / 180));
    const ley = $('#leyenda');
    const derecha = !MOVIL.matches && ley && !ley.classList.contains('plegada') ? Math.min(ley.offsetWidth + 24, 300) : 24;
    map.fitBounds([[f.lon - dLon, f.lat - dLat], [f.lon + dLon, f.lat + dLat]], {
      padding: MOVIL.matches ? { top: 46, bottom: 30, left: 16, right: 16 } : { top: 70, bottom: 40, left: 40, right: derecha },
      duration: QUIETO.matches ? 0 : 2400, essential: true, maxZoom: 16 });
  }

  function ponerMarcador(f) {
    if (!mapaListo) { pendiente = f; return; }
    if (marcador) marcador.remove();
    const el = document.createElement('div');
    el.className = 'elegido';
    const col = f.tipo === 'medido' ? TRAMOS[f.tramo].color : f.tipo === 'sin_leer' ? '#ffffff' : SIN_WEB;
    el.innerHTML = `<span class="elegido__pulso"></span><span class="elegido__punto${f.tipo === 'sin_leer' ? ' elegido__punto--hueco' : ''}" style="background:${col}"></span>
      <span class="elegido__rotulo">${esc(f.nombre)}${f.tipo === 'medido' ? `<b style="background:${col}">${Math.round(f.nota)}</b>` : ''}</span>`;
    marcador = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat([f.lon, f.lat]).addTo(map);
    const z = f.zona;
    if (z) cartel(`${miles(z.restaurantes)} restaurantes a ${km(z.radio_m)} · ${z.medidas} webs que una IA puede leer`);
  }

  function pintarZona(f) {
    if (!mapaListo) return;
    const src = map.getSource('zona');
    if (!f || !f.zona) { src.setData({ type: 'FeatureCollection', features: [] }); return; }
    const r = f.zona.radio_m, n = 72, anillo = [];
    const dLat = r / 111320, dLon = r / (111320 * Math.cos(f.lat * Math.PI / 180));
    for (let i = 0; i <= n; i++) { const a = (i / n) * 2 * Math.PI; anillo.push([f.lon + dLon * Math.cos(a), f.lat + dLat * Math.sin(a)]); }
    src.setData({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [anillo] }, properties: {} }] });
  }

  function plegarLeyenda(si) {
    const ley = $('#leyenda'), b = $('#leyenda-boton');
    ley.classList.toggle('plegada', si);
    b.setAttribute('aria-expanded', String(!si));
  }

  function montarLeyenda() {
    $('#leyenda-boton').addEventListener('click', () => plegarLeyenda(!$('#leyenda').classList.contains('plegada')));
    if (MOVIL.matches || window.innerWidth < 1280) plegarLeyenda(true);
    $('#tipos').addEventListener('click', (ev) => {
      const b = ev.target.closest('[data-tipo]');
      if (b) ponerFiltro(b.dataset.tipo === '' ? null : +b.dataset.tipo);
    });
    pintarTipos();
    pintarLeyenda();
  }

  function pintarLeyenda() {
    if (!D) return;
    const cuenta = [0, 0, 0, 0, 0, 0, 0];
    lista.forEach((e) => { if (e.lat != null && (filtroTipo == null || e.k === filtroTipo)) cuenta[e.g]++; });
    const muestra = (g) => g <= 3 ? `<i style="background:${TRAMOS[g].color}"></i>` : `<i class="leyenda__g${g}"></i>`;
    const filas = [3, 2, 1, 0, 4, 5, 6].map((g) => `<li>${muestra(g)}<span>${GRUPOS[g]}</span><span>${miles(cuenta[g])}</span></li>`);
    $('#leyenda-lista').innerHTML = filas.join('');
  }

  // ---------------------------------------------------------------- arranque
  document.addEventListener('click', (ev) => {
    if (ev.target.closest('[data-ir-oferta]')) {
      const o = $('#oferta');
      ev.preventDefault();
      if (o) o.scrollIntoView({ behavior: QUIETO.matches ? 'auto' : 'smooth', block: 'start' });
      else { const q = $('#q'); if (q) { q.focus(); q.placeholder = 'Primero, busca tu restaurante'; } }
    }
  });

  (async () => {
    montarMapa();
    try { await cargarDatos(); } catch (err) {
      dentro.innerHTML = '<p class="bloque__texto">No hemos podido cargar el índice. Recarga la página en unos segundos.</p>';
      console.error(err); return;
    }
    montarLeyenda();
    const params = new URLSearchParams(location.search);
    const pedido = params.get('r'), q = params.get('q');
    pintarInicio();
    if (pedido && porId.has(pedido)) seleccionar(pedido);
    else if (q) {             // desde la portada: el nombre ya escrito
      const input = $('#q');
      input.value = q;
      const hay = buscar(q);
      if (hay.length === 1) seleccionar(hay[0].id);
      else input.dispatchEvent(new Event('input'));
    }
  })();
})();
