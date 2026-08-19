# Registro de Sprints — Comfenalco IA

Registro correlativo de todos los sprints ejecutados en este repositorio, con el agente que hizo cada uno (`Claude Code` o `Codex`). Ver plantilla y reglas de cierre en `METODOLOGIA_SCRUM.md`. Entradas más recientes arriba.

**Antes de abrir un sprint nuevo, lee al menos las 2-3 entradas más recientes de este archivo.**

---

## SPRINT-27 — Arquitectura IA para accion sugerida [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** definir que requiere una IA permanente para recomendaciones comerciales, sin fingir que el HTML local ya puede operar como sistema inteligente conectado.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-044 | Evaluar arquitectura de IA permanente para recomendaciones | Codex | Hecha | Documento de arquitectura y HUs derivadas creadas |

### Resumen de cierre

Se creo `05-tablero-ocupacion/ARQUITECTURA_IA_RECOMENDACIONES_SPRINT-27.md` para evaluar como evolucionar la `Accion sugerida` desde el motor deterministico actual hacia recomendaciones asistidas por IA. La conclusion principal es no conectar IA directamente desde el HTML local: el motor deterministico debe seguir como base auditable y fallback, y cualquier IA real requiere backend/API, autenticacion, auditoria, control de llaves, validacion de salida y aprobacion humana.

El documento separa hechos verificados del estado actual, valor posible de IA, limites, arquitectura por capas, flujo recomendado, opciones de implementacion, datos minimos, riesgos y backlog derivado. Se recomienda empezar por IA bajo demanda despues de cargar archivos, no por IA permanente con job diario. Tambien se alimenta el backlog con `TO-HU-073` a `TO-HU-077`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md` y `05-tablero-ocupacion/ARQUITECTURA_IA_RECOMENDACIONES_SPRINT-27.md`.

**Validacion realizada:** lectura de `strategic-recommendation.js`, `occupancy.js`, `commercial-context.js` y `data-contracts.js`; revision documental contra reglas de `CLAUDE.md` (no inventar cifras, distinguir hechos/propuestas, no presentar IA como decision aprobada); `git diff --check`; servidor local `http://localhost:8055/` responde 200 aunque no se toco runtime.

```text
HANDOFF — SPRINT-27 Arquitectura IA para accion sugerida
──────────────────────────────────────
HUs completas:        TO-HU-044
HUs pendientes:       TO-HU-073, TO-HU-074, TO-HU-075, TO-HU-076,
                      TO-HU-077 creadas como derivadas

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/ARQUITECTURA_IA_RECOMENDACIONES_SPRINT-27.md

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/**/*.js
                      v3-modular/styles/app.css

Datos/contratos:      No se cambiaron datos, contratos, plantillas ni runtime.

Decisiones tomadas:   No conectar IA real desde HTML local.
                      Mantener motor deterministico como base auditable y
                      fallback.
                      Primera fase recomendada: IA bajo demanda con backend,
                      no IA permanente automatica.
                      La IA propone; Comercial/Diana/Gerencia aprueban.

Riesgos residuales:
- Sin backend, autenticacion y auditoria no hay forma responsable de operar IA
  real dentro del instrumento.
- Sin TO-HU-026/027, una recomendacion IA no tendria bitacora ni responsable.
- La IA permanente diaria depende de fuente programada Zeus/Power BI y gobierno
  de costos/datos; queda como fase posterior.

Validación hecha:
  Documental:         lectura de motor actual, semaforo, contexto comercial
                      y contratos de datos -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime:            no aplica; sprint arquitectonico sin cambios de codigo
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-044.
```

---

## SPRINT-26 — Mes activo sin fallback quemado [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1, E2
- **Objetivo del sprint:** evitar que Hoteles y Parques muestren agosto como mes operativo cuando una sede no tiene filas cargadas.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-072 | Quitar fallback visual a agosto en sedes sin filas | Codex | Hecha | Hoteles/Parques muestran estado sin periodo activo hasta cargar datos |

### Resumen de cierre

Se elimino el fallback visual a agosto (`${year}-08`) en `Hoteles` y `Parques`. Ahora, si la sede activa no tiene filas de ocupacion/uso cargadas, no existe mes activo: no se resalta ninguna barra mensual, el cumplimiento dice `Sin periodo cargado`, las metricas muestran `Sin periodo cargado` y el detalle cambia a `Detalle diario pendiente`.

Tambien se ajusto `renderSiteBudgetPanel()` para tolerar `activePeriod` vacio. Si no hay periodo de ocupacion pero si existe presupuesto cargado de la sede, el panel lo muestra como ultimo presupuesto cargado con nota explicita; si tampoco hay presupuesto, mantiene el estado gris `Sin presupuesto cargado`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js`, `src/ui/views/parks.js` y `src/ui/site-budget-panel.js`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright: en modo real vacio, Hoteles y Parques no muestran `2026-08`, no tienen `.month-bar.active`, muestran `Sin periodo cargado` y `Detalle diario pendiente`; en modo demo, Hosteria Los Farallones conserva un mes activo real; al cargar `Forecast Balandú 1808.pdf`, Balandu activa `2026-08` desde el archivo y no desde fallback.

```text
HANDOFF — SPRINT-26 Mes activo sin fallback quemado
──────────────────────────────────────
HUs completas:        TO-HU-072
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/src/ui/site-budget-panel.js

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/state/app-state.js
                      v3-modular/src/ui/views/dashboard.js
                      v3-modular/src/ui/views/data-load.js

Datos/contratos:      No se cambiaron contratos, plantillas ni datos semilla.

Decisiones tomadas:   Una sede sin filas no tiene periodo activo.
                      `2026-08` solo aparece si viene de filas cargadas o demo.
                      El panel presupuestal tolera ausencia de periodo de
                      ocupacion sin mostrar texto tecnico ni periodo inventado.

Riesgos residuales:
- Si un usuario selecciona manualmente un mes gris en una sede que si tiene
  filas en otro mes, la vista puede mostrar ese mes seleccionado sin datos.
  Eso es intencional: corresponde a una seleccion explicita, no a fallback.
- La persistencia real de filas cargadas sigue fuera de alcance del HTML local.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  modo real vacio en Hoteles/Parques sin 2026-08 visible,
                      sin barra mensual activa y con textos de periodo pendiente -> pass
                      modo demo conserva mes activo real -> pass
                      carga Forecast Balandú 1808.pdf activa 2026-08 desde datos -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-072.
```

---

## SPRINT-25 — Modo demo y datos reales [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** separar el arranque con datos semilla del arranque con datos reales vacios, para que la V3 modular no mezcle demo con operacion.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-071 | Separar modo demo / modo datos reales | Codex | Hecha | Modo persistente en localStorage y control en Carga de datos |

### Resumen de cierre

Se separo la V3 modular en dos modos de operacion: `Modo demo`, que conserva los datos semilla para revisar el instrumento completo, y `Datos reales`, que arranca sin ocupacion, presupuesto ni reglas de Revenue hasta que el usuario cargue archivos. La seleccion queda guardada en `localStorage` con la clave `comfenalco_data_mode_v1`, para que el tablero recuerde el modo entre recargas locales.

El control de modo queda dentro de `Carga de datos`, no en el Dashboard. Al pasar a `Datos reales`, `appState` reinicia `loadedFiles`, `occupancyInventoryRows`, `parkRows`, `budgetRows` y `revenueRuleRows` vacios; se conservan catalogos base como calendario comercial y campanas, porque son estructura de negocio y no cargas operativas. El boton `Exportar ocupacion CSV` queda deshabilitado cuando no hay filas y se habilita apenas se carga ocupacion/inventario.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/state/app-state.js`, `src/main.js`, `src/ui/views/data-load.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright: demo abre con datos semilla, `Datos reales` deja cobertura en `0 de 3 frentes`, deshabilita exportacion, carga `Forecast Balandú 1808.pdf` con 14 filas aceptadas, habilita exportacion y permite volver a `Modo demo` sin errores de consola.

```text
HANDOFF — SPRINT-25 Modo demo y datos reales
──────────────────────────────────────
HUs completas:        TO-HU-071
HUs pendientes:       TO-HU-072 queda pendiente fuera del alcance

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/dashboard.js, hotels.js, parks.js,
                      budget.js, calendar.js, campaigns.js

Datos/contratos:      No se cambiaron contratos ni plantillas.
                      El modo real arranca sin datos operativos cargados.
                      El modo demo conserva semillas para revision visual.

Decisiones tomadas:   El modo de datos vive en appState y se persiste en
                      localStorage (`comfenalco_data_mode_v1`).
                      Cambiar a Datos reales limpia ocupacion, parques,
                      presupuesto, Revenue y archivos cargados.
                      Calendario comercial y catalogo de campanas se conservan
                      como catalogos base, no como carga operativa.

Riesgos residuales:
- TO-HU-072 sigue pendiente: Hoteles/Parques aun deben dejar de mostrar un
  fallback visual a agosto cuando una sede no tiene filas.
- El modo real no persiste las filas cargadas despues de refrescar el navegador;
  eso sigue siendo una limitacion del demo local sin backend/persistencia formal.
- Los catalogos base siguen precargados en ambos modos por decision funcional;
  si Diana quiere que tambien arranquen vacios, se debe abrir otra HU.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  demo con semillas -> pass
                      Datos reales sin filas -> pass
                      Forecast Balandú 1808.pdf carga 14 fila(s) -> pass
                      exportacion se deshabilita sin filas y se habilita
                      despues de cargar ocupacion -> pass
                      regreso a Modo demo -> pass

Auto-reporte DoD:     Completo para TO-HU-071.
```

---

## SPRINT-24 — Auditoria de datos quemados [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** auditar la V3 modular para distinguir datos semilla, datos estructurales y datos quemados riesgosos antes de seguir evolucionando el tablero.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-067 | Auditoria de datos quemados | Codex | Hecha | Informe creado y HUs derivadas en backlog |

### Resumen de cierre

Se audito la V3 modular para ubicar datos operativos quemados, datos semilla y catalogos estructurales. La conclusion principal queda documentada en `05-tablero-ocupacion/AUDITORIA_DATOS_QUEMADOS_SPRINT-24.md`: las vistas ejecutivas no tienen cifras operativas escondidas, pero `appState` arranca precargado desde `src/data/demo-data.js`, por lo que el tablero muestra datos antes de que el usuario cargue archivos en esa sesion. Eso es util para demo, pero riesgoso para lectura real.

Tambien se identifico que el fallback `latestMonth(rows) || \`${year}-08\`` en Hoteles/Parques no inventa cifras, pero si puede reforzar la percepcion de un mes fijo cuando una sede no tiene filas. Se registraron dos HUs derivadas: `TO-HU-071` para separar modo demo / modo datos reales, y `TO-HU-072` para eliminar el fallback visual a agosto en sedes vacias.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md` y `05-tablero-ocupacion/AUDITORIA_DATOS_QUEMADOS_SPRINT-24.md`.

**Validacion realizada:** auditoria por busqueda y lectura de `src/state/app-state.js`, `src/data/demo-data.js`, vistas principales (`dashboard.js`, `hotels.js`, `parks.js`, `budget.js`), dominios (`sites.js`, `occupancy.js`, `budget.js`, `operational-calendar.js`) y datos semilla (`commercial-calendar.js`, `campaigns.js`, `colombia-holidays-2026.js`). Se ejecuto `node --check` sobre modulos JS, `git diff --check` y `curl -I http://localhost:8055/`.

```text
HANDOFF — SPRINT-24 Auditoria de datos quemados
──────────────────────────────────────
HUs completas:        TO-HU-067
HUs pendientes:       TO-HU-071, TO-HU-072 creadas como derivadas

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/AUDITORIA_DATOS_QUEMADOS_SPRINT-24.md

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/**/*.js
                      v3-modular/styles/app.css

Datos/contratos:      No se cambiaron datos, contratos ni comportamiento runtime.

Decisiones tomadas:   La deuda principal no esta en cifras hardcodeadas dentro
                      de las vistas, sino en que `appState` arranca con
                      `demo-data.js`.
                      Se deja pendiente separar modo demo / modo datos reales.
                      Se deja pendiente quitar el fallback visual a agosto en
                      sedes sin filas.

Riesgos residuales:
- Mientras no exista modo datos reales, la V3 modular puede abrir con datos
  semilla que parecen cargados.
- Mientras no se corrija el fallback de mes, una sede sin filas puede mostrar
  `2026-08` como contexto visual aunque no tenga informacion.

Validación hecha:
  Auditoria:          rg + lectura manual de estado, datos, dominios y vistas -> pass
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md
                      actualizados; informe creado

Auto-reporte DoD:     Completo para TO-HU-067.
```

