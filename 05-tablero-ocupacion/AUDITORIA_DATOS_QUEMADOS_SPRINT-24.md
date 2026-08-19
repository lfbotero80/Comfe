# Auditoria de datos quemados — SPRINT-24

Fecha: 2026-08-19  
Agente: Codex  
Alcance: `05-tablero-ocupacion/v3-modular/`

## Objetivo

Auditar si la V3 modular muestra informacion operativa que no venga de datos cargados o de una fuente claramente declarada. La pregunta de control fue: "si abro el instrumento, que cifras esta mostrando porque fueron cargadas y cuales estan quemadas en codigo?".

## Resultado ejecutivo

La V3 modular no tiene cifras operativas escondidas dentro de las vistas principales: `dashboard.js`, `hotels.js`, `parks.js` y `budget.js` calculan sus metricas desde `appState`.

El riesgo real esta en que `appState` arranca precargado desde `src/data/demo-data.js`. Eso significa que el tablero, al abrir localmente, ya muestra ocupacion, presupuesto y parques antes de que el usuario suba archivos en esa sesion. Es valido para demo, pero no es valido como modo de datos reales sin una senal visual fuerte o sin poder apagar la semilla.

## Hallazgos

### H1 — Riesgo alto: datos demo precargados como estado inicial

**Hecho verificado:** `src/state/app-state.js` importa `DEMO_BUDGET_ROWS`, `DEMO_HOTEL_FORECAST` y `DEMO_PARK_ROWS`, registra archivos `demo-*` en `loadedFiles` y llena `occupancyInventoryRows`, `parkRows` y `budgetRows` desde esas constantes.

**Impacto:** el Dashboard, Hoteles, Parques, Presupuesto, exportaciones CSV y el nuevo estado de informacion por sede pueden mostrar informacion sin que el usuario haya cargado archivos en esa sesion. Aunque los nombres `demo-*` existen en estado, la primera lectura ejecutiva no dice con suficiente fuerza que son datos semilla.

**Conclusion:** no es un bug de calculo, pero si una deuda de producto. Para demo ayuda; para decision real puede falsear confianza.

**Accion propuesta:** crear un modo "datos reales" que arranque vacio, sin `demo-data.js`, y dejar el modo demo como opcion explicita.

### H2 — Riesgo medio: catalogos estructurales viven en codigo

**Hecho verificado:** `src/domain/sites.js`, `src/data/commercial-calendar.js`, `src/data/campaigns.js`, `src/data/colombia-holidays-2026.js` y `src/domain/operational-calendar.js` contienen sedes, roles, calendario comercial, campanas base, festivos y temporadas.

**Impacto:** estos datos no se cargan por archivo en la V3 modular. Algunos son estructura de negocio estable (sedes, roles, festivos 2026); otros son contenido operativo vivo (campanas/calendario) que podria cambiar sin desarrollo.

**Conclusion:** no todos son "datos quemados malos". Hay tres clases:

- **Reglas/estructura aceptables en codigo:** sedes, tipo de sede, umbrales del semaforo, festivos 2026, temporadas definidas.
- **Semillas aceptables si estan declaradas:** campanas y calendario migrados desde v2.
- **Contenido que debe migrar a carga/persistencia:** catalogo de campanas y calendario si Diana los va a operar sin desarrollador.

**Accion propuesta:** mantenerlos como semilla mientras el tablero es demo local, pero crear una HU futura para persistencia/carga de calendario y campanas cuando el flujo operativo se estabilice.

### H3 — Riesgo medio: mes activo cae a agosto cuando una sede no tiene filas

**Hecho verificado:** `src/ui/views/hotels.js` y `src/ui/views/parks.js` calculan el mes activo como `latestMonth(rows) || \`${year}-08\``. Si una sede no tiene datos, el estado vacio puede aparecer asociado a `2026-08`.

**Impacto:** no inventa ocupacion ni presupuesto, pero refuerza la percepcion que Luis Felipe ya senalo: "agosto" parece fijo para sedes sin dato. El tablero dice pendiente, pero el periodo puede leerse como una decision real.

