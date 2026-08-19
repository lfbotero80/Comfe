# Registro de Sprints — Comfenalco IA

Registro correlativo de todos los sprints ejecutados en este repositorio, con el agente que hizo cada uno (`Claude Code` o `Codex`). Ver plantilla y reglas de cierre en `METODOLOGIA_SCRUM.md`. Entradas más recientes arriba.

**Antes de abrir un sprint nuevo, lee al menos las 2-3 entradas más recientes de este archivo.**

---

## SPRINT-46 — Menú lateral y header fijos al hacer scroll [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Commit:** `SPRINT-46 — Menu lateral y header fijos al hacer scroll (Claude Code)`

- **Objetivo del sprint:** Luis Felipe pidió que "el panel/menú lateral y el header no se muevan". El header (`.topbar`) ya tenía `position:sticky` desde antes; el que se iba con el scroll era el menú lateral (`.sidebar`) — en cualquier vista larga (Dashboard, Hoteles) había que volver arriba para cambiar de sección.

| HU | Título | Agente | Estado | Nota |
|---|---|---|---|---|
| HU-052 | Menú lateral fijo al hacer scroll | Claude Code | Hecha | Header ya estaba fijo; se agregó el mismo comportamiento al menú |

**Qué se hizo:** `.sidebar` pasa a `position:sticky; top:0; height:100vh; align-self:start; overflow-y:auto`. El `align-self:start` es necesario porque `.sidebar` es un ítem de grid (`.app-shell{grid-template-columns:252px 1fr}`) — sin eso, un ítem de grid se estira a todo el alto de la fila y `sticky` no tiene margen para desplazarse, queda inerte. `overflow-y:auto` es la salvaguarda para cuando el propio menú crezca más que la pantalla (más ítems de navegación a futuro). En el breakpoint móvil (`max-width:900px`, donde el layout pasa a una sola columna y el menú va apilado arriba del contenido) se revierte explícitamente a `position:static; height:auto; overflow:visible` — fijar el menú ahí no tiene sentido y competiría con el propio scroll de la página.

**Archivos tocados:** `05-tablero-ocupacion/v3-modular/styles/app.css` (regla `.sidebar` y su override dentro de `@media (max-width:900px)`).

**Validación realizada:** `node --check` sobre todos los módulos JS. Servidor local sin caché en `http://localhost:8083/` (puerto de prueba, no el 8055 de Luis Felipe). Medido por `getBoundingClientRect()` en cuatro posiciones de scroll (0, 400, 1200, 2500px sobre una página de ~3300px de alto): menú y header quedan en `top:0` en las cuatro. Prueba funcional: clic en "Parques" con la página desplazada a 1200px cambia de vista correctamente (el menú sigue interactivo, no solo visualmente fijo). Repetido en viewport móvil (375×812): `position:static` confirmado, sin cambio de comportamiento frente a antes del sprint. Consola sin errores.

**Nota de la sesión:** la herramienta de captura de pantalla del navegador quedó atascada (pantalla en blanco) durante la verificación visual, sin relación con el tablero — el DOM cargaba con contenido normal. La verificación se hizo por medición de layout (`getBoundingClientRect`) en vez de por captura, igual de concluyente para este cambio.

```
HANDOFF — SPRINT-46 Menu lateral y header fijos al hacer scroll
Agente:             Claude Code
Estado:             Cerrado
Commit:             SPRINT-46 — Menu lateral y header fijos al hacer scroll (Claude Code)

Que quedo listo:    .sidebar es sticky igual que .topbar. En vistas largas el
                    menu y el header ya no se van con el scroll. Revertido a
                    static en el breakpoint movil (<900px), donde el layout es
                    de una sola columna.

Que NO se toco:     Nada de logica ni de otras vistas. Cambio puramente de
                    styles/app.css.

Riesgos abiertos:   Ninguno identificado. Si el menu de navegacion crece mucho
                    a futuro, `overflow-y:auto` en .sidebar ya lo cubre.

Validacion:         node --check: todos los modulos -> pass
                    getBoundingClientRect en scroll 0/400/1200/2500px ->
                      sidebar y topbar siempre en top:0
                    Clic en "Parques" con pagina scrolleada a 1200px -> cambia
                      de vista (funcional, no solo visual)
                    Viewport movil 375x812 -> position:static, sin regresion
                    Consola sin errores
```

---

## SPRINT-45 — Se elimina el hospedaje de OpenAI Sites [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Commit:** `SPRINT-45 — Se elimina el hospedaje de OpenAI Sites (Claude Code)`

- **Objetivo del sprint:** cerrar `HU-051`, abierta desde la auditoría de `SPRINT-34`: había un `project_id` de un servicio de hosting de terceros en el repo, sin que nadie hubiera decidido si ese despliegue debía existir.

| HU | Título | Agente | Estado | Nota |
|---|---|---|---|---|
| HU-051 | Decidir el destino del `project_id` de OpenAI Sites | Luis Felipe / Claude Code | Hecha | Decisión: no se necesita |

**Qué se aclaró primero.** Luis Felipe mencionó que "con Codex creamos una página temporal lanzada desde GitHub". Al verificar aparecieron **dos hospedajes distintos**, no uno:

1. **GitHub Pages** — rama `gh-pages` en `github.com/lfbotero80/Comfe`, con el tablero completo. Es el que él conocía y autorizó.
2. **OpenAI Sites** — `05-tablero-ocupacion/v3-modular/.openai/hosting.json`, con `project_id: appgprj_6a86049a2e488191bbf7b19548624e9b`, commiteado por Codex en `c586bec` ("Hosting — Configuracion Sites para demo del tablero"). Otro proveedor, no el mismo. Este no lo había revisado nadie.

**Qué se verificó sobre la exposición real.** La rama `gh-pages` **no publica cifras de negocio**: `src/data/demo-data.js` quedó en tres arreglos vacíos desde `SPRINT-35`, y los datos de ocupación y presupuesto viven en `localStorage` de cada navegador. Lo publicado es la herramienta y los nombres de las sedes, no los números.

**Decisión de Luis Felipe (2026-08-19):** *"no la necesito"*. Se eliminó `.openai/hosting.json` y su directorio del repo.

**Límite explícito de este sprint:** borrar el archivo **no da de baja el sitio si llegó a publicarse**. El archivo es solo la configuración local que apunta al proyecto; si Codex alcanzó a desplegar, el sitio sigue vivo en la cuenta de OpenAI hasta que se elimine desde ahí. Queda anotado como acción de Luis Felipe, no del repo.

**Archivos tocados**

- `05-tablero-ocupacion/v3-modular/.openai/hosting.json`: eliminado (con su directorio).
- `BACKLOG.md`, `SPRINTS.md`: cierre de `HU-051`.

**Validación realizada:** `git rm` sobre el único archivo del directorio; `.openai/` ya no existe en el árbol de trabajo. No se tocó código de la aplicación, así que no hay superficie funcional que revalidar. La regla que este incidente originó ya está escrita en `METODOLOGIA_SCRUM.md` (sección de commits sin rastro y de despliegue a terceros) y se mantiene.

**Riesgos / pendientes:** `gh-pages` todavía contiene una copia de `.openai/hosting.json`, porque se publicó el directorio completo. Se limpia solo en el próximo redespliegue desde `main`. Un `project_id` por sí solo no otorga acceso, así que no es una credencial filtrada, pero conviene que el redespliegue ocurra.

```
HANDOFF — SPRINT-45 Se elimina el hospedaje de OpenAI Sites
Agente:             Claude Code
Estado:             Cerrado
Commit:             SPRINT-45 — Se elimina el hospedaje de OpenAI Sites (Claude Code)

Que quedo listo:    HU-051 cerrada. `.openai/hosting.json` eliminado del repo
                    por decision de Luis Felipe: el unico hospedaje que quiere
                    es GitHub Pages (rama gh-pages). El de OpenAI Sites era un
                    segundo destino que nadie habia revisado.

Que NO se toco:     Nada de la aplicacion. gh-pages sigue como estaba.

Riesgos abiertos:   - Borrar el archivo NO da de baja el sitio si Codex alcanzo
                      a publicarlo. Eso se elimina desde la cuenta de OpenAI;
                      es accion de Luis Felipe, no del repo.
                    - gh-pages aun tiene una copia del archivo; se limpia en el
                      proximo redespliegue desde main.
                    - gh-pages va atrasada en SPRINT-42: le faltan 43, 44 y 45.

Validacion:         git rm sobre el unico archivo del directorio
                    `.openai/` ya no existe en el arbol de trabajo
                    Sin cambios de codigo -> sin superficie funcional a probar
```

---

## SPRINT-44 — Riesgo por sede pasa de texto a gráfico [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Commit:** `SPRINT-44 — Riesgo por sede pasa de texto a grafico (Claude Code)`

- **Objetivo del sprint:** el bloque que reemplazó al cuadrante en `SPRINT-43` era correcto pero no era visual. Luis Felipe lo rechazó de inmediato: *"pero es que eso no se parece a un dashboard visual, eso es demasiado texto."* Tenía razón: se había cambiado un gráfico malo por párrafos.

| HU | Título | Agente | Estado | Nota |
|---|---|---|---|---|
| TO-HU-100 | Riesgo por sede como gráfico, no como texto | Claude Code | Hecha | Barras divergentes contra la meta |

**Qué se hizo**

El bloque **"Riesgo por sede"** pasa a ser un **gráfico de barras divergentes contra la meta**. Cada sede es una fila con dos barras finas: ocupación arriba (meta 70%), presupuesto abajo (meta 90%). El eje vertical central es la meta; la barra crece **hacia la izquierda si está por debajo** y **hacia la derecha si está por encima**. El tipo de riesgo deja de ser una etiqueta escrita y pasa a ser la **forma** de la fila:

- dos barras a la izquierda → problema comercial y financiero a la vez
- solo la de arriba a la izquierda → problema de ocupación
- solo la de abajo a la izquierda → problema de ejecución presupuestal
- ambas a la derecha → sede en meta
- barra rayada con `s/d` → no hay dato, y se distingue a simple vista de una sede en crisis

Las filas se ordenan por gravedad (ambos → ocupación → presupuesto → en meta → sin dato) y las sedes sin información suficiente quedan atenuadas al final, no compitiendo con las críticas.

**Detalles de lectura corregidos durante el sprint** (los tres se detectaron mirando el render, no el código):

1. Los porcentajes quedaban pegados al borde del panel, lejos de su propia barra. Ahora cada barra lleva su valor en una columna fija de 38 px a su derecha: quedan alineados entre sedes y adyacentes a su barra.
2. Los nombres de sede se cortaban con puntos suspensivos (`Ecoparque Mario Ar...`). La columna pasó a 152 px y los nombres largos parten en dos líneas en vez de truncarse — en un tablero directivo la sede tiene que quedar identificable.
3. El panel quedaba con ~550 px de hueco muerto abajo, porque la columna vecina (*Prioridad directiva*) es más alta. Las filas ahora se reparten el alto disponible (`grid-auto-rows:minmax(30px,1fr)`), sin apretarse cuando el panel es corto.

La escala está topada en 50 puntos de brecha (`GAP_SCALE`); más allá de eso la barra se dibuja rayada para no mentir sobre el tamaño de la diferencia.

**Archivos tocados**

- `src/ui/views/dashboard.js`: `renderRiskGroups()` y `renderGapRow()` reemplazan el listado de grupos con texto por el gráfico divergente; `renderGapBar()` calcula lado, ancho y tope, y emite el valor junto a su barra.
- `styles/app.css`: se retiró el CSS de `.risk-group*` / `.risk-item*` / `.risk-metric*` y se agregó `.gap-legend`, `.gap-chart`, `.gap-row`, `.gap-name`, `.gap-bars`, `.gap-line`, `.gap-bar`, `.gap-axis`, `.gap-fill`, `.gap-value` y el estado `.gap-bar.empty`. El override móvil pasa a `88px` de columna de nombre.

**Validación realizada:** `node --check` sobre todos los módulos JS. Servidor local sin caché en `http://localhost:8082/` (puerto de prueba, no el 8055 de Luis Felipe) respondiendo 200. Escenario cargado a propósito para que aparecieran los cinco casos a la vez: Piedras Blancas 30%/50% (ambos bajos), Quirama 40%/95% (solo ocupación), Balandú 85%/60% (solo presupuesto), Farallones 90%/98% (en meta) y Salados 60% sin presupuesto (dato insuficiente). Se verificó en el render que el orden, el lado de cada barra, el color y el rayado correspondían al caso. Consola sin errores. Las 6 vistas (`dashboard`, `hotels`, `parks`, `calendar`, `campaigns`, `decisions`) renderizan contenido.

**Riesgos / pendientes:** la lectura depende de que las metas (70% ocupación, 90% presupuesto) sean las correctas; están declaradas en la leyenda para que se puedan discutir. Falta la confirmación visual de Luis Felipe sobre esta versión — es la segunda iteración del mismo bloque y la primera fue rechazada por él, así que no se da por buena sin su visto.

```
HANDOFF — SPRINT-44 Riesgo por sede pasa de texto a grafico
Agente:             Claude Code
Estado:             Cerrado
Commit:             SPRINT-44 — Riesgo por sede pasa de texto a grafico (Claude Code)

Que quedo listo:    El bloque "Riesgo por sede" del Dashboard general ya no es
                    un listado de grupos con texto: es un grafico de barras
                    divergentes contra la meta. Ocupacion arriba (meta 70%),
                    presupuesto abajo (meta 90%), eje central = meta, izquierda
                    = por debajo, derecha = por encima. El tipo de riesgo se ve
                    en la forma de la fila. Sin dato = barra rayada con "s/d".

Que NO se toco:     El dominio. `dashboard-command.js` y `riskGroupFor()` quedan
                    igual que en SPRINT-43. Este sprint es solo presentacion.

Riesgos abiertos:   - Falta el visto bueno visual de Luis Felipe. Es la segunda
                      iteracion de este bloque; la primera la rechazo.
                    - Las metas 70/90 estan cableadas (OCCUPANCY_TARGET,
                      BUDGET_TARGET). Si cambian, cambia toda la lectura.

Validacion:         node --check: todos los modulos -> pass
                    Servidor sin cache :8082 -> 200
                    5 escenarios (ambos bajos / solo ocupacion / solo
                    presupuesto / en meta / sin dato) -> forma y orden correctos
                    Consola sin errores; 6 vistas renderizan
```

---

## SPRINT-43 — Riesgo por sede reemplaza el cuadrante [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** Luis Felipe reportó que el plano cartesiano "no se entiende, no se lee fácil". Al revisarlo aparecieron tres defectos reales, no solo de presentación. Eligió reemplazarlo (opción B) en vez de repararlo.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-099 | Reemplazar el cuadrante por lectura agrupada por tipo de riesgo | Claude Code | Hecha | Corrige de paso 3 defectos verificados |

### Resumen de cierre

**Los tres defectos que se encontraron al analizar (verificados numéricamente, no supuestos):**

1. **Cuatro sedes se confundían entre sí.** `shortName()` reducía `Hosteria Los Farallones` y `Camping Los Farallones` ambas a "Farallones", y `Hotel Piedras Blancas` con `Parque Piedras Blancas` ambas a "Piedras Blancas" — justo los dos pares que `CLAUDE.md` insiste en no mezclar por ser unidades de negocio distintas.
2. **La línea de meta de presupuesto estaba mal calibrada.** Las coordenadas usaban `min(pct,120)/1.2` pero la línea se dibujaba en `bottom:90%`, que corresponde a **108% de ejecución**, no al umbral de 90%. Toda sede que cumplía bien (90–107%) aparecía *debajo* de la línea, como si incumpliera. El eje X sí era 1:1, lo que hacía la mezcla más engañosa.
3. **Las sedes sin dato caían en el cuadrante "Acción prioritaria".** Sin ocupación o sin presupuesto, el punto se ubicaba en `(4,4)` — la esquina inferior izquierda, literalmente rotulada como acción prioritaria. Una sede de la que no se sabía nada se veía igual que una en crisis.

**Qué reemplaza al cuadrante:** un bloque **"Riesgo por sede"** que responde la misma pregunta (qué tipo de problema tiene cada sede) sin exigir interpretar coordenadas. Agrupa en cinco categorías con nombre explícito — ocupación y presupuesto bajos / solo ocupación / solo presupuesto / ambos en meta / sin información suficiente — y por cada sede muestra las dos cifras con su meta y la brecha en puntos, así no hace falta ninguna línea de referencia.

- `src/domain/dashboard-command.js`: `riskGroupFor()` clasifica el tipo de riesgo; exporta `BUDGET_TARGET`. Una sede sin ocupación o sin presupuesto confiable queda en `insufficient`, nunca en un grupo de riesgo.
- `src/ui/views/dashboard.js`: `renderRiskGroups()` reemplaza a `renderQuadrant()`. `shortName()` ahora conserva la palabra que distingue (Hotel/Parque/Camping/Hostería) — verificado que las 9 sedes producen etiquetas únicas.
- **Se corrigió el mismo error de calibración en las barras verticales de presupuesto**, que compartían la escala y la línea mal ubicada: la meta se dibuja ahora en `75%` de altura, que es donde cae el 90% real.
- `styles/app.css`: se eliminó todo el CSS del cuadrante (20 reglas, ninguna usada en otro lado) y se agregó el de los grupos de riesgo.

**Validación realizada:** `node --check`; verificación numérica de que las 9 etiquetas cortas son únicas; prueba en navegador limpio con 4 escenarios construidos a propósito, uno por grupo — Piedras Blancas (30% ocup / 50% ppto) → "ambos bajo meta"; Quirama (40% / 95%) → "solo ocupación"; Balandú (85% / 60%) → "solo presupuesto"; Farallones (90% / 98%) → "ambos en meta"; las 5 sedes sin datos quedaron correctamente en "Sin información suficiente" y fuera de cualquier grupo de alerta. Las 6 vistas sin errores de consola.

---

## SPRINT-42 — Top 3 accionable con campanas y bitacora [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2, E3
- **Objetivo del sprint:** cerrar `TO-HU-082`, que Codex dejó explícitamente pendiente en `SPRINT-31` y `SPRINT-32`: el bloque "Prioridad directiva" existía como primera lectura, pero le faltaba relación con campañas y bitácora para servir como seguimiento operativo.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-082 | Top 3 acciones con responsable, fuente, campañas y bitácora | Claude Code | Hecha | Cierra el pendiente de `SPRINT-31`/`SPRINT-32` |

### Resumen de cierre

**Qué le faltaba:** el top 3 decía **qué** hacer ("activar campaña de choque"), con responsable y fuente, pero no **con qué** hacerlo ni **qué se había decidido antes**. Sin eso, cada revisión obligaba a salir a Campañas y a Bitácora para reconstruir el contexto.

**Qué cambió:**

