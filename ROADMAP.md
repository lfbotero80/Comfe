# Roadmap — Comfenalco IA

Roadmap vivo por semana calendario. Se ajusta cada vez que el alcance real (visible en `SPRINTS.md`) se desvía de lo planeado acá — este documento refleja el plan vigente, no un plan fijo de una sola vez. Ver metodología completa en `METODOLOGIA_SCRUM.md`.

Formato por semana: objetivo en una frase, épicas/features que se tocan, y qué se espera dejar cerrado.

---

## Roadmap por sprints · Proyecto Tablero de ocupación

Este roadmap organiza el producto `Tablero de ocupación` antes de ejecutar nuevos sprints. No abre sprint ni marca HUs como `En sprint actual`; solo define el orden recomendado para construir una versión mejor que v2 sin perder sus aciertos.

| Sprint sugerido | Objetivo | Épicas | Resultado esperado |
|---|---|---|---|
| Sprint TO-01 | Definir el modelo de datos y carga por archivo | E1 | **Ejecutado en `SPRINT-04`**: contratos de archivo para ocupación, inventario, presupuesto y Revenue |
| Sprint TO-02 | Construir dashboard general de control | E2, E3 | Vista ejecutiva con sedes, semáforos, ocupación, presupuesto y acción |
| Sprint TO-03 | Construir sección Hoteles | E2, E3 | Una pestaña por hotel con inventario, ocupación, cumplimiento y semáforo |
| Sprint TO-04 | Construir sección Parques / pasadía / camping | E2, E3 | Una pestaña por parque/sede con métricas equivalentes pero no hoteleras |
| Sprint TO-05 | Integrar Revenue y campañas | E3 | Reglas de semáforo v2 + acción recomendada + catálogo/activación de campañas |
| Sprint TO-06 | Consolidar presupuesto y reportes | E3 | Presupuesto, ejecutado, cumplimiento, acumulado y exportaciones |
| Sprint TO-07 | Gobierno, trazabilidad y cierre de demo | E1, E2, E3 | Roles, bitácora, fuentes, validaciones y versión candidata a reemplazar v2 |

### Sprint TO-01 · Modelo de datos y carga

**Objetivo:** que el tablero deje de depender de datos escritos en código o pegados manualmente.

**HUs candidatas:** TO-HU-001, TO-HU-002, TO-HU-003, TO-HU-004, TO-HU-005, TO-HU-006, TO-HU-007.

**Estado:** ejecutado en `SPRINT-04` el 2026-08-19; ampliado en `SPRINT-10` con carga directa de PDFs Zeus para ocupacion hotelera. `SPRINT-15` (Claude Code) corrigio un bug real: la carga exitosa borraba su propio mensaje de confirmacion antes de que se pudiera leer (`rerender()` innecesario en `data-load.js`); ahora confirma exito/advertencia/error con color. `SPRINT-16` (Codex) oculto el pill fijo del header cuando no hay mensaje real. `SPRINT-17` (Codex) dejo `Cargar datos` como accion primaria arriba a la derecha.

**Criterio de salida:** existen plantillas/contratos claros para cargar ocupación, inventario, presupuesto y fuentes. El tablero puede rechazar datos incompletos o mal formateados.

### Sprint TO-02 · Dashboard general

**Objetivo:** que Diana y jefatura puedan ver el estado general en una sola mirada.

**HUs candidatas:** TO-HU-008, TO-HU-009, TO-HU-010, TO-HU-016, TO-HU-019, TO-HU-022.

**Avance relacionado:** `SPRINT-05` adelanto TO-HU-008, TO-HU-016 y TO-HU-019 como correccion de producto sobre V3. `SPRINT-08` cerro TO-HU-009 y TO-HU-031 para que el dashboard muestre estructura completa por sede en gris cuando falte data. `SPRINT-09` cerro TO-HU-022 y TO-HU-033 con lectura tipo Power BI y presupuesto proyectado vs real en absolutos/%. `SPRINT-12` (Claude Code) cerro TO-HU-040: elimino el panel de texto "Donde mirar hoy" y las tarjetas detalladas por hotel/parque (redundantes con las pestanas Hoteles/Parques), separo la ocupacion en dos graficas (Hoteles / Parques) ordenadas de mas critico a mejor con tendencia (sparkline) por sede, y ordeno el presupuesto igual. `SPRINT-15` (Claude Code) cerro TO-HU-046: el presupuesto paso de una sola barra de % de relleno a dos barras comparables por sede (`Proyectado` vs `Real cumplido`), escaladas contra el mayor de los dos valores, con el monto en pesos visible. `SPRINT-16` (Codex) cerro TO-HU-048, TO-HU-049, TO-HU-050 y TO-HU-051: agrego convenciones de color, paso Hoteles y Parques a bloques verticales con graficas mas protagonistas, elimino el contador de alertas criticas y agrego % de ejecucion al real cumplido. `SPRINT-17` (Codex) agrego filtros globales de periodo/unidad/semaforo y ajusto graficas de ocupacion a layout 50/50 con convenciones al lado. `SPRINT-18` (Claude Code) cerro TO-HU-057: acoto los filtros globales solo al Dashboard, tras reporte de Luis Felipe de que aparecian en pantallas donde no filtraban nada (Calendario, Campanas) y llegaron a mostrar falsos "Sin dato" en Hoteles por un fallback silencioso al filtro global. TO-HU-010 queda bloqueada en la parte de ano anterior hasta tener fuente historica.

