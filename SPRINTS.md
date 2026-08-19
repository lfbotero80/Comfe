# Registro de Sprints — Comfenalco IA

Registro correlativo de todos los sprints ejecutados en este repositorio, con el agente que hizo cada uno (`Claude Code` o `Codex`). Ver plantilla y reglas de cierre en `METODOLOGIA_SCRUM.md`. Entradas más recientes arriba.

**Antes de abrir un sprint nuevo, lee al menos las 2-3 entradas más recientes de este archivo.**

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
