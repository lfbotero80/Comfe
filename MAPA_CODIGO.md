# Mapa de código — Comfenalco IA

Resumen navegable del repositorio para ubicar "¿dónde está X?" sin leer todo el código. Se actualiza en el mismo sprint en que el código cambia (ver `METODOLOGIA_SCRUM.md`). Última actualización: **2026-08-19**, tras `SPRINT-13`.

---

## 1. Mapa del repositorio

```
Comfenalco IA/
├── CLAUDE.md                  Reglas operativas permanentes (leer siempre primero)
├── README.md                  Mapa general del proyecto y fuentes de Drive
├── METODOLOGIA_SCRUM.md       Reglas del proceso Scrum personalizado (este sistema)
├── BACKLOG.md                 Épicas / Features / HUs, con estado
├── ROADMAP.md                 Plan por semana calendario
├── SPRINTS.md                 Registro de todos los sprints, con agente identificado
├── MAPA_CODIGO.md             Este archivo
│
├── 01-oferta-y-calendario/    EP-01 · Oferta focalizada 3.1.2 + calendario 3.1.3 (.md y .docx)
├── 02-benchmarking/           EP-02 · Benchmarking cajas de compensación (.docx)
├── 03-ocupacion-hotelera/     EP-03 · Estrategia de ocupación (versiones v1/v2/v3, .md)
├── 04-skills-uit/             EP-04 · Skills especializadas de Diana (ver su propio README)
├── 05-tablero-ocupacion/      EP-05 · Tablero HTML y base modular — ver sección 2 de este mapa
└── 06-vigilancia-turismo-bienestar/   EP-06 · Informes de vigilancia (versión vigente: CONSOLIDADO v3)
```

Para las carpetas 01, 02, 03 y 06: el contenido es Markdown/Word, no código — para ubicar la versión vigente de cada una, revisar el README de la carpeta (si existe) o la fecha/número de versión más alto en el nombre del archivo.

---

## 2. `05-tablero-ocupacion/` — el tablero HTML

Versiones principales:

| Archivo | Rol |
|---|---|
| `tablero-seguimiento-ocupacion.html` | **Versión principal** — la que usa Diana/Sandra hoy en producción. |
| `tablero-seguimiento-ocupacion-v2.html` | **Versión de trabajo** — tiene todo lo de `SPRINT-00` (auth, forecast diario, festivos, CSV, sub-navegación por hotel) pendiente de que Luis Felipe la revise y decida si reemplaza a la principal (`HU-034`). |
| `tablero-seguimiento-ocupacion-v3-demo.html` | **Demo v3 abrible por doble clic** — creado en `SPRINT-03` a partir de v2 para conservar semaforos, seguimientos, metricas y experiencia visual mientras la modularizacion madura. Es el archivo correcto para revision local inmediata. |
| `abrir-v3-modular.command` | Lanzador macOS para abrir `v3-modular/` con servidor local en `http://localhost:8055/`. |
| `v3-modular/` | **Base modular paralela** — creada en `SPRINT-01` para dejar de crecer el monolito. No reemplaza producción ni v2. |

Las versiones `tablero-seguimiento-ocupacion.html`, `tablero-seguimiento-ocupacion-v2.html` y `tablero-seguimiento-ocupacion-v3-demo.html` son **un solo archivo HTML autocontenido** (HTML + CSS + JS inline), sin build step, sin backend. Persistencia en `localStorage` del navegador. Sin dependencias externas (se quitó Chart.js — el gráfico de presupuesto es divs+CSS puro — para que el tablero funcione sin internet).

Los números de línea de abajo son de `tablero-seguimiento-ocupacion-v2.html` (3096 líneas). La versión principal tiene una estructura equivalente pero sin las secciones marcadas `[solo v2]`.

### 2.1 — CSS (línea 11 a 724)