---

## SPRINT-23 — Estado de informacion por sede [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1, E3
- **Objetivo del sprint:** mostrar en Carga de datos que informacion tiene cada sede y que contratos faltan, sin ensuciar el dashboard general.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-068 | Estado de informacion por sede | Codex | Hecha | Ocupacion, presupuesto y Revenue por Hoteles/Parques |

### Resumen de cierre

Se implemento un bloque de `Estado de informacion por sede` dentro de `Carga por archivo`, agrupado en Hoteles y Parques. Para cada sede muestra el porcentaje de cobertura, estado (`Completo`, `Parcial`, `Sin datos`), y tres chips operativos: Ocupacion, Presupuesto y Revenue. Cada chip indica si hay filas cargadas y el dato de referencia mas reciente cuando existe.

La logica queda separada en `src/domain/data-readiness.js`: calcula cobertura por sede desde `appState` sin tocar vistas ejecutivas. `data-load.js` solo renderiza el resultado y refresca ese bloque despues de una carga exitosa, sin volver a renderizar toda la pantalla ni borrar los mensajes de validacion. Tambien se corrigio un texto desactualizado: la vista ya no dice que PDF Zeus esta pendiente, porque la carga directa por PDF existe desde `SPRINT-10`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/domain/data-readiness.js`, `src/ui/views/data-load.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS, `git diff --check`, servidor local `http://localhost:8055/` respondiendo 200 y prueba Playwright: la vista de carga muestra 2 grupos, 9 sedes y 27 chips; el texto de PDF Zeus directo aparece; al subir `Forecast Balandu 1808.pdf`, Hacienda Balandu pasa a `2 de 3 frentes`; el mensaje de validacion se conserva y no hay errores JS.

```text
HANDOFF — SPRINT-23 Estado de informacion por sede
──────────────────────────────────────
HUs completas:        TO-HU-068
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/domain/data-readiness.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/dashboard.js, hotels.js,
                      parks.js, budget.js, calendar.js, campaigns.js

Datos/contratos:      Sin cambios en contratos de carga.
                      Se corrige texto operativo sobre PDF Zeus: ya se puede
                      subir directamente en el contrato de ocupacion/inventario.

Decisiones tomadas:   El estado de informacion vive en Carga de datos, no en
                      Dashboard, para no aumentar carga cognitiva de la vista
                      ejecutiva.
                      La cobertura se mide en tres frentes por sede:
                      ocupacion/inventario, presupuesto y Revenue.
                      La vista se refresca por bloque tras carga exitosa, sin
                      rerender completo que borre validaciones.

Riesgos residuales:
- `Revenue` aparece pendiente mientras no se carguen reglas; el motor actual
  de accion sugerida sigue usando reglas deterministicas internas, no filas de
  `revenueRules`.
- El estado no audita usuario ni fecha por responsable; eso corresponde a
  TO-HU-027 o a una capa de persistencia/autenticacion real.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  Playwright confirma 2 grupos, 9 sedes, 27 chips,
                      texto PDF actualizado, carga real de Balandu actualiza
                      cobertura a 2 de 3 frentes y conserva validacion visible;
                      sin errores JS.
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md
                      actualizados

Auto-reporte DoD:     Completo para TO-HU-068.
```

---

## SPRINT-22 — Exportacion CSV de ocupacion [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** cerrar la brecha de exportacion de ocupacion e inventario en CSV, igualando la salida que ya existe para presupuesto.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-066 | Exportar ocupacion e inventario CSV | Codex | Hecha | Consolidado, por tipo de sede y por sede; reusa `services/csv-export.js` |

### Resumen de cierre

Se agrego exportacion CSV para ocupacion e inventario, cubriendo la brecha que habia quedado frente a presupuesto. La vista `Carga por archivo` permite descargar el consolidado completo de ocupacion; `Hoteles` permite exportar todos los hoteles o el hotel activo; `Parques` permite exportar todos los parques o el parque activo.

La exportacion usa un servicio nuevo, `src/services/occupancy-export.js`, que ordena las filas por sede, tipo de unidad y fecha, y descarga con las mismas reglas del exportador existente: separador `;` y BOM UTF-8 para Excel en español. Los botones por sede quedan deshabilitados cuando esa sede no tiene datos, para no generar CSV vacios que parezcan reportes validos.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/services/occupancy-export.js`, `src/ui/views/data-load.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS, `git diff --check`, servidor local `http://localhost:8055/` respondiendo 200 y prueba Playwright con descargas reales: consolidado completo (`13` filas), Hoteles (`11` filas), Hosteria Los Farallones (`11` filas), Parques (`2` filas); Camping Los Farallones queda con exportacion por sede deshabilitada por falta de datos; sin errores JS.

```text
HANDOFF — SPRINT-22 Exportacion CSV de ocupacion
──────────────────────────────────────
HUs completas:        TO-HU-066
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/services/occupancy-export.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/dashboard.js, budget.js,
                      calendar.js, campaigns.js, contracts.js

Datos/contratos:      Sin cambios en contratos de carga.

Decisiones tomadas:   Se crea `occupancy-export.js` como capa de servicio
                      especifica para ocupacion/inventario, reutilizando el
                      exportador CSV generico de `SPRINT-19`.
                      Los reportes se descargan consolidado, por hoteles,
                      por parques y por sede activa.
                      Si una sede no tiene filas cargadas, su boton de
                      exportacion queda deshabilitado para evitar reportes
                      vacios.

Riesgos residuales:
- El CSV exporta los datos actualmente presentes en memoria/local demo; no
  persiste historico multiusuario ni audita quien descargo el reporte.
- La exportacion por sede depende del nombre normalizado de sede que ya usa
  el tablero. Si Zeus cambia nombres en PDFs futuros, la correccion debe
  hacerse en el parser/normalizador, no en este exportador.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  Playwright descarga CSV consolidado, Hoteles,
                      Hosteria Los Farallones y Parques con header esperado
                      y filas correctas; boton por sede sin datos queda
                      deshabilitado; sin errores JS.
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md
                      actualizados

Auto-reporte DoD:     Completo para TO-HU-066.
```

---

## SPRINT-21 — Dashboard ejecutivo compacto [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** aprovechar mejor el espacio del dashboard general: reemplazar leyendas laterales por informacion grafica, evitar % repetidos y hacer los KPIs mas legibles.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-060 | Lateral de graficas con contenido grafico | Codex | Hecha | Cambia convenciones por resumen visual |
| TO-HU-062 | Quitar % duplicado en presupuesto | Codex | Hecha | Mantiene % junto a barra, quita badge repetido |
| TO-HU-063 | Redistribuir tamaños del dashboard | Codex | Hecha | KPI y bloques con menos aire muerto |
| TO-HU-064 | Sidebar Unidad de Turismo | Codex | Hecha | Ajuste de texto |

### Resumen de cierre

Se corrigio el dashboard para que el espacio lateral de Hoteles/Parques deje de ser una leyenda grande y pase a ser informacion visual: promedio con dato, barra apilada por semaforo, conteo de sedes rojas/amarillas/verdes/sin dato y cobertura de datos. Las convenciones de presupuesto siguen visibles donde son necesarias, pero la ocupacion ahora usa el lateral como grafica de diagnostico.

Tambien se quito la repeticion del % de cumplimiento presupuestal en el encabezado de cada sede del dashboard: el porcentaje queda solo junto a la barra `Real cumplido`, y el valor monetario queda a la derecha. Los KPIs superiores se hicieron mas legibles con valores de 34px y menos aire muerto. En el sidebar, el subtitulo de marca pasa a `Unidad de Turismo`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/index.html`, `src/ui/views/dashboard.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS, `git diff --check`, servidor local `http://localhost:8055/` respondiendo 200 y prueba Playwright: sidebar con `Unidad de Turismo`, KPIs a 34px, lateral de ocupacion con resumen visual, sin convenciones antiguas en ocupacion, proporciones 47%/47%, presupuesto sin badge duplicado, % solo junto a barra, boton de carga a la derecha y sin errores JS.

```text
HANDOFF — SPRINT-21 Dashboard ejecutivo compacto
──────────────────────────────────────
HUs completas:        TO-HU-060, TO-HU-062, TO-HU-063, TO-HU-064
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/index.html
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/hotels.js, parks.js, budget.js,
                      data-load.js, calendar.js, campaigns.js, contracts.js

Datos/contratos:      Sin cambios en contratos de carga.

Decisiones tomadas:   El lateral derecho de Hoteles/Parques en Dashboard ya no
                      muestra convenciones; muestra diagnostico visual de semaforo
                      y cobertura.
                      El % de presupuesto se mantiene solo junto a la barra real;
                      se elimina el badge duplicado por sede.
                      El KPI superior aumenta legibilidad sin cambiar metricas.

Riesgos residuales:
  - El bloque de presupuesto del Dashboard sigue siendo resumen ejecutivo; el
    detalle completo vive en la pestaña Presupuesto restaurada en SPRINT-19.
  - TO-HU-061 sigue pendiente: `Todo 2026` todavia requiere un diseno distinto
    y mas robusto que una suma simple de meses.

Validacion hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Runtime navegador:  http://localhost:8055/ responde 200; Playwright confirma
                      sidebar correcto, lateral con resumen visual, sin %
                      duplicado en presupuesto y sin errores JS.

Auto-reporte DoD:     Completo para TO-HU-060, TO-HU-062, TO-HU-063 y TO-HU-064.
```

---

## SPRINT-20 — Control completo por sede [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** que Hoteles y Parques tengan lectura integrada por sede: operacion, semaforo, accion sugerida y seguimiento presupuestal sin obligar a cambiar de pestaña.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-065 | Parques al nivel de Hoteles | Codex | Hecha | Movimiento anual, cumplimiento mensual y recomendacion |
| TO-HU-069 | Presupuesto dentro de Hoteles | Codex | Hecha | Reusa `domain/budget.js` |
| TO-HU-070 | Presupuesto dentro de Parques | Codex | Hecha | Reusa `domain/budget.js` |

### Resumen de cierre

Se evoluciono el tablero hacia control completo por sede. `src/ui/site-budget-panel.js` es un componente compartido nuevo que muestra presupuesto/ejecutado de la sede activa usando la logica ya restaurada por Claude Code en `domain/budget.js`; si el mes activo no tiene presupuesto, muestra el ultimo periodo cargado con una nota explicita, para no inventar datos ni dejar el bloque vacio. `hotels.js` integra este panel dentro de cada hotel, despues de las metricas operativas y antes de la accion sugerida.

`parks.js` sube de nivel para acercarse a Hoteles: ahora tiene movimiento anual de 12 meses, seleccion de mes, cumplimiento del mes contra meta de uso, presupuesto de sede, accion sugerida y detalle diario del mes activo. Cuando un parque no tiene uso cargado, ya no queda una tabla vacia: muestra accion sugerida gris ("cargar uso operativo") y un estado vacio claro para el detalle diario.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/site-budget-panel.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS, `git diff --check`, servidor local `http://localhost:8055/` respondiendo 200 y prueba Playwright: Hoteles conserva 12 meses, accion sugerida y ahora muestra presupuesto de sede; Parques muestra 12 meses, cumplimiento, presupuesto y accion sugerida tanto en sede sin datos como en sede con datos; Ecoparque Mario Aramburo muestra uso 59.1% y filas de detalle; la pestaña Presupuesto sigue con 9 sedes y exportacion activa.

