# Mapa de código — Comfenalco IA

Resumen navegable del repositorio para ubicar "¿dónde está X?" sin leer todo el código. Se actualiza en el mismo sprint en que el código cambia (ver `METODOLOGIA_SCRUM.md`). Última actualización: **2026-08-19**, tras `SPRINT-28`.

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
| `AUDITORIA_DATOS_QUEMADOS_SPRINT-24.md` | Informe de auditoria de datos quemados de la V3 modular: distingue datos semilla, catalogos estructurales, reglas de negocio y riesgos pendientes (`TO-HU-071`, `TO-HU-072`). |
| `ARQUITECTURA_IA_RECOMENDACIONES_SPRINT-27.md` | Documento de arquitectura para evolucionar `Accion sugerida` hacia IA asistida: recomienda no conectar IA desde HTML local, mantener motor deterministico como fallback, y exigir backend, auditoria, contexto estructurado y aprobacion humana antes de IA real. |
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
| `v3-modular/index.html` | Shell HTML con sidebar, topbar, boton primario `Cargar datos` ubicado arriba a la derecha, pill de estado oculto por defecto, contenedor de filtros globales y contenedor de vistas. La marca lateral muestra `Unidad de Turismo` desde `SPRINT-21`. Carga `src/main.js` como modulo ES. |
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
| `src/main.js` | Orquesta navegacion, titulo de vista y render de la pantalla activa. Desde `SPRINT-18`, los filtros globales (`#globalFilters`) solo se renderizan y enlazan cuando `activeView === 'dashboard'`; en el resto de vistas quedan `hidden`. `setStatus(text, type)` colorea el pill del header segun `ok`/`warn`/`error`/`pending`; desde `SPRINT-16`, lo mantiene oculto cuando no hay texto real. |
| `src/ui/global-filters.js` | Renderiza y enlaza filtros globales de periodo, unidad y semaforo. Expone `monthLabel()` para que dashboard y vistas por sede nombren el periodo con lenguaje humano. |
| `src/config/navigation.js` | Define las vistas del menu lateral con iconos: dashboard, hoteles, parques, presupuesto (`$`, desde `SPRINT-19`), calendario comercial y catalogo de campanas. La carga de datos se abre desde el boton primario del header. `Estructura de archivos` ya no aparece en navegacion desde `SPRINT-09`. |
| `src/domain/sites.js` | Catálogo de hoteles y parques, con rol estrategico y capacidad conocida cuando existe. |
| `src/domain/data-contracts.js` | Contratos de archivo de S1: `occupancyInventory`, `budgetExecution` y `revenueRules`, con columnas obligatorias/opcionales, tipos, fuentes, grano y plantilla CSV. |
| `src/domain/occupancy.js` | Reglas de clasificacion de ocupacion: Estandar >=70, Preventa 40-69, Mas cerca <40, alta demanda >=90, cierre operativo y brecha proyectado/real. |
| `src/domain/budget.js` | Desde `SPRINT-19`. `summarizeSite(sede, rows, mode)` resume presupuesto/ejecutado de una sede en 3 modos: `latest` (ultimo periodo), `accumulated` (suma de todos los periodos cargados, excluye `ejecutado` de filas no confiables) o un mes especifico (`2026-01`..`2026-12`). Respeta `dato_confiable` en los tres modos. `BUDGET_MONTHS` es la lista de los 12 meses de 2026. |
| `src/domain/operational-calendar.js` | Reglas de calendario operativo: festivos Colombia 2026, cierre domingo/lunes sin festivo, temporada alta y tipo de dia. |
| `src/domain/commercial-context.js` | Cruza sede, fecha, tramo del semaforo, calendario comercial y campanas para generar contexto accionable. |
| `src/domain/strategic-recommendation.js` | Motor deterministico de `Accion sugerida` para hoteles: combina semaforo, cumplimiento mensual, tendencia y contexto comercial. Punto futuro para conectar IA real sin mezclarla con la vista. |
| `src/domain/ai-recommendation-context.js` | Desde `SPRINT-28`. Arma el paquete estructurado por sede para futura IA asistida desde `appState`: fuentes, ocupacion, presupuesto, Revenue, calendario, campanas, confianza y datos faltantes. No llama modelos ni lee el DOM. |
| `src/domain/data-readiness.js` | Desde `SPRINT-23`. Calcula estado de informacion por sede desde `appState`: cobertura de ocupacion/inventario, presupuesto y Revenue, ultimo detalle disponible, fuente mas reciente y estado (`Completo`, `Parcial`, `Sin datos`). No renderiza HTML. |
| `src/data/demo-data.js` | Datos semilla para que el demo modular no arranque vacio: forecast real de Hosteria Los Farallones y cortes presupuestales disponibles. |
| `src/data/colombia-holidays-2026.js` | Festivos oficiales de Colombia 2026 migrados desde v2 para no generar falsas alarmas por cierres normales o festivos. |
| `src/data/commercial-calendar.js` | Calendario comercial migrado desde v2: actividades por mes, sede, tipo, publico y descripcion. |
| `src/data/campaigns.js` | Catalogo de campanas migrado desde v2: causa, sedes, tarifa/producto, estado y medicion cuando exista. |
| `src/services/csv.js` | Parser CSV simple con soporte de separador `;` o `,`, comillas y normalizacion de encabezados. |
| `src/services/file-reader.js` | Lee archivos `.csv`, `.json` y PDFs Zeus para `occupancyInventory`; extrae texto con PDF.js local y delega normalizacion al parser Zeus. |
| `src/services/zeus-forecast-parser.js` | Interpreta texto extraido de PDF Zeus Forecast por sede: detecta sede, corte, filas diarias, habitaciones disponibles/ocupadas y porcentaje, y devuelve filas `occupancyInventory`. |
| `src/services/validators.js` | Valida formato, columnas obligatorias, fechas, periodos, sedes reconocidas, tipo de unidad, porcentajes y cuadratura de inventario/presupuesto/umbrales. |
| `src/services/csv-export.js` | Desde `SPRINT-19`. `toCSV(headers, rows)`/`downloadCSV(filename, csv)` genericos — separador `;` y BOM UTF-8 para Excel en español, mismo patron que v2. Primera utilidad de exportacion CSV en V3 (antes no existia ninguna). |
| `src/services/occupancy-export.js` | Desde `SPRINT-22`. Exportador especifico de ocupacion/inventario: consolida headers operativos, ordena por sede/tipo de unidad/fecha, permite filtrar por sede o por tipo de sede y genera slugs de archivo. Reusa `csv-export.js`; no valida ni transforma datos, solo exporta lo que ya esta aceptado en `appState`. |
| `src/state/app-state.js` | Estado en memoria de la sesion local: modo de datos (`dataMode`), archivos cargados, inventario/ocupacion, presupuesto, reglas de Revenue, campanas agregadas durante la sesion y filtros globales (`period`, `unitType`, `severity`). Desde `SPRINT-25`, `DATA_MODES` separa `demo` (semillas de `demo-data.js`) de `real` (arranque sin datos operativos) y `setDataMode()` persiste la seleccion en `localStorage` con `comfenalco_data_mode_v1`. `mergeByKey()` recibe un comparador de orden configurable desde `SPRINT-19`; `budgetExecution` fusiona por `sede + periodo` (antes sobrescribia todo en cada carga) igual que `occupancyInventory` fusiona por `sede + tipo_unidad + fecha`. |
| `src/ui/html.js` | Helpers pequeños para escapar HTML, crear badges y renderizar el semaforo real de tres luces. |
| `src/ui/ai-context-panel.js` | Desde `SPRINT-28`. Componente compartido de Hoteles/Parques para mostrar `Base para analisis asistido`: confianza, evidencia de ocupacion/presupuesto/Revenue, faltantes principales y paquete JSON compacto en `details`. |
| `src/ui/site-budget-panel.js` | Desde `SPRINT-20`. Componente compartido de presupuesto por sede para Hoteles/Parques. Reusa `domain/budget.js`; intenta mostrar el mes activo y, si no existe presupuesto para ese periodo, muestra el ultimo periodo cargado con nota explicita. Desde `SPRINT-26`, tolera ausencia de periodo de ocupacion sin mostrar `null` ni un mes inventado. |
| `src/ui/views/dashboard.js` | Dashboard general solo-graficas tipo Power BI: banda principal sin contador de alertas, 2 KPIs de negocio, ocupacion Hoteles y ocupacion Parques en bloques verticales con cuerpo 50/50 (grafica + diagnostico visual de semaforo/cobertura), y presupuesto comparativo por sede. El presupuesto usa dos barras (`Proyectado` y `Real cumplido`, funcion `budgetCompareRow()`), escaladas contra el mayor de los dos valores, y muestra el % de ejecucion solo junto a la barra real, sin badge duplicado por sede desde `SPRINT-21`. Sedes sin dato quedan en gris al final de cada grafica. Obedece filtros globales de periodo, unidad y semaforo. |
| `src/ui/views/data-load.js` | Vista de carga de archivos, descarga de plantillas, resultado de validacion por fila y explicacion de interpretacion Zeus por hotel. Desde `SPRINT-15`, el handler de carga ya no llama `rerender()` tras un exito (`renderDataLoad()` no depende de `appState`, y ese `rerender()` borraba el mensaje de validacion antes de que se alcanzara a leer) — el mensaje ahora persiste con estado `pending`/`ok`/`warn`/`error`. Desde `SPRINT-22`, agrega exportacion CSV consolidada de ocupacion e inventario. Desde `SPRINT-23`, muestra `Estado de informacion por sede` y refresca solo ese bloque tras carga exitosa. Desde `SPRINT-25`, agrega control de `Modo demo` / `Datos reales` y deshabilita exportacion cuando no hay filas de ocupacion. |
| `src/ui/views/hotels.js` | Vista de hoteles con pestanas internas por hotel, 12 barras mensuales, cumplimiento del mes contra meta, ocupadas/inventario en un solo indicador, semaforo contextual, accion sugerida, contexto comercial, seguimiento presupuestal de la sede, base de contexto IA y detalle diario del mes activo con dia real. Grafica de detalle diario ampliada en `SPRINT-15` (contenedor 240px, barras escaladas `pct * 2`, valores en 14px/800). El mes activo depende solo de seleccion explicita o de `latestMonth(rows)` cuando la sede tiene filas; desde `SPRINT-26`, una sede sin filas queda sin periodo activo y no cae a agosto. No obedece filtros globales (tiene su propia navegacion). Desde `SPRINT-22`, exporta todos los hoteles o el hotel activo en CSV; el boton por hotel queda deshabilitado si la sede no tiene filas. |
| `src/ui/views/parks.js` | Vista `Parques` con pestanas por sede, movimiento anual de 12 meses, cumplimiento del mes contra meta de uso, capacidad, usados/libres, alarma, accion sugerida, base de contexto IA, seguimiento presupuestal de la sede y detalle diario del mes activo. No obedece filtros globales (se quito en `SPRINT-18` la dependencia del periodo global que introdujo `SPRINT-17`). Desde `SPRINT-20`, una sede sin dato muestra accion sugerida gris y estado vacio claro, no tabla vacia. Desde `SPRINT-26`, una sede sin filas queda sin periodo activo y no cae a agosto. Desde `SPRINT-22`, exporta todos los parques o el parque activo en CSV; el boton por parque queda deshabilitado si la sede no tiene filas. |
| `src/ui/views/budget.js` | **Seguimiento presupuestal** (desde `SPRINT-19`, restaura la pestaña que existia en v2). Selector de periodo (ultimo cargado / acumulado / mes especifico), leyenda, comparacion de las 9 sedes con **escala comun** (a proposito distinto de `budgetCompareRow()` del Dashboard, que escala cada sede contra si misma) para poder comparar tamaño entre sedes, y detalle `<details>` de 12 meses por sede con desglose empresarial/individual cuando el archivo lo trae, exportacion CSV consolidada y por sede. Usa clases CSS propias (`budget-report-*`) en vez de `budget-compare-*` del Dashboard para no acoplarse a un componente que Codex sigue evolucionando. |
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

