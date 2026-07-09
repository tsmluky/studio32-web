# Guía — Pasar un número de teléfono existente a agente (WhatsApp)

Muchos negocios (clínicas, etc.) ya tienen su número de empresa. Esto explica cómo convertir ese número en el canal del agente, y el caveat que hay que dejar claro al cliente.

## El caveat que SIEMPRE hay que avisar

Un número solo puede estar en un sitio a la vez: la **app de WhatsApp** (normal o Business App) **o** la **WhatsApp Business API**. Para que el agente atienda, el número tiene que ir a la **API**. Al hacerlo, **ese número deja de funcionar en la app de WhatsApp del móvil**.

- **Excepción — "coexistence"**: Meta está desplegando la coexistencia (WhatsApp Business App + Cloud API sobre el mismo número). Si está disponible para ese número/país, permite mantener la app y automatizar a la vez. Hay que comprobarlo caso por caso; no darlo por hecho.
- **Alternativa limpia**: si el negocio NO quiere perder su WhatsApp de siempre, usar un **número nuevo dedicado** solo para el agente (una SIM/VoIP nueva). Es lo más sencillo y sin riesgo.

## Opción A — Meta Cloud API (recomendada: directa y barata)

El agente ya tiene el canal montado en `/whatsapp/meta/webhook`. No hay que programar nada.

1. **Meta Business Portfolio** (business.facebook.com) del cliente, o gestionado por Studio32, con la **verificación del negocio** completada (tarda de horas a días).
2. En la app de Meta (developers.facebook.com) → **WhatsApp** → añadir el **número del cliente**. Requisito: ese número **no debe estar activo en la app de WhatsApp** (si lo está, primero se saca / o se usa coexistence).
3. **Verificación del número**: Meta envía un **código por SMS o llamada** a ese número. Alguien con acceso al teléfono lo lee y lo mete en Meta.
4. Generar **token permanente** con un **System User** (permisos `whatsapp_business_messaging` + `whatsapp_business_management`) → `META_ACCESS_TOKEN`.
5. Coger el **Phone number ID** del número → `META_PHONE_NUMBER_ID`. Elegir un `META_VERIFY_TOKEN` (texto libre).
6. Configurar en el agente (variables de entorno en Bonto): los 3 valores anteriores. Webhook en Meta: `https://studio32-agent2.bonto.run/whatsapp/meta/webhook`, campo **messages**.
7. En el tenant del cliente: `business.json → whatsapp_number` = ese número (así el agente resuelve el tenant por el número destino).

## Opción B — Twilio

El agente tiene el canal en `/whatsapp/webhook`. Twilio registra el número como **WhatsApp sender** (también pasa por aprobación de Meta). Añade un pequeño recargo + alquiler de número, pero Twilio gestiona el papeleo. Poner el número en `TWILIO_WHATSAPP_NUMBER` y en el `business.json` del cliente. Webhook: `https://studio32-agent2.bonto.run/whatsapp/webhook`.

Para **probar hoy sin papeleo** existe el **sandbox de Twilio** (número compartido +14155238886): validas el flujo entre nosotros antes de tocar el número real. (Ver `docs/PRUEBA-WHATSAPP-TWILIO.md` del agente.)

## Cómo funciona el multi-cliente

El agente resuelve qué tenant contesta según el **número de destino** del mensaje (`resolverTenantPorNumero`): cada cliente pone su número en `business.json.whatsapp_number`. Un solo backend atiende a muchos clientes, cada número a su tenant.

## Qué pedirle al cliente (checklist comercial)

- Decidir: ¿migramos su número actual (pierde la app, salvo coexistence) o usamos un número nuevo dedicado?
- Si migramos el suyo: acceso/permiso en su Meta Business (o que Studio32 lo gestione) y **el código de verificación** que llegue por SMS/llamada.
- Confirmar quién recibe los avisos de citas/leads (email y/o WhatsApp) → va en `handoff.json`.

## Recomendación para empezar

Para el primer cliente (GH Dent) y demos: **modo web (widget) primero** — funciona ya, sin papeleo de Meta, y demuestra el valor. El WhatsApp con su número real se monta después, cuando el cliente confirme y decidamos número propio vs dedicado.