| Bloque | Línea | Qué estiliza |
|---|---|---|
| App shell (sidebar + columna) | 80 | Layout general de dos columnas |
| Nav tabs (sidebar) | 112 | Botones del menú lateral |
| Header | 156 | Barra superior con título y acciones |
| Layout general | 209 | `main`, `.tab-panel`, animaciones |
| KPI cards | 260 | Tarjetas del Resumen ejecutivo |
| Semáforo | 297 | Widget de 3 luces rojo/ámbar/verde |
| Forms | 319 | Inputs, labels, campos genéricos |
| Sede ocupación cards | 347 | Tarjeta de cada hotel en "Ocupación y tramos" |
| Forecast diario `[solo v2]` | 373 | Tabla de forecast por día, patrón semanal |
| Comparación y recomendación | 389 | Grid proyección-vs-real + caja de recomendación |
| Quirama split | 441 | Bloque individual/empresarial de Quirama |
| Calendar tab | 459 | Tabla de calendario comercial |
| Campaign catalog | 489 | Tabla del catálogo de campañas |
| Budget tab | 500 | Gráfico de barras de presupuesto (CSS puro) |
| Bitácora | 541 | Entradas de la bitácora del comité |
| Instrucciones | 554 | Tarjetas de la pestaña de onboarding |
| Modal | 608 | Todos los modales (genérico) |
| Toast | 628 | Notificación flotante |
| Usuario en sidebar `[solo v2]` | 692 | Bloque de sesión activa + logout |
| Gestión de usuarios `[solo v2]` | 711 | Tabla de administración de cuentas |

### 2.2 — HTML: pestañas (`<section class="tab-panel">`)

| id | Pestaña | Línea |
|---|---|---|
| `tab-instrucciones` | Instrucciones (onboarding, landing por defecto) | 863 |
| `tab-resumen` | Resumen ejecutivo (KPIs) | 990 |
| `tab-ocupacion` | Ocupación y tramos (forecast por hotel) | 1007 |
| `tab-calendario` | Calendario comercial | 1036 |
| `tab-campanas` | Catálogo de campañas | 1062 |
| `tab-presupuesto` | Seguimiento presupuestal | 1086 |
| `tab-bitacora` | Bitácora del comité | 1115 |
| `tab-usuarios` `[solo v2]` | Gestión de usuarios (solo Admin) | 1128 |

Login: overlay `#authOverlay`, antes del `<div class="app-shell">` — bloquea todo hasta iniciar sesión (`[solo v2]`).

### 2.3 — JavaScript: mapa de funciones

Bloques numerados dentro del `<script>` (línea 1296-3094):

| # | Bloque | Línea | Contiene |
|---|---|---|---|
| 1 | Datos base | 1298 | Todas las constantes reales: `SEDES_ALOJAMIENTO`, `SEDES_PASADIA`, `PRESUPUESTO_ANUAL`, `PRESUPUESTO_MENSUAL`, `TARIFAS_PB`, `CAMPAIGNS_DEFAULT`, `CALENDARIO`, `CAPACIDAD_HABITACIONES`, `FORECAST_FARALLONES_SEED`, `FESTIVOS_COLOMBIA_2026` |
| 2 | Persistencia | 1643 | `loadLS`, `saveLS`, `LS_KEYS`, `recalcularVigente`, `parseZeusForecastText`, `ensureForecastSeed`, `patronSemanal` |
| 2.5 | Autenticación `[solo v2]` | 1749 | `hashText`, `ensureSeedAdmin`, `findUser`, sesión (`loadSession`/`saveSession`/`clearSession`), `applyRolePermissions`, `onLoginSuccess`, `initAuth` |
| 3 | Utilidades | 1859 | `formatCOP`, `formatPct`, `calcularTramo`, `calcularCumplimientoOcupacion`, `generarRecomendacion`, `esFestivo`, `esCierreOperativoNormal`, modales genéricos (`showInfo`, `askConfirm`, `openModal`, `closeModal`), `renderSemaforo` |
| 4 | Tabs | 1961 | Lógica de cambio de pestaña |
| 5 | Tab Resumen ejecutivo | 1975 | `renderResumen` — arma las tarjetas KPI de las 8 sedes |
| 6 | Tab Ocupación y tramos | 2081 | `renderOcupacionSedeChips`, `renderOcupacionTab` (la función más grande del archivo — arma la tarjeta completa de un hotel: forecast, capacidad, resultado real, comparación, recomendación, tarifas) |
| 7 | Tab Calendario comercial | 2416 | `renderCalendarFilters`, `renderCalendarTable` |
| 8 | Tab Catálogo de campañas | 2456 | `renderCampaignTable` + handlers de crear/eliminar |
| 9 | Tab Seguimiento presupuestal | 2531 | `populateMonthSelect`, `renderBudgetChart` (barras CSS), `renderBudgetDetail` |
| 10 | Tab Bitácora | 2649 | `populateLogSedeSelect`, `renderLog` |
| 11 | Exportar/Importar | 2704 | `toCSV`, `downloadCSV`, handlers de cada botón "Exportar CSV", y el respaldo/restauración JSON (`btnExport`/`btnImportTrigger`) |
| 12 | Inicialización | 2848 | `renderTablaFestivos`, `renderAll` (dispara el render de todas las pestañas) |
| 13 | Autenticación (handlers) `[solo v2]` | 2875 | Login, logout, recuperar contraseña, "Mi cuenta", `renderUserTable`, crear/eliminar usuario, resetear contraseña |