### 3.15 — Hoteles anual y accion sugerida en `SPRINT-14`

`SPRINT-14` agrega una lectura anual dentro de cada hotel:

- `src/ui/views/hotels.js` construye 12 barras mensuales por hotel, resalta el mes activo y filtra el detalle diario a ese mes.
- La barra `Cumplimiento del mes` compara el promedio mensual contra `OCCUPANCY_TARGET` (70%).
- `src/domain/strategic-recommendation.js` decide la `Accion sugerida` con semaforo, cumplimiento mensual, tendencia reciente y contexto comercial; no usa IA real todavia.
- `styles/app.css` contiene `.year-panel`, `.month-bars`, `.month-bar`, `.compliance-panel` y estados visuales asociados.

### 3.16 — Retroalimentacion de carga y legibilidad en `SPRINT-15`

`SPRINT-15` corrige tres problemas de uso reportados por Luis Felipe tras revisar V3:

- **Bug real:** `src/ui/views/data-load.js` llamaba `rerender()` tras una carga exitosa, lo que regeneraba las tarjetas de subida y borraba el mensaje de validacion antes de que se pudiera leer. Se quito ese `rerender()` (innecesario: `renderDataLoad()` no depende de `appState`) y el mensaje ahora persiste con estado `pending` (leyendo) → `ok`/`warn`/`error` (resultado).
- `src/main.js` expone `setStatus(text, type)`: colorea el pill del header del topbar segun el resultado, en vez de texto plano sin estado visual.
- `src/ui/views/hotels.js`: la barra de `Detalle diario del mes` escala `pct * 2` (antes `pct * 1.25`), aprovechando el `.forecast-strip` ampliado a 240px de alto minimo.
- `src/ui/views/dashboard.js`: el bloque de presupuesto reemplaza la barra unica de % de relleno por `budgetCompareRow()` — dos barras por sede (`Proyectado` y `Real cumplido`), escaladas contra el mayor de los dos valores de esa sede, con el monto en pesos junto a cada barra.
- `styles/app.css` agrega `.status-pill.ok/.warn/.error/.pending`, `.validation-item.pending`, `.budget-compare-list/.budget-compare-row/.budget-compare-bars/.budget-compare-bar`, y amplia `.forecast-strip/.forecast-column/.forecast-value`.
- Se investigo un cuarto reporte ("el dashboard no se actualiza al cargar en Hoteles") sin poder reproducirlo: `renderDashboard()` ya lee `appState` en cada render sin cache. Probable confusion causada por el bug de confirmacion de carga de arriba.

