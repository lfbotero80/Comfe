# Estado del método — Comfenalco IA

> Este archivo es del **asesor de método de vibe coding**, capa adicional sobre el Scrum personalizado que ya vive en `CLAUDE.md` / `METODOLOGIA_SCRUM.md` / `BACKLOG.md` / `SPRINTS.md` / `MAPA_CODIGO.md`. No lo duplica: lo referencia. Primera vez que se aplica el método formal a este proyecto — creado el 2026-08-18.

## Nivel de riesgo

**Propuesto: Nivel 2** (terceros dependen del resultado) — **pendiente de confirmación explícita con Luis Felipe**, no asumido en silencio.

Justificación: Diana, Sandra y los gerentes de sede toman decisiones reales sobre el negocio (activar campaña, subir/mantener tarifa) a partir de lo que muestra el tablero (EP-05). No mueve dinero directamente ni es cliente externo, pero sí son usuarios reales dependiendo de datos correctos para decisiones que afectan ocupación e ingresos. Esto activa el estándar de nivel 2: arquitectura de solución + modelo de amenazas completos, y rigor de testing equivalente al de la skill de QA.

## Bloques completados

No se ha corrido el método completo por bloques (1 a 7) de forma explícita — el proyecto avanzó con el Scrum personalizado (HUs directo a `BACKLOG.md`) sin pasar por los gates 1 y 2 del método de vibe coding. Registrado como brecha, no corregido retroactivamente sin decisión de Luis Felipe.

- **Bloque 1 (definiciones de negocio):** no hay documento formal de objetivo/target/caso de negocio/validación con usuarios reales para EP-05 — existe contexto disperso en `CLAUDE.md` y las HUs del backlog, pero no el instrumento del bloque 1. **Gate 1: no corrido formalmente.**
- **Bloque 3 (arquitectura técnica):** no existe un documento de decisiones de arquitectura ni modelo de amenazas — sí existe `MAPA_CODIGO.md`, que documenta estructura pero no decisiones (por qué un solo HTML sin backend, por qué localStorage, por qué el "auth" no es seguridad real, qué se hizo consciente vs. por conveniencia). **Gate 2: no corrido formalmente.**
- **Bloque 7 (retro):** `SPRINTS.md` tiene resumen de cierre por sprint, pero no las 3 preguntas de retro del método (qué decisión de bloque 3 se rompió, qué hubo que reexplicar, qué quedó distinto a lo diseñado).

## Decisiones de bloque 3 registradas

Ninguna registrada formalmente todavía. Decisiones técnicas reales que sí existen (extraídas de `MAPA_CODIGO.md` y `SPRINTS.md`, pero no como instrumento de bloque 3):
- Un solo archivo HTML autocontenido (HTML+CSS+JS inline), sin build step, sin backend, sin dependencias externas (se quitó Chart.js a propósito).
- Persistencia en `localStorage` del navegador — no hay servidor ni base de datos.
- "Auth" con roles es identificación, no seguridad real (hash SHA-256 client-side, declarado explícitamente como no-seguro en el propio login).
- Dos archivos en paralelo (`tablero-seguimiento-ocupacion.html` productivo, `-v2.html` de trabajo) en vez de una rama o versión única — decisión de gobierno pendiente en `HU-034`.

## Resumen del backlog

Ver `BACKLOG.md` (fuente de verdad, no se duplica aquí). Estado a 2026-08-18: EP-01 a EP-04 y EP-06 con HUs núcleo hechas y pendientes menores de validación externa; EP-05 (tablero) es la línea activa, con `SPRINT-00` cerrado como línea base retroactiva.

## Retro de sprints cerrados

- **SPRINT-00:** no tiene retro con las 3 preguntas del método (fue documentado retroactivamente, no ejecutado bajo el método). Pendiente si Luis Felipe quiere reconstruirla con lo que recuerde, o dejarla en blanco por ser retroactiva.

## Bugs abiertos

No hay `backlog-bugs.json` en el repo — la skill `qa-integral` no se ha corrido sobre este proyecto. No se puede correr `check_open_bugs.py` sin ese archivo. Para nivel 2, esto es un hueco: no hay QA formal registrada sobre un tablero que ya está "en producción" según `MAPA_CODIGO.md`.