**Criterio de salida:** primera pantalla con todas las sedes, semáforo, ocupación proyectada, ocupación real, cumplimiento presupuestal y acción sugerida.

### Sprint TO-03 · Hoteles

**Objetivo:** llevar el control sede por sede para alojamiento.

**HUs candidatas:** TO-HU-011, TO-HU-012, TO-HU-013, TO-HU-017, TO-HU-018, TO-HU-020, TO-HU-021.

**Avance relacionado:** `SPRINT-05` adelanto TO-HU-011 y TO-HU-012 para recuperar pestanas y analisis basico por hotel. `SPRINT-07` cerro TO-HU-017, TO-HU-018, TO-HU-020 y TO-HU-021 para que el semaforo sea confiable y accionable. `SPRINT-08` cerro TO-HU-013 con ocupacion del mes y detalle diario. `SPRINT-14` amplio Hoteles con 12 barras mensuales, cumplimiento contra meta y detalle diario del mes activo. `SPRINT-15` (Claude Code) cerro TO-HU-047: la grafica de detalle diario paso de un contenedor de 160px a 240px con barras y valores mas grandes, tras reporte de que era demasiado pequena para leer. `SPRINT-18` (Claude Code) corrigio un efecto lateral de `SPRINT-17`: el filtro global de periodo competia con la navegacion propia de 12 meses y llegaba a mostrar "Sin datos de ocupacion" en una sede con dato real en otro mes; Hoteles vuelve a depender solo de su propia navegacion.

**Criterio de salida:** sección Hoteles con pestañas por hotel, métricas operativas, forecast/real, inventario, semáforo y acción.

### Sprint TO-04 · Parques, pasadía y camping

**Objetivo:** no forzar los parques al modelo hotelero, pero darles control equivalente.

**HUs candidatas:** TO-HU-014, TO-HU-015, TO-HU-005, TO-HU-006, TO-HU-019, TO-HU-022.

**Avance relacionado:** `SPRINT-08` cerro TO-HU-014 y TO-HU-015: la seccion se llama `Parques`, tiene pestanas por sede y metricas equivalentes en gris cuando faltan datos.

**Criterio de salida:** cada parque/sede tiene pestaña propia con capacidad/cupos/sitios, uso, libres, cumplimiento y alerta.

### Sprint TO-05 · Revenue y campañas

**Objetivo:** que la alarma no sea informativa sino accionable.

**HUs candidatas:** TO-HU-016, TO-HU-017, TO-HU-018, TO-HU-019, TO-HU-020, TO-HU-021, TO-HU-026.

**Avance relacionado:** `SPRINT-06` recupero TO-HU-028, TO-HU-029 y TO-HU-030 como correccion de fidelidad frente a v2: calendario comercial, catalogo de campanas y contexto comercial conectado a alertas. `SPRINT-07` cerro TO-HU-017, TO-HU-018, TO-HU-020 y TO-HU-021: umbrales, cierres/festivos/temporada y recomendaciones de proteger tarifa o activar campana. `SPRINT-11` recupero el patron modal de v2 para agregar campanas con causa, sede, tarifa, fecha y medicion. `SPRINT-13` compacto el modal para que sea operativo y no ocupe la pantalla completa. `SPRINT-14` separo la accion sugerida en un motor deterministico que combina semaforo, cumplimiento mensual y tendencia; IA permanente queda como evaluacion arquitectonica pendiente. Sigue pendiente TO-HU-026 para bitacora/seguimiento de decisiones.

**Criterio de salida:** el semáforo de v2 gobierna la recomendación: mantener, preventa, Más Cerca, campaña, proteger tarifa o no actuar por cierre operativo.

### Sprint TO-06 · Presupuesto y reportes