### 3.17 — Dashboard ejecutivo y convenciones en `SPRINT-16`

`SPRINT-16` aplica la retroalimentacion visual del dashboard general:

- `index.html`: el boton `Cargar datos` queda siempre visible arriba a la izquierda; el pill `dataStatus` arranca oculto.
- `src/main.js`: `setStatus(text, type)` muestra el pill solo cuando recibe texto real.
- `src/ui/views/dashboard.js`: elimina el contador de alertas criticas y el score "Alertas activas"; agrega convenciones visibles para ocupacion/uso y presupuesto; cambia Hoteles y Parques a bloques verticales; y suma % de ejecucion al valor de `Real cumplido`.
- `styles/app.css`: agrega `[hidden]`, `.dashboard-stack`, `.score-grid.two`, estilos de convenciones, y variantes de grafica de ocupacion mas protagonistas.

### 3.18 — Filtros globales y proporcion visual en `SPRINT-17`

`SPRINT-17` corrige la segunda ronda visual del dashboard:

- `index.html`: `Cargar datos` vuelve a la esquina superior derecha y se agrega `#globalFilters` debajo del header.
- `src/ui/global-filters.js`: nuevo modulo de filtros globales con periodo (`Todo 2026` + meses), unidad (`Todas`, `Hoteles`, `Parques`) y semaforo (`Todos`, rojo, amarillo, verde, sin dato).
- `src/state/app-state.js`: agrega `filters` y `setGlobalFilter()`.
- `src/main.js`: renderiza filtros en todas las vistas y vuelve a renderizar al cambiar un filtro.
- `src/ui/views/dashboard.js`: KPIs, graficas y presupuesto obedecen los filtros; ocupacion usa layout 50/50 grafica/convenciones; presupuesto agrega convenciones y ubica el % junto a la barra.
- `src/ui/views/hotels.js` y `src/ui/views/parks.js`: toman el periodo global cuando corresponde; si el filtro esta en `Todo 2026`, usan el ultimo mes con dato de la sede para mantener el demo legible.
- `styles/app.css`: agrega estilos de filtro global, selectores, convenciones inline, layout 50/50 de ocupacion y columna de porcentaje presupuestal junto a barra.