```text
HANDOFF — SPRINT-20 Control completo por sede
──────────────────────────────────────
HUs completas:        TO-HU-065, TO-HU-069, TO-HU-070
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/ui/site-budget-panel.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/dashboard.js
                      v3-modular/src/ui/views/budget.js
                      v3-modular/src/ui/views/data-load.js, calendar.js,
                      campaigns.js, contracts.js

Datos/contratos:      Sin cambios en contratos de carga.

Decisiones tomadas:   Presupuesto por sede se muestra dentro de Hoteles/Parques
                      reutilizando `domain/budget.js`; si el mes activo no tiene
                      presupuesto, se muestra el ultimo periodo cargado con nota
                      explicita, no un dato inventado.
                      Parques adopta el patron de Hoteles: 12 meses, cumplimiento
                      del mes, accion sugerida y detalle diario del mes activo.

Riesgos residuales:
  - La recomendacion de Parques sigue siendo deterministica por semaforo de uso;
    no usa todavia el motor mas rico de Hoteles (`strategic-recommendation.js`).
  - Cuando ocupacion y presupuesto existen en meses distintos, el panel de sede
    muestra el ultimo presupuesto cargado con nota. Es honesto para el demo, pero
    en produccion conviene cargar ambos contratos para el mismo periodo operativo.

Validacion hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Runtime navegador:  http://localhost:8055/ responde 200; Playwright confirma
                      Hoteles con presupuesto integrado, Parques con 12 meses,
                      cumplimiento, presupuesto, accion sugerida y detalle diario,
                      y Presupuesto sin regresion visible.

Auto-reporte DoD:     Completo para TO-HU-065, TO-HU-069 y TO-HU-070.
```

---

## SPRINT-19 — Seguimiento presupuestal (restauracion de v2) [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** restaurar la pestaña "Seguimiento presupuestal" que existía en v2 y se perdió en la modularización — Luis Felipe la señaló como "bastante completa" en el demo y notó que hoy solo queda repartida dentro de cada Hotel/Parque.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-023 | Vista acumulada mensual | Claude Code | Hecha | Modo "Acumulado" suma todos los periodos cargados por sede |
| TO-HU-024 | Datos no confiables marcados | Claude Code | Hecha | `dato_confiable: no` se muestra "Pendiente de validar", no un % engañoso |
| TO-HU-025 | Exportar reportes por sede y consolidado | Claude Code | Hecha (presupuesto) | Ocupación queda pendiente para otra HU |
| TO-HU-058 | Cargar un mes no borra los meses ya cargados | Claude Code | Hecha | Bug real encontrado: `budgetRows` se sobrescribía en cada carga |
| TO-HU-059 | Pestaña propia "Seguimiento presupuestal" | Claude Code | Hecha | Selector de periodo, comparación a escala común, detalle 12 meses |

### Resumen de cierre

**Qué había en v2 y no existía en v3 (confirmado leyendo el HTML de v2 antes de construir, no de memoria):** selector de mes, gráfico comparativo de las 9 sedes con **escala común** (para comparar tamaño entre sedes, no solo % de cada una), desglose Presupuesto Empresarial vs. Individual, marcado explícito de "dato no confiable" en vez de un % engañoso, detalle desplegable de 12 meses por sede, y exportación CSV (consolidada y por sede). En v3 solo quedaba un fragmento dentro del Dashboard (KPI + comparación de 2 barras del último periodo cargado), sin selector de mes, sin desglose, sin marcado de confiabilidad y sin exportar nada — v3 no tenía ninguna utilidad de exportación CSV en ningún archivo.

**Bug real encontrado y corregido antes de construir la pestaña:** `registerLoad()` en `app-state.js` sobrescribía `appState.budgetRows` completo en cada carga (`appState.budgetRows = acceptedRows`), a diferencia de `occupancyInventoryRows` que sí fusiona por clave. Cargar el presupuesto de un segundo mes borraba el primero. Se corrigió `mergeByKey()` para aceptar un comparador de orden configurable y se aplicó tambien a `budgetExecution` con clave `sede__periodo`. Verificado en navegador: cargado marzo y mayo de Quirama por separado, ambos meses conviven en el detalle y el modo "Acumulado" los suma correctamente (82% cumplido, $1.375.058.812 / $1.123.719.766).

**Qué se construyó:**

- `src/services/csv-export.js` (nuevo): `toCSV()`/`downloadCSV()` genéricos, separador `;` y BOM UTF-8 para Excel en español — mismo patrón que v2 (documentado en `SPRINT-00`).
- `src/domain/budget.js` (nuevo): `summarizeSite()` calcula el resumen de una sede para 3 modos — `latest` (último periodo cargado), `accumulated` (suma de todos los periodos, excluyendo `ejecutado` de filas no confiables) y un mes específico (`2026-01`..`2026-12`). Maneja `dato_confiable` en los tres modos.
- `src/ui/views/budget.js` (nuevo): `renderBudget()`/`bindBudgetHandlers()`. Selector de periodo, leyenda, gráfico comparativo de las 9 sedes a escala común (`Math.max` de presupuesto/ejecutado entre todas las sedes, no por sede — a proposito distinto del `budgetCompareRow()` del Dashboard, que sí escala por sede), y detalle `<details>` de 12 meses por sede con desglose empresarial/individual cuando el archivo lo trae, y botón de exportación individual.
- `src/config/navigation.js`: nuevo item `Presupuesto` (ícono `$`) entre Parques y Calendario comercial.
- `src/main.js`: enlaza `renderBudget`/`bindBudgetHandlers`; los filtros globales (acotados a Dashboard desde `SPRINT-18`) no se tocan — Presupuesto tampoco los muestra.
- `styles/app.css`: `.budget-legend`, `.budget-report-list/-row/-head/-bars/-bar/-label`, `.budget-detail-list/-card/-inner`, `.pending-text`. Clases propias (`budget-report-*`) en vez de reusar `.budget-compare-*` del Dashboard, porque ese componente lo sigue evolucionando Codex (ya tiene 4 columnas desde `SPRINT-16`/`17`) y acoplarme a su forma actual habría sido frágil.

**Decisión deliberada — no se fabricaron datos:** la demo de presupuesto no incluye hoy desglose empresarial/individual ni ninguna fila marcada `dato_confiable: no`. Siguiendo la regla del proyecto de no inventar cifras (`CLAUDE.md`), no se agregaron esos campos a `demo-data.js` solo para mostrar la funcionalidad — la UI ya maneja ambos casos correctamente y se activará en cuanto se cargue un archivo real con esos campos.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/services/csv-export.js` (nuevo), `src/domain/budget.js` (nuevo), `src/ui/views/budget.js` (nuevo), `src/config/navigation.js`, `src/main.js`, `src/state/app-state.js`, `styles/app.css`.

**Validación realizada:** `node --check` en todos los módulos JS; servidor local `localhost:8055` responde 200; navegador: 9 sedes listadas con escala común visible (Quirama notablemente más grande que un parque pequeño), `6 de 9 sedes con dato` correcto, `Hotel Piedras Blancas`/`Parque Piedras Blancas`/`Parque Los Tamarindos` en "Sin dato" honesto; detalle de Quirama expandido muestra 11 meses en "Sin dato" y 1 con dato real; exportación CSV interceptada y verificada (BOM, separador `;`, columnas y % correctos); carga real de un segundo mes de Quirama confirma que el merge ya no borra el primero; las demás 5 vistas (Dashboard, Hoteles, Parques, Calendario, Campañas) siguen respondiendo sin errores de consola tras los cambios compartidos (`app-state.js`, `app.css`).

---

## SPRINT-18 — Correccion de alcance de filtros globales [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** corregir el alcance de los filtros globales de `SPRINT-17` — Luis Felipe reportó que Codex "los puso en todos lados". Los filtros aparecían y en algunos casos afectaban silenciosamente pantallas donde no correspondía.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-057 | Filtros globales acotados solo al Dashboard | Claude Code | Hecha | Corrige sobre-alcance de TO-HU-055 |

### Resumen de cierre

**Qué se encontró (reproducido en navegador antes de tocar código):**

- La barra de filtros (`#globalFilters`) vivía en el layout compartido (`index.html`), fuera de `#appView` — se renderizaba en **las 5 pestañas**, incluyendo Calendario comercial y Campañas, donde ningún archivo lee `appState.filters` — filtros decorativos que no filtraban nada ahí. En Calendario, además, quedaba encima de los filtros propios de Mes/Sede que la pestaña ya tenía, duplicando el concepto.
- En Hoteles, `activeMonth` mezclaba el mes elegido con clic en las 12 barras (`activeMonthByHotelId`, de `SPRINT-14`) con el filtro global de Periodo (`appState.filters.period`) como *fallback* silencioso. Reproducido: con el filtro global en "Marzo 2026" (sin dato para Hostería Los Farallones), la pantalla de Hoteles mostraba **"Sin datos de ocupación"** para esa sede aunque la misma pantalla mostraba 55% en la barra de Agosto, un par de columnas más allá — el usuario no tenía forma de saber por qué, salvo leer una nota chica ("Filtro global: Marzo 2026").
- En Parques, el filtro global de Periodo era la **única** forma de elegir mes (Parques nunca tuvo navegación propia como Hoteles) — quedaba acoplado a un control pensado para comparar sedes en el Dashboard, sin ninguna pista visual en la propia pantalla de Parques.

**Qué cambió:**

- `main.js`: `#globalFilters` solo se renderiza y se enlaza (`bindGlobalFilterHandlers`) cuando `activeView === 'dashboard'`; en cualquier otra vista queda `hidden` y vacío.
- `hotels.js`: se quitó el *fallback* al filtro global en el cálculo de `activeMonth` — vuelve a depender solo de `activeMonthByHotelId` y `latestMonth(rows)`, exactamente como quedó en `SPRINT-14`. Se quitó el import de `monthLabel` (ya sin uso) y la nota "Filtro global: X" volvió a su texto original ("Una barra por mes; gris indica que falta archivo cargado").
- `parks.js`: se quitó la dependencia de `appState.filters.period`; `rowsForPeriod(rows, period)` se simplificó a `latestMonthRows(rows)` — vuelve al comportamiento de antes de `SPRINT-17` (siempre el último mes con dato). Parques sigue sin navegación propia de mes — queda como brecha real, no resuelta en este sprint (ver nota abajo).
- El Dashboard no se tocó: ahí los tres filtros (Periodo/Unidad/Semáforo) sí tienen sentido — es la única pantalla donde se comparan varias sedes a la vez — y siguen funcionando igual que en `SPRINT-17`.

**Brecha que queda pendiente (no es parte de este sprint):** Parques no tiene una navegación de mes propia como la de Hoteles (12 barras). Antes de `SPRINT-17` tampoco la tenía, así que no es una regresión de este sprint — pero vale la pena una HU futura para dar a Parques el mismo patrón de `renderYearMovement` que ya existe en Hoteles.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/main.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`.

**Validación realizada:** `node --check` sobre todos los módulos JS; servidor local `localhost:8055` responde 200; reproducción del bug original en navegador (filtro global en Marzo → Hoteles decía "Sin dato" con 55% visible en Agosto) confirmada **antes** del fix y **corregida después** (Hoteles vuelve a mostrar Agosto/54.9% sin importar el filtro global dejado en el Dashboard); confirmado que `#globalFilters` queda oculto (`hidden = true`) en Hoteles, Parques, Calendario y Campañas, y visible solo en Dashboard; confirmado que Ecoparque Mario Aramburo sigue mostrando 59.1% en Parques; sin errores de consola.

**Nota de coordinación:** este sprint corrige exclusivamente el sobre-alcance introducido en `SPRINT-17` (Codex). No se tocó nada del ajuste visual de convenciones/layout 50-50 de ese mismo sprint, que queda intacto.

---

## SPRINT-17 — Filtros globales y ajuste visual de graficas [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** resolver visualmente los filtros del instrumento, ajustar proporción de graficas/convenciones, mover el boton de carga al header derecho y ubicar el % de presupuesto junto a la barra.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-053 | Graficas con convenciones al lado | Codex | Hecha | Ocupacion ocupa media zona del bloque y convenciones explican color |
| TO-HU-054 | % de presupuesto junto a barra | Codex | Hecha | Separar avance visual de valor monetario |
| TO-HU-055 | Filtros globales | Codex | Hecha | Periodo, tipo de unidad y semaforo visibles en todo el instrumento |
| TO-HU-056 | Boton de carga arriba derecha | Codex | Hecha | Header vuelve a titulo izquierda / accion derecha |

### Resumen de cierre

Se resolvio una segunda capa visual del dashboard general. `index.html` devuelve el boton `Cargar datos` a la esquina superior derecha y agrega el contenedor de filtros globales debajo del header. `src/ui/global-filters.js` crea filtros persistentes de periodo, unidad y semaforo; `src/state/app-state.js` guarda el estado global de esos filtros. `src/main.js` renderiza y enlaza esos controles en todas las vistas.