**Objetivo:** consolidar control financiero y salida para gestión.

**HUs candidatas:** TO-HU-022, TO-HU-023, TO-HU-024, TO-HU-025.

**Avance relacionado:** `SPRINT-09` cerro TO-HU-022 en dashboard general. Siguen pendientes TO-HU-023, TO-HU-024 y TO-HU-025 para vista mensual/trimestral, confiabilidad del dato y exportacion.

**Criterio de salida:** presupuesto vs ejecutado por sede, periodo mensual/trimestral, acumulado, datos pendientes/no confiables y exportación.

### Sprint TO-07 · Trazabilidad y demo candidato

**Objetivo:** dejar una versión revisable como producto, no solo como prototipo.

**HUs candidatas:** TO-HU-007, TO-HU-024, TO-HU-026, TO-HU-027.

**Criterio de salida:** versión candidata con bitácora, fuentes, usuario que cargó datos, validaciones visibles y decisión pendiente de si reemplaza v2.

**Recomendación de secuencia:** empezar por `Sprint TO-01`. Si el dato no queda definido primero, las pantallas pueden verse bien pero seguirían montadas sobre supuestos frágiles.

---

## Semana del 2026-08-17 (semana de instalación de la metodología)

**Objetivo:** instalar el proceso de trabajo (backlog, roadmap, registro de sprints, mapa de código) para poder trabajar con Codex y Claude Code en paralelo sin pisarse, y dejar `SPRINT-00` documentado como línea base de todo lo construido en el tablero de ocupación hasta ahora.

- EP-05 (tablero de ocupación): `SPRINT-00` — línea base (retroactivo, ver `SPRINTS.md`).
- Metodología: `METODOLOGIA_SCRUM.md`, `BACKLOG.md`, `ROADMAP.md`, `SPRINTS.md`, `MAPA_CODIGO.md` creados y en uso.

**Cierra la semana con:** los 5 documentos de proceso en el repo, backlog poblado con el estado real, y el primer sprint (`SPRINT-00`) registrado.

---

## Próxima semana (a confirmar fecha exacta con Luis Felipe)

**Objetivo actualizado:** corregir la base arquitectónica del tablero antes de seguir creciendo el monolito.

- EP-05 / FT-05.12 (HU-037, HU-038, HU-040): definir y empezar a implementar contratos de carga por archivo para hoteles y parques, reemplazando copiar/pegar como flujo principal.
- EP-05 / FT-05.13 (HU-041 a HU-043): crear una versión modular paralela del tablero para dejar de concentrar HTML, CSS, datos, reglas, servicios y UI en un único archivo.
- EP-05 / FT-05.10 (HU-034): queda pendiente la decisión de si `tablero-seguimiento-ocupacion-v2.html` reemplaza a la principal; no se recomienda decidirlo hasta revisar la base modular.

**Depende de:** cerrar `SPRINT-01` con una base modular usable y un contrato de datos suficientemente claro para no seguir alimentando el monolito.

---

## Semanas siguientes (pendiente de definir)

Candidatos identificados en el backlog, sin semana asignada todavía — se programan cuando haya insumo o decisión de Luis Felipe:

- **EP-03 / FT-03.1 (HU-007):** replicar tabla de tramos y tarifas para Los Farallones, Quirama y Balandú — depende de tener la curva de ocupación real de Zeus de cada sede (se destraba con `FT-05.9`).
- **EP-01 (HU-003):** validación formal de 3.1.2 y 3.1.3 con Coordinación Administrativa y Financiera, Diseño de Producto y Comercial.
- **EP-05 / FT-05.14 (HU-044 a HU-046):** rediseñar la experiencia hacia dashboard de decisión, gráficos visuales y ayuda contextual breve, reduciendo la carga cognitiva.
- **EP-05 / FT-05.9 (HU-030 a HU-033):** cargar datos reales de Zeus de Quirama, Piedras Blancas y Balandú cuando lleguen los archivos/fuentes reales y ya exista el contrato de carga.
- **EP-05 / FT-05.11 (HU-035):** evaluación de actualización diaria/tiempo real del tablero — bloqueada hasta confirmar con TI/proveedor de Zeus si hay API o exportación programada disponible.
- **EP-05 / FT-05.15 (HU-047):** recuperación automática de contraseña — bloqueada mientras el tablero sea HTML local sin backend/correo/SSO.

> Nota de proceso: no se abre una semana con un objetivo que dependa de un insumo que no ha llegado — si `FT-05.9` sigue bloqueada por falta de PDFs, la semana siguiente toma el próximo candidato de la lista de arriba en su lugar.