**Correccion en `SPRINT-18`:** los puntos "renderiza filtros en todas las vistas" y "toman el periodo global" de arriba quedaron mal — Luis Felipe reporto que los filtros aparecian "en todos lados", incluida Calendario/Campanas donde no filtraban nada, y que Hoteles llego a mostrar "Sin datos de ocupacion" para una sede con dato real en otro mes, por el fallback silencioso al filtro global. `SPRINT-18` acota los filtros globales solo al Dashboard (ver seccion 3.19) — esta entrada se deja como registro historico de lo que se hizo en `SPRINT-17`, no como estado vigente.

### 3.19 — Correccion de alcance de filtros globales en `SPRINT-18`

`SPRINT-18` corrige el sobre-alcance de `SPRINT-17`, reportado por Luis Felipe ("Codex se equivoco con los filtros y los puso en todos lados"), reproducido en navegador antes de tocar codigo:

- `src/main.js`: `#globalFilters` solo se renderiza y enlaza (`bindGlobalFilterHandlers`) cuando `activeView === 'dashboard'`; en cualquier otra vista queda `hidden` y vacio. Antes se renderizaba (decorativo, sin efecto) en las 5 vistas.
- `src/ui/views/hotels.js`: se quito el fallback al filtro global en el calculo de `activeMonth` — vuelve a depender solo de `activeMonthByHotelId` y `latestMonth(rows)`, como en `SPRINT-14`. Se quito el import de `monthLabel` (sin uso) y la nota volvio a "Una barra por mes; gris indica que falta archivo cargado."
- `src/ui/views/parks.js`: `rowsForPeriod(rows, period)` se simplifico a `latestMonthRows(rows)` — ya no depende de `appState.filters.period`. Vuelve al comportamiento de antes de `SPRINT-17`.
- El Dashboard no se toco: ahi los tres filtros si comparan varias sedes a la vez y siguen funcionando igual que en `SPRINT-17`.
- Pendiente real (no resuelto aqui): Parques no tiene navegacion propia de mes como Hoteles (12 barras) — nunca la tuvo, no es una regresion de `SPRINT-17`, pero es candidata a HU futura.