En `dashboard.js`, las graficas de Hoteles y Parques pasan a un cuerpo 50/50: a la izquierda queda la grafica y a la derecha sus convenciones de color. El presupuesto agrega convenciones propias y mueve el % de ejecucion a una columna junto a la barra de `Real cumplido`, dejando el valor monetario separado. Los KPIs, graficas y presupuesto ya obedecen filtros globales, con `Todo 2026` como valor inicial para no esconder datos de meses distintos en el demo local.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/index.html`, `src/main.js`, `src/state/app-state.js`, `src/ui/global-filters.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS, `git diff --check`, servidor local `http://localhost:8055/` respondiendo 200 y prueba Playwright con navegador: boton arriba derecha, `dataStatus` oculto al inicio, tres filtros globales visibles, graficas de ocupacion con proporcion aprox. 47%/47% grafica-convenciones, presupuesto con % junto a barra, convenciones de presupuesto visibles, sin card/contador de alertas, y filtros cambiando KPIs/presupuesto.

```text
HANDOFF — SPRINT-17 Filtros globales y ajuste visual de graficas
──────────────────────────────────────
HUs completas:        TO-HU-053, TO-HU-054, TO-HU-055, TO-HU-056
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/index.html
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/ui/global-filters.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/data-load.js, calendar.js,
                      campaigns.js, contracts.js

Datos/contratos:      Sin cambios en contratos de carga.

Decisiones tomadas:   Filtro inicial `Todo 2026` para no ocultar datos del demo,
                      porque ocupacion y presupuesto cargados hoy viven en meses
                      distintos.
                      Las graficas de ocupacion usan layout 50/50 con convenciones
                      al lado.
                      El % de ejecucion presupuestal queda junto a la barra; el monto
                      queda como valor separado a la derecha.
                      El boton de carga vuelve a la esquina superior derecha.

Riesgos residuales:
  - Los filtros globales ya afectan dashboard, presupuesto, Hoteles y Parques,
    pero Calendario comercial conserva sus filtros internos propios.
  - El filtro de periodo arranca en `Todo 2026`; si Diana quiere operar siempre
    por mes vigente, habria que cargar fuentes completas del mismo periodo para
    evitar vistas vacias.

Validacion hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Runtime navegador:  http://localhost:8055/ responde 200; Playwright confirma
                      boton derecha, filtros visibles, graficas 50/50 con
                      convenciones, presupuesto con % junto a barra, y filtros
                      actualizando KPIs/presupuesto.

Auto-reporte DoD:     Completo para TO-HU-053, TO-HU-054, TO-HU-055 y TO-HU-056.
```

---

## SPRINT-16 — Dashboard ejecutivo y convenciones [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** corregir el dashboard general para explicar convenciones de color, dar protagonismo vertical a Hoteles/Parques, mejorar presupuesto con % de ejecución y limpiar el estado fijo de carga.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-048 | Convenciones de color | Codex | Hecha | Ocupación 70/40; presupuesto 90/70; gris sin dato/cierre |
| TO-HU-049 | Hoteles y Parques verticales | Codex | Hecha | Bloques separados y gráficas más protagonistas |
| TO-HU-050 | Eliminar contador de alertas | Codex | Hecha | Sale hero status y score de alertas activas |
| TO-HU-051 | Presupuesto con % de ejecución | Codex | Hecha | Real cumplido muestra monto + % |
| TO-HU-052 | Estado de carga no permanente | Codex | Hecha | Pill oculto hasta que exista resultado real |

### Resumen de cierre

Se corrigio el dashboard general con foco en lectura ejecutiva: Hoteles y Parques ya no compiten en dos columnas comprimidas, sino que aparecen como dos bloques verticales de ocupacion/uso con graficas mas grandes. Se agrego un bloque de convenciones para explicar los colores del semaforo: ocupacion/uso en verde desde 70%, amarillo entre 40% y 69%, rojo por debajo de 40%, y gris cuando no hay dato o hay cierre operativo normal; presupuesto en verde desde 90% de ejecucion, amarillo entre 70% y 89%, rojo por debajo de 70%, y gris sin presupuesto cargado.

Tambien se elimino del dashboard el contador de alertas criticas y la tarjeta de "Alertas activas", porque no aportaban una decision clara frente a las graficas y acciones por sede. En presupuesto, la barra de `Real cumplido` ahora muestra monto y porcentaje de ejecucion. En el header, `Cargar datos` queda siempre visible arriba a la izquierda y el pill de estado queda oculto hasta que exista un mensaje real.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/index.html`, `src/main.js`, `src/ui/views/dashboard.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS, `git diff --check`, servidor local `http://localhost:8055/` respondiendo 200 y revision visual con Playwright: header sin estado permanente, convenciones visibles, Hoteles arriba y Parques abajo, presupuesto con % de ejecucion y sin contador de alertas.

```text
HANDOFF — SPRINT-16 Dashboard ejecutivo y convenciones
──────────────────────────────────────
HUs completas:        TO-HU-048, TO-HU-049, TO-HU-050, TO-HU-051, TO-HU-052
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/index.html
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/hotels.js, parks.js, data-load.js,
                      calendar.js, campaigns.js, contracts.js

Datos/contratos:      Sin cambios en contratos de carga.

Decisiones tomadas:   Convenciones visibles en dashboard: ocupacion/uso verde >=70,
                      amarillo 40-69, rojo <40, gris sin dato/cierre; presupuesto
                      verde >=90, amarillo 70-89, rojo <70, gris sin presupuesto.
                      Hoteles y Parques pasan a bloques verticales full-width con
                      graficas mas protagonistas.
                      Se elimina el contador de alertas criticas del hero y el score
                      de Alertas activas.
                      Presupuesto conserva barras Proyectado/Real cumplido y suma
                      % de ejecucion al Real cumplido.
                      El pill de estado del header queda oculto hasta que exista
                      un mensaje real.

Riesgos residuales:
  - Las convenciones de presupuesto quedan definidas por umbrales internos
    90/70 mientras no exista una regla formal de jefatura en fuente externa.
  - El status del header sigue siendo un mecanismo global usado por carga y
    campanas; queda oculto por defecto, pero puede aparecer con eventos reales
    que usen setStatus().

Validacion hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Runtime navegador:  http://localhost:8055/ responde 200; Playwright confirma
                      dataStatus oculto al inicio, convenciones visibles, dos
                      bloques de ocupacion verticales, presupuesto con %, y sin
                      contador de alertas en hero/KPIs.

Auto-reporte DoD:     Completo para TO-HU-048, TO-HU-049, TO-HU-050,
                      TO-HU-051 y TO-HU-052.
```

---

## SPRINT-15 — Retroalimentacion de carga y legibilidad del tablero [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1, E2
- **Objetivo del sprint:** corregir tres problemas de uso reportados por Luis Felipe tras revisar V3 en vivo: la carga de archivos no confirmaba éxito/error, la gráfica diaria de Hoteles era pequeña, y el presupuesto del dashboard no permitía comparar proyectado vs. real de un vistazo.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-045 | Confirmación de carga exitosa/error/formato incompatible | Claude Code | Hecha | Bug real: el mensaje se borraba solo antes de leerse |
| TO-HU-046 | Presupuesto como barras comparables Proyectado/Real | Claude Code | Hecha | Reemplaza la barra de % de relleno |
| TO-HU-047 | Gráfica diaria de Hoteles más grande y legible | Claude Code | Hecha | Contenedor y barras ampliados, valores más grandes |

### Resumen de cierre

**Qué cambió:**

- **Bug real encontrado y corregido (`data-load.js`):** tras una carga exitosa (o parcialmente exitosa), el handler llamaba `rerender()` sobre toda la vista de "Carga de datos", lo que regeneraba las tarjetas de subida desde cero y borraba el mensaje de validación (`"N fila(s) listas para cargar..."`) que él mismo acababa de mostrar — el usuario solo alcanzaba a ver el pill genérico del header, sin color ni énfasis. Como `renderDataLoad()` no depende de ningún dato mutable de `appState`, se quitó el `rerender()` innecesario: el mensaje ahora queda visible, con estado `pending` mientras lee el archivo y `ok`/`warn`/`error` al terminar. `event.target.value` se limpia al final para poder resubir el mismo archivo si hace falta.
- **`main.js`:** `setStatus(text, type)` ahora colorea el pill del header (`ok` verde, `warn` ámbar, `error` rojo, `pending` gris) en vez de un texto plano sin estado visual.
- **`styles/app.css`:** `.status-pill.ok/.warn/.error/.pending` y `.validation-item.pending` nuevos; `.forecast-strip` pasa de 160px a 240px de alto mínimo, columnas de 38px a 48px mínimo, `.forecast-value` de 12px a 14px en negrita 800; `.budget-compare-list/.budget-compare-row/.budget-compare-bars/.budget-compare-bar` nuevos para el presupuesto comparativo.
- **`hotels.js`:** la barra de detalle diario escala `pct * 2` en vez de `pct * 1.25`, usando el nuevo alto disponible del contenedor.
- **`dashboard.js`:** el bloque de presupuesto deja de ser una sola barra de % relleno (`bar-row`) y pasa a `budgetCompareRow()` — dos barras por sede ("Proyectado" y "Real cumplido"), escaladas ambas contra `max(presupuesto, ejecutado)` de esa sede para que la más larga llegue a 100% y la comparación sea proporcional, con el valor en pesos junto a cada barra y el % de cumplimiento como badge.

**Investigación de un cuarto reporte (no reproducido):** Luis Felipe también reportó que el dashboard no se actualiza cuando se carga información en Hoteles. Se probó en vivo (carga real de un CSV de Recinto Quirama vía "Cargar datos", luego navegación a Dashboard) y el dashboard sí reflejó el dato nuevo de inmediato — `renderDashboard()` lee `appState` en cada render, sin caché. La explicación más probable es que el bug de `TO-HU-045` (mensaje de confirmación que desaparecía) generaba la sensación de que la carga no había surtido efecto en ningún lado. Queda para revisión de Luis Felipe si el síntoma persiste después de este sprint con un caso concreto.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js`, `src/main.js`, `src/ui/views/hotels.js`, `src/ui/views/dashboard.js`, `styles/app.css`.

**Validación realizada:** `node --check` en todos los módulos JS; servidor local `localhost:8055` respondió 200; pruebas en navegador simulando carga real de archivo (éxito con fila válida de Quirama, error con `.txt` no soportado) confirmando mensaje visible y con color correcto en ambos casos; revisión visual de la gráfica diaria de Hoteles (Hostería Los Farallones, mes 2026-08) y del bloque de presupuesto comparativo; sin errores en consola.

**Nota de coordinación:** Codex cerró `SPRINT-14` (Hoteles anual y acción sugerida) en paralelo, tocando `hotels.js` y `app.css` — los mismos archivos que yo estaba editando. Se esperó a que Codex comiteara antes de tocar el índice de git (no se hizo `git add` mientras su commit estaba pendiente), pero el commit `3d94152` de Codex sí terminó incluyendo, sin querer, mi cambio de escala del gráfico diario (`pct * 2` en `forecast-column`) porque ya estaba guardado en el mismo archivo cuando Codex hizo `git add hotels.js` — mismo patrón exacto que ya pasó entre `SPRINT-11` y `SPRINT-12`. El contenido quedó correcto (ambos cambios conviven bien, verificado en navegador), solo la atribución del commit no es exacta. Este `SPRINT-15` solo agrega lo que quedó pendiente después de ese commit: `data-load.js`, `main.js`, `dashboard.js`, y el resto de `app.css` (status-pill, validation-item.pending, budget-compare-*).

---

## SPRINT-14 — Hoteles anual y accion sugerida [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** convertir la sección Hoteles en una lectura anual por sede con 12 barras mensuales, detalle diario del mes activo, cumplimiento contra meta y acción sugerida más estratégica.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-042 | Hoteles con 12 barras mensuales | Codex | Hecha | Una barra por mes y detalle diario del mes activo |
| TO-HU-043 | Acción sugerida estratégica | Codex | Hecha | Combina semáforo, cumplimiento mensual y tendencia |

### Resumen de cierre

**Qué cambió:** La sección `Hoteles` ahora muestra, dentro de cada pestaña de hotel, una lectura anual con 12 barras mensuales. El mes activo queda resaltado y debajo aparece una barra de `Cumplimiento del mes` contra la meta de ocupación del 70%. El detalle diario se filtra al mes activo; si el usuario selecciona un mes sin datos, el tablero muestra estado vacío en gris sin romper el contexto. La `Accion sugerida` dejó de depender solo del último día y ahora combina semáforo vigente, cumplimiento mensual y tendencia reciente. Se agregó `src/domain/strategic-recommendation.js` como módulo de dominio para mantener esta lógica separada de la vista y dejar un punto futuro de conexión con IA real.

**HUs trabajadas:** TO-HU-042 y TO-HU-043 quedaron en `Hecha`. TO-HU-044 queda `Pendiente` porque IA permanente real requiere arquitectura fuera del HTML local.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js`, `05-tablero-ocupacion/v3-modular/src/domain/strategic-recommendation.js` y `05-tablero-ocupacion/v3-modular/styles/app.css`.