**Conclusion:** esto debe corregirse en producto. Una sede sin filas deberia decir "Sin periodo cargado" o usar el periodo elegido solo cuando exista informacion.

**Accion propuesta:** crear HU especifica para reemplazar el fallback fijo por un estado sin periodo.

### H4 — Riesgo bajo: 2026 esta parametrizado como ano de trabajo, no como dato cargado

**Hecho verificado:** `global-filters.js`, `budget.js`, `colombia-holidays-2026.js` y `operational-calendar.js` trabajan con meses/festivos/temporadas 2026.

**Impacto:** es correcto para el tablero actual porque el instrumento se esta construyendo para 2026, pero no esta listo para cambiar de ano sin tocar codigo.

**Conclusion:** no bloquea el demo. Si el tablero pasa a operacion continua, el ano debe convertirse en configuracion o fuente cargable.

### H5 — Sin hallazgo: las vistas principales no contienen cifras de ocupacion/presupuesto hardcodeadas

**Hecho verificado:** las vistas consultan `appState.occupancyInventoryRows`, `appState.budgetRows`, `HOTELS`, `PARKS` y reglas de dominio. No se encontro una cifra operativa fija tipo "Farallones = 54.1%" escrita directamente en `dashboard.js`, `hotels.js`, `parks.js` o `budget.js`.

**Conclusion:** la modularizacion va bien: la deuda no esta en que las pantallas inventen datos, sino en que el estado inicial todavia mezcla demo y operacion.

## Clasificacion de datos encontrados

| Tipo | Archivo(s) | Riesgo | Decision recomendada |
|---|---|---:|---|
| Datos demo de ocupacion, presupuesto y parques | `src/data/demo-data.js`, `src/state/app-state.js` | Alto | Separar modo demo de modo datos reales |
| Sedes, roles y tipos de unidad | `src/domain/sites.js` | Bajo | Mantener como catalogo estructural |
| Umbrales de semaforo | `src/domain/occupancy.js`, `src/domain/budget.js` | Bajo | Mantener como regla de negocio versionada |
| Festivos y temporadas 2026 | `src/data/colombia-holidays-2026.js`, `src/domain/operational-calendar.js` | Bajo/medio | Mantener para 2026; parametrizar si se vuelve multi-ano |
| Calendario comercial y campanas base | `src/data/commercial-calendar.js`, `src/data/campaigns.js` | Medio | Mantener como semilla; migrar a carga/persistencia si lo opera negocio |
| Fallback visual a agosto | `src/ui/views/hotels.js`, `src/ui/views/parks.js` | Medio | Quitar fallback fijo cuando no haya filas |

## Recomendacion

No conviene eliminar `demo-data.js` de inmediato porque todavia sirve para revisar visualmente la V3 modular sin cargar archivos cada vez. Pero si conviene abrir el siguiente trabajo como una separacion clara:

1. **Modo demo:** arranca con datos semilla y lo declara visualmente.
2. **Modo datos reales:** arranca vacio, muestra sedes en gris y solo activa metricas despues de cargar archivos.

Esa separacion resuelve la preocupacion principal sin perder velocidad de revision.

## Evidencia revisada

- `src/state/app-state.js`: inicializacion de `appState` y merge de cargas.
- `src/data/demo-data.js`: filas semilla de Farallones, parques y presupuesto.
- `src/ui/views/dashboard.js`: calculos desde `appState` y filtros.
- `src/ui/views/hotels.js`: filas por hotel, mes activo, detalle diario y accion sugerida.
- `src/ui/views/parks.js`: filas por parque, mes activo y detalle diario.
- `src/ui/views/budget.js`: presupuesto por sede y exportacion.
- `src/domain/sites.js`: catalogo de sedes.
- `src/domain/occupancy.js`: umbrales y recomendaciones base.
- `src/domain/budget.js`: meses 2026 y reglas de cumplimiento.
- `src/domain/operational-calendar.js` y `src/data/colombia-holidays-2026.js`: calendario operativo.
- `src/data/commercial-calendar.js` y `src/data/campaigns.js`: semillas de calendario/campanas.
