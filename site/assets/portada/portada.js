/* Propuesta de portada · Visibilidad en IA.
   El mapa del hero usa los mismos datos que la demo (auditoria/datos/puntos.json) y recorre algunas ciudades
   contando sus restaurantes por color. Sin interacción: para buscar está la demo. */
(() => {
  'use strict';

  const QUIETO = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TRAMOS = [
    { nombre: 'Con mucho margen', color: '#c4553a' }, { nombre: 'Mejorable', color: '#d9a441' },
    { nombre: 'Bien preparada', color: '#8fa85a' }, { nombre: 'Muy bien preparada', color: '#2f7d5b' }];
  const CIUDADES = [   // municipio tal como viene en los datos → cómo se dice
    { mun: 'València', nombre: 'València', centro: [-0.3763, 39.4699], zoom: 12.6 },
    { mun: 'Alacant / Alicante', nombre: 'Alicante', centro: [-0.4855, 38.3452], zoom: 12.9 },
    { mun: 'Benidorm', nombre: 'Benidorm', centro: [-0.1315, 38.5395], zoom: 13.2 },
    { mun: 'Dénia', nombre: 'Dénia', centro: [0.1056, 38.8408], zoom: 12.8 },
    { mun: 'Castelló de la Plana / Castellón de la Plana', nombre: 'Castelló', centro: [-0.0379, 39.9864], zoom: 12.8 },
  ];
  const $ = (s) => document.querySelector(s);
  const miles = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // ---------------------------------------------------------------- aparecer al hacer scroll
  const ver = (el) => {
    el.classList.add('visto');
    el.querySelectorAll('[data-v]').forEach((b) => b.style.setProperty('--v', b.dataset.v));
    el.querySelectorAll('[data-cuenta]').forEach(contar);
  };
  function contar(b) {
    const fin = +b.dataset.cuenta;
    if (QUIETO) { b.textContent = fin; return; }
    const t0 = performance.now(), dura = 1100;
    const paso = (t) => {
      const x = Math.min(1, (t - t0) / dura);
      b.textContent = Math.round(fin * (1 - Math.pow(1 - x, 3)));
      if (x < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
  const vistos = [...document.querySelectorAll('.aparece, .validez, .maqueta')];
  if (QUIETO) vistos.forEach(ver);
  else {
    // sin IntersectionObserver a propósito: se mira la posición al cargar y al hacer scroll (funciona siempre)
    document.documentElement.classList.add('anim');
    let pendiente = false;
    const revisar = () => {
      pendiente = false;
      const alto = window.innerHeight;
      vistos.forEach((el) => { if (!el.classList.contains('visto') && el.getBoundingClientRect().top < alto * .92) ver(el); });
    };
    const pedir = () => { if (!pendiente) { pendiente = true; requestAnimationFrame(revisar); } };
    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir);
    revisar();
    setTimeout(revisar, 400);                     // por si se llega con un #ancla
  }

  // ---------------------------------------------------------------- mapa del hero
  let datos = null;
  function porCiudad(mun) {
    const t = [0, 0, 0, 0];
    let total = 0, sinLeer = 0;
    datos.medidos.forEach((x) => { if (x[2] === mun) { t[x[5]]++; total++; } });
    datos.sin_leer.forEach((x) => { if (x[2] === mun) { sinLeer++; total++; } });
    datos.otros.forEach((x) => { if (x[1] === mun) total++; });
    return { t, total, sinLeer };
  }
  function ficha(ciudad) {
    const f = $('#ficha-hero');
    const pintar = () => {
      if (ciudad) {
        const c = porCiudad(ciudad.mun);
        $('#hero-lugar').textContent = ciudad.nombre;
        $('#hero-n').textContent = miles(c.total);
        $('#hero-tramos').innerHTML = [3, 2, 1, 0].map((k) => `<li><i style="background:${TRAMOS[k].color}"></i><span>${TRAMOS[k].nombre}</span><span>${miles(c.t[k])}</span></li>`).join('')
          + `<li><i class="sin-leer"></i><span>La IA no puede leer su web</span><span>${miles(c.sinLeer)}</span></li>`;
      } else {
        const total = datos.medidos.filter((x) => x[3] != null).length + datos.sin_leer.length + datos.otros.length;
        $('#hero-lugar').textContent = 'Comunitat Valenciana';
        $('#hero-n').textContent = miles(total);
        $('#hero-tramos').innerHTML = [3, 2, 1, 0].map((k) => `<li><i style="background:${TRAMOS[k].color}"></i><span>${TRAMOS[k].nombre}</span><span>${miles(datos.tramos[k])}</span></li>`).join('');
      }
      f.style.opacity = 1;
    };
    if (QUIETO) { pintar(); return; }
    f.style.opacity = 0;
    setTimeout(pintar, 380);
  }

  function tono(map) {      // mismo papel cálido que la demo
    const p = (id, prop, v) => { try { if (map.getLayer(id)) map.setPaintProperty(id, prop, v); } catch { /* capa distinta */ } };
    p('background', 'background-color', '#f3eee4'); p('park', 'fill-color', '#e6e5d5'); p('landcover_wood', 'fill-color', '#e2e2d0');
    p('landuse_residential', 'fill-color', '#eee8dc'); p('water', 'fill-color', '#cdd7d6'); p('building', 'fill-color', '#e8e0d2');
    ['highway_minor', 'highway_path', 'highway_major_subtle', 'highway_motorway_subtle'].forEach((id) => p(id, 'line-color', '#e3dbcc'));
    ['highway_major_casing', 'highway_motorway_casing'].forEach((id) => p(id, 'line-color', '#d8cfbf'));
    map.getStyle().layers.filter((l) => l.type === 'symbol').forEach((l) => {
      try { map.setLayoutProperty(l.id, 'visibility', l.id.startsWith('label_city') || l.id.startsWith('label_town') ? 'visible' : 'none'); } catch { /* */ }
      try { if (l.layout && l.layout['text-field']) map.setLayoutProperty(l.id, 'text-field', ['coalesce', ['get', 'name:es'], ['get', 'name']]); } catch { /* */ }
      p(l.id, 'text-color', '#3b352c'); p(l.id, 'text-halo-color', 'rgba(247,244,238,.9)');
    });
  }

  async function mapaHero() {
    if (!window.maplibregl) return;
    try { datos = await (await fetch('auditoria/datos/puntos.json')).json(); } catch { return; }
    document.querySelectorAll('[data-n="webs"]').forEach((el) => { el.textContent = miles(datos.webs); });
    const total = datos.medidos.filter((x) => x[3] != null).length + datos.sin_leer.length + datos.otros.length;
    document.querySelectorAll('.demo__cargar small').forEach((el) => { el.textContent = `${miles(total)} restaurantes de la Comunitat Valenciana`; });
    ficha(null);
    const map = new maplibregl.Map({
      container: 'mapa-hero', style: 'https://tiles.openfreemap.org/styles/positron',
      center: [-0.35, 39.15], zoom: 6.7, interactive: false,
      attributionControl: { compact: true, customAttribution: 'Restaurantes: Overture Maps, OpenStreetMap' },
    });
    map.on('load', () => {
      tono(map);
      document.querySelector('.ventana .maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show');   // créditos plegados
      const antes = (map.getStyle().layers.find((l) => l.type === 'symbol') || {}).id;
      const f = (lon, lat, g) => ({ type: 'Feature', geometry: { type: 'Point', coordinates: [lon, lat] }, properties: { g } });
      const puntos = [
        ...datos.otros.map((x) => f(x[3], x[2], 5)),
        ...datos.sin_leer.map((x) => f(x[4], x[3], 4)),
        ...datos.medidos.filter((x) => x[3] != null).map((x) => f(x[4], x[3], x[5])),
      ];
      map.addSource('p', { type: 'geojson', data: { type: 'FeatureCollection', features: puntos } });
      const z = (...a) => ['interpolate', ['linear'], ['zoom'], ...a];
      map.addLayer({ id: 'otros', type: 'circle', source: 'p', filter: ['==', ['get', 'g'], 5], paint: {
        'circle-radius': z(6, .8, 13, 2.6), 'circle-color': '#a3977f', 'circle-opacity': .7 } }, antes);
      map.addLayer({ id: 'sinleer', type: 'circle', source: 'p', filter: ['==', ['get', 'g'], 4], paint: {
        'circle-radius': z(6, 1.3, 13, 4.2), 'circle-color': '#fff', 'circle-stroke-color': '#3b352c', 'circle-stroke-width': z(6, .5, 13, 1.5) } }, antes);
      map.addLayer({ id: 'medidos', type: 'circle', source: 'p', filter: ['<=', ['get', 'g'], 3], paint: {
        'circle-radius': z(6, 1.8, 13, 5.2),
        'circle-color': ['match', ['get', 'g'], 3, TRAMOS[3].color, 2, TRAMOS[2].color, 1, TRAMOS[1].color, TRAMOS[0].color],
        'circle-stroke-color': '#fff', 'circle-stroke-width': z(6, .3, 13, 1.3) } }, antes);
      if (QUIETO) return;
      // recorrido: la Comunitat entera y después ciudad a ciudad, solo mientras se ve
      let i = -1, activo = true, reloj = null;
      const siguiente = () => {
        if (!activo) return;
        i = (i + 1) % (CIUDADES.length + 1);
        const c = i === CIUDADES.length ? null : CIUDADES[i];
        map.flyTo(c ? { center: c.centro, zoom: c.zoom, duration: 3200, essential: true }
          : { center: [-0.35, 39.15], zoom: 6.7, duration: 3200, essential: true });
        ficha(c);
        reloj = setTimeout(siguiente, 6500);
      };
      reloj = setTimeout(siguiente, 2600);
      new IntersectionObserver(([e]) => {
        activo = e.isIntersecting;
        if (activo && !reloj) reloj = setTimeout(siguiente, 800);
        if (!activo) { clearTimeout(reloj); reloj = null; }
      }).observe($('#mapa-hero'));
    });
  }
  window.addEventListener('load', mapaHero);   // el mapa no frena el primer pintado

  // ---------------------------------------------------------------- la demo dentro de la portada
  // Se carga sola al acercarse, también en el móvil: el mapa real, que se mueve y se amplía, es la mejor invitación.
  const marco = $('#demo-marco'), boton = $('#demo-cargar');
  let puesta = false;
  const poner = () => {
    if (puesta) return;
    puesta = true;
    const f = document.createElement('iframe');
    f.src = 'auditoria/?embed=1';
    f.title = 'Mapa del Índice Studio32';
    f.loading = 'lazy';
    f.setAttribute('allow', 'fullscreen');
    marco.appendChild(f);
    f.addEventListener('load', () => boton.remove());
  };
  boton.addEventListener('click', poner);
  {
    const cerca = () => { if (marco.getBoundingClientRect().top < window.innerHeight + 500) { poner(); window.removeEventListener('scroll', cerca); } };
    window.addEventListener('scroll', cerca, { passive: true });
    window.addEventListener('load', cerca);
  }
})();