- `src/domain/dashboard-command.js`: cada fila del mando expone ahora `campaigns` (campañas aplicables del catálogo) y `lastDecision` (último registro de bitácora de esa sede, completo — antes solo se extraía el responsable).
- `src/ui/views/dashboard.js`: `renderPriorityItem()` muestra tres capas por sede — la acción, las campañas disponibles con su tarifa, y el último registro de bitácora con responsable, fecha y estado.
- `styles/app.css`: `.priority-body` y `.priority-line` con acento distinto para campaña (lima) y bitácora (verde).

**Decisión de criterio:** las campañas se sugieren según la **señal comercial** (severidad de ocupación), no según el estado combinado. Si una sede está en rojo por ejecución presupuestal y su ocupación está bien, una campaña no es la respuesta correcta y no se ofrece — la acción ya dice "revisar ejecución presupuestal".

**Ausencias explícitas:** cuando no hay campaña aplicable o no hay registro previo, se dice ("Sin campana aplicable en el catalogo para este tramo", "Sin registro previo en bitacora · responsable por definir") en vez de omitir la línea. La ausencia también es información operativa.

**Validación realizada:** `node --check`; prueba end-to-end en navegador limpio: se cargó ocupación baja de Hotel Piedras Blancas (25-30%), se registró una decisión en Bitácora ("Activar Wellness Passport para septiembre", Sandra Ruiz, En seguimiento) y apareció en el top 3; luego se creó la campaña "Wellness Passport" y apareció como campaña disponible con su tramo. Las sedes sin registro muestran la ausencia explícita. Las 6 vistas cargan sin errores de consola.

**Hallazgo durante la prueba (relevante para el reporte de "solo menú y header"):** una pestaña abierta desde antes de `SPRINT-40` lanzó `The requested module './occupancy.js' does not provide an export named 'classifyOccupancyValue'` — un módulo cacheado viejo junto a uno nuevo. Se confirmó que el export existe en disco y que el servidor lo entrega correctamente; en contexto limpio no ocurre. Es exactamente el modo de falla que `SPRINT-40` corrige de aquí en adelante, y confirma que el síntoma que reportó Luis Felipe era caché y no código.

---

## SPRINT-41 — Historial de cargas de archivos [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** mostrar el historial de archivos cargados —fecha, nombre, tipo y responsable— para poder auditar de dónde salió cada dato del tablero.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-097 | Historial de cargas de archivos | Claude Code | Hecha | El dato ya se capturaba; faltaba la vista |

### Resumen de cierre

**Verificación previa que redujo el alcance:** antes de escribir la HU se revisó el código y `appState.loadedFiles` **ya capturaba y persistía** los cuatro campos pedidos (`loadedAt`, `filename`, `contractId`, `loadedBy`) más filas aceptadas y rechazadas, en `localStorage` desde `SPRINT-35`. Ninguna vista los mostraba. Por eso el sprint fue construir la pantalla, no capturar datos nuevos.

**Qué se construyó:**

- `src/ui/load-history-panel.js` (nuevo): tabla del historial dentro de `Cargar datos`, ordenada de más reciente a más antigua, con fecha y hora, nombre del archivo, formato, tipo de dato, responsable y filas aceptadas/rechazadas. Incluye export CSV propio.
- `src/ui/views/data-load.js`: monta el panel y lo refresca en vivo tras cada carga exitosa (`refreshLoadHistory()`), con el mismo patrón que el bloque de cobertura por sede — sin volver a renderizar toda la pantalla, para no borrar los mensajes de validación.
- `styles/app.css`: `.format-chip` para el formato del archivo.

**Sobre la ambigüedad de "tipo de archivo" (quedaba por definir en el backlog):** se muestran **los dos sentidos**, porque ambos sirven para auditar y ninguno reemplaza al otro — el **tipo de dato** (contrato: ocupación / presupuesto / Revenue), que ya se guardaba, y el **formato** (`.pdf` / `.csv` / `.json`). El formato se deriva del nombre del archivo con `getExtension()` en vez de guardarse como campo nuevo, para que el historial ya existente también lo muestre y no haga falta migrar nada.

**Validación realizada:** `node --check` en todos los módulos; en navegador: el historial aparece con la carga previa; se definió "Diana Florez" como responsable activo y se cargó `presupuesto-marzo.csv`, apareciendo de inmediato arriba con responsable, formato `.csv` y tipo `Presupuesto y ejecucion`; export CSV interceptado y verificado (BOM, separador `;`, 8 columnas); tras recargar la página el historial persiste completo; las 6 vistas cargan sin errores de consola.

**Nota:** el historial es local al navegador, igual que el resto de los datos — Diana verá sus propias cargas, no las de otra persona. Se resuelve con el backend pendiente (`TO-HU-092`/`TO-HU-093`).

---

## SPRINT-40 — Servidor local sin cache [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / soporte de desarrollo
- **Objetivo del sprint:** eliminar la causa raíz de un problema recurrente: el navegador servía una mezcla de módulos viejos y nuevos, y el tablero aparecía a medias (solo menú y header, o pestañas que ya no existían) aun con el código correcto en disco.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-098 | Servidor local sin caché | Claude Code | Hecha | Deja de aparecer código viejo mezclado con nuevo |

### Resumen de cierre

**El problema, que ya se había manifestado cuatro veces:** el tablero usa módulos ES (`type="module"`), que los navegadores cachean de forma agresiva. `python3 -m http.server` no envía ninguna cabecera de caché, así que el navegador reutilizaba módulos viejos junto con otros nuevos. Los síntomas variaban — una pestaña `Presupuesto` que ya no existía en el código, un dashboard que se quedaba solo con menú y header, cifras que no reflejaban el último cambio — y en los cuatro casos el código en disco estaba correcto. Durante el desarrollo me obligó dos veces a levantar servidores en puertos nuevos para poder verificar cambios, y a Luis Felipe le costó dos reportes de "se rompió".

**Qué cambió:**

- `05-tablero-ocupacion/servidor-local.py` (nuevo): equivalente a `python3 -m http.server` pero enviando `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`, `Pragma: no-cache` y `Expires: 0`. Así el navegador revalida siempre y lo que se ve corresponde al código en disco.
- `05-tablero-ocupacion/abrir-v3-modular.command`: usa ese servidor en vez de `http.server`. Resuelve la ruta base con `pwd` para poder invocar el script desde la carpeta del tablero.

**Validación realizada:** `curl -I` confirma las tres cabeceras en los módulos JS servidos; el tablero carga completo en puertos limpios (`8062`, `8070`) con el código actual; el menú se sirve correcto (6 secciones, sin `Presupuesto`).

**Límite conocido:** una pestaña que ya visitó el puerto **antes** de este cambio puede seguir usando su caché previa; la primera vez hace falta una recarga forzada (o abrir una ventana privada). De ahí en adelante ya no vuelve a pasar, porque el servidor pide no cachear.

---

## SPRINT-39 — Cifras ajustadas a la realidad [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** garantizar que ninguna cifra del tablero sobreestime ni subestime la realidad — instrucción explícita de Luis Felipe. Resuelve de raíz `TO-HU-061`/`TO-HU-083` ("Todo 2026" se veía igual a un mes).

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-061 | "Todo 2026" con lectura anual real | Claude Code | Hecha | La causa no era visual: mostraba un solo día |
| TO-HU-083 | Lectura anual distinta de la mensual | Claude Code | Hecha | Mejor/peor mes + cobertura por sede |
| TO-HU-096 | Cifras sin sobre/subestimar | Claude Code | Hecha | Ponderación por inventario y misma definición en todas las pantallas |

### Resumen de cierre

**Hallazgo (medido, no deducido).** Se cargó un caso controlado —marzo 20%, agosto 90% en la misma sede— y se comprobó que con el filtro en "Todo 2026" el Dashboard mostraba **90%**: tomaba la última fila de la serie completa, no el año. Por eso "Todo 2026" se veía idéntico a agosto — literalmente era agosto. El presupuesto, en cambio, sí acumulaba bien, así que el filtro anual mezclaba un presupuesto anual real con una ocupación de un solo día.

**Segundo hallazgo, más grave:** "un mes" tampoco significaba lo mismo en cada pantalla. El Dashboard mostraba el último día del mes; Hoteles mostraba el promedio del mes. La misma sede y el mismo mes daban dos cifras distintas según dónde se mirara.

**Qué cambió:**

- `src/domain/occupancy-aggregate.js` (nuevo): `aggregateOccupancy(rows)` calcula la ocupación de un periodo como `sum(unidades_ocupadas) / sum(inventario_total)` — **ponderada por inventario, no promedio simple de porcentajes**. Cuando el inventario varía entre días (bloqueos, mantenimiento), el promedio simple distorsiona: 20/100 un día y 9/10 otro da 55% como promedio simple, pero la ocupación real del periodo es 29/110 = **26.4%**. Devuelve además siempre la cobertura del cálculo (días contados, meses, rango de fechas y filas descartadas por datos inválidos).
- `src/domain/occupancy.js`: nuevo `classifyOccupancyValue(pct)` para clasificar cifras agregadas **sin** aplicar reglas de calendario. Un cierre operativo o un festivo son propiedades de un día concreto y no pueden trasladarse a un promedio de varios días sin falsear la lectura.
- `src/domain/dashboard-command.js`: la ocupación por sede pasa a ser la agregada del periodo. El KPI consolidado también se pondera por inventario en vez de promediar las tasas de cada sede — una sede de 500 cupos y una de 48 habitaciones no pesan igual.
- `src/ui/views/dashboard.js`: el KPI declara exactamente sobre qué se calculó (`29 de 110 unidades · 1 de 9 sedes · 2 día(s) cargado(s)`) y advierte cuando mezcla habitaciones con cupos, que no son unidades comparables. La matriz por sede muestra la cobertura y, cuando hay más de un mes cargado, el mejor y peor mes.
- `src/ui/views/hotels.js` y `parks.js`: su `monthSummary` adopta la misma agregación ponderada, de modo que Dashboard, Hoteles y Parques dan la misma cifra para el mismo mes. Las 12 barras mensuales quedan sobre la misma base.