**Validación realizada:** `node --check` sobre todos los módulos JS; prueba Playwright en `http://localhost:8055/` entrando a `Hoteles`, verificando 12 barras mensuales, `Cumplimiento del mes`, `Accion sugerida`, detalle diario del mes activo y estado vacío al seleccionar un mes sin datos; sin errores de consola; captura visual revisada.

**Decisiones / límites:** La recomendación estratégica de este sprint es determinística y explicable; no llama IA todavía. Esto es intencional: en demo local no existe backend, job programado ni almacenamiento persistente para una IA permanente. El nuevo módulo deja preparada la frontera para que un servicio de IA futuro consuma las mismas entradas y devuelva recomendaciones auditables.

**Pendientes para revisar:** Definir arquitectura de IA permanente: backend/API, frecuencia de análisis tras carga, almacenamiento de recomendaciones, responsable de aprobación y trazabilidad de decisiones.

```text
HANDOFF — SPRINT-14 Hoteles anual y accion sugerida
──────────────────────────────────────
HUs completas:        TO-HU-042, TO-HU-043
HUs pendientes:       TO-HU-044 pendiente: arquitectura de IA permanente
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/domain/strategic-recommendation.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      Sin cambios en contratos. Usa occupancyInventory existente.
Decisiones tomadas:   Hoteles muestra 12 meses + cumplimiento mensual + detalle del mes activo.
                      Accion sugerida queda en motor deterministico explicable.
                      IA permanente se separa como arquitectura pendiente.
Riesgos residuales:
  - Meses sin archivo cargado aparecen en gris; no hay interpolacion.
  - La recomendacion no reemplaza aprobacion humana ni IA real.
  - Para IA permanente faltan backend, jobs, persistencia y auditoria.
Validación hecha:
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Runtime navegador:  Hoteles muestra 12 barras, cumplimiento, accion y detalle -> pass
  Estado sin datos:   mes sin forecast muestra estado vacio -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para TO-HU-042 y TO-HU-043
                      TO-HU-044 queda para decision arquitectonica.
```

---

## SPRINT-13 — Compactar modal de campaña [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** ajustar el modal de creación de campañas para que conserve el patrón de v2, pero con tamaño operativo y menor carga visual.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-041 | Modal compacto de campaña | Codex | Hecha | Reduce ancho, alto, padding, tipografía y agrupa campos secundarios |

### Resumen de cierre

**Qué cambió:** El modal `Agregar campaña al catálogo` se compactó: pasó a 640px de ancho máximo, menor altura visual, padding y tipografías de formulario más sobrias. `Tarifa aplicada` y `Fecha de ejecución` ahora comparten fila en desktop, igual que las ocupaciones, para reducir desplazamiento sin perder campos.

**HUs trabajadas:** TO-HU-041 quedó en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/views/campaigns.js` y `05-tablero-ocupacion/v3-modular/styles/app.css`.

**Validación realizada:** Prueba Playwright en `http://localhost:8055/`: abrir `Campañas`, abrir modal, medir tamaño renderizado (640 x 561 aprox. en 1280x900), guardar campaña y confirmar cálculo de efectividad 120%, sin errores de consola. `git diff --check` y `node --check` sobre módulos JS.

**Decisiones / límites:** Es un ajuste visual/ergonómico; no cambia persistencia, contratos de carga ni el comportamiento de cálculo. En móvil el modal sigue a una columna para evitar campos apretados.

**Pendientes para revisar:** Validación visual final de Luis Felipe sobre proporción del modal en su navegador real.

```text
HANDOFF — SPRINT-13 Compactar modal de campaña
──────────────────────────────────────
HUs completas:        TO-HU-041
HUs pendientes:       ninguna dentro del alcance del sprint
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/ui/views/campaigns.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      Sin cambios.
Decisiones tomadas:   Modal compacto: 640px max, menor padding/tipografía,
                      campos secundarios en dos columnas en desktop.
Riesgos residuales:
  - Proporción visual final depende del navegador/tamaño de pantalla de revisión.
  - Persistencia de campañas sigue pendiente.
Validación hecha:
  Sintaxis:           node --check sobre módulos JS -> pass
  Runtime navegador:  Playwright abre, guarda y calcula efectividad -> pass
  Visual:             modal 640 x 561 aprox. en 1280x900 -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para TO-HU-041
```

---

## SPRINT-12 — Dashboard solo-graficas [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** rediseñar el dashboard general de V3 modular para que sea solo gráficas ordenadas por gravedad, sin listas de texto ni tarjetas detalladas duplicadas con las pestañas Hoteles/Parques, a partir de revisión directa de Luis Felipe con capturas.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-040 | Dashboard solo-gráficas ordenado por gravedad | Claude Code | Hecha | Sin texto, sin tarjetas por sede; detalle vive en Hoteles/Parques |

### Resumen de cierre

**Qué cambió:** `src/ui/views/dashboard.js` se reescribió completo. Se quitó la tarjeta KPI "Sedes con datos" (métrica de instrumento, no de negocio), el panel de texto "Dónde mirar hoy" y las 9 tarjetas detalladas por hotel/parque (duplicaban lo que ya vive en `hotels.js`/`parks.js`). La ocupación se separó en dos gráficas — "Hoteles — ocupación" y "Parques — ocupación / uso" — cada una ordenada de más crítico a mejor (rojo/ámbar primero, gris al final) en vez del orden alfabético anterior, con un sparkline SVG de tendencia por sede construido a partir de las fechas ya cargadas en `occupancyInventoryRows` (dato que existía pero no se usaba). El presupuesto quedó igual pero también ordenado de menor a mayor cumplimiento. `styles/app.css` agrega `.chart-grid`, `.occ-row`, `.trend-svg`/`.trend-empty` y `.score-grid.three`; se retiraron `.dashboard-grid`, `.alert-list`/`.alert-item` y el bloque `.kpi-grid`/`.kpi-card`/… por quedar sin uso.

**HUs trabajadas:** TO-HU-040 quedó en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js`, `05-tablero-ocupacion/v3-modular/styles/app.css` (ajuste puntual de ancho de columna sobre lo ya commiteado en `SPRINT-11`).

**Validación realizada:** `node --check` sobre todos los módulos JS; servidor local `http://localhost:8055/` respondió 200; revisión visual en navegador (Dashboard general con las 3 gráficas y sin las secciones retiradas, capturas confirmadas contra las que Luis Felipe compartió) y verificación de que Hoteles/Parques siguen funcionando sin errores de consola tras el cambio de CSS compartido.

**Decisiones / límites:** El orden por gravedad usa el semáforo (`red`→`amber`→`green`→`gray`) de cada sitio, no un umbral distinto. El sparkline usa hasta 14 puntos más recientes por sede y escala al rango min/max de esos puntos (no a una escala fija 0-100), para que la variación se note incluso en rangos estrechos.

**Nota de coordinación (importante para el proceso):** durante este sprint, Codex cerró en paralelo `SPRINT-11` (modal de campañas) editando el mismo `05-tablero-ocupacion/v3-modular/styles/app.css`. Como ambos editamos el archivo compartido directamente en disco (sin ramas/worktrees), el commit de Codex para `SPRINT-11` (`46e3777`) terminó incluyendo, sin querer, las reglas CSS que yo ya había guardado para este dashboard (`.chart-grid`, `.occ-row`, `.trend-svg`, `.score-grid.three`) — `git add <archivo>` capta el archivo completo, no solo el diff de quien comitea. No se revirtió ni se reescribió el historial: este commit de `SPRINT-12` solo agrega el ajuste que quedó pendiente después de ese commit (ancho de columna de `.occ-row`). Se deja registrado como límite real del proceso de commit-por-sprint cuando dos agentes tocan el mismo archivo en la misma sesión: falta una forma de aislar cambios (worktree por agente, o revisar `git diff` del archivo completo antes de comitear) para que la atribución sea exacta.

---

## SPRINT-11 — Modal de campaña nueva [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** recuperar en V3 modular el patrón modal de v2 para agregar campañas, con captura completa de causa, sede, tarifa, fecha y medición de ocupación.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-039 | Modal de alta de campaña tipo v2 | Codex | Hecha | Reemplaza formulario incrustado por modal con campos completos |

### Resumen de cierre

**Qué cambió:** La vista `Catálogo de campañas` de V3 modular dejó de abrir un formulario incrustado y ahora usa un modal inspirado en el HTML v2: overlay, cabecera verde institucional, botón de cierre, campos amplios, ayuda breve y acciones `Cancelar` / `Guardar campaña`. El alta captura nombre, causa, sede(s), tarifa aplicada, fecha de ejecución y ocupación proyectada/real; cuando existe medición, la tabla calcula efectividad.

**HUs trabajadas:** TO-HU-039 quedó en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/ui/views/campaigns.js`, `05-tablero-ocupacion/v3-modular/src/state/app-state.js` y `05-tablero-ocupacion/v3-modular/styles/app.css`.

**Validación realizada:** `node --check` sobre todos los módulos JS; prueba Playwright en `http://localhost:8055/` abriendo `Campañas`, mostrando el modal, guardando una campaña con 35% proyectado y 42% real, cerrando el modal y calculando 120% de efectividad; captura visual del modal para revisar proporciones; `git diff --check`.

**Decisiones / límites:** El sprint no cambia persistencia: las campañas nuevas siguen viviendo solo en memoria de sesión. No se tocó el HTML v2 ni la versión principal. El campo de fecha usa `type=date`, por lo que el formato visible depende del navegador/localización.

**Pendientes para revisar:** Definir si el catálogo de campañas debe persistir en localStorage, si debe permitir editar/eliminar campañas y si estas altas deben convertirse en bitácora con responsable.

```text
HANDOFF — SPRINT-11 Modal de campaña nueva
──────────────────────────────────────
HUs completas:        TO-HU-039
HUs pendientes:       ninguna dentro del alcance del sprint
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/ui/views/campaigns.js
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      Sin cambios en contratos de carga.
                      Campañas nuevas agregan fecha y ocupación proyectada/real.
Decisiones tomadas:   El alta de campaña vuelve al patrón modal de v2.
                      La tabla calcula efectividad solo con proyectado y real.
Riesgos residuales:
  - La campaña nueva no persiste al recargar; sigue pendiente localStorage o backend.
  - El formato visible de fecha depende del navegador.
  - Falta decisión de edición/eliminación y bitácora con responsable.
Validación hecha:
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Runtime navegador:  Playwright abre modal, guarda campaña y calcula 120% -> pass
  Visual:             captura del modal revisada contra referencia v2 -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para TO-HU-039
                      Persistencia y bitácora quedan para sprint posterior.
```

---

## SPRINT-10 — Carga directa de PDFs Zeus [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** permitir que V3 modular cargue directamente PDFs Forecast Zeus por hotel y fusione la informacion por sede/fecha sin borrar cortes previos.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-037 | Carga directa de PDF Zeus | Codex | Hecha | PDF.js local + parser Zeus integrado a Cargar datos |
| TO-HU-038 | Fusionar cargas por sede/fecha | Codex | Hecha | No borra otras sedes al cargar un hotel |

### Resumen de cierre

**Qué cambió:** V3 modular ahora permite cargar directamente PDFs Forecast Zeus desde el boton `Cargar datos`, en el contrato `Ocupacion e inventario diario`. Se vendorizo PDF.js local en `vendor/pdfjs/`, `file-reader.js` extrae texto del PDF en navegador y lo pasa a `zeus-forecast-parser.js`, que normaliza sede, corte, fecha, habitaciones disponibles, habitaciones ocupadas, inventario total y porcentaje de ocupacion. `app-state.js` ahora fusiona cargas de ocupacion por `sede + tipo_unidad + fecha`, para que cargar Balandu, Quirama y Piedras Blancas no borre Farallones ni otras sedes.