### 3.20 — Seguimiento presupuestal en `SPRINT-19`

`SPRINT-19` restaura la pestaña "Seguimiento presupuestal" de v2, que se habia perdido en la modularizacion (solo quedaba un fragmento dentro del Dashboard):

- **Bug corregido primero:** `registerLoad()` en `app-state.js` sobrescribia `budgetRows` completo en cada carga en vez de fusionar — cargar un segundo mes borraba el primero. `mergeByKey()` ahora acepta un comparador de orden configurable; `budgetExecution` fusiona por `sede + periodo`.
- `src/services/csv-export.js` (nuevo): primera utilidad de exportacion CSV de V3.
- `src/domain/budget.js` (nuevo): `summarizeSite()` con 3 modos (`latest`/`accumulated`/mes especifico), maneja `dato_confiable`.
- `src/ui/views/budget.js` (nuevo): pestaña completa — selector de periodo, comparacion a escala comun de las 9 sedes, detalle de 12 meses por sede con desglose empresarial/individual, exportacion CSV consolidada y por sede.
- `src/config/navigation.js` y `src/main.js`: nuevo item `Presupuesto` entre Parques y Calendario comercial.
- No se fabricaron datos en `demo-data.js` para mostrar el desglose empresarial/individual ni `dato_confiable: no` — la demo actual no trae esos campos y no se inventaron cifras (regla de `CLAUDE.md`); la UI ya los maneja y se activan con datos reales.