**Verificación con datos controlados (caso de inventario variable):**

| Filtro | Antes | Ahora | Comprobación |
|---|---|---|---|
| Todo 2026 | 90% | **26.4%** | 29/110 ✓ |
| Marzo 2026 | 20% | 20.0% | 20/100 ✓ |
| Agosto 2026 | 90% | 90.0% | 9/10 ✓ |
| Hoteles (agosto) | 90.0% | 90.0% | coincide con el Dashboard ✓ |

El promedio simple habría dado 55% para el año — más del doble de la cifra real. Ese es exactamente el tipo de sobreestimación que este sprint elimina.

**Decisión deliberada — qué NO se hizo:** no se excluyeron los días de cierre operativo del cálculo. Incluirlos podría leerse como subestimar el desempeño comercial, y excluirlos como inflarlo; es una decisión de negocio, no técnica. Se dejó la versión neutra (todos los días cargados, con la cobertura declarada) y queda como pregunta abierta para Luis Felipe.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/domain/occupancy-aggregate.js` (nuevo), `src/domain/occupancy.js`, `src/domain/dashboard-command.js`, `src/ui/views/dashboard.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`.

**Validación realizada:** `node --check` en todos los módulos; servidor en puerto limpio (`8062`) para evitar la caché de módulos ES que volvió a aparecer durante la prueba; caso controlado de inventario variable verificado contra aritmética manual en los 4 escenarios de la tabla; matriz mostrando cobertura y mejor/peor mes; las 6 vistas cargan sin errores de consola.

**Pendientes para revisar:** (1) decidir si los días de cierre operativo deben excluirse del promedio; (2) las cifras del Dashboard van a **bajar** frente a lo que se veía antes — no es una regresión, es la corrección de una sobreestimación.

---

## SPRINT-38 — Presupuesto dentro de Hoteles y Parques [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** disolver el módulo independiente "Presupuesto" y llevar el control presupuestal a dos niveles dentro de Hoteles y Parques — familia (comparación entre las sedes del grupo) y sede individual — para que toda la información de una sede viva en un solo lugar.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-094 | Presupuesto por familia dentro de Hoteles/Parques | Claude Code | Hecha | Chip "Resumen" con comparación a escala de familia |
| TO-HU-095 | Detalle 12 meses + empresarial/individual dentro de cada sede | Claude Code | Hecha | Enriquece `site-budget-panel.js` |

### Resumen de cierre

**Análisis previo (pedido explícitamente por Luis Felipe antes de desarrollar):** se revisó el código de los tres lugares donde vivía el presupuesto y se encontró que esto **no era un "mover" sino un "reconstruir"** — el panel per-site (`site-budget-panel.js`, 61 líneas) solo tenía 2 barras del mes activo, mientras la pestaña (`views/budget.js`, 211 líneas) tenía selector de periodo, comparación a escala común, detalle de 12 meses, desglose empresarial/individual y export CSV. Borrar la pestaña sin más habría perdido 5 de 6 capacidades, incluido el desglose empresarial/individual que sostiene la regla de negocio de Quirama (`CLAUDE.md`: revenue individual solo sobre la porción individual).

**Qué cambió:**

- `src/services/budget-export.js` (nuevo): `exportBudgetRows()`, `budgetRowsForSites()`, `sortedBudgetRows()` — espeja el patrón de `occupancy-export.js` y saca la generación de CSV de la vista.
- `src/ui/budget-family-panel.js` (nuevo): comparación presupuestal de una familia con **escala común dentro de esa familia**, selector de periodo propio por familia (`modeByFamily`), total de la familia y export CSV del grupo.
- `src/ui/site-budget-panel.js` (enriquecido, 61 → 136 líneas): conserva las 2 barras y agrega el detalle de los 12 meses en un `<details>` colapsado (con columnas empresarial/individual) y export CSV de esa sede.
- `src/ui/views/hotels.js` y `src/ui/views/parks.js`: nuevo chip **"Resumen"** al inicio de los chips de sede, que es ahora la **entrada por defecto** (de lo general a lo particular). El contenido de cada sede queda igual, con el panel presupuestal enriquecido.
- `src/config/navigation.js` + `src/main.js`: se retira el item `Presupuesto` del menú lateral (de 7 a 6 secciones).
- `src/ui/views/data-load.js`: se agrega el export consolidado de presupuesto (las 9 sedes) junto al de ocupación que ya vivía ahí.
- `src/ui/views/budget.js`: **eliminado** — su lógica quedó repartida entre el componente de familia y el de sede.

**Decisiones de diseño tomadas (Luis Felipe dio go sin responder las 3 preguntas abiertas, así que se resolvieron con el criterio propuesto en el análisis):**
1. "Resumen" es la entrada por defecto de Hoteles/Parques.
2. Export: por familia en cada Resumen, por sede dentro de cada sede, y consolidado total en "Cargar datos".
3. Selector de periodo solo en el Resumen de familia — dentro de cada sede la tabla de 12 meses ya muestra el año completo.

**Por qué separar por familia mejora el análisis, no solo la navegación:** con las 9 sedes en escala común, Quirama ($687M) aplastaba visualmente a un parque como Mario Aramburo ($96M), que quedaba como una rayita. Separadas, la escala común vuelve a ser informativa dentro de cada grupo — y coincide con la regla del proyecto de que hoteles y parques son negocios estructuralmente distintos. La vista total de la unidad no se pierde: sigue en el KPI consolidado del Dashboard.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/services/budget-export.js` (nuevo), `src/ui/budget-family-panel.js` (nuevo), `src/ui/site-budget-panel.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js`, `src/ui/views/data-load.js`, `src/config/navigation.js`, `src/main.js`, `styles/app.css`, y `src/ui/views/budget.js` (eliminado).

**Validación realizada:** `node --check` sobre todos los módulos JS; búsqueda negativa de referencias huérfanas a la vista `budget`; servidor local en puerto limpio (`8060`) para evitar la caché de módulos ES que ya había tropezado en `SPRINT-33`; en navegador con presupuesto real de prueba cargado: Resumen de Hoteles muestra total de familia ($746.715.196 de $1.014.897.734, 74%) y comparación de las 4 sedes con escala propia; Quirama conserva el desglose empresarial ($611.901.171) / individual ($68.752.941) en su detalle de 12 meses; Resumen de Parques muestra "2 de 5 sedes con dato"; export CSV por familia interceptado y verificado (BOM, separador `;`, solo las sedes de esa familia); las 6 vistas del menú cargan sin errores de consola y el item `Presupuesto` ya no aparece.

**Pendientes para revisar:** validar visualmente con Diana si entrar por "Resumen" (en vez de directo al primer hotel) es el flujo que espera.

---

## SPRINT-37 — Datos reales y flujo de carga [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** eliminar el modo demo residual y ordenar la vista Cargar datos como flujo operativo: cargar primero, revisar estado después.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-090 | Sin modo demo residual | Codex | Hecha | Estado siempre real/vacio + persistencia local de cargas |
| TO-HU-091 | Orden operativo en Cargar datos | Codex | Hecha | Cargadores antes del estado consolidado |

### Resumen de cierre

Se elimino el modo demo como concepto ejecutable dentro de la V3 modular. `app-state.js` ya no exporta ni calcula `DATA_MODES`, `dataMode`, `setDataMode()`, `readDataMode()` ni `dataForMode()`: el tablero arranca siempre desde datos reales persistidos en `localStorage` o desde arrays vacios si no hay cargas. La migracion existente mantiene la limpieza de datos heredados y remueve tambien la llave antigua `comfenalco_data_mode_v1`, para que navegadores que alguna vez quedaron en `demo` no arrastren esa configuracion.

Se reordeno la vista `Cargar datos`: despues del encabezado y del responsable activo aparecen primero los bloques de carga de archivos (`.upload-grid`), luego el estado consolidado de informacion por sede, y al final la guia de interpretacion de archivos Zeus. Tambien se retiro el panel "Datos reales" y el CSS muerto asociado a `.data-mode-panel`/`.mode-toggle`.

**Qué cambió:** estado siempre real en `src/state/app-state.js`; orden operativo de `src/ui/views/data-load.js`; limpieza visual en `styles/app.css`.

**HUs trabajadas:** `TO-HU-090` y `TO-HU-091`, ambas `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/state/app-state.js`, `05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js`, `05-tablero-ocupacion/v3-modular/styles/app.css`.

**Validación realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; busqueda negativa de `DATA_MODES`, `dataMode`, `setDataMode`, `Modo demo`, `data-mode` y `mode-toggle` en runtime/CSS; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright con navegador limpio y con `comfenalco_data_mode_v1=demo` simulado confirmando que no aparece modo demo, se borra la llave heredada, no sobreviven filas demo simuladas y los cargadores aparecen antes del estado consolidado; carga real de `Forecast Quirama 1808.pdf` confirmando 15 filas aceptadas y persistidas.

**Decisiones / límites:** no se cambia parser Zeus, contratos de archivo, persistencia local, dashboard, Hoteles, Parques, Presupuesto, Campanas ni Bitacora. La persistencia sigue siendo local por navegador; no sincroniza datos entre usuarios.

