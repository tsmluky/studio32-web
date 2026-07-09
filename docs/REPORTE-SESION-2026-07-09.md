# Reporte de sesión · Studio32 — 9 julio 2026 (traspaso al portátil)

Documento de traspaso para continuar desde el otro dispositivo (otro Claude Code / Cowork) sin perder contexto.

---

## 1. Repos y dónde está cada cosa

- **studio32-web** — la web. Local en `C:\Users\lukys\Desktop\Studio32`. La web publicable vive en `site/` (Netlify, deploy manual por ahora; `netlify.toml` con `publish=site` ya añadido para migrar a deploy por Git cuando se conecte el repo). Repo: `github.com/tsmluky/studio32-web`.
- **studio32-agent** — el agente (Node/Express multi-tenant, WhatsApp + Google Calendar + LLM). Repo: `github.com/tsmluky/studio32-agent`. **Bonto auto-despliega desde este repo** en `https://studio32-agent2.bonto.run`. NUEVO clon local en `C:\Users\lukys\Desktop\studio32-agent-repo` (creado esta sesión).
- Ojo: dentro de `Studio32/studio32-agent/` hay una **copia** del agente que es parte de studio32-web (NO despliega). El que despliega es el clon standalone de arriba.

## 2. Hecho esta sesión

- **Landing (`site/index.html`)**: corregido el copy de la Capa 03 del asistente y la tarjeta Servicios 04 → fuera "Make/Zapier/n8n" (no trabajamos con eso); ahora dice que el agente es autónomo. **Cambio en disco pero SIN COMMITEAR** en studio32-web.
- **Demo clínica (`site/Landing3-Clinic/`, "Aura Dental")**: reconstruida con sección de asistente + chat mock, FAQ en acordeón, formulario que llama al asistente, y fix del bug CSS `--text-color`. **Entregada en `studio32-clinica.zip`** porque el mount FUSE no dejó escribir esa carpeta; **NO aplicada a disco todavía**.
- **Decisión de producto**: NO rebrandear la demo a GH Dent. El cliente solo quiere **el agente**, no tocar su web (ghdent.es ya existe). La demo Aura Dental queda como **demo genérica** de portfolio.
- **Tenant `gh-dent`** (primer cliente real) creado con datos reales de ghdent.es y **YA PUSHEADO** al repo del agente (commit `1698d31`). Bonto lo carga al redesplegar.
- **La Taberna NO es un caso real** (es la landing de restaurante de lujo copiada). Pendiente: quitar/replantear el bloque "caso real" del landing.

## 3. OBJETIVO DE HOY: MVP de demo para GH Dent

- **Juanma presenta MAÑANA en persona** en la clínica, con el portátil. Mostrará el flujo del agente: cómo responde, cómo explica desde su contexto (servicios, precios, mutuas, financiación) y cómo **agenda una cita**.
- **Config de demo**: en `tenants/gh-dent/handoff.json`, poner el **email de Juanma** (para que los avisos de cita/lead le lleguen a él durante la presentación). → PENDIENTE: email de Juanma.
- MVP **atractivo pero simple**. Nada de sobre-ingeniería.
- **Cómo mostrarlo** (a decidir): (A) `studio32-agent2.bonto.run/widget-demo` con tenant `gh-dent`; (B) una página demo con el widget embebido (más vistoso).
- **Requisitos en Bonto** (variables de entorno): `DEEPSEEK_API_KEY` + `LLM_PROVIDER=deepseek` (verificar que están), `CORS_ORIGINS` con el dominio donde se muestre.

## 4. Tenant gh-dent — estado y pendientes

- Datos reales: Guadalajara, C. Cardenal González de Mendoza 8; tel 949 23 51 60; WhatsApp +34 610 23 80 24; email cliente gabriela@ghdent.es; horario L-J 10-19, V 10-14; +20 mutuas; financiación 36 meses; primera valoración gratis; 11 tratamientos.
- `owner.token` puesto: `cf96adef7e5ccd96fad9aeca6965ee87ffc3014996935b36`.
- **Pendiente**: `calendar.calendar_id` (requiere que GH Dent comparta su Google Calendar con la service account — `credentials.json` ya existe en el agente); confirmar email de avisos (demo = Juanma; real = gabriela); matiz viernes cierra 14:00.

## 5. Tarea preparada: pasar un número existente a agente

Ver `GUIA-NUMERO-EXISTENTE-A-AGENTE.md`. Resumen: el número del negocio pasa a **WhatsApp Business API** (Meta Cloud API o Twilio). Caveat clave: el número **deja de usarse en la app normal de WhatsApp** (salvo "coexistence"). Verificación por SMS/llamada. El agente ya tiene los dos canales montados (`/whatsapp/meta/webhook` y `/whatsapp/webhook`).

## 6. Gotchas (importante)

- **Mount FUSE del entorno Cowork**: bloquea `unlink`/rename y algunas subcarpetas de `site/` "flapean" (se ven vacías) → git y escrituras directas en `site/` fallan de forma intermitente. Se trabaja con `cat > archivo` y entregando zips.
- **PowerShell antiguo**: no acepta `&&`; usar líneas separadas o `;`.
- Para publicar la web hay lío conocido de desincronización Desktop vs origin (ver histórico).

## 7. Pendientes abiertos

1. Commitear `site/index.html` en studio32-web (fix Capa 03).
2. Decidir si aplicar el zip de la demo clínica a `site/Landing3-Clinic/`.
3. Poner email de Juanma en `tenants/gh-dent/handoff.json` y push al repo del agente.
4. Verificar en Bonto: LLM key + CORS; probar `/widget-demo` con `gh-dent`.
5. Conectar Google Calendar de GH Dent (cliente comparte) para agendar de verdad.
6. Quitar el falso "caso real" de La Taberna del landing.
7. Snippet del widget para el WordPress de ghdent.es (cuando el cliente diga sí).

---
Generado el 2026-07-09. Repos: github.com/tsmluky/studio32-web · github.com/tsmluky/studio32-agent