### 3.21 — Control completo por sede en `SPRINT-20`

`SPRINT-20` integra la lectura presupuestal dentro de las vistas operativas por sede y eleva Parques al patron de Hoteles:

- `src/ui/site-budget-panel.js` (nuevo): componente compartido de presupuesto por sede; usa `siteRowsSorted()` y `summarizeSite()` de `domain/budget.js`.
- `src/ui/views/hotels.js`: agrega `renderSiteBudgetPanel()` dentro de cada hotel, entre metricas operativas y accion sugerida.
- `src/ui/views/parks.js`: agrega movimiento anual de 12 meses, seleccion de mes, cumplimiento del mes contra meta de uso, accion sugerida gris cuando falta dato, detalle diario con estado vacio y presupuesto por sede.
- `styles/app.css`: agrega `.site-budget-panel`, `.site-budget-bars` y `.site-budget-bar`.
- Decision de dato: si el mes activo no tiene presupuesto, se muestra el ultimo periodo presupuestal cargado con nota explicita, no se inventa ni se oculta.

### 3.22 — Dashboard ejecutivo compacto en `SPRINT-21`

`SPRINT-21` pule el dashboard general:

- `index.html`: subtitulo lateral cambia a `Unidad de Turismo`.
- `src/ui/views/dashboard.js`: el lateral de Hoteles/Parques deja de mostrar convenciones y pasa a `renderOccupancyInsight()` con promedio, barra apilada de semaforo, conteos por color y cobertura de datos.
- `src/ui/views/dashboard.js`: `budgetCompareRow()` elimina el badge `% cumplido` del encabezado para evitar duplicidad; el % queda solo junto a la barra `Real cumplido`.
- `styles/app.css`: KPIs superiores suben a 34px, hero mas compacto, y estilos nuevos `.occupancy-insight`, `.status-stack`, `.status-counts`, `.coverage-line`.

### 3.23 — Exportacion CSV de ocupacion en `SPRINT-22`

`SPRINT-22` cierra la brecha de reportes de ocupacion/inventario:

- `src/services/occupancy-export.js` (nuevo): arma los headers operativos de ocupacion/inventario, ordena filas, filtra por sede o tipo de sede y delega la descarga a `csv-export.js`.
- `src/ui/views/data-load.js`: agrega `Exportar ocupacion CSV` para descargar todo lo cargado/semilla en una sola salida.
- `src/ui/views/hotels.js`: agrega `Exportar hotel` y `Exportar hoteles`; el boton por hotel se deshabilita si la sede activa no tiene filas.
- `src/ui/views/parks.js`: agrega `Exportar parque` y `Exportar parques`; el boton por parque se deshabilita si la sede activa no tiene filas.
- `styles/app.css`: agrega estado visual para botones deshabilitados.

### 3.24 — Estado de informacion por sede en `SPRINT-23`

`SPRINT-23` agrega control de fuentes cargadas sin meter ruido en el Dashboard:

- `src/domain/data-readiness.js` (nuevo): calcula cobertura por sede para tres frentes: ocupacion/inventario, presupuesto y Revenue.
- `src/ui/views/data-load.js`: agrega la seccion `Estado de informacion por sede`, agrupada por Hoteles y Parques, con porcentaje de cobertura, chips por frente y fuente mas reciente.
- `src/ui/views/data-load.js`: despues de una carga exitosa, refresca solo `#readinessSummary`, conservando el mensaje de validacion de la tarjeta de carga.
- `src/ui/views/data-load.js`: corrige el texto de PDF Zeus directo; ya no se dice que esta pendiente.
- `styles/app.css`: agrega `.readiness-*` para tarjetas, barras y chips responsive.

### 3.25 — Auditoria de datos quemados en `SPRINT-24`

`SPRINT-24` no toca codigo runtime; deja una auditoria documental:

- `AUDITORIA_DATOS_QUEMADOS_SPRINT-24.md`: concluye que las vistas principales calculan desde `appState`, pero `appState` arranca precargado desde `src/data/demo-data.js`.
- Hallazgo principal: la V3 modular necesita separar modo demo de modo datos reales para no mostrar semillas como si fueran cargas del usuario (`TO-HU-071`).
- Hallazgo secundario: Hoteles/Parques usan fallback visual a agosto cuando no hay filas (`latestMonth(rows) || \`${year}-08\``); no inventa cifras, pero puede confundir el periodo operativo (`TO-HU-072`).

### 3.26 — Modo demo y datos reales en `SPRINT-25`

`SPRINT-25` cierra `TO-HU-071` y separa el arranque de la V3 modular:

- `src/state/app-state.js`: agrega `DATA_MODES`, `dataMode`, `setDataMode()` y la clave `localStorage` `comfenalco_data_mode_v1`.
- `src/state/app-state.js`: `dataForMode('real')` arranca con `loadedFiles`, `occupancyInventoryRows`, `parkRows`, `budgetRows` y `revenueRuleRows` vacios; `dataForMode('demo')` conserva las semillas de `demo-data.js`.
- `src/ui/views/data-load.js`: agrega el control visual de modo dentro de `Carga de datos`, refresca la vista al cambiar de modo y mantiene el mensaje de estado en el header.
- `src/ui/views/data-load.js`: `Exportar ocupacion CSV` queda deshabilitado si no hay filas y se habilita despues de cargar ocupacion/inventario en modo real.
- `src/main.js`: pasa `rerender: renderActiveView` a `bindDataLoadHandlers()` para que el cambio de modo pueda refrescar la vista activa.
- `styles/app.css`: agrega `.data-mode-panel` y `.mode-toggle`, con estado responsive.

### 3.27 — Mes activo sin fallback quemado en `SPRINT-26`

`SPRINT-26` cierra `TO-HU-072`:

- `src/ui/views/hotels.js`: elimina `|| \`${year}-08\`` del calculo de `activeMonth`; si la sede no tiene filas, el periodo activo es `null`.
- `src/ui/views/parks.js`: aplica el mismo criterio que Hoteles; no hay mes activo sin filas cargadas.
- `hotels.js` y `parks.js`: los estados vacios dicen `Sin periodo cargado` y `Detalle diario pendiente`, sin escribir `2026-08`.
- `src/ui/site-budget-panel.js`: acepta `activePeriod` vacio; muestra ultimo presupuesto solo si existe, con nota explicita de que no hay periodo de ocupacion cargado.

### 3.28 — Arquitectura IA para recomendaciones en `SPRINT-27`

`SPRINT-27` no toca runtime; deja una decision arquitectonica documentada:

- `ARQUITECTURA_IA_RECOMENDACIONES_SPRINT-27.md`: define capas para pasar de recomendacion deterministica a IA asistida.
- Decision: no poner llaves ni llamadas IA dentro del HTML local.
- Secuencia recomendada: cerrar bitacora/responsables (`TO-HU-026/027`), crear paquete de contexto IA (`TO-HU-073`), pilotear IA bajo demanda (`TO-HU-074`) y solo despues evaluar job diario (`TO-HU-077`).
- Backlog derivado: `TO-HU-073` a `TO-HU-077`.

### 3.29 — Contexto IA por sede en `SPRINT-28`

`SPRINT-28` cierra `TO-HU-073` y `TO-HU-076` sin conectar IA real:

- `src/domain/ai-recommendation-context.js` (nuevo): construye un contexto JSON por sede desde datos validados en `appState`.
- El contexto incluye fuentes, ocupacion diaria/resumen, presupuesto, Revenue, campanas, calendario, confianza y datos faltantes.
- `src/ui/ai-context-panel.js` (nuevo): muestra el contexto en Hoteles/Parques con tarjetas compactas y JSON bajo `details`.
- `src/ui/views/hotels.js` y `src/ui/views/parks.js`: insertan `renderAIContextPanel()` despues de la accion sugerida.
- `styles/app.css`: agrega `.ai-context-*`.