**Pendientes para revisar:** si Diana necesita recibir los mismos datos que cargue Luis Felipe, sigue haciendo falta backend o almacenamiento compartido. El texto historico de sprints anteriores conserva referencias a "Modo demo" porque documenta decisiones pasadas; el runtime ya no lo usa.

```text
HANDOFF — SPRINT-37 Datos reales y flujo de carga
──────────────────────────────────────
HUs completas:        TO-HU-090, TO-HU-091
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/zeus-forecast-parser.js
                      v3-modular/src/domain/data-contracts.js
                      v3-modular/src/ui/views/dashboard.js
                      v3-modular/src/ui/views/hotels.js
                      v3-modular/src/ui/views/parks.js

Datos/contratos:      Sin cambios en contratos, plantillas ni parser Zeus.
                      Se mantiene persistencia local de archivos cargados.

Decisiones tomadas:   Se elimina el modo demo residual: todo opera como dato real.
                      En Cargar datos, primero se cargan archivos y luego se revisa
                      el estado consolidado por sede.

Riesgos residuales:
- La persistencia sigue siendo local por navegador; Diana no ve datos cargados por
  Luis Felipe si abre la URL en otro equipo/navegador.
- Los sprints historicos y algunos documentos de proceso conservan referencias a
  "Modo demo" como historia del proyecto, no como runtime vigente.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Busqueda runtime:   sin DATA_MODES/dataMode/setDataMode/Modo demo/data-mode -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  localStorage heredado demo se limpia -> pass
                      cargadores antes del estado consolidado -> pass
                      PDF Quirama 15 filas persistidas -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-090 y TO-HU-091.
```

---

## SPRINT-36 — Estado de carga solo en su módulo [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** evitar que el nombre/estado del archivo cargado quede visible globalmente en todas las pantallas.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-089 | Estado de archivo limitado a Cargar datos | Codex | Hecha | Oculta pill del header fuera de la vista de carga |

### Resumen de cierre

Se corrigio el comportamiento del estado global del header: el mensaje con nombre de archivo cargado ya no queda expuesto en Dashboard, Hoteles, Parques, Presupuesto, Calendario, Campanas ni Bitacora. `src/main.js` conserva internamente el texto del ultimo estado, pero `syncStatusVisibility()` solo lo muestra cuando la vista activa es `data-load`.

**Qué cambió:** `setStatus(text, type)` deja de decidir por si solo si el pill del header es visible. Ahora actualiza texto/clase y delega en `syncStatusVisibility()`, que oculta el pill cuando `activeView !== 'data-load'`. `renderActiveView()` llama esa sincronizacion en cada navegacion, por lo que el detalle del archivo se esconde inmediatamente al salir de Cargar datos y reaparece si el usuario vuelve a esa vista.

**HUs trabajadas:** `TO-HU-089` queda `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/main.js`.

**Validación realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright cargando `Forecast Quirama 1808.pdf`, verificando que el estado es visible en Cargar datos, queda oculto al navegar a Dashboard y vuelve a aparecer al regresar a Cargar datos.

**Decisiones / límites:** no se cambia la validacion de archivos, persistencia ni parser Zeus. El detalle de carga sigue existiendo dentro de la vista de carga y en la bitacora/localStorage, pero no se muestra como informacion transversal de todas las pantallas.

```text
HANDOFF — SPRINT-36 Estado de carga solo en su módulo
──────────────────────────────────────
HUs completas:        TO-HU-089
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/main.js

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/data-load.js
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/zeus-forecast-parser.js
                      v3-modular/src/state/app-state.js

Datos/contratos:      Sin cambios en contratos, plantillas ni datos.

Decisiones tomadas:   El estado de carga deja de ser global.
                      Solo se muestra cuando la vista activa es Cargar datos.

Riesgos residuales:
- Los mensajes de Campanas/Bitacora que usan setStatus tambien quedan ocultos fuera
  de Cargar datos; si se quieren conservar, necesitan un estado contextual propio.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  carga PDF Quirama -> estado visible en Cargar datos -> pass
                      navegar a Dashboard -> estado oculto -> pass
                      volver a Cargar datos -> estado visible -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-089.
```

---

## SPRINT-35 — Demo publico sin datos quemados [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** dejar la URL pública compartible sin datos de negocio quemados y con persistencia local verificable para cargas reales.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-087 | URL pública sin datos quemados | Codex | Hecha | Arranque real/vacío, sin demo operativo ni catálogos comerciales precargados |
| TO-HU-088 | Persistencia local completa | Codex | Hecha | Mantiene filas cargadas, archivos cargados y campañas agregadas tras recarga |

### Resumen de cierre

Se preparo la version compartible del tablero para Diana con dos certezas: la URL publica no arranca con datos de negocio quemados y lo que el usuario cargue persiste localmente en su navegador.

**Qué cambió:** `src/state/app-state.js` deja de importar datos semilla, arranca por defecto en `Datos reales` y mantiene el modo demo sin semillas. Se agrego una migracion unica (`comfenalco_public_storage_schema_v1`) para limpiar restos de demos anteriores en navegadores que ya hubieran abierto la URL. Ademas, `loadedFiles` y `campaignRows` ahora persisten en `localStorage`, igual que ya persistian ocupacion, presupuesto, Revenue y bitacora desde `SPRINT-33`.

Se vaciaron los modulos `src/data/demo-data.js`, `src/data/commercial-calendar.js` y `src/data/campaigns.js` para que no publiquen forecast, presupuesto, campanas ni calendario comercial precargados. Las plantillas CSV quedaron solo con encabezados, sin filas de ejemplo con cifras o tarifas. `src/domain/data-contracts.js` conserva contratos y reglas, pero sus `sampleRow` ya no incluyen cifras, tarifas o archivos fuente especificos. `src/ui/views/data-load.js` ya no muestra selector `Modo demo`; la pantalla de carga presenta `Datos reales` y aclara que la URL arranca sin datos precargados y guarda en el navegador.