**HUs trabajadas:** TO-HU-037 y TO-HU-038 quedaron en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/domain/data-contracts.js`, `src/services/file-reader.js`, `src/services/zeus-forecast-parser.js`, `src/state/app-state.js`, `src/ui/views/data-load.js`, `vendor/pdfjs/pdf.mjs` y `vendor/pdfjs/pdf.worker.mjs`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; prueba Playwright real en navegador subiendo `Forecast Balandu 1808.pdf`, `Forecast Quirama 1808.pdf` y `Forecast Piedras Blancas 1808.pdf`; verificacion de que cada hotel cargado muestra su pestana con ocupacion compacta y detalle diario.

**Decisiones / límites:** La carga directa PDF queda habilitada solo para `Ocupacion e inventario diario`, porque los PDFs Zeus Forecast tienen estructura hotelera. Presupuesto y reglas Revenue siguen por CSV/JSON. PDF.js queda local para no depender de internet/CDN.

**Pendientes para revisar:** Probar visualmente en navegador con los tres PDFs y decidir si tambien se debe cargar Farallones desde PDF, no desde data semilla.

```text
HANDOFF — SPRINT-10 Carga directa de PDFs Zeus
──────────────────────────────────────
HUs completas:        TO-HU-037, TO-HU-038
HUs pendientes:       ninguna dentro del alcance del sprint
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/domain/data-contracts.js
                      05-tablero-ocupacion/v3-modular/src/services/file-reader.js
                      05-tablero-ocupacion/v3-modular/src/services/zeus-forecast-parser.js
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/vendor/pdfjs/pdf.mjs
                      05-tablero-ocupacion/v3-modular/vendor/pdfjs/pdf.worker.mjs
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      occupancyInventory ahora acepta .csv, .json y .pdf.
                      PDF Zeus se normaliza a sede/fecha/inventario/ocupadas/libres/%/corte.
Decisiones tomadas:   PDF directo solo aplica para Forecast Zeus de hoteles.
                      Cargas de ocupacion se fusionan por sede + unidad + fecha.
                      PDF.js queda vendorizado localmente, sin CDN.
Riesgos residuales:
  - Si Zeus cambia el layout del PDF, el parser puede requerir ajuste.
  - Presupuesto y reglas Revenue siguen sin carga PDF; usan CSV/JSON.
  - La validacion automatica cubrio navegador headless; falta prueba manual de Luis Felipe.
Validación hecha:
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Runtime navegador:  Playwright subio PDFs Balandu, Quirama y Piedras Blancas -> pass
  Fusion de datos:    los tres hoteles cargan sin borrar otras sedes -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para carga directa de PDFs Zeus
                      Prueba manual queda pendiente de Luis Felipe.
```

---

## SPRINT-09 — Dashboard ejecutivo y limpieza de navegación [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** llevar V3 modular a una lectura mas ejecutiva: dashboard tipo Power BI, presupuesto proyectado vs real, campañas editables, navegación con iconos y limpieza de indicadores de ocupación/día.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-010 | Comparar contra meta/presupuesto | Codex | Bloqueada | Presupuesto/meta cubierto; ano anterior requiere fuente cargada |
| TO-HU-022 | Control presupuestal por sede | Codex | Hecha | Absolutos y % de cumplimiento |
| TO-HU-033 | Dashboard visual tipo Power BI | Codex | Hecha | KPIs, barras, alertas y presupuesto en una pantalla |
| TO-HU-034 | Agregar campaña nueva | Codex | Hecha | Alta local en estado de sesion |
| TO-HU-035 | Menu con iconos y sin estructura tecnica | Codex | Hecha | Removida Estructura de archivos del menu |
| TO-HU-036 | Ocupacion compacta y dia real | Codex | Hecha | 26 de 48 (54.1%) y lunes/martes |

### Resumen de cierre

**Qué cambió:** Se ajusto V3 modular para que el dashboard general tenga lectura ejecutiva tipo Power BI: banda principal, KPIs de ocupacion, sedes con datos, alertas y presupuesto ejecutado. Se agrego control presupuestal proyectado vs real por sede con absolutos (`ejecutado de presupuesto`) y porcentaje. Se elimino `Estructura de archivos` de la navegacion lateral y se agregaron iconos a cada seccion. En Hoteles se unieron ocupadas e inventario en un solo indicador (`26 de 48 (54.1%)`) y la tabla diaria ahora muestra el dia real (`Lunes`, `Martes`, etc.) en vez de etiquetas tecnicas como `entre_semana`. En Campanas se agrego el boton `Agregar campaña nueva` y un formulario compacto para sumar campanas en la sesion local.

**HUs trabajadas:** TO-HU-022, TO-HU-033, TO-HU-034, TO-HU-035 y TO-HU-036 quedaron en `Hecha`. TO-HU-010 queda `Bloqueada` solo por el tramo de comparacion contra ano anterior, porque falta fuente historica cargada; el comparativo contra presupuesto/meta quedo cubierto por TO-HU-022.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/config/navigation.js`, `src/main.js`, `src/domain/operational-calendar.js`, `src/state/app-state.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`, `src/ui/views/campaigns.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; prueba de render de dashboard/hoteles/parques/campanas; verificacion de que la navegacion ya no contiene `contracts` ni `Estructura de archivos`; verificacion de que el dashboard no contiene `Calendario operativo 2026`; prueba de dia real `Martes`; servidor local `http://localhost:8055/` responde 200; `git diff --check`.

**Decisiones / límites:** El alta de campanas queda en memoria de sesion, no persistente en localStorage. No se elimino el archivo tecnico `contracts.js`; se retiro la seccion de navegacion visible para usuario. La comparacion contra ano anterior no se implemento porque no hay fuente historica cargada en V3.

**Pendientes para revisar:** Definir persistencia de campanas, bitacora de ejecucion y fuente/contrato para ano anterior.

```text
HANDOFF — SPRINT-09 Dashboard ejecutivo y limpieza de navegación
──────────────────────────────────────
HUs completas:        TO-HU-022, TO-HU-033, TO-HU-034, TO-HU-035, TO-HU-036
HUs pendientes:       TO-HU-010 bloqueada parcialmente por fuente de año anterior
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/config/navigation.js
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/src/domain/operational-calendar.js
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/campaigns.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
                      05-tablero-ocupacion/v3-modular/src/ui/views/contracts.js
Datos/contratos:      Presupuesto vs ejecutado usa appState.budgetRows.
                      Campanas nuevas se agregan a appState.campaignRows.
Decisiones tomadas:   Estructura de archivos sale del menu visible.
                      Ocupadas + inventario se muestran en un solo indicador.
                      Dia visible usa nombre de semana, no tipo tecnico.
                      Dashboard prioriza lectura ejecutiva tipo Power BI.
Riesgos residuales:
  - Agregar campaña nueva no persiste al recargar; falta localStorage o backend.
  - TO-HU-010 no queda completa por falta de fuente de año anterior.
  - Falta revision visual de Luis Felipe en navegador.
Validación hecha:
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Render/flujo:       dashboard + hoteles + parques + campañas -> pass
  Navegación:         sin contracts/Estructura de archivos visible -> pass
  Servidor local:     http://localhost:8055/ responde 200 -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para HUs cerradas
                      Parcial en TO-HU-010 por fuente histórica pendiente.
```

---

## SPRINT-08 — Estructura gris, hoteles/parques y lectura Zeus [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1, E2
- **Objetivo del sprint:** corregir la estructura visual de V3 para que todas las sedes existan aunque no tengan datos, mover el calendario operativo fuera del dashboard, llevar Hoteles/Parques al mismo patron y aclarar como se interpretan los PDFs Zeus por sede.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-009 | Dashboard con estructura completa por sede | Codex | Hecha | Todas las sedes visibles; sin dato en gris |
| TO-HU-013 | Hoteles con ocupacion mensual y detalle diario | Codex | Hecha | Arriba mes, abajo detalle diario del mes |
| TO-HU-014 | Parques con pestañas por sede | Codex | Hecha | La seccion se llama Parques |
| TO-HU-015 | Parques con metricas equivalentes | Codex | Hecha | Capacidad/uso/libres/alarma en gris si falta dato |
| TO-HU-031 | Estructura visible sin datos | Codex | Hecha | Placeholder gris en dashboard, hoteles y parques |
| TO-HU-032 | Interpretacion de archivos Zeus | Codex | Hecha | Analisis de PDFs adjuntos y parser modular de texto Zeus |

### Resumen de cierre

**Qué cambió:** Se corrigio V3 modular para que el instrumento muestre toda la estructura aunque falte data: el dashboard lista Hoteles y Parques con tarjetas grises cuando una sede no tiene archivo cargado. `Calendario operativo 2026` salio del dashboard general y quedo dentro de `Calendario comercial`. `hotels.js` ahora muestra `Ocupacion del mes` arriba y abajo el detalle diario del mes. `parks.js` se rehizo con el mismo patron de Hoteles: pestañas por parque, uso del mes, capacidad, usados/libres, dia operativo y detalle diario. `data-load.js` explica como se interpreta un PDF Zeus por hotel y deja visible la brecha real: la carga directa de PDF requiere incorporar extractor PDF local. Se agrego `zeus-forecast-parser.js` para convertir texto extraido de Zeus en filas `occupancyInventory`.

**HUs trabajadas:** TO-HU-009, TO-HU-013, TO-HU-014, TO-HU-015, TO-HU-031 y TO-HU-032 quedaron en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/config/navigation.js`, `src/main.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`, `src/ui/views/calendar.js`, `src/ui/views/data-load.js`, `src/services/zeus-forecast-parser.js` y `styles/app.css`.

**Validacion realizada:** extraccion de texto con `pdfplumber` de `Forecast Balandu 1808.pdf`, `Forecast Quirama 1808.pdf` y `Forecast Piedras Blancas 1808.pdf`; prueba del parser Zeus contra los tres textos extraidos; `node --check` sobre todos los modulos JS; prueba de render de dashboard/hoteles/parques/calendario/carga; verificacion de que `Calendario operativo 2026` no aparece en dashboard y si aparece en calendario; `git diff --check`.

**Decisiones / límites:** No se cargaron los PDFs como datos semilla para no falsear el estado: si no se cargan por flujo, Balandu, Quirama y Piedras Blancas siguen en gris. El parser ya interpreta texto Zeus por sede, corte y filas diarias, pero la extraccion PDF dentro del navegador queda pendiente porque V3 local no trae todavia una libreria tipo PDF.js ni backend.

**Pendientes para revisar:** Decidir si el siguiente sprint incorpora PDF.js local para subir PDF Zeus directamente o si la operacion estandar sera convertir/exportar desde Zeus a CSV antes de cargar.

```text
HANDOFF — SPRINT-08 Estructura gris, hoteles/parques y lectura Zeus
──────────────────────────────────────
HUs completas:        TO-HU-009, TO-HU-013, TO-HU-014, TO-HU-015,
                      TO-HU-031, TO-HU-032
HUs pendientes:       ninguna dentro del alcance del sprint
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/config/navigation.js
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/calendar.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/src/services/zeus-forecast-parser.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      PDFs Zeus revisados: Forecast Balandu 1808,
                      Forecast Quirama 1808, Forecast Piedras Blancas 1808.
                      Parser convierte texto Zeus a occupancyInventory.
Decisiones tomadas:   sedes sin data quedan visibles en gris;
                      dashboard general no contiene Calendario operativo 2026;
                      Hoteles y Parques comparten estructura de pestañas/metricas;
                      PDF directo queda identificado como brecha tecnica real.
Riesgos residuales:
  - V3 local aun no extrae PDF directamente en navegador; necesita PDF.js local
    o conversion previa a CSV/JSON.
  - Los PDFs adjuntos se usaron para validar interpretacion, no se cargaron
    como datos semilla del tablero.
  - Falta revision visual de Luis Felipe navegando todas las pestañas.
Validación hecha:
  PDFs:               pdfplumber extrajo texto de los tres Forecast Zeus -> pass
  Parser Zeus:        Balandu 14 filas, Quirama 15, Piedras Blancas 15 -> pass
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Render/flujo:       dashboard + hoteles + parques + calendario + carga -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para alcance SPRINT-08
                      Carga directa PDF queda como siguiente decision tecnica.