### 2.4 — Modelo de datos clave

- **`ocupacionData[sede]`** (en localStorage, clave `comfenalco_ocupacion_v1`): `{ fecha, ocupacion, fechaReal, ocupacionReal, actualizadoPor, forecastDiario: [{fecha, pct}], corteZeus, capacidad }`. `fecha`/`ocupacion` son un valor **derivado** — `recalcularVigente()` los recalcula siempre a partir del día del `forecastDiario` más cercano a hoy. No se editan a mano directamente.
- **`campaignsData`** (clave `comfenalco_campaigns_v1`): array de campañas, cada una con `creadoPor` (atribución de usuario).
- **`logData`** (clave `comfenalco_bitacora_v1`): array de entradas de bitácora.
- **`usersData`** `[solo v2]` (clave `comfenalco_users_v1`): array de cuentas `{username, nombre, rol, passwordHash, pregunta, respuestaHash, creadoEl}`. Semilla inicial: usuario `admin` / contraseña `Comfenalco2026`.
- **`CAPACIDAD_HABITACIONES`**: constante de código, solo semilla inicial (Hostería Los Farallones = 48 habitaciones, real). El valor real vigente por sede vive en `ocupacionData[sede].capacidad` una vez se guarda/importa.

### 2.5 — Cómo se prueba

No hay test runner instalado en el repo. La validación de cada sprint se hizo con scripts Node + `jsdom` ad hoc (creados y borrados en el scratchpad de la sesión, no viven en el repo) que cargan el HTML, simulan clics/eventos, y verifican el DOM resultante. Si Codex necesita validar un cambio, este es el patrón a seguir: `jsdom` + `runScripts:"dangerously"` + polyfill de `crypto.subtle` con `require('crypto').webcrypto` (jsdom no lo implementa nativo).

---

## 3. `05-tablero-ocupacion/v3-modular/` — base modular paralela

Creada en `SPRINT-01` por Codex. Es una base de desarrollo local para migrar el tablero por piezas, no una copia completa de v2.

### 3.1 — Archivos de entrada

| Archivo | Rol |
|---|---|
| `v3-modular/index.html` | Shell HTML con sidebar, topbar, boton primario `Cargar datos` y contenedor de vistas. Carga `src/main.js` como modulo ES. |
| `v3-modular/styles/app.css` | Estilos separados del HTML. Tras `SPRINT-02`, recupera el sistema visual de v2: paleta Comfenalco, sidebar verde, acento lima, tarjetas KPI, semaforo real y graficos CSS. |
| `v3-modular/README.md` | Instrucciones de uso local, limites y estado de la version modular. |

Para abrir con modulos ES:

```bash
cd /Users/mellolfbo/Documents/Claude/Projects/Comfenalco\ IA/05-tablero-ocupacion/v3-modular
python3 -m http.server 8055
```