**HUs trabajadas:** `TO-HU-087` y `TO-HU-088`, ambas `Hecha`.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/state/app-state.js`, `src/ui/views/data-load.js`, `src/domain/data-contracts.js`, `src/data/demo-data.js`, `src/data/commercial-calendar.js`, `src/data/campaigns.js`, y las tres plantillas CSV en `v3-modular/templates/`.

**Validación realizada:** `node --check` sobre todos los módulos JS; `git diff --check`; búsqueda negativa de cadenas de datos semilla/campañas/tarifas/presupuesto en `v3-modular/`; prueba Playwright en navegador limpio confirmando arranque sin ocupación ni presupuesto (`0 de 9 sedes con dato`, `$0 de $0`), carga real de `Forecast Quirama 1808.pdf` con 15 filas, persistencia tras recarga, historial de archivo cargado persistido, campañas iniciales en cero, campaña nueva persistida tras recarga.

**Decisiones / límites:** se mantienen nombres de sedes, roles, contratos, umbrales de semáforo y festivos oficiales Colombia 2026 como estructura/reglas del instrumento, no como datos operativos cargados. La persistencia sigue siendo local por navegador; no hay base de datos compartida ni sincronización entre usuarios.

**Pendientes para revisar:** si Diana necesita ver los mismos datos que Luis Felipe cargue, hará falta backend/persistencia centralizada. Si el calendario comercial y catálogo base deben volver, deben cargarse por archivo o por una fuente aprobada, no quemados en el build público.

```text
HANDOFF — SPRINT-35 Demo publico sin datos quemados
──────────────────────────────────────
HUs completas:        TO-HU-087, TO-HU-088
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/src/domain/data-contracts.js
                      05-tablero-ocupacion/v3-modular/src/data/demo-data.js
                      05-tablero-ocupacion/v3-modular/src/data/commercial-calendar.js
                      05-tablero-ocupacion/v3-modular/src/data/campaigns.js
                      05-tablero-ocupacion/v3-modular/templates/*.csv

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/dashboard.js
                      v3-modular/src/ui/views/hotels.js
                      v3-modular/src/ui/views/parks.js
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/zeus-forecast-parser.js

Datos/contratos:      No se cambiaron columnas obligatorias ni parser Zeus.
                      Se limpiaron datos semilla y plantillas con filas de ejemplo.

Decisiones tomadas:   La URL publica arranca en Datos reales, sin precarga.
                      Los datos cargados persisten localmente en el navegador.
                      Las campanas agregadas y el historial de archivos tambien persisten.

Riesgos residuales:
- La persistencia es local por navegador; Diana no ve datos cargados por Luis Felipe.
- Si el usuario borra cache/localStorage, pierde lo cargado.
- Calendario comercial y catalogo base quedan vacios hasta que se carguen o se apruebe una fuente.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Datos quemados:     rg negativo para seeds/campanas/tarifas/presupuesto -> pass
  Runtime navegador:  arranque limpio -> pass
                      PDF Quirama 15 filas -> pass
                      recarga conserva datos -> pass
                      campana nueva persiste -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-087 y TO-HU-088.
```

**Nota de autorización y verificación independiente (Claude Code, 2026-08-19):** este sprint incluye `git push` a `main` y despliegue a `gh-pages` — ambos requieren permiso explícito de Luis Felipe desde `SPRINT-34`. Luis Felipe confirmó directamente en el chat que autorizó esto con Codex por fuera de este registro, porque necesita exponer el desarrollo a Diana. Se verificó independientemente navegando a `https://lfbotero80.github.io/Comfe/`: el sitio está vivo, público, sin autenticación; Dashboard, Presupuesto, Calendario y Campañas confirmados sin datos reales de negocio (`0 de 9 sedes con dato`, `0 campañas`, `0 actividades`); sin errores de consola. **Efecto secundario que vale la pena tener presente:** `demo-data.js`, `commercial-calendar.js` y `campaigns.js` quedaron vacíos para todo el repositorio, no solo para el build público — la V3 modular local (`abrir-v3-modular.command`) ya no arranca con datos semilla; cualquier prueba local futura (de cualquier agente) necesita cargar archivos de ejemplo primero, ya no hay fixture rica precargada.

---

## SPRINT-34 — Documentación retroactiva: commit de hosting sin registro [Estado: Cerrado]

- **Agente(s):** Claude Code (documentación retroactiva de un commit de Codex sin registro)
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / proceso
- **Objetivo del sprint:** documentar retroactivamente el commit `c586bec` ("Hosting — Configuracion Sites para demo del tablero", Codex) que entró al repo sin HU, sin entrada en `SPRINTS.md`/`BACKLOG.md` y sin bloque `HANDOFF` — y cerrar el hueco de proceso que lo permitió.

### Resumen de cierre

**Qué se encontró:** Luis Felipe pidió revisar qué hizo Codex para subir el repo a GitHub. Al revisar el log, el commit `c586bec` (19:32:54, 2026-08-19) agrega un único archivo — `05-tablero-ocupacion/v3-modular/.openai/hosting.json`, con un `project_id` (`appgprj_6a86049a2e488191bbf7b19548624e9b`) — sin ninguna traza en `SPRINTS.md`, `BACKLOG.md`, `ROADMAP.md` ni `MAPA_CODIGO.md`. El mensaje del commit sugiere que Codex configuró (o empezó a configurar) un despliegue del tablero a un servicio de hosting de OpenAI ("Sites"), aparentemente en respuesta a la advertencia previa de Luis Felipe sobre que GitHub Pages privado no era la vía correcta para compartir con Diana.

**Lo que no se pudo verificar desde aquí (requiere revisión de Luis Felipe):** no hay forma de confirmar desde este entorno si ese `project_id` corresponde a un sitio ya publicado y accesible, ni si contiene datos reales de negocio (tarifas, presupuesto, ocupación de las 9 sedes) expuestos a un tercero. El archivo por sí solo es solo un puntero de configuración — no prueba que algo se haya publicado, pero tampoco lo descarta. **Se recomienda a Luis Felipe verificar directamente en su cuenta si existe un sitio activo asociado a ese `project_id`.**

**Qué se corrigió en el proceso (no en código):** se agregó una regla dura en `METODOLOGIA_SCRUM.md` (sección 2): ningún commit entra al repo sin HANDOFF y entrada en `SPRINTS.md`, sin importar qué tan chico sea. Se agregó también que publicar o desplegar el tablero en cualquier servicio de hosting de terceros (GitHub Pages, Vercel, Netlify, Sites de OpenAI, etc.) requiere permiso explícito de Luis Felipe antes de hacerlo, con el mismo criterio que ya regía para `git push` — incluyendo la preparación (archivos de configuración de despliegue). Se agregó el campo `Commit:` al bloque `HANDOFF` para que cada cierre de sprint quede atado a un hash real, no solo a una promesa de commit.

**No se modificó ni se eliminó `.openai/hosting.json`** — esa decisión (dejarlo, completarlo, o revertirlo) le corresponde a Luis Felipe una vez confirme si el hosting es algo que quiere o no.

**Archivos tocados:** `SPRINTS.md`, `METODOLOGIA_SCRUM.md`.

**Pendientes para revisar (Luis Felipe):** confirmar si el `project_id` de `.openai/hosting.json` corresponde a un sitio publicado y, si es así, decidir si se mantiene, se reconfigura como privado/protegido, o se elimina.

---

## SPRINT-33 — Persistencia real de datos operativos [Estado: Cerrado]

- **Agente(s):** Claude Code
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E1
- **Objetivo del sprint:** corregir un bug grave reportado por Luis Felipe — al subir PDFs reales de Zeus, la carga funcionaba pero desaparecía al recargar, mientras los datos semilla (demo) seguían apareciendo siempre, dando la sensación de estar "quemados".

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-086 | Persistencia real de ocupación/presupuesto/Revenue | Claude Code | Hecha | Bug grave: cero persistencia para los datos operativos desde siempre |

### Resumen de cierre

**Diagnóstico (reproducido en navegador antes de tocar código):** `appState.occupancyInventoryRows`, `budgetRows` y `revenueRuleRows` — los datos operativos reales, incluido cualquier PDF/CSV que se suba — **nunca se guardaban en `localStorage`**. Solo se persistían `dataMode`, `currentOperator` y `decisionRows` (bitácora, desde `SPRINT-29`). Reproducido paso a paso: subí un archivo real para Recinto Quirama en "Modo demo" (el modo por defecto) → cargó bien → recargué la página → Quirama volvió a "Sin datos de ocupación", mientras Hostería Los Farallones seguía mostrando su forecast de agosto (54.9%), igual que siempre. Confirmé además que cambiar a "Datos reales" **no** resolvía nada — ese modo solo cambia el punto de partida (vacío vs. semilla), pero tampoco persistía las cargas.

Esto no era una regresión de un sprint reciente — era el estado del proyecto desde que existe `v3-modular/` (ya lo había anotado en mi primera revisión de esta base, hace muchos sprints: "cero persistencia"). 32 sprints de trabajo agregaron persistencia para modo/responsable/bitácora, pero nunca para los datos operativos en sí.

**Qué cambió (`src/state/app-state.js`):**

- Nuevas claves `comfenalco_occupancy_rows_v1`, `comfenalco_budget_rows_v1`, `comfenalco_revenue_rows_v1`, con el mismo patrón ya probado de `decisionRows` (`try/catch`, validación de que el valor es un array antes de usarlo).
- Al iniciar, `appState` intenta leer estas tres claves primero; si no hay nada guardado, cae al comportamiento anterior (`dataForMode(mode)`: semilla en demo, vacío en real).
- `registerLoad()` persiste el resultado del merge inmediatamente después de fusionar cada contrato (ocupación, presupuesto, Revenue) — ya no solo en memoria.
- `setDataMode()` (el botón "Modo demo" / "Datos reales") ahora también persiste el reinicio: cambiar de modo es una acción explícita y deliberada (el propio botón lo anuncia: "datos semilla restaurados" / "cargue archivos para activar métricas"), así que el reinicio se guarda también en `localStorage`, no solo en memoria de sesión.

**Cómo se verificó (con dificultad — vale la pena dejarlo anotado):** el entorno de navegador de este sprint retenía en caché el módulo `app-state.js` entre recargas, incluso con pestaña nueva y hard-refresh — un problema de la infraestructura de prueba, no del código (confirmado leyendo la respuesta HTTP cruda vía `fetch(..., {cache:'no-store'})`, que sí traía el archivo correcto). Se resolvió cambiando a un puerto de servidor nuevo, lo que forzó una carga limpia. Con eso: subí un archivo real para Quirama, confirmé la persistencia en `localStorage` de inmediato, recargué la página real (navegación completa) y Quirama mantuvo el 70% cargado — el bug quedó resuelto y verificado en la UI real, no solo por inspección de código.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/state/app-state.js`.

**Validación realizada:** `node --check`; reproducción del bug original confirmada antes del fix; verificación aislada de la lógica vía `import()` con cache-busting (merge + persistencia correctos, incluyendo convivencia de datos semilla y datos reales); verificación end-to-end en UI real con servidor limpio (carga → recarga → dato persiste); verificación de que "Modo demo"/"Datos reales" siguen funcionando como reinicio explícito y ahora también persistido; las 6 vistas (Dashboard, Parques, Presupuesto, Bitácora, Calendario, Campañas) siguen sin errores de consola.

---

## SPRINT-32 — Prioridad Hoteles y cuadrante completo [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** corregir la prioridad directiva del Dashboard general para que Hoteles aparezca antes que Parques y el cuadrante incluya ambas familias con dato completo o parcial.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-085 | Prioridad Hoteles y cuadrante completo | Codex | Hecha | Hoteles primero; cuadrante muestra Hoteles y Parques, incluso con dato parcial |

### Resumen de cierre

Se corrigio la prioridad directiva del Dashboard general: Hoteles queda como primera familia de lectura y Parques como segunda. La matriz de mando y el bloque de prioridad directiva ordenan por familia antes de ordenar por criticidad interna, de manera que el director lee primero el estado hotelero y luego el de parques.

El cuadrante ocupacion vs presupuesto ya no excluye sedes por falta parcial de datos. Ahora muestra Hoteles y Parques en el mismo plano; las sedes con ocupacion o presupuesto incompleto aparecen en gris y con trazo diferenciado, para indicar estructura presente pero dato parcial. Se agrego convencion visual dentro del cuadrante para distinguir Hoteles, Parques y datos parciales.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/domain/dashboard-command.js`, `05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js` y `05-tablero-ocupacion/v3-modular/styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright confirmando que la matriz inicia con las 4 sedes hoteleras y que el cuadrante contiene 9 puntos: 4 Hoteles, 5 Parques y sedes parciales visibles.

**Riesgos / pendientes:** las sedes con datos parciales pueden agruparse visualmente cerca de los bordes del cuadrante cuando faltan ocupacion o presupuesto. `TO-HU-082` sigue pendiente para enriquecer el top de acciones con campanas/bitacora; `TO-HU-083` y `TO-HU-061` siguen pendientes para diferenciar mejor la lectura anual.

```text
HANDOFF — SPRINT-32 Prioridad Hoteles y cuadrante completo
──────────────────────────────────────
HUs completas:        TO-HU-085
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/domain/dashboard-command.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/hotels.js
                      v3-modular/src/ui/views/parks.js
                      v3-modular/src/ui/views/budget.js
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/validators.js

Datos/contratos:      No se cambiaron datos, contratos ni plantillas.

Decisiones tomadas:   La prioridad directiva del Dashboard general ordena por familia:
                      Hoteles primero, Parques despues; dentro de cada familia
                      aplica criticidad.
                      El cuadrante cartesiano ya no esconde sedes con datos parciales:
                      muestra Hoteles y Parques; parciales quedan en gris/dashed.
                      El filtro de unidad sigue funcionando; en "Todas las unidades"
                      el cuadrante contiene ambas familias.

Riesgos residuales:
- Sedes parciales se agrupan en los bordes del cuadrante; puede haber cercania visual
  entre etiquetas cuando varias sedes no tienen ocupacion o presupuesto.
- El top 3 ahora prioriza hoteles primero, pero TO-HU-082 sigue pendiente para enriquecer
  acciones con campanas/bitacora.
- La lectura anual diferenciada sigue pendiente en TO-HU-083/TO-HU-061.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  matriz con 4 hoteles primero -> pass
                      cuadrante con 9 puntos, 4 hoteles y 5 parques -> pass
                      parciales visibles -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-085.
```

---

## SPRINT-31 — Dashboard de mando visual [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** implementar una primera version del Dashboard de Mando con estado combinado y visualizaciones mixtas, reduciendo la dependencia de barras horizontales.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-079 | Estado general combinado | Codex | Hecha | Ocupacion, presupuesto y cobertura de datos |
| TO-HU-080 | Matriz de mando por sede | Codex | Hecha | Ocupacion, presupuesto, tendencia, accion y responsable |
| TO-HU-081 | Cuadrante ocupacion vs presupuesto | Codex | Hecha | Cada sede como punto de riesgo |
| TO-HU-084 | Lenguaje visual mixto | Codex | Hecha | Barras verticales, lineas, matriz, cuadrante y radar |

### Resumen de cierre

Se implemento la primera version runtime del Dashboard de Mando visual. Se creo `src/domain/dashboard-command.js` como capa de dominio para combinar ocupacion/uso, presupuesto, cobertura de datos, fuente y bitacora en filas directivas por sede. Este modulo calcula estado combinado, prioridad, accion sugerida base, responsable, fuente, tendencia, perfil radar y datos para cuadrante, evitando que `dashboard.js` mezcle reglas de negocio con HTML.

`src/ui/views/dashboard.js` se reescribio sobre esa capa y deja de depender de una lectura dominada por barras horizontales. La pantalla ahora muestra banda de mando, 3 KPIs directivos, cuadrante ocupacion vs presupuesto, prioridad directiva, tendencia anual en lineas, radar de perfil, barras verticales de cumplimiento presupuestal, matriz heatmap por sede y calidad del dato. `styles/app.css` agrega los estilos responsivos para estas visualizaciones. El documento `DISENO_DASHBOARD_MANDO_SPRINT-30.md` se actualizo con la decision de lenguaje visual mixto.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/DISENO_DASHBOARD_MANDO_SPRINT-30.md`, `05-tablero-ocupacion/v3-modular/src/domain/dashboard-command.js`, `src/ui/views/dashboard.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright desktop/mobile confirmando presencia de banda, cuadrante, radar, linea de tendencia, matriz, barras verticales y prioridad directiva; prueba de filtros verificando que Hoteles no muestra Parques, Parques no muestra Hoteles y Semaforo rerenderiza sin errores JS.

**Decisiones / límites:** `TO-HU-082` no se cierra: el bloque de prioridad directiva existe como primera lectura, pero falta profundizarlo con relacion mas rica a campanas/bitacora. `TO-HU-083` y `TO-HU-061` siguen pendientes: `Todo 2026` ya tiene tendencia anual visible, pero aun no es una experiencia anual completamente distinta a la mensual.

**Pendientes para revisar:** evaluar visualmente con Luis Felipe si el mix cuadrante/radar/linea/matriz ya se siente mas directivo; siguiente sprint recomendado: top 3 acciones con fuente, campana y bitacora (`TO-HU-082`) o lectura anual diferenciada (`TO-HU-083/061`).

```text
HANDOFF — SPRINT-31 Dashboard de mando visual
──────────────────────────────────────
HUs completas:        TO-HU-079, TO-HU-080, TO-HU-081, TO-HU-084
HUs pendientes:       TO-HU-082 pendiente para profundizar acciones
                      TO-HU-083 / TO-HU-061 pendientes para lectura anual

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/DISENO_DASHBOARD_MANDO_SPRINT-30.md
                      05-tablero-ocupacion/v3-modular/src/domain/dashboard-command.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/ui/views/hotels.js
                      v3-modular/src/ui/views/parks.js
                      v3-modular/src/ui/views/budget.js
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/validators.js

Datos/contratos:      No se cambiaron contratos, plantillas ni datos semilla.

Decisiones tomadas:   Se crea una capa de dominio para el mando directivo.
                      El Dashboard adopta visualizaciones mixtas: cuadrante,
                      matriz heatmap, lineas, barras verticales y radar.
                      Las barras horizontales dejan de ser el lenguaje dominante.
                      El top 3 queda como lectura inicial, no cierre completo
                      de TO-HU-082.

Riesgos residuales:
- El radar es util como perfil, pero no como lectura precisa; debe revisarse
  con Diana para confirmar si aporta o distrae.
- Si solo hay un mes de ocupacion cargado, la linea de ocupacion anual no
  aparece completa; es correcto porque no se inventan datos.
- La matriz en movil requiere scroll horizontal para ver todas las columnas.
- Falta enriquecer acciones con campanas/bitacora para cerrar TO-HU-082.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  desktop/mobile con banda, cuadrante, radar, linea,
                      matriz, barras verticales y prioridad directiva -> pass
                      filtros Hoteles/Parques/Semaforo -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-079, TO-HU-080, TO-HU-081 y TO-HU-084.
                      Parcial del frente de accion directiva: TO-HU-082 sigue pendiente.
```

---

## SPRINT-30 — Especificación Dashboard de Mando [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E2
- **Objetivo del sprint:** definir la lógica directiva del Dashboard general antes de volver a tocar código.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-078 | Especificación funcional del Dashboard de Mando | Codex | Hecha | Define reglas, jerarquía visual y HUs de implementación |

### Resumen de cierre

Se detuvo la inercia de seguir ajustando piezas visuales del Dashboard general sin una logica directiva cerrada. Se creo `05-tablero-ocupacion/DISENO_DASHBOARD_MANDO_SPRINT-30.md` como especificacion funcional previa a desarrollo. El documento declara que el Dashboard general debe decidir y priorizar, no resumir todas las secciones, y separa responsabilidades: Dashboard decide; Hoteles/Parques explican detalle operativo; Presupuesto profundiza finanzas; Carga controla fuentes; Bitacora registra compromisos.

La especificacion define la estructura objetivo del Dashboard de Mando: banda de estado general de unidad, tres indicadores directivos, matriz de mando por sede, cuadrante ocupacion vs presupuesto, top 3 acciones y bloque secundario de calidad del dato. Tambien define reglas propuestas para estado combinado por sede, estado general de la unidad y diferencia entre lectura mensual y `Todo 2026`.

Se alimento `BACKLOG.md` con nuevas HUs de implementacion: `TO-HU-079` estado general combinado, `TO-HU-080` matriz de mando por sede, `TO-HU-081` cuadrante ocupacion vs presupuesto, `TO-HU-082` top 3 acciones y `TO-HU-083` lectura anual distinta. `ROADMAP.md` quedo actualizado para que el siguiente sprint no vuelva a improvisar: primero dominio de mando + banda + matriz; despues cuadrante + acciones; finalmente lectura anual.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md` y `05-tablero-ocupacion/DISENO_DASHBOARD_MANDO_SPRINT-30.md`.

**Validacion realizada:** revision documental de `BACKLOG.md`, `ROADMAP.md`, ultimos sprints y `MAPA_CODIGO.md`; contraste contra `src/ui/views/dashboard.js` y `src/domain/strategic-recommendation.js`; `git diff --check`.

**Decisiones / límites:** No se toco codigo runtime en este sprint. Las HUs de implementacion quedan pendientes a proposito para no marcar como hecho un dashboard que aun no existe en pantalla. El proximo sprint recomendado debe empezar por una capa de dominio de mando antes de reordenar HTML/CSS.

**Pendientes para revisar:** validar con Luis Felipe si la estructura propuesta es la correcta antes de implementar; si se aprueba, abrir `SPRINT-31` con `TO-HU-079` y `TO-HU-080`.

```text
HANDOFF — SPRINT-30 Especificación Dashboard de Mando
──────────────────────────────────────
HUs completas:        TO-HU-078
HUs pendientes:       TO-HU-079, TO-HU-080, TO-HU-081,
                      TO-HU-082, TO-HU-083 quedan para implementacion

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/DISENO_DASHBOARD_MANDO_SPRINT-30.md

Archivos NO tocados:  05-tablero-ocupacion/v3-modular/src/ui/views/dashboard.js
                      05-tablero-ocupacion/v3-modular/src/domain/strategic-recommendation.js
                      05-tablero-ocupacion/v3-modular/styles/app.css
                      tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html

Datos/contratos:      No se cambiaron datos, contratos ni plantillas.

Decisiones tomadas:   El Dashboard general debe ser tablero de mando, no resumen.
                      La prioridad pasa a estado combinado, matriz por sede,
                      cuadrante ocupacion vs presupuesto y top 3 acciones.
                      La lectura mensual y Todo 2026 deben ser distintas.
                      La implementacion queda separada en HUs nuevas.

Riesgos residuales:
- Si se implementa sin validar la especificacion, se puede volver a iterar en
  circulo sobre estetica.
- El estado combinado depende de calidad de datos; sedes sin presupuesto o
  Revenue deben mostrarse como dato insuficiente, no como buen desempeno.
- TO-HU-010 sigue bloqueada para comparacion contra ano anterior por falta de
  fuente historica cargada.

Validación hecha:
  Documental:         backlog, roadmap, sprints y mapa revisados -> pass
  Producto:           dashboard actual contrastado contra objetivo directivo -> pass
  Estatica:           git diff --check -> pass
  Runtime:            no aplica; sprint sin cambios de codigo
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-078.
```

---

## SPRINT-29 — Bitácora y responsables locales [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** agregar trazabilidad local para cargas, modificaciones y decisiones operativas del tablero.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-026 | Bitácora de decisiones y responsables | Codex | Hecha | Vista propia con formulario manual y tabla de registros persistidos localmente |
| TO-HU-027 | Identificar quién carga o modifica datos | Codex | Hecha | Responsable activo asociado a cargas aceptadas y campañas nuevas |

### Resumen de cierre

Se agrego trazabilidad local al tablero modular. `src/state/app-state.js` ahora conserva un `currentOperator` persistido en `localStorage` (`comfenalco_operator_v1`) y una `decisionRows` persistida localmente (`comfenalco_decision_log_v1`). Cada carga aceptada desde `registerLoad()` genera un registro automatico con archivo, contrato, sede(s), responsable, filas cargadas y advertencias; cada campana creada desde el catalogo tambien deja registro con responsable, causa y tarifa/producto.

Se creo `src/ui/views/decisions.js` como vista propia `Bitacora de decisiones`, con formulario para registrar sede, tipo de decision, compromiso, responsable, fecha, estado y notas, mas tabla de eventos. `data-load.js` agrega el panel `Responsable activo` para que quien carga o modifica quede identificado antes de subir archivos. `navigation.js` y `main.js` incorporan la nueva vista al menu lateral, y `styles/app.css` agrega estilos para select/textarea, panel de responsable y formulario de bitacora.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/state/app-state.js`, `src/ui/views/data-load.js`, `src/ui/views/decisions.js`, `src/config/navigation.js`, `src/main.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright: registrar decision manual en Bitacora, definir responsable activo en Carga de datos, subir `Forecast Balandú 1808.pdf`, verificar mensaje de 14 filas cargadas con responsable, verificar registro automatico en Bitacora y persistencia tras recargar.

**Decisiones / límites:** La trazabilidad es local al navegador porque el producto sigue como demo local. No hay autenticacion real ni auditoria multiusuario; eso requiere backend. Se usa `Sin responsable definido` cuando alguien carga sin registrar responsable para no bloquear pruebas, pero la bitacora deja visible la omision.

**Pendientes para revisar:** definir si la version candidata necesita obligar responsable antes de cargar, y si `TO-HU-075` debe usar esta misma bitacora cuando exista IA bajo demanda.

```text
HANDOFF — SPRINT-29 Bitácora y responsables locales
──────────────────────────────────────
HUs completas:        TO-HU-026, TO-HU-027
HUs pendientes:       ninguna dentro del alcance del sprint

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/state/app-state.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/data-load.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/decisions.js
                      05-tablero-ocupacion/v3-modular/src/config/navigation.js
                      05-tablero-ocupacion/v3-modular/src/main.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/validators.js
                      v3-modular/src/domain/ai-recommendation-context.js

Datos/contratos:      No se cambiaron contratos ni plantillas.
                      La carga Zeus PDF sigue usando el contrato existente.

Decisiones tomadas:   Bitacora y responsable se guardan en localStorage por ser
                      demo local.
                      Las cargas aceptadas y campañas nuevas generan eventos
                      automaticos.
                      Cargar sin responsable no bloquea, pero queda visible como
                      "Sin responsable definido".

Riesgos residuales:
- La bitacora local no sirve como auditoria multiusuario real; en produccion debe
  ir a backend con usuario autenticado.
- Si se borra el almacenamiento del navegador, se pierde la bitacora local.
- TO-HU-075 debe reutilizar o ampliar esta bitacora cuando exista IA bajo demanda.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  decision manual registrada -> pass
                      responsable activo guardado -> pass
                      Forecast Balandú 1808.pdf carga 14 filas -> pass
                      evento automatico de carga aparece en Bitacora -> pass
                      bitacora persiste tras recargar -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-026 y TO-HU-027.
```

---

## SPRINT-28 — Contexto IA por sede [Estado: Cerrado]

- **Agente(s):** Codex
- **Fecha apertura:** 2026-08-19
- **Fecha cierre:** 2026-08-19
- **Épica(s):** Proyecto Tablero de ocupación / E3
- **Objetivo del sprint:** preparar un paquete estructurado por sede para futuras recomendaciones IA y mostrar confianza/datos faltantes sin conectar todavia ningun modelo.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| TO-HU-073 | Paquete de contexto estructurado para IA por sede | Codex | Hecha | Dominio compartido para Hoteles/Parques |
| TO-HU-076 | Confianza y datos faltantes en recomendacion IA | Codex | Hecha | Panel visible sin llamada a modelo |

### Resumen de cierre

Se implemento la base tecnica previa a cualquier IA real: `src/domain/ai-recommendation-context.js` arma un paquete estructurado por sede desde datos ya validados en `appState`. El contexto incluye sede, periodo activo, fuentes, ocupacion, presupuesto, reglas Revenue, campanas, calendario, confianza y datos faltantes. No llama a ningun modelo y no expone llaves ni simula una recomendacion IA.

Se agrego `src/ui/ai-context-panel.js`, un componente compartido para Hoteles y Parques. Dentro de cada sede muestra `Base para analisis asistido`, confianza (`Alta`, `Media`, `Baja`), tres tarjetas de evidencia (Ocupacion, Presupuesto, Revenue), faltantes principales y un `details` con el paquete JSON compacto para revision. En modo real vacio la confianza queda baja y lista faltantes criticos; al cargar un PDF Zeus, la ocupacion entra al contexto y siguen visibles los faltantes de presupuesto/Revenue si no estan cargados.

**Archivos tocados:** `BACKLOG.md`, `SPRINTS.md`, `ROADMAP.md`, `MAPA_CODIGO.md`, `05-tablero-ocupacion/v3-modular/src/domain/ai-recommendation-context.js`, `src/ui/ai-context-panel.js`, `src/ui/views/hotels.js`, `src/ui/views/parks.js` y `styles/app.css`.

**Validacion realizada:** `node --check` sobre todos los modulos JS; `git diff --check`; servidor local `http://localhost:8055/` respondiendo 200; prueba Playwright: en demo aparece el panel y el paquete; en modo real vacio muestra confianza baja y faltantes de ocupacion/presupuesto; al cargar `Forecast Balandú 1808.pdf`, Balandu muestra 14 filas en el contexto, paquete JSON parseable y faltantes de presupuesto/Revenue sin errores de consola.

```text
HANDOFF — SPRINT-28 Contexto IA por sede
──────────────────────────────────────
HUs completas:        TO-HU-073, TO-HU-076
HUs pendientes:       TO-HU-074, TO-HU-075, TO-HU-077 quedan fuera del alcance

Archivos tocados:     BACKLOG.md · SPRINTS.md · ROADMAP.md · MAPA_CODIGO.md
                      05-tablero-ocupacion/v3-modular/src/domain/ai-recommendation-context.js
                      05-tablero-ocupacion/v3-modular/src/ui/ai-context-panel.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/hotels.js
                      05-tablero-ocupacion/v3-modular/src/ui/views/parks.js
                      05-tablero-ocupacion/v3-modular/styles/app.css

Archivos NO tocados:  tablero-seguimiento-ocupacion.html
                      tablero-seguimiento-ocupacion-v2.html
                      tablero-seguimiento-ocupacion-v3-demo.html
                      v3-modular/src/services/file-reader.js
                      v3-modular/src/services/zeus-forecast-parser.js
                      v3-modular/src/domain/strategic-recommendation.js

Datos/contratos:      No se cambiaron contratos ni plantillas.
                      No se conecto ningun modelo IA.

Decisiones tomadas:   El contexto IA se arma desde appState, no desde el DOM.
                      La vista muestra confianza y faltantes antes de permitir
                      una recomendacion asistida.
                      El JSON de contexto queda visible solo bajo demanda en
                      un details, para auditoria/revision.

Riesgos residuales:
- El panel puede sentirse tecnico para usuarios finales; se deja compacto y
  colapsa el JSON, pero conviene revisarlo visualmente con Diana.
- La confianza no equivale a aprobacion de negocio; solo mide suficiencia de
  datos para un analisis asistido.
- TO-HU-074/075 siguen pendientes: llamada IA bajo demanda y auditoria de
  respuesta requieren backend/decision tecnica.

Validación hecha:
  Sintaxis:           node --check sobre todos los modulos JS -> pass
  Estatica:           git diff --check -> pass
  Servidor local:     http://localhost:8055/ responde 200
  Runtime navegador:  demo con panel y paquete visible -> pass
                      modo real vacio con confianza baja/faltantes -> pass
                      Forecast Balandú 1808.pdf carga 14 filas y alimenta
                      paquete JSON parseable -> pass
  Documentación:      BACKLOG.md + SPRINTS.md + ROADMAP.md + MAPA_CODIGO.md actualizados

Auto-reporte DoD:     Completo para TO-HU-073 y TO-HU-076.
```

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