```

---

## SPRINT-07 — Confianza del semáforo y reglas operativas [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** cerrar la confianza operativa del semaforo en V3 modular: umbrales, cierres normales, festivos/temporada y recomendaciones de Revenue accionables.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-017 | Umbrales Revenue del semaforo | Codex | Hecha | Estándar >=70, Preventa 40-69, Mas cerca <40 validado |
| TO-HU-018 | Cierres, festivos y temporada | Codex | Hecha | Regla de v2 portada y calendario operativo visible |
| TO-HU-020 | Baja ocupacion sugiere campana/tarifa | Codex | Hecha | Preventa/Mas cerca recomiendan campana o proteccion segun calendario |
| TO-HU-021 | Alta ocupacion protege tarifa | Codex | Hecha | Alta demanda protege tarifa y sugiere incremento futuro |

### Resumen de cierre

**Qué cambió:** Se cerro la logica de confianza del semaforo en V3 modular. `occupancy.js` ahora clasifica con los umbrales de Revenue del producto (`>=70` Estandar, `40-69` Preventa, `<40` Mas cerca) y devuelve contexto operativo. Se agregaron `colombia-holidays-2026.js` y `operational-calendar.js` para distinguir cierre operativo normal, festivo, temporada alta, fin de semana y entre semana. `dashboard.js` muestra calendario operativo 2026 y anota el tipo de dia en alertas/tarjetas. `hotels.js` muestra `Dia operativo` dentro de la pestaña de cada hotel.

**HUs trabajadas:** TO-HU-017, TO-HU-018, TO-HU-020 y TO-HU-021 quedaron en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/data/colombia-holidays-2026.js`, `src/domain/operational-calendar.js`, `src/domain/occupancy.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; prueba de reglas con casos limite 70/40/39, domingo cierre, lunes festivo no cierre, festivo de octubre y temporada alta; prueba de render de dashboard/hoteles/calendario/campanas; busqueda negativa de frases internas no aptas para producto; `git diff --check`.

**Decisiones / límites:** Los festivos oficiales de Colombia 2026 se migraron desde v2. Las ventanas de temporada alta quedaron como reglas iniciales de producto: Semana Santa, mitad de ano, receso escolar y fin de ano. En baja ocupacion durante festivo o temporada alta, la recomendacion protege tarifa antes de descontar para evitar decisiones contraintuitivas.

**Pendientes para revisar:** Confirmar con Diana/Comercial si las ventanas de temporada alta deben ampliarse por sede y si Quirama requiere regla distinta por su mezcla individual/empresarial.

```text
HANDOFF — SPRINT-07 Confianza del semáforo y reglas operativas
──────────────────────────────────────
HUs completas:        TO-HU-017, TO-HU-018, TO-HU-020, TO-HU-021
HUs pendientes:       ninguna dentro del alcance del sprint
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/data/colombia-holidays-2026.js
                      05-tablero-ocupacion/v3-modular/src/domain/operational-calendar.js
                      05-tablero-ocupacion/v3-modular/src/domain/occupancy.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      Festivos Colombia 2026 migrados desde FESTIVOS_COLOMBIA_2026 de v2
                      Ventanas iniciales de temporada alta en operational-calendar.js
Decisiones tomadas:   domingo/lunes sin festivo = cierre operativo normal;
                      lunes festivo no se trata como cierre;
                      festivo/temporada alta protege tarifa antes de descontar.
Riesgos residuales:
  - Las ventanas de temporada alta son reglas iniciales; deben validarse con
    Comercial y con cada sede antes de tratarlas como politica definitiva.
  - Quirama puede necesitar una regla separada para negocio empresarial vs.
    individual; este sprint no modela ese split.
  - La validacion fue tecnica/render local; falta revision visual de Luis Felipe
    navegando el tablero en navegador.
Validación hecha:
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Reglas:             70/40/39, domingo cierre, lunes festivo, festivo octubre,
                      temporada alta -> pass
  Render/flujo:       dashboard + hoteles + calendario + campañas renderizan -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para alcance SPRINT-07
                      Revisión visual y validación comercial de temporada quedan pendientes.
```

---

## SPRINT-06 — Recuperar calendario y campañas en V3 [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** recuperar en V3 modular las secciones de calendario comercial y catalogo de campanas que existian en v2, y conectarlas con las alertas de ocupacion.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-028 | Calendario comercial como seccion propia | Codex | Hecha | Datos de v2 migrados a modulo y vista con filtros |
| TO-HU-029 | Catalogo de campanas como seccion propia | Codex | Hecha | Campanas de v2 migradas a modulo y vista propia |
| TO-HU-030 | Alertas conectadas a campanas y calendario | Codex | Hecha | Dashboard/hoteles muestran contexto comercial aplicable |

### Resumen de cierre

**Qué cambió:** Se recuperaron en V3 modular las secciones `Calendario comercial` y `Catalogo de campanas` que existian en v2. Los datos dejaron de vivir dentro del HTML monolitico y quedaron separados como modulos (`commercial-calendar.js` y `campaigns.js`). Se agrego una capa de dominio (`commercial-context.js`) para cruzar sede, mes, tramo del semaforo y campanas aplicables.

**HUs trabajadas:** TO-HU-028, TO-HU-029 y TO-HU-030 quedaron en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/data/commercial-calendar.js`, `src/data/campaigns.js`, `src/domain/commercial-context.js`, `src/state/app-state.js`, `src/config/navigation.js`, `src/main.js`, `src/ui/views/calendar.js`, `src/ui/views/campaigns.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; prueba de render/import de dashboard, hoteles, calendario y campanas; verificacion de navegacion (`dashboard`, `hotels`, `parks`, `calendar`, `campaigns`, `contracts`); busqueda negativa de frases internas no aptas para producto (`S1 fija`, `contrato unico`, `V3 ya lee`, `Tablero listo`, `Demo local modular`).

**Decisiones / límites:** Esta recuperacion priorizo no perder capacidades buenas de v2 antes de seguir con nuevas metricas. El catalogo queda como vista de consulta y contexto de decision; la creacion/edicion de campanas y bitacora de ejecucion siguen pendientes para TO-HU-026. El calendario queda filtrable por mes y sede, pero aun no cruza festivos/temporada alta de forma automatica.

**Pendientes para revisar:** Completar presupuesto por sede dentro de Hoteles/Parques y definir si el catalogo de campanas debe permitir edicion local, aprobacion o solo consulta.

```text
HANDOFF — SPRINT-06 Recuperar calendario y campañas en V3
──────────────────────────────────────
HUs completas:        TO-HU-028, TO-HU-029, TO-HU-030
HUs pendientes:       ninguna dentro del alcance del sprint
Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/data/commercial-calendar.js
                      05-tablero-ocupacion/v3-modular/src/data/campaigns.js
                      05-tablero-ocupacion/v3-modular/src/domain/commercial-context.js
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/config/navigation.js
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/calendar.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/campaigns.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
Archivos NO tocados:  05-tablero-ocupacion/tablero-seguimiento-ocupacion.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v2.html
                      05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html
Datos/contratos:      72 actividades migradas desde CALENDARIO de v2
                      4 campañas migradas desde CAMPAIGNS_DEFAULT de v2
Decisiones tomadas:   calendario y campañas quedan como módulos de datos y vistas propias;
                      las alertas del semáforo muestran contexto comercial aplicable.
Riesgos residuales:
  - El catálogo es de consulta: crear/editar campañas y bitácora de ejecución
    siguen pendientes para TO-HU-026.
  - El calendario filtra por mes/sede, pero aún no cruza automáticamente
    festivos, temporada alta o cierres operativos.
  - La validación fue técnica/render local; falta revisión visual de Luis Felipe
    navegando todas las pestañas en navegador.
Validación hecha:
  Sintaxis:           node --check sobre todos los módulos JS -> pass
  Render/flujo:       dashboard + hoteles + calendario + campañas importan/renderizan -> pass
  Navegación:         dashboard, hoteles, parques, calendar, campaigns, contracts -> pass
  Servidor local:     http://localhost:8055/ responde 200 -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados
Auto-reporte DoD:     Completo para alcance SPRINT-06
                      Revisión visual de producto queda pendiente de Luis Felipe.