URL local: `http://localhost:8055/`

### 3.2 — Modulos JavaScript

| Modulo | Responsabilidad |
|---|---|
| `src/main.js` | Orquesta navegacion, titulo de vista y render de la pantalla activa. |
| `src/config/navigation.js` | Define las vistas del menu lateral con iconos: dashboard, hoteles, parques, calendario comercial y catalogo de campanas. La carga de datos se abre desde el boton primario del header. `Estructura de archivos` ya no aparece en navegacion desde `SPRINT-09`. |
| `src/domain/sites.js` | Catálogo de hoteles y parques, con rol estrategico y capacidad conocida cuando existe. |
| `src/domain/data-contracts.js` | Contratos de archivo de S1: `occupancyInventory`, `budgetExecution` y `revenueRules`, con columnas obligatorias/opcionales, tipos, fuentes, grano y plantilla CSV. |
| `src/domain/occupancy.js` | Reglas de clasificacion de ocupacion: Estandar >=70, Preventa 40-69, Mas cerca <40, alta demanda >=90, cierre operativo y brecha proyectado/real. |
| `src/domain/operational-calendar.js` | Reglas de calendario operativo: festivos Colombia 2026, cierre domingo/lunes sin festivo, temporada alta y tipo de dia. |
| `src/domain/commercial-context.js` | Cruza sede, fecha, tramo del semaforo, calendario comercial y campanas para generar contexto accionable. |
| `src/data/demo-data.js` | Datos semilla para que el demo modular no arranque vacio: forecast real de Hosteria Los Farallones y cortes presupuestales disponibles. |
| `src/data/colombia-holidays-2026.js` | Festivos oficiales de Colombia 2026 migrados desde v2 para no generar falsas alarmas por cierres normales o festivos. |
| `src/data/commercial-calendar.js` | Calendario comercial migrado desde v2: actividades por mes, sede, tipo, publico y descripcion. |
| `src/data/campaigns.js` | Catalogo de campanas migrado desde v2: causa, sedes, tarifa/producto, estado y medicion cuando exista. |
| `src/services/csv.js` | Parser CSV simple con soporte de separador `;` o `,`, comillas y normalizacion de encabezados. |
| `src/services/file-reader.js` | Lee archivos `.csv`, `.json` y PDFs Zeus para `occupancyInventory`; extrae texto con PDF.js local y delega normalizacion al parser Zeus. |
| `src/services/zeus-forecast-parser.js` | Interpreta texto extraido de PDF Zeus Forecast por sede: detecta sede, corte, filas diarias, habitaciones disponibles/ocupadas y porcentaje, y devuelve filas `occupancyInventory`. |
| `src/services/validators.js` | Valida formato, columnas obligatorias, fechas, periodos, sedes reconocidas, tipo de unidad, porcentajes y cuadratura de inventario/presupuesto/umbrales. |
| `src/state/app-state.js` | Estado en memoria de la sesion local: archivos cargados, inventario/ocupacion, presupuesto, reglas de Revenue y campanas agregadas durante la sesion. |
| `src/ui/html.js` | Helpers pequeños para escapar HTML, crear badges y renderizar el semaforo real de tres luces. |
| `src/ui/views/dashboard.js` | Dashboard general solo-graficas tipo Power BI (desde `SPRINT-12`): banda principal, 3 KPIs de negocio, y 3 graficas — ocupacion Hoteles y ocupacion Parques (separadas, ordenadas de mas critico a mejor, con sparkline de tendencia por sede) y presupuesto ejecutado vs proyectado (ordenado igual). Sin listas de texto ni tarjetas detalladas por sede — ese detalle vive solo en `hotels.js`/`parks.js`. Sedes sin dato quedan en gris al final de cada grafica. |
| `src/ui/views/data-load.js` | Vista de carga de archivos, descarga de plantillas, resultado de validacion por fila y explicacion de interpretacion Zeus por hotel. |
| `src/ui/views/hotels.js` | Vista de hoteles con pestanas internas por hotel, ocupacion del mes, ocupadas/inventario en un solo indicador, semaforo contextual, accion sugerida, contexto comercial y detalle diario del mes con dia real. |
| `src/ui/views/parks.js` | Vista `Parques` con pestanas por sede, uso del mes, capacidad, usados/libres, alarma y detalle diario; no muestra semaforo cuando falta dato. |
| `src/ui/views/calendar.js` | Vista recuperada de calendario comercial, con filtros por mes/sede y calendario operativo 2026. |
| `src/ui/views/campaigns.js` | Vista recuperada de catalogo de campanas, con estado, resultado si hay ocupacion proyectada/real y boton `Agregar campaña nueva` que abre un modal tipo v2. |
| `src/ui/views/contracts.js` | Vista tecnica de contratos de datos; queda sin acceso desde el menu visible desde `SPRINT-09`. |
| `vendor/pdfjs/pdf.mjs` | PDF.js local para extraer texto de PDFs Zeus en navegador sin depender de CDN. |
| `vendor/pdfjs/pdf.worker.mjs` | Worker local de PDF.js requerido por la lectura de PDFs. |