```

---

## SPRINT-05 — Correccion de seriedad y contexto operativo V3 [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** corregir V3 para que se lea como tablero de control serio: carga de datos como accion primaria, lenguaje no tecnico, semaforo con contexto y analisis por hotel.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-008 | Dashboard general con alerta/riesgo | Codex | Hecha | Lenguaje de producto, sin referencias a sprint/contrato |
| TO-HU-011 | Hoteles con pestaña por hotel | Codex | Hecha | Pestañas internas por hotel en la seccion Hoteles |
| TO-HU-012 | Métricas operativas por hotel | Codex | Hecha | Ocupacion vigente, inventario, ocupadas, libres y accion |
| TO-HU-016 | Semáforo definido en v2 | Codex | Hecha | Semaforo solo cuando hay dato; si no, estado pendiente |
| TO-HU-019 | Acción sugerida por alarma | Codex | Hecha | Accion comercial junto al tramo/alarma |

### Resumen de cierre

**Qué cambió:** Se corrigio V3 para que no hable como prototipo tecnico. `index.html` cambia el titulo y el texto de marca a ocupacion/presupuesto; la accion `Cargar datos` sale del menu lateral y queda como boton primario verde claro en el header. `dashboard.js` elimina frases como “Tablero listo para revisar datos de S1” y “V3 ya lee un contrato unico...” y las reemplaza por lenguaje operativo. `hotels.js` recupera analisis por hotel con pestanas internas, metricas de ocupacion/inventario, serie diaria, semaforo contextual y accion sugerida. `parks.js` deja de mostrar semaforo sin dato; usa estado pendiente cuando falta informacion.

**HUs trabajadas:** TO-HU-008, TO-HU-011, TO-HU-012, TO-HU-016 y TO-HU-019 quedaron en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/index.html`, `src/config/navigation.js`, `src/main.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`, `src/ui/views/data-load.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; prueba de render de dashboard/hoteles/parques/carga; busqueda negativa de frases tecnicas (`S1`, `contrato unico`, `V3 ya lee`, `Tablero listo`); verificacion de que `data-load` ya no aparece como item de navegacion lateral; `git diff --check`.

**Decisiones / límites:** Esta correccion mejora la seriedad y recupera analisis por hotel, pero no completa aun las vistas ejecutivas mensual/trimestral ni comparacion contra ano anterior. `Estructura de archivos` sigue disponible como vista secundaria porque aun se necesita para revisar plantillas y fuentes.

**Pendientes para revisar:** Siguiente paso natural: completar presupuesto/cumplimiento dentro de las pestanas por hotel y luego extender el mismo patron a Parques.

---

## SPRINT-04 — S1 modelo de datos y carga por archivo V3 [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1 (datos, inventario y fuentes)
- **Objetivo del sprint:** iniciar S1 sobre V3 dejando contratos de archivo, validaciones y trazabilidad de fuente para ocupación/inventario, presupuesto y Revenue.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-001 | Cargar archivos de ocupación por sede | Codex | Hecha | Flujo principal por archivo, no copiar/pegar |
| TO-HU-002 | Subir inventario diario ocupado/libre | Codex | Hecha | Inventario total, ocupado, libre por fecha y unidad |
| TO-HU-003 | Validar columnas, fechas, sede y unidad | Codex | Hecha | Validaciones antes de aceptar datos |
| TO-HU-004 | Mostrar errores claros por fila/columna | Codex | Hecha | Resultado de carga auditable con detalle por fila |
| TO-HU-005 | Modelo de inventario total/ocupado/libre/% | Codex | Hecha | Base del tablero de control |
| TO-HU-006 | Diferenciar habitación/cabaña/camping/sitio/cupo | Codex | Hecha | Hoteles y parques no se mezclan |
| TO-HU-007 | Conservar fuente, fecha de corte y periodo | Codex | Hecha | Contratos exigen fuente y fecha de corte |

### Resumen de cierre

**Qué cambió:** V3 modular quedo con S1 implementado sobre contratos de archivo. `data-contracts.js` reemplazo los contratos iniciales por tres contratos de producto: `occupancyInventory` para ocupacion e inventario diario, `budgetExecution` para presupuesto/ejecucion y `revenueRules` para reglas de Revenue. Se agregaron plantillas CSV descargables para los tres contratos y la vista de carga ahora muestra fuente esperada, grano, columnas obligatorias y errores por fila. El validador ahora revisa formato, columnas, sede reconocida, tipo de sede/unidad, fechas, periodo, numericos, porcentajes, cuadratura de inventario y umbrales de Revenue.

**HUs trabajadas:** TO-HU-001, TO-HU-002, TO-HU-003, TO-HU-004, TO-HU-005, TO-HU-006 y TO-HU-007 quedaron en `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/README.md`, `05-tablero-ocupacion/v3-modular/src/domain/data-contracts.js`, `src/domain/sites.js`, `src/services/validators.js`, `src/state/app-state.js`, `src/data/demo-data.js`, `src/ui/views/data-load.js`, `src/ui/views/contracts.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`, y las plantillas `v3-modular/templates/*.csv`.

**Validacion realizada:** `node --check` sobre todos los modulos JS de V3; prueba de import/render de `dashboard`, `data-load` y `contracts`; prueba positiva/negativa del contrato `occupancyInventory`; validacion de las tres plantillas CSV; `git diff --check`.

**Decisiones / límites:** S1 no construye todavia las pestanas completas por hotel/parque ni reemplaza visualmente v2. Deja lista la base de datos para que S2/S3/S4 construyan dashboard general, hoteles y parques sobre datos confiables. Los archivos `.xlsx` siguen como fuente de negocio, pero V3 local acepta `.csv` y `.json` mientras no se incorpore una libreria de lectura XLSX.

**Pendientes para revisar:** antes de S2 conviene confirmar si `Power BI Hoteles.pbix` se llamara asi o tiene otro nombre en Drive, y si `Parque Los Tamarindos` entra formalmente al alcance o queda como sede pendiente de validar.

---

## SPRINT-03 — Demo v3 abrible y comparable con v2 [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-18
- **Fecha cierre:** 2026-08-18
- **Épica(s):** EP-05 (tablero de ocupación HTML)
- **Objetivo del sprint:** corregir la entregabilidad de v3 para que abra localmente y sea comparable con el demo v2, manteniendo la fuente modular como base de desarrollo.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| HU-049 | V3 de demo local fácil de abrir | Codex | Hecha | `tablero-seguimiento-ocupacion-v3-demo.html` abre por doble clic |
| HU-050 | V3 comparable visual y funcionalmente con v2 | Codex | Hecha | Demo v3 se basa en v2 para no perder semaforos, seguimientos ni metricas |

### Resumen de cierre

Se corrigio la entrega de v3 porque la version modular pura no era suficiente para revision: por usar modulos ES, no siempre abre desde `file://`, y visualmente seguia lejos del demo v2. Se creo `05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html` como artefacto autocontenido basado en v2, con el sistema visual, semaforos, seguimientos, metricas, autenticacion local y secciones existentes del demo que ya funcionaba. Tambien se agrego `05-tablero-ocupacion/abrir-v3-modular.command` para abrir la fuente modular en servidor local cuando se quiera revisar la arquitectura.

**HUs trabajadas:** HU-049 y HU-050.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/tablero-seguimiento-ocupacion-v3-demo.html`, `05-tablero-ocupacion/abrir-v3-modular.command`, `05-tablero-ocupacion/v3-modular/README.md`.

**Validacion:** permisos ejecutables del lanzador (`chmod +x`), revision de presencia de encabezado v3 demo, extraccion y validacion sintactica del JavaScript embebido con `node --check`, y `git diff --check`.

**Decision / limite:** `tablero-seguimiento-ocupacion-v3-demo.html` es el archivo correcto para revisar por doble clic. `v3-modular/` sigue siendo fuente tecnica en desarrollo, no reemplazo visual ni version para usuario final.

**Pendiente para siguiente sprint:** definir un flujo de build/exportacion para que los modulos generen un HTML autocontenido sin volver a trabajar a mano sobre un monolito.

---

## SPRINT-02 — Recuperar fidelidad visual y decisional del demo modular [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-18
- **Fecha cierre:** 2026-08-18
- **Épica(s):** EP-05 (tablero de ocupación HTML)
- **Objetivo del sprint:** mantener la base modular, pero recuperar el sistema visual, semáforos, métricas y señales de decisión que la versión modular inicial perdió frente a v2.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| HU-044 | Dashboard general de decisión como primera pantalla | Codex | Hecha | Primera vista con banda de decisión, métricas, alertas y KPIs por hotel |
| HU-045 | Gráficos visuales de forecast, brechas y alertas | Codex | Hecha | Barras de forecast, serie Farallones, cumplimiento presupuestal y semáforos |
| HU-048 | Conservar sistema de diseño y patrones visuales de v2 | Codex | Hecha | Tokens de marca restaurados desde v2 y contrastados con sitio oficial |

### Resumen de cierre

Se corrigio la base modular inicial porque habia perdido demasiada fidelidad frente al demo v2. `v3-modular/styles/app.css` recupera la paleta institucional usada en v2 (`#005744`, `#C4D600`, fondo calido, sidebar verde, tarjetas KPI y semaforo real de tres luces). Se agrego `src/data/demo-data.js` con datos semilla reales del forecast de Hosteria Los Farallones y cortes presupuestales disponibles, para que el dashboard no arranque vacio. `src/ui/views/dashboard.js` ahora muestra una primera pantalla decisional: banda de accion, metricas, alertas, tarjetas por hotel, serie visual de forecast y cumplimiento presupuestal. Validacion realizada: `node --check` sobre todos los modulos JS, prueba de render de dashboard, prueba negativa de contrato de forecast y `git diff --check`.

---

## SPRINT-01 — Base modular y contrato de datos del tablero [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-18
- **Fecha cierre:** 2026-08-18
- **Épica(s):** EP-05 (tablero de ocupación HTML)
- **Objetivo del sprint:** detener el crecimiento del HTML monolítico creando una versión modular paralela, con contratos explícitos de carga de archivos para hoteles y parques.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| HU-037 | Contrato de datos para archivos de hoteles y parques | Codex | Hecha | Contratos en `v3-modular/src/domain/data-contracts.js` |
| HU-038 | Subir archivo de forecast Zeus con validación | Codex | Hecha | Carga CSV/JSON con validacion de columnas/filas; XLSX queda pendiente por dependencia de lector |
| HU-040 | Formato propio para parques de pasadía | Codex | Hecha | Contrato separado de visitantes, aforo e ingresos |
| HU-041 | Versión modular paralela del tablero | Codex | Hecha | `05-tablero-ocupacion/v3-modular/`, sin reemplazar principal ni v2 |
| HU-042 | Separar dominio, servicios y vistas UI | Codex | Hecha | Modulos `domain`, `services`, `state`, `ui/views` |
| HU-043 | Mapa técnico actualizado de versión modular | Codex | Hecha | `MAPA_CODIGO.md` actualizado |

### Resumen de cierre

Se creo `05-tablero-ocupacion/v3-modular/` como base paralela para dejar de crecer el HTML monolitico. La version modular incluye `index.html`, CSS separado, modulos ES para navegacion, contratos de datos, reglas de ocupacion, lectura/validacion de archivos, estado y vistas. La carga principal ya se plantea por archivos CSV/JSON normalizados, no por copiar/pegar texto del PDF. Se definieron contratos separados para forecast hotelero, parques de pasadia y presupuesto/ejecucion. Validacion realizada: `node --check` sobre todos los modulos JS y prueba con CSV minimo de hotel y parque. Servidor local de prueba: `http://localhost:8055/`.

---

## SPRINT-00 — Línea base del tablero de ocupación (retroactivo) [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-07-20 (primera versión del tablero)
- **Fecha cierre:** 2026-08-18 (fecha en que se instala esta metodología)
- **Épica(s):** EP-05 (tablero de ocupación HTML)
- **Objetivo del sprint:** todo el trabajo hecho sobre `05-tablero-ocupacion/` **antes** de que existiera este proceso formal de Scrum. Se documenta acá como línea base para que Codex (o cualquier sesión nueva de Claude Code) entienda de dónde parte el proyecto, sin tener que leer todo el historial de conversación.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| HU-009 | Estructura base del tablero, datos reales de tarifas/presupuesto/calendario/campañas | Claude Code | Hecha | Un solo archivo HTML autocontenido, sin backend |
| HU-010 | Calendario comercial y catálogo de campañas editables | Claude Code | Hecha | Incluye corrección de terminología ("sin costo", no "gratis") |
| HU-011 | Persistencia localStorage + exportar/importar | Claude Code | Hecha | Base del respaldo JSON actual |
| HU-012 | Paleta e identidad visual real de Comfenalco Antioquia | Claude Code | Hecha | Colores extraídos del sitio real, no inventados |
| HU-013 | Semáforo real de 3 luces (rojo/ámbar/verde) | Claude Code | Hecha | Reemplazó el indicador de color simple inicial |
| HU-014 | Comparación ocupación proyectada vs. real (absoluto y %) | Claude Code | Hecha | Objetivo de referencia: umbral del tramo Estándar (70%) |
| HU-015 | Motor de recomendación estratégica (mantener/promocional/subir tarifa) | Claude Code | Hecha | Cubre las dos direcciones: bajar precio y subir precio |
| HU-016 | Login con identificación de usuario | Claude Code | Hecha | No es seguridad real — ver aviso en el propio login |
| HU-017 | Gestión de usuarios y roles (Admin/Editor/Visualizador) | Claude Code | Hecha | Contraseñas y respuestas cifradas (SHA-256, Web Crypto) |
| HU-018 | Recuperación de contraseña por pregunta de seguridad | Claude Code | Hecha | Alternativa: admin resetea desde Gestión de usuarios |
| HU-019 | Forecast diario de Zeus (serie por día, no un solo valor) | Claude Code | Hecha | Reemplazó el campo único "ocupación proyectada" |
| HU-020 | Capacidad real de habitaciones y habitaciones absolutas | Claude Code | Hecha | Confirmada para Hostería Los Farallones: 48 habitaciones |
| HU-021 | Cierre operativo normal (domingo/lunes sin festivo) | Claude Code | Hecha | Confirmado con Luis Felipe: aplica a domingo Y lunes |
| HU-022 | Calendario de festivos Colombia 2026 | Claude Code | Hecha | Calculado con Ley Emiliani, verificado contra fechas ya usadas en el proyecto |
| HU-023 | Aviso automático de patrón semanal | Claude Code | Hecha | Excluye días de cierre operativo del cálculo |
| HU-024 | Importar forecast de Zeus pegando texto del PDF | Claude Code | Hecha | Parser reconoce el formato real del "Informe de Forecast Global" |
| HU-025 | Autodetección de capacidad y fecha de corte al pegar | Claude Code | Hecha | Solo si el valor es constante en todas las filas pegadas |
| HU-026 | Exportar reportes en CSV en vez de JSON | Claude Code | Hecha | Separador `;` para compatibilidad con Excel en español |
| HU-027 | Exportación CSV individual por sede/parque | Claude Code | Hecha | En Ocupación (4 hoteles) y en Seguimiento presupuestal (8 sedes) |
| HU-028 | Clarificar JSON (respaldo) vs. CSV (reporte) vs. importador de Zeus | Claude Code | Hecha | Renombrado a "Guardar/Restaurar copia de seguridad" para no chocar con "Cargar forecast pegado" |
| HU-029 | Sección dedicada por hotel (sub-navegación) | Claude Code | Hecha | Chips por sede en vez de las 4 tarjetas apiladas |

### Resumen de cierre

El tablero (`05-tablero-ocupacion/tablero-seguimiento-ocupacion.html`, versión principal, y `tablero-seguimiento-ocupacion-v2.html`, versión de trabajo con todo lo de auth + forecast + festivos + CSV + sub-navegación) quedó funcional y probado con pruebas automatizadas (jsdom) en cada HU. **Pendiente de decisión de Luis Felipe:** si `v2` reemplaza a la versión principal (`HU-034`, `FT-05.10`). **Pendiente de insumo:** PDFs de Zeus de Quirama, Piedras Blancas y Balandú para replicar `HU-019`-`HU-025` en esas 3 sedes (`FT-05.9`, próximo sprint natural — ver `ROADMAP.md`).

---

<!--
Plantilla para el próximo sprint — copiar y completar:

## SPRINT-01 — <nombre corto> [Estado: En curso | Cerrado]

- **Agente(s):**
- **Fecha apertura:**
- **Fecha cierre:**
- **Épica(s):**
- **Objetivo del sprint:**

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|

### Resumen de cierre

**Qué cambió:** ...

**HUs trabajadas:** ...

**Archivos tocados:** ...

**Validación realizada:** ...

**Decisiones / límites:** ...

**Pendientes para revisar:** ...

-->