### 3.3 — Contratos actuales

- **Ocupacion e inventario diario (`occupancyInventory`)**: `sede`, `tipo_sede`, `tipo_unidad`, `fecha`, `inventario_total`, `unidades_ocupadas`, `unidades_libres`, `ocupacion_porcentaje`, `fuente`, `fecha_corte`.
- **Presupuesto/ejecucion (`budgetExecution`)**: `sede`, `periodo`, `presupuesto`, `ejecutado`, `fuente`, `fecha_corte`.
- **Reglas de Revenue (`revenueRules`)**: `sede`, `tipo_sede`, `tipo_unidad`, `plan_venta`, `tramo`, `umbral_min`, `umbral_max`, `accion_recomendada`, `fuente`, `fecha_corte`.

Plantillas CSV de S1:

| Archivo | Uso |
|---|---|
| `v3-modular/templates/ocupacion-inventario-diario.csv` | Plantilla para ocupacion, inventario total, ocupado, libre y fuente por sede/fecha/unidad. |
| `v3-modular/templates/presupuesto-ejecucion.csv` | Plantilla para presupuesto, ejecutado, cumplimiento y confiabilidad por sede/periodo. |
| `v3-modular/templates/reglas-revenue.csv` | Plantilla para reglas de tramos, umbrales, tarifas y acciones recomendadas. |

### 3.4 — Validacion realizada en `SPRINT-01`

- `node --check` sobre todos los modulos `.js`.
- Prueba directa de `parseCSV()` + `validateFileRows()` con un CSV minimo de hotel y un CSV minimo de parque.
- Servidor local levantado con `python3 -m http.server 8055`.

### 3.5 — Correccion de fidelidad en `SPRINT-02`

`SPRINT-02` corrige el problema de que la primera version modular era limpia tecnicamente, pero demasiado pobre frente al demo v2. Cambios relevantes:

- Sistema de diseño restaurado desde v2 y contrastado con la pagina oficial de Comfenalco Antioquia Personas: verde institucional, acento lima, fondo calido, sidebar oscuro, tarjetas KPI y botones sobrios.
- Semaforo visual real recuperado como helper reusable (`trafficLight()` en `src/ui/html.js`).
- Dashboard general enriquecido en `src/ui/views/dashboard.js`: primera pantalla de decision, no instrucciones.
- Datos semilla en `src/data/demo-data.js` para mostrar forecast real de Farallones, serie visual y cumplimiento presupuestal sin depender de una carga manual inicial.
- Validacion adicional: render del dashboard contiene semaforo, Serie Farallones, cumplimiento presupuestal y Hosteria Los Farallones; prueba negativa de contrato de forecast incompleto.

### 3.6 — S1 modelo de datos y carga en `SPRINT-04`

`SPRINT-04` ejecuta `Sprint TO-01` del roadmap de producto. Cambios relevantes:

- El contrato principal de V3 pasa a ser `occupancyInventory`, no `hotelForecast`: una fila por sede, tipo de unidad y fecha, con inventario total, ocupado, libre, porcentaje de ocupacion, fuente y fecha de corte.
- Se mantienen contratos separados para `budgetExecution` y `revenueRules`, porque presupuesto y Revenue no tienen el mismo grano que inventario diario.
- `validators.js` valida sede conocida, tipo de sede/unidad, fechas `AAAA-MM-DD`, periodo `AAAA-MM`, numericos, porcentajes, cuadratura de inventario, cumplimiento presupuestal opcional y umbrales de Revenue.
- `data-load.js` y `contracts.js` muestran plantillas descargables, columnas y errores por fila.
- Las pantallas actuales de dashboard, hoteles y parques leen `appState.occupancyInventoryRows`; las pestañas completas por hotel/parque quedan para los sprints TO-03 y TO-04.

### 3.7 — Correccion de seriedad y contexto operativo en `SPRINT-05`

`SPRINT-05` responde a la revision de Luis Felipe sobre V3:

- `Cargar datos` deja de ser una opcion del menu lateral y pasa a ser boton primario verde claro en el header (`index.html` + `main.js`).
- La UI elimina lenguaje interno de desarrollo como `S1`, `contrato unico`, `V3 ya lee` o `Tablero listo para revisar datos`.
- El semaforo solo se muestra con dato disponible y acompanado de tramo/accion; si falta informacion, se muestra estado pendiente.
- `hotels.js` recupera la logica de ocupacion y tramos por hotel mediante pestanas internas, metricas de inventario y serie diaria.

### 3.8 — Recuperacion de calendario y campanas en `SPRINT-06`

`SPRINT-06` corrige la perdida de dos secciones buenas de v2 dentro de la V3 modular:

- `src/data/commercial-calendar.js` contiene 72 actividades migradas desde `CALENDARIO` de v2, normalizadas a los nombres de sede usados por V3.
- `src/data/campaigns.js` contiene las 4 campanas base migradas desde `CAMPAIGNS_DEFAULT` de v2.
- `src/ui/views/calendar.js` agrega la seccion navegable `Calendario comercial`, con filtros por mes y sede.
- `src/ui/views/campaigns.js` agrega la seccion navegable `Catalogo de campanas`, con estado y resultado cuando haya ocupacion proyectada/real.
- `src/domain/commercial-context.js` conecta sede, fecha y tramo del semaforo con actividades y campanas. `dashboard.js` y `hotels.js` usan este contexto para que una alerta muestre accion comercial aplicable.

### 3.9 — Confianza del semaforo en `SPRINT-07`

`SPRINT-07` corrige la regla de negocio del semaforo para que V3 modular no genere falsas alarmas:

- `src/data/colombia-holidays-2026.js` contiene los 18 festivos oficiales usados por v2.
- `src/domain/operational-calendar.js` distingue `cierre_operativo`, `festivo`, `temporada_alta`, `fin_de_semana` y `entre_semana`.
- `src/domain/occupancy.js` usa ese contexto para clasificar ocupacion: `>=70` Estandar, `40-69` Preventa, `<40` Mas cerca, `>=90` Alta demanda. Domingo/lunes sin festivo queda gris como cierre operativo normal; lunes festivo no se trata como cierre.
- `src/ui/views/dashboard.js` anota el tipo de dia en alertas/tarjetas; desde `SPRINT-08`, el bloque `Calendario operativo 2026` vive en `src/ui/views/calendar.js`.
- `src/ui/views/hotels.js` muestra `Dia operativo` por hotel junto a ocupacion, inventario y accion.

### 3.10 — Estructura gris, hoteles/parques y Zeus en `SPRINT-08`

`SPRINT-08` corrige la estructura visual y aclara la carga Zeus:

- `src/ui/views/dashboard.js` ya no muestra `Calendario operativo 2026`; ese bloque pasa a `src/ui/views/calendar.js`. El dashboard general se concentra en estado por sede.
- El dashboard muestra Hoteles y Parques aunque no tengan data; las sedes sin archivo cargado aparecen en gris con estado pendiente.
- `src/ui/views/hotels.js` muestra arriba `Ocupacion del mes` y abajo `Detalle diario del mes` con fecha, inventario, ocupadas, libres, ocupacion, dia y tramo.
- `src/ui/views/parks.js` adopta el mismo patron de Hoteles: pestanas por sede, metricas del mes, alarma y detalle diario.
- `src/services/zeus-forecast-parser.js` interpreta el texto extraido de cada PDF Zeus por sede. Validado con los PDFs adjuntos de Balandu, Quirama y Piedras Blancas.
- La carga directa de PDF en navegador sigue pendiente: V3 local todavia no incluye extractor PDF tipo PDF.js ni backend.

### 3.11 — Dashboard ejecutivo y limpieza de navegacion en `SPRINT-09`

`SPRINT-09` responde a la revision de producto sobre V3 modular:

- `src/config/navigation.js` elimina `contracts` del menu visible y agrega iconos por seccion.
- `src/main.js` deja de importar/renderizar `contracts` y enlaza handlers de campañas.
- `src/ui/views/dashboard.js` pasa a una composicion tipo Power BI: tarjetas de score, alertas, ocupacion por sede, presupuesto ejecutado vs presupuesto en absolutos/% y tarjetas por Hoteles/Parques.
- `src/ui/views/hotels.js` fusiona ocupadas e inventario en un solo indicador (`26 de 48 (54.1%)`) y muestra dia real en el detalle diario.
- `src/ui/views/parks.js` tambien muestra dia real en el detalle diario.
- `src/ui/views/campaigns.js` agrega `Agregar campaña nueva` y formulario de alta local.
- `src/state/app-state.js` agrega `addCampaign()` para sumar campañas a `campaignRows` durante la sesion.

### 3.12 — Carga directa de PDFs Zeus en `SPRINT-10`

`SPRINT-10` habilita la prueba directa con los PDFs reales de Zeus:

- `src/domain/data-contracts.js` permite `.pdf` en el contrato `occupancyInventory`.
- `src/services/file-reader.js` detecta `.pdf`, usa `vendor/pdfjs/pdf.mjs` y `vendor/pdfjs/pdf.worker.mjs` para extraer texto en navegador, y envia ese texto a `parseZeusForecastText()`.
- `src/services/zeus-forecast-parser.js` convierte cada fila diaria Zeus en `sede`, `tipo_sede`, `tipo_unidad`, `fecha`, `inventario_total`, `unidades_ocupadas`, `unidades_libres`, `ocupacion_porcentaje`, `fuente` y `fecha_corte`.
- `src/state/app-state.js` fusiona cargas por `sede + tipo_unidad + fecha`; cargar un hotel no borra los datos ya cargados de otro.
- Validado con Playwright subiendo `Forecast Balandu 1808.pdf`, `Forecast Quirama 1808.pdf` y `Forecast Piedras Blancas 1808.pdf` desde la vista `Cargar datos`.

### 3.13 — Modal de campanas en `SPRINT-11`

`SPRINT-11` recupera el patron visual de v2 para crear campanas sin saturar la tabla:

- `src/ui/views/campaigns.js` reemplaza el formulario incrustado por un modal con overlay, cabecera verde, cierre, campos completos y botones `Cancelar` / `Guardar campaña`.
- El modal captura nombre, causa, sede(s), tarifa aplicada, fecha de ejecucion, ocupacion proyectada y ocupacion real.
- `src/state/app-state.js` conserva ocupaciones en cero cuando se registren y mantiene las campanas nuevas en memoria de sesion.
- `styles/app.css` contiene los estilos del modal, campos, ayuda y footer responsive.

### 3.14 — Compactacion del modal de campanas en `SPRINT-13`

`SPRINT-13` reduce la carga visual del modal creado en `SPRINT-11`:

- `src/ui/views/campaigns.js` agrupa `Tarifa aplicada` y `Fecha de ejecucion` en una fila de dos columnas en desktop.
- `styles/app.css` baja el modal a 640px de ancho maximo, reduce padding, alto de inputs, tamano de texto y acciones, manteniendo layout responsive a una columna en movil.
