# Backlog — Comfenalco IA

Taxonomía: **Proyecto → Épica (EP) → Feature (FT) → Historia de Usuario (HU)**. Ver reglas completas en `METODOLOGIA_SCRUM.md`.

Estado de HU: `Pendiente` · `En sprint actual` · `Hecha` · `Bloqueada`.

> Este backlog se pobló el 2026-08-18 con el estado real del proyecto a esa fecha (incluye trabajo hecho antes de instalar esta metodología, marcado como línea base — ver `SPRINTS.md`, `SPRINT-00`). De aquí en adelante, toda HU nueva se agrega antes de trabajarla, no después.

---

## EP-01 · Oferta focalizada y calendario comercial
Carpeta: `01-oferta-y-calendario/`. Actividades 3.1.2 y 3.1.3 del cronograma UIT.

- **FT-01.1 — Oferta focalizada y calendario agosto-diciembre 2026**
  - HU-001: Como Diana, quiero una oferta diferenciada por sede (no genérica) para no canibalizar el portafolio entre sedes. — **Hecha**
  - HU-002: Como Diana, quiero un calendario comercial agosto-diciembre 2026 por sede y mes, para poder validarlo con Comercial y Diseño de Producto. — **Hecha**
  - HU-003: Como Diana, quiero validar 3.1.2 y 3.1.3 formalmente con Coordinación Administrativa y Financiera, Diseño de Producto y Comercial. — **Pendiente**

## EP-02 · Benchmarking
Carpeta: `02-benchmarking/`.

- **FT-02.1 — Benchmarking de cajas de compensación y tendencias**
  - HU-004: Como Diana, quiero benchmarking de otras cajas de compensación en Colombia y tendencias globales de turismo, como insumo del enfoque diferencial. — **Hecha**

## EP-03 · Estrategia de ocupación hotelera (documento)
Carpeta: `03-ocupacion-hotelera/`. Actividad 3.3 del cronograma UIT.

- **FT-03.1 — Modelo de tramos y catálogo de campañas (documento base)**
  - HU-005: Como Diana, quiero el modelo de tramos de tarifa (Estándar/Preventa/Más cerca) documentado para Piedras Blancas. — **Hecha**
  - HU-006: Como Diana, quiero un catálogo vivo de campañas de baja ocupación inspirado en "Descansa y Vota". — **Hecha**
  - HU-007: Como Diana, quiero replicar la tabla de tramos y tarifas para Hostería Los Farallones, Recinto Quirama y Hacienda Balandú. — **Pendiente**

## EP-04 · Skills UIT
Carpeta: `04-skills-uit/`.

- **FT-04.1 — Skills especializadas recurrentes**
  - HU-008: Como Diana, quiero skills reutilizables para diseño de experiencias hoteleras, reglamentación, informes de gestión y propuestas comerciales. — **Hecha**

## EP-05 · Tablero de ocupación HTML
Carpeta: `05-tablero-ocupacion/`. La línea más activa del proyecto — ver `MAPA_CODIGO.md` para el detalle técnico.

- **FT-05.1 — Estructura base del tablero (datos reales, sin backend)**
  - HU-009: Como Diana, quiero un tablero HTML autocontenido con Resumen ejecutivo, KPIs por sede y datos reales de tarifas/presupuesto ya cargados. — **Hecha**
  - HU-010: Como Diana, quiero calendario comercial y catálogo de campañas dentro del mismo tablero, editables sin tocar código. — **Hecha**
  - HU-011: Como Diana, quiero persistencia en localStorage con exportar/importar para no perder lo que ingreso. — **Hecha**

- **FT-05.2 — Identidad visual Comfenalco**
  - HU-012: Como Diana, quiero que el tablero use la paleta y el estilo visual real del sitio de Comfenalco Antioquia, no una paleta genérica. — **Hecha**
  - HU-013: Como gerente de sede, quiero un semáforo real (rojo/ámbar/verde) que se entienda de un vistazo, no solo un color de acento. — **Hecha**

- **FT-05.3 — Proyección vs. real y recomendación estratégica**
  - HU-014: Como Sandra, quiero comparar ocupación proyectada vs. real (en puntos y en % de cumplimiento) contra un objetivo. — **Hecha**
  - HU-015: Como gerente de sede, quiero una recomendación automática (mantener / activar campaña / evaluar subir tarifa) según el estado frente al objetivo. — **Hecha**

- **FT-05.4 — Autenticación y roles**
  - HU-016: Como Diana, quiero que cada persona entre con su propio usuario para saber quién hizo cada cambio. — **Hecha**
  - HU-017: Como administradora, quiero crear/eliminar usuarios y roles (Admin, Editor, Visualizador) sin necesitar desarrollo. — **Hecha**
  - HU-018: Como usuaria, quiero recuperar mi contraseña con una pregunta de seguridad si la olvido. — **Hecha**

- **FT-05.5 — Forecast diario de Zeus**
  - HU-019: Como gerente de sede, quiero cargar el forecast de Zeus día por día (no un solo valor) por sede. — **Hecha**
  - HU-020: Como gerente de sede, quiero ver la capacidad real de habitaciones y el número absoluto de habitaciones ocupadas, no solo el %. — **Hecha**
  - HU-021: Como gerente de sede, quiero que domingo/lunes sin festivo se marque como cierre operativo normal, no como alarma. — **Hecha**
  - HU-022: Como Diana, quiero ver el calendario de festivos de Colombia 2026 que usa esa regla. — **Hecha**
  - HU-023: Como gerente de sede, quiero un aviso automático de patrón semanal (qué día es más alto/más bajo) cuando haya suficiente dato cargado. — **Hecha**

- **FT-05.6 — Carga de Zeus sin desarrollo**
  - HU-024: Como gerente de sede, quiero pegar el texto copiado del PDF de Zeus y que el tablero cargue todos los días automáticamente, sin pedirle el cambio a un desarrollador. — **Hecha**
  - HU-025: Como gerente de sede, quiero que el tablero detecte solo la capacidad de habitaciones y la fecha de corte si el reporte las trae. — **Hecha**

- **FT-05.7 — Exportación de reportes**
  - HU-026: Como Diana, quiero exportar reportes en CSV (Excel), no en JSON, para poder compartirlos o analizarlos fuera del tablero. — **Hecha**
  - HU-027: Como gerente de sede, quiero exportar el reporte de mi propia sede de forma individual, no solo el combinado. — **Hecha**
  - HU-028: Como administradora, quiero que quede claro que el JSON es un respaldo del tablero completo, no un reporte para leer. — **Hecha**

- **FT-05.8 — Navegación por hotel**
  - HU-029: Como gerente de sede, quiero que mi hotel viva en su propia sección dentro de "Ocupación y tramos", no apilado con los otros 3. — **Hecha**

- **FT-05.9 — Datos reales pendientes de otras sedes**
  - HU-030: Como Diana, quiero cargar el forecast real de Zeus de Recinto Quirama. — **Pendiente**
  - HU-031: Como Diana, quiero cargar el forecast real de Zeus de Hotel Piedras Blancas (y corregir el dato de Ejecutado inconsistente en la fuente). — **Pendiente**
  - HU-032: Como Diana, quiero cargar el forecast real de Zeus de Hacienda Balandú. — **Pendiente**
  - HU-033: Como Diana, quiero la capacidad real de habitaciones de Quirama, Piedras Blancas y Balandú. — **Pendiente**

- **FT-05.10 — Gobierno de versiones del tablero**
  - HU-034: Como Luis Felipe, quiero decidir cuándo `tablero-seguimiento-ocupacion-v2.html` reemplaza a la versión principal, después de revisarla. — **Pendiente**
  - HU-051: Como Luis Felipe, quiero confirmar si el `project_id` dejado por Codex en `05-tablero-ocupacion/v3-modular/.openai/hosting.json` (`SPRINT-34`, sin registro en su momento) corresponde a un sitio ya publicado, para decidir si se mantiene, se protege o se elimina — el tablero contiene datos reales de negocio y no debería quedar expuesto a un tercero sin decisión consciente. — **Hecha** (`SPRINT-45`; Luis Felipe decidió el 2026-08-19 que no necesita ese hospedaje: la única página que quiere es la de GitHub Pages. Se eliminó `.openai/hosting.json` del repo)

- **FT-05.11 — Actualización diaria/tiempo real (evaluación arquitectónica)**
  - HU-035: Como Diana, quiero entender qué se necesita para que el tablero se actualice solo desde Zeus (API o export programado), sabiendo que hoy no hay backend. — **Bloqueada** (depende de confirmar con TI/proveedor de Zeus si existe API o exportación programada). *Relacionada con `TO-HU-092`/`TO-HU-093` (`E1-F5`): esta HU es sobre traer el dato automáticamente desde Zeus; `TO-HU-092` es sobre que varias personas vean el mismo dato ya cargado, sin importar cómo entró — son dos necesidades de backend distintas, no la misma.*

- **FT-05.12 — Contrato de carga de datos (archivos, no copiar/pegar)**
  - HU-037: Como Luis Felipe, quiero definir el contrato de datos para archivos de hoteles y parques, para que el tablero deje de depender de texto copiado/pegado. — **Hecha**
  - HU-038: Como gerente de sede, quiero subir un archivo de forecast de Zeus y recibir validación de columnas/filas, para saber si el dato fue cargado correctamente antes de usarlo. — **Hecha**
  - HU-039: Como Diana, quiero subir archivos de presupuesto/ejecución con una estructura clara, para separar actualización de datos de edición de código. — **Pendiente**
  - HU-040: Como gerente de parque de pasadía, quiero cargar visitantes, aforo e ingresos en un formato propio, para no forzar los parques al modelo de ocupación hotelera. — **Hecha**

- **FT-05.13 — Arquitectura modular del tablero**
  - HU-041: Como Luis Felipe, quiero una versión modular paralela del tablero, para dejar de crecer el HTML monolítico sin reemplazar todavía producción. — **Hecha**
  - HU-042: Como desarrollador, quiero separar datos base, reglas de negocio, servicios de archivo y vistas UI en módulos independientes, para poder probar y evolucionar cada parte sin tocar todo el archivo. — **Hecha**
  - HU-043: Como desarrollador, quiero un mapa técnico actualizado de la versión modular, para que Codex y Claude Code sepan dónde intervenir sin pisarse. — **Hecha**

- **FT-05.14 — Reducción de carga cognitiva y dashboard decisional**
  - HU-044: Como Diana, quiero que la primera pantalla sea un dashboard general de decisión, no una página de instrucciones, para saber dónde actuar sin leer explicaciones largas. — **Hecha**
  - HU-045: Como gerente de sede, quiero gráficos visuales de forecast, brechas y alertas, para decidir de un vistazo sin depender de texto explicativo. — **Hecha**
  - HU-046: Como usuario nuevo, quiero ayuda contextual breve en cada flujo, para aprender sin una pestaña larga de instrucciones. — **Pendiente**
  - HU-052: Como Diana, quiero que el menú lateral y el encabezado se queden fijos al hacer scroll, para no tener que subir hasta arriba cada vez que quiero cambiar de sección en una pantalla larga. — **Hecha** (`SPRINT-46`)
  - HU-048: Como Luis Felipe, quiero que la versión modular conserve el sistema de diseño y los patrones visuales que ya funcionaban en v2, para que modularizar no signifique retroceder en producto. — **Hecha**
  - HU-049: Como Luis Felipe, quiero una versión v3 de demo que abra localmente sin depender de saber levantar un servidor, para poder revisarla fácil y compartirla con otra IA. — **Hecha**
  - HU-050: Como Luis Felipe, quiero que la v3 se parezca visual y funcionalmente al demo v2 mientras se modulariza por debajo, para no revisar una maqueta inferior al tablero existente. — **Hecha**

- **FT-05.15 — Recuperación de acceso**
  - HU-047: Como usuaria, quiero recuperación automática de contraseña, para no depender de pregunta de seguridad local. — **Bloqueada** (requiere backend, correo, SSO o proveedor de identidad; no se puede resolver de forma real en HTML local puro).

---

## Backlog de producto · Proyecto Tablero de ocupación

Este bloque organiza el tablero como **producto digital específico**, separado del historial técnico ya registrado en `EP-05`. Usa prefijo `TO-HU` para no mezclar estas historias de producto con las HUs históricas del repositorio.

**Objetivo del producto:** controlar ocupación, inventario disponible, presupuesto y acciones comerciales por sede, conectando operación diaria con decisiones de Revenue y reporte de gestión.

### E1 · Datos, inventario y fuentes

- **E1-F1 — Carga de información por archivo**
  - TO-HU-001: Como Diana, quiero cargar archivos de ocupación por sede, para no depender de copiar/pegar datos manualmente. — **Hecha**
  - TO-HU-002: Como gerente de sede, quiero subir un archivo con inventario diario, unidades ocupadas y unidades libres, para actualizar el tablero sin tocar código. — **Hecha**
  - TO-HU-003: Como usuario, quiero que el tablero valide columnas obligatorias, fechas, sede y tipo de habitación/sitio, para evitar cargar información incompleta o mal estructurada. — **Hecha**
  - TO-HU-004: Como Diana, quiero ver errores de carga claros por fila y columna, para corregir el archivo antes de usarlo en decisiones. — **Hecha**
  - TO-HU-045: Como gerente de sede, quiero saber de inmediato si mi archivo se cargó, se rechazó o el formato no es compatible, para confiar en que el dato quedó (o no) sin adivinar. — **Hecha**
  - TO-HU-089: Como usuaria del tablero, quiero que el mensaje con el archivo cargado solo aparezca en el módulo Cargar datos, para no exponer ese detalle en Dashboard, Hoteles, Parques u otras secciones. — **Hecha** (`SPRINT-36`)
  - TO-HU-090: Como Diana, quiero que el tablero no tenga modo demo residual y opere siempre sobre datos reales cargados por archivo, para evitar confusión entre estructura, prueba y dato operativo. — **Hecha** (`SPRINT-37`)
  - TO-HU-091: Como usuaria del tablero, quiero que en Cargar datos aparezcan primero los bloques de carga y después el estado consolidado de la información, para seguir el flujo natural de subir, validar y revisar cobertura. — **Hecha** (`SPRINT-37`)

- **E1-F2 — Modelo de datos por sede y unidad**
  - TO-HU-005: Como Diana, quiero que cada sede tenga inventario total, ocupado, libre y % de ocupación, para auditar capacidad real y uso. — **Hecha**
  - TO-HU-006: Como gerente, quiero que el tablero diferencie habitación, cabaña, camping, sitio o cupo, para no mezclar hoteles y parques. — **Hecha**
  - TO-HU-007: Como Diana, quiero conservar la fuente, fecha de corte y periodo cargado, para saber de dónde viene cada dato. — **Hecha**
  - TO-HU-086: Como Diana, quiero que lo que subo desde un PDF de Zeus (u otro archivo) sobreviva a cerrar o recargar el navegador, para que el tablero sirva como seguimiento real y no solo dentro de la misma sesión. — **Hecha**

- **E1-F3 — Interpretación de archivos Zeus**
  - TO-HU-032: Como gerente hotelero, quiero que el tablero explique como interpreta un PDF Zeus por sede, corte y filas diarias, para saber que pasara al cargar cada hotel. — **Hecha**
  - TO-HU-037: Como gerente hotelero, quiero subir directamente el PDF Forecast Zeus de mi sede, para que el tablero cargue automaticamente ocupacion diaria sin convertir manualmente a CSV. — **Hecha**
  - TO-HU-038: Como Diana, quiero que los archivos Zeus de sedes distintas se fusionen sin borrar la data ya cargada, para completar el tablero por hotel progresivamente. — **Hecha**

- **E1-F4 — Auditoría de datos y calidad**
  - TO-HU-067 *(mediano, requiere revisión completa del código)*: Como Luis Felipe, quiero una auditoría del tablero para confirmar que no hay información quemada en el código (ejemplo señalado: el mes de agosto aparece fijo para Hostería Los Farallones), para asegurar que todo lo que se muestra sale de datos realmente cargados. — **Hecha** (`SPRINT-24`; ver `05-tablero-ocupacion/AUDITORIA_DATOS_QUEMADOS_SPRINT-24.md`)
  - TO-HU-071 *(derivada de `SPRINT-24`)*: Como Luis Felipe, quiero separar el modo demo del modo datos reales, para que el tablero pueda arrancar vacío y no muestre datos semilla como si hubieran sido cargados por el usuario. — **Hecha** (`SPRINT-25`)
  - TO-HU-072 *(derivada de `SPRINT-24`)*: Como gerente de sede, quiero que una sede sin filas cargadas no muestre un mes fijo como agosto, para no confundir un estado vacío con un periodo operativo real. — **Hecha** (`SPRINT-26`)

- **E1-F5 — Persistencia compartida (backend)**
  Nace de un caso real detectado el 2026-08-19: la URL pública (`SPRINT-35`) guarda todo en `localStorage`, por navegador — si la jefa de Diana abre el tablero en otro computador, no ve nada de lo que Diana ya cargó; tendría que cargarlo de nuevo ella misma. Sin esto, el tablero sirve para uso individual o demo, no como fuente compartida de verdad entre varias personas.
  - TO-HU-092 *(grande, necesita definición de arquitectura antes de estimarse — mismo criterio de Bloque 3 que `HU-035`)*: Como Luis Felipe, quiero evaluar qué requiere un backend real de persistencia compartida (base de datos, servidor, sincronización) para que el tablero deje de depender de `localStorage` por navegador, para decidir conscientemente si vale la pena construirlo antes de invertir en él. — **Pendiente**
  - TO-HU-093 *(depende de `TO-HU-092`)*: Como jefatura, quiero ver los mismos datos que carga Diana (o cualquier gerente de sede) sin tener que cargarlos yo también, para que el tablero sea una fuente compartida entre personas y computadores distintos, no una copia aislada por navegador. — **Pendiente** (bloqueada por la decisión de arquitectura de `TO-HU-092`)
  - **Nota de dependencia:** un backend compartido con varias personas cargando y viendo el mismo dato reabre la necesidad de autenticación real por usuario (no solo el campo de texto libre "Responsable activo" que existe hoy) — conectar con la conversación pendiente sobre restablecer el login/roles que tenía v2, en vez de resolverlo por separado.
  - TO-HU-087: Como Luis Felipe, quiero que la URL pública del tablero arranque sin datos operativos, campañas ni calendario comercial quemados, para compartirla con Diana sin exponer información de negocio en el código. — **Hecha** (`SPRINT-35`)
  - TO-HU-088: Como Diana, quiero que los datos que cargue en la URL pública persistan en mi navegador, incluyendo archivos cargados y campañas agregadas, para poder recargar y seguir revisando sin volver a subir todo. — **Hecha** (`SPRINT-35`)

### E2 · Control operativo por sede

- **E2-F1 — Dashboard general**
  - TO-HU-008: Como Diana, quiero un dashboard general con todas las sedes, para ver de un vistazo dónde hay alerta, cumplimiento o riesgo. — **Hecha**
  - TO-HU-009: Como jefatura, quiero ver ocupación proyectada, ocupación real, cumplimiento presupuestal y semáforo por sede, para entender el estado mensual/trimestral. — **Hecha**
  - TO-HU-010: Como Diana, quiero comparar cada sede contra meta/presupuesto y contra el mismo periodo del año anterior, para detectar brechas reales. — **Bloqueada** (comparacion contra ano anterior requiere fuente cargada; presupuesto/meta ya queda cubierto por TO-HU-022)
  - TO-HU-033: Como jefatura, quiero que el dashboard general tenga lectura visual tipo Power BI, para entender el estado del negocio sin recorrer cada sección. — **Hecha**
  - TO-HU-040: Como jefatura, quiero que el dashboard sea solo gráficas ordenadas de más crítico a mejor (sin listas de texto ni tarjetas detalladas por sede), para ver en segundos dónde actuar y encontrar el detalle diario solo dentro de cada Hotel/Parque. — **Hecha**
  - TO-HU-046: Como Diana, quiero ver presupuesto proyectado y real cumplido como dos barras comparables por sede (no un solo % de relleno), para distinguir de un vistazo si el problema es de proyección o de ejecución. — **Hecha**
  - TO-HU-048: Como usuaria del tablero, quiero ver convenciones claras de color, para entender cuándo una sede pasa de rojo a amarillo o verde. — **Hecha**
  - TO-HU-049: Como jefatura, quiero que Hoteles y Parques aparezcan en bloques verticales separados, con gráficas más protagonistas, para comparar sin comprimir la lectura. — **Hecha**
  - TO-HU-050: Como jefatura, quiero eliminar el contador de alertas del dashboard, para quitar métricas que no explican una decisión operativa clara. — **Hecha**
  - TO-HU-051: Como Diana, quiero que las barras de presupuesto muestren el % de ejecución junto al real cumplido, para leer monto y cumplimiento sin hacer cálculo mental. — **Hecha**
  - TO-HU-053: Como jefatura, quiero que las graficas de ocupacion tengan convenciones al lado y no ocupen todo el bloque, para entender el color sin perder contexto. — **Hecha**
  - TO-HU-054: Como Diana, quiero que el % de ejecucion del presupuesto aparezca junto a la barra, para asociarlo visualmente al avance y no al valor monetario. — **Hecha**
  - TO-HU-055: Como usuario, quiero filtros globales visibles en el instrumento, para revisar periodo, tipo de unidad y estado sin entrar a cada tabla. — **Hecha**
  - TO-HU-057: Como Luis Felipe, quiero que los filtros globales solo aparezcan y afecten el Dashboard (donde comparo sedes), no las pantallas que ya tienen su propia navegación (Hoteles, Parques) ni las que no filtran nada (Calendario, Campañas), para no ver un control que confunde o esconde datos que sí existen. — **Hecha**
  - TO-HU-060 *(chico)*: Como jefatura, quiero que el espacio a la derecha de las gráficas de Hoteles/Parques en el dashboard muestre contenido gráfico, no las convenciones de color (hoy ocupan ese lugar), para aprovechar ese espacio como información, no como leyenda. — **Hecha**
  - TO-HU-061 *(grande, necesita definir diseño primero)*: Como jefatura, quiero que el filtro de periodo "Todo 2026" muestre una lectura consolidada considerablemente más completa que la de un mes puntual (hoy se ve prácticamente igual), para que el filtro anual aporte algo distinto a mirar mes por mes. — **Hecha** (`SPRINT-39`)
  - TO-HU-062 *(chico)*: Como Diana, quiero que el % de cumplimiento del presupuesto no se repita en el bloque de presupuesto del dashboard (hoy aparece en el badge del encabezado de cada sede y de nuevo junto a la barra "Real cumplido"), para no leer el mismo dato dos veces. — **Hecha**
  - TO-HU-063 *(mediano)*: Como jefatura, quiero redistribuir tamaños en los bloques "Ocupación hotelera" y "Ejecución presupuestal" del dashboard (hoy tienen mucho espacio en blanco y la información se ve muy pequeña), para aprovechar mejor el espacio y leer los datos sin esforzarme. — **Hecha**
  - TO-HU-064 *(muy chico)*: Como usuaria, quiero que el subtítulo del sidebar diga "Unidad de Turismo" en vez de "Ocupación y presupuesto", para que sea consistente con el encabezado de cada pantalla. — **Hecha**
  - TO-HU-078: Como Luis Felipe, quiero una especificación funcional del Dashboard de Mando antes de desarrollar, para dejar de iterar sobre piezas visuales sin una lógica directiva clara. — **Hecha** (`SPRINT-30`; ver `05-tablero-ocupacion/DISENO_DASHBOARD_MANDO_SPRINT-30.md`)
  - TO-HU-079: Como director, quiero ver un estado general de la unidad combinando ocupación, presupuesto y cobertura de datos, para saber si el negocio está crítico, en atención, bajo control o sin dato suficiente. — **Hecha** (`SPRINT-31`)
  - TO-HU-080: Como jefatura, quiero una matriz de mando por sede con ocupación, presupuesto, tendencia, semáforo, acción sugerida y responsable, para decidir sin entrar a cada pestaña. — **Hecha** (`SPRINT-31`)
  - TO-HU-081: Como director, quiero un cuadrante ocupación vs presupuesto por sede, para detectar rápidamente si el riesgo principal es comercial, financiero, operativo o de datos. — **Hecha** (`SPRINT-31`)
  - TO-HU-082: Como Diana, quiero ver las tres acciones prioritarias del día con responsable y fuente, para convertir el tablero en seguimiento operativo. — **Hecha** (`SPRINT-42`; incluye campanas aplicables y ultimo registro de bitacora)
  - TO-HU-083: Como usuario directivo, quiero que la lectura anual y mensual sean visualmente distintas, para que "Todo 2026" no se vea igual a mirar un mes. — **Hecha** (`SPRINT-39`; resuelto en la raiz: "Todo 2026" mostraba un solo dia, no el ano)
  - TO-HU-096: Como Diana, quiero que ninguna cifra del tablero sobreestime ni subestime la realidad — ocupacion ponderada por inventario, misma definicion de periodo en todas las pantallas, y cobertura explicita de sobre cuantos dias se calculo —, para poder tomar decisiones sobre cifras en las que confio. — **Hecha** (`SPRINT-39`)
  - TO-HU-084: Como director, quiero que el dashboard combine barras verticales, líneas de tendencia, cuadrante, matriz y radar de perfil, para evitar una lectura monótona basada solo en barras horizontales. — **Hecha** (`SPRINT-31`)
  - TO-HU-085: Como director, quiero que el dashboard general priorice primero Hoteles y luego Parques, y que el cuadrante ocupación vs presupuesto incluya ambas familias aun cuando haya datos parciales, para leer la unidad según la importancia real del negocio. — **Hecha** (`SPRINT-32`)

- **E2-F2 — Sección Hoteles**
  - TO-HU-011: Como gerente hotelero, quiero una sección de Hoteles con una pestaña por hotel, para revisar solo mi sede sin ruido. — **Hecha**
  - TO-HU-012: Como gerente hotelero, quiero ver por hotel la proyección del mes, ocupación real %, unidades disponibles, ocupadas y libres, para gestionar inventario diario. — **Hecha**
  - TO-HU-013: Como Diana, quiero que cada hotel muestre vista diaria y acumulada por periodo, para auditar evolución y cierre mensual. — **Hecha**
  - TO-HU-042: Como gerente hotelero, quiero ver 12 barras mensuales por hotel y el detalle diario solo del mes activo, para entender cómo se mueve el año sin perder el día a día. — **Hecha**
  - TO-HU-047: Como gerente hotelero, quiero que la gráfica de detalle diario sea grande y legible (no un gráfico pequeño), para leer el comportamiento del mes sin acercarme a la pantalla. — **Hecha**
  - TO-HU-069 *(mediano, reutiliza `domain/budget.js`)*: Como gerente hotelero, quiero ver el seguimiento presupuestal de mi hotel dentro de la misma pestaña de Hoteles (no solo en la pestaña "Presupuesto" separada), para tener toda la información de mi sede en un mismo lugar. — **Hecha**

- **E2-F3 — Sección Parques / pasadía / camping**
  - TO-HU-014: Como gerente de parque, quiero una sección de Parques con una pestaña por sede, para controlar cupos, sitios o visitantes sin forzar lógica hotelera. — **Hecha**
  - TO-HU-015: Como Diana, quiero que parques y camping tengan métricas equivalentes: capacidad, ocupación/uso, libres, cumplimiento y alarma, para compararlos sin distorsionar su operación. — **Hecha**
  - TO-HU-065 *(grande)*: Como gerente de parque, quiero que Parques tenga el mismo nivel de detalle que Hoteles (movimiento anual de 12 meses, cumplimiento del mes contra meta, recomendación estratégica), para no quedar con una vista más pobre que la de alojamiento. — **Hecha**
  - TO-HU-070 *(mediano, reutiliza `domain/budget.js`)*: Como gerente de parque, quiero ver el seguimiento presupuestal de mi parque dentro de la misma pestaña de Parques, igual que en Hoteles, para tener toda la información de mi sede en un mismo lugar. — **Hecha**

- **E2-F4 — Estructura visible sin datos**
  - TO-HU-031: Como Diana, quiero ver sedes sin datos en gris, para confirmar que la estructura existe aunque falte cargar informacion. — **Hecha**

### E3 · Revenue, presupuesto y acción

- **E3-F1 — Semáforo y reglas de Revenue**
  - TO-HU-016: Como Comercial/Reservas, quiero conservar el semáforo definido en v2, para activar acciones según ocupación. — **Hecha**
  - TO-HU-017: Como usuario, quiero que el semáforo clasifique `>=70%` como Estándar, `40-69%` como Preventa y `<39%` como Más Cerca, para aplicar la estrategia tarifaria correcta. — **Hecha**
  - TO-HU-018: Como gerente, quiero que el tablero distinga cierres operativos, festivos y temporada alta, para no activar falsas alarmas. — **Hecha**

- **E3-F2 — Acción recomendada**
  - TO-HU-019: Como Diana, quiero que cada alarma genere una acción sugerida, para pasar del dato a la decisión. — **Hecha**
  - TO-HU-020: Como Comercial, quiero que baja ocupación sugiera campaña o tarifa de choque, para reaccionar antes de que cierre la ventana de venta. — **Hecha**
  - TO-HU-021: Como Diana, quiero que ocupación alta sugiera revisar tarifa o proteger precio, para no vender barato cuando hay demanda. — **Hecha**
  - TO-HU-043: Como Diana, quiero que la acción sugerida combine semáforo, cumplimiento mensual y tendencia, para decidir si activar campaña, mantener comunicación o cerrar comunicación promocional. — **Hecha**
  - TO-HU-044: Como Luis Felipe, quiero evaluar una arquitectura de IA permanente para recomendaciones, para saber qué requiere más allá del HTML local. — **Pendiente** (propuesta lista en `05-tablero-ocupacion/ARQUITECTURA_IA_RECOMENDACIONES_SPRINT-27.md` desde `SPRINT-27`; construida sobre ella en `SPRINT-28`-`31` sin confirmación explícita registrada — ver regla 1.1 de `METODOLOGIA_SCRUM.md`)
  - TO-HU-073 *(derivada de `SPRINT-27`)*: Como Diana, quiero que cada sede tenga un paquete de contexto estructurado para IA, para que la recomendación use solo datos validados y no lea la pantalla completa. — **Hecha** (`SPRINT-28`)
  - TO-HU-074 *(derivada de `SPRINT-27`)*: Como Comercial/Reservas, quiero solicitar una recomendación IA bajo demanda por sede, para comparar la acción sugerida determinística con un análisis asistido. — **Pendiente**
  - TO-HU-075 *(derivada de `SPRINT-27`)*: Como administradora, quiero que toda recomendación IA guarde usuario, fecha, fuente de datos y versión de respuesta, para auditar decisiones. — **Pendiente**
  - TO-HU-076 *(derivada de `SPRINT-27`)*: Como Diana, quiero que una recomendación IA con datos incompletos muestre confianza baja y datos faltantes, para no tomar decisiones con información insuficiente. — **Hecha** (`SPRINT-28`)
  - TO-HU-077 *(derivada de `SPRINT-27`)*: Como jefatura, quiero recibir un resumen diario automatizado de sedes en riesgo, para actuar sin abrir manualmente cada pestaña. — **Pendiente**

- **E3-F3 — Control presupuestal**
  - TO-HU-022: Como Diana, quiero ver presupuesto, ejecutado y % de cumplimiento por sede y periodo, para controlar desempeño financiero. — **Hecha**
  - TO-HU-023: Como jefatura, quiero una vista acumulada mensual/trimestral, para usar el tablero como insumo de gestión. — **Hecha**
  - TO-HU-024: Como Diana, quiero que los datos no confiables se marquen como pendientes de validar, para no tomar decisiones sobre cifras dudosas. — **Hecha**
  - TO-HU-058: Como Diana, quiero que cargar el presupuesto de un mes no borre los meses ya cargados de esa sede, para poder construir el historial completo mes a mes. — **Hecha**
  - TO-HU-059: Como Diana, quiero recuperar la pestaña propia "Seguimiento presupuestal" que existia en v2 (selector de periodo, comparacion de las 9 sedes en una escala comun, desglose empresarial/individual cuando el archivo lo trae, y detalle de 12 meses por sede), para no perder ese nivel de detalle al migrar a la version modular. — **Hecha** (`SPRINT-19`; el módulo independiente se disolvió en `SPRINT-38` — las capacidades siguen vivas, repartidas en Hoteles y Parques)
  - TO-HU-094: Como Luis Felipe, quiero que el control presupuestal deje de ser un módulo independiente y viva dentro de Hoteles y Parques — a nivel de familia (comparación entre las sedes de ese grupo) y dentro de cada sede en particular —, para tener toda la información de una sede en un mismo lugar. — **Hecha** (`SPRINT-38`)
  - TO-HU-095: Como gerente de sede, quiero ver dentro de mi hotel/parque el detalle de los 12 meses de presupuesto con desglose empresarial/individual y su exportación, para no tener que salir a otra pestaña por el detalle financiero de mi sede. — **Hecha** (`SPRINT-38`)

- **E3-F4 — Reportes y trazabilidad**
  - TO-HU-025: Como Diana, quiero exportar reportes por sede y consolidado, para compartirlos con jefatura o analizarlos en Excel. — **Hecha** (presupuesto; ocupación queda pendiente — ver TO-HU-066)
  - TO-HU-026: Como Diana, quiero registrar decisiones y responsables en bitácora, para dar seguimiento a campañas, tarifas y compromisos. — **Hecha** (`SPRINT-29`)
  - TO-HU-027: Como administradora, quiero identificar quién cargó o modificó datos, para mantener control operativo mínimo. — **Hecha** (`SPRINT-29`)
  - TO-HU-066 *(chico-mediano, reutiliza `services/csv-export.js`)*: Como Diana, quiero exportar ocupación e inventario por sede y consolidado en CSV, igual que ya existe para presupuesto, para compartir esos datos fuera del tablero. — **Hecha** (`SPRINT-22`)
  - TO-HU-068 *(construida en `SPRINT-23` con interpretación propia: lectura de fuentes cargadas por sede dentro de Carga de datos — el alcance original quedó anotado "por definir con Luis Felipe" y no se confirmó antes de construir; ver regla 1.1 de `METODOLOGIA_SCRUM.md`)*: Como Diana, quiero ver un estado de "cumplimiento técnico" de Hoteles y Parques, para saber qué contratos de datos (ocupación, presupuesto, Revenue) están cargados por sede y cuáles faltan. — **Pendiente de confirmar con Luis Felipe si esta interpretación es la que quería**
  - TO-HU-097 *(chico — el dato ya existe, falta la vista)*: Como Diana, quiero ver un historial de cargas de archivos con fecha, nombre del archivo, tipo y quién lo subió, para auditar de dónde salió cada dato del tablero sin depender de la memoria de nadie. — **Hecha** (`SPRINT-41`; se muestran los dos sentidos de "tipo": contrato y formato)
  - TO-HU-098: Como desarrollador (Claude Code o Codex), quiero que el servidor local no permita cachear los modulos ES, para que el tablero nunca se muestre a medias con una mezcla de codigo viejo y nuevo. — **Hecha** (`SPRINT-40`)
  - TO-HU-099: Como jefatura, quiero entender de un vistazo que tipo de problema tiene cada sede sin aprender a leer un plano cartesiano, para no depender de un formato que ademas estaba mal calibrado. — **Hecha** (`SPRINT-43`; reemplaza el cuadrante y corrige 3 defectos: etiquetas que colisionaban, linea de meta en 108% en vez de 90%, y sedes sin dato ubicadas en "Accion prioritaria")
  - TO-HU-100: Como jefatura, quiero que el bloque de riesgo por sede se **vea** como un gráfico y no se **lea** como un texto, para reconocer el tipo de problema de un vistazo sin ponerme a leer etiquetas sede por sede. — **Hecha** (`SPRINT-44`; el reemplazo de `SPRINT-43` había resuelto la correctitud pero convirtió el bloque en texto: Luis Felipe lo rechazó — *"eso no se parece a un dashboard visual, eso es demasiado texto"*)
    - *Estado real verificado (2026-08-19):* `appState.loadedFiles` ya captura y persiste en `localStorage` (`comfenalco_loaded_files_v1`) los cuatro campos pedidos — `loadedAt` (fecha/hora), `filename` (nombre), `contractId` (tipo: ocupación / presupuesto / Revenue) y `loadedBy` (responsable activo) — más `acceptedRows` y `rejectedRows`. **Ninguna vista lo muestra hoy.** La Bitácora registra las cargas como un evento más, mezcladas con decisiones manuales, pero no como historial de archivos.
    - *Alcance sugerido:* tabla en `Cargar datos` (bajo los cargadores), ordenada de más reciente a más antigua, con filas aceptadas/rechazadas y exportable a CSV como el resto.
    - *A definir contigo:* "tipo de archivo" puede significar (a) el **contrato** — ocupación / presupuesto / Revenue —, que ya está guardado, o (b) el **formato** — `.pdf` / `.csv` / `.json` —, que hoy solo vive dentro del nombre del archivo y habría que guardarlo aparte. Lo natural es mostrar ambos; confirmar antes de construir.

- **E3-F5 — Calendario comercial y catálogo de campañas**
  - TO-HU-028: Como Diana, quiero conservar el calendario comercial como sección propia, para interpretar la ocupación según actividades, temporada y sede. — **Hecha**
  - TO-HU-029: Como Comercial/Reservas, quiero conservar el catálogo de campañas como sección propia, para tener acciones disponibles cuando el semáforo active una alerta. — **Hecha**
  - TO-HU-030: Como gerente de sede, quiero que la alerta de ocupación muestre campañas y actividades comerciales aplicables, para pasar del semáforo a una acción concreta. — **Hecha**
  - TO-HU-034: Como Comercial/Reservas, quiero agregar una campaña nueva desde el tablero, para ampliar el catálogo sin editar código. — **Hecha**
  - TO-HU-039: Como Comercial/Reservas, quiero agregar campañas en un modal similar al de v2, para capturar causa, sede, tarifa, fecha y medición sin saturar la vista del catálogo. — **Hecha**
  - TO-HU-041: Como Comercial/Reservas, quiero que el modal de nueva campaña tenga tamaño operativo y no ocupe la pantalla completa, para registrar campañas sin perder contexto del catálogo. — **Hecha**

- **E3-F6 — Limpieza de interfaz ejecutiva**
  - TO-HU-035: Como usuario, quiero un menú con iconos y sin la sección técnica Estructura de archivos, para navegar el tablero como producto operativo. — **Hecha**
  - TO-HU-036: Como gerente, quiero ver ocupadas sobre inventario total en un solo indicador y el día de la semana real, para leer la ocupación sin duplicidad ni etiquetas genéricas. — **Hecha**
  - TO-HU-052: Como usuario, quiero que el control fijo de estado de carga desaparezca salvo cuando exista un mensaje real de carga, para no ver texto decorativo permanente en el header. — **Hecha**
  - TO-HU-056: Como usuario, quiero que el boton de carga de archivos quede en la parte superior derecha, para mantener el patron de accion primaria del header. — **Hecha**

## EP-06 · Vigilancia turismo bienestar
Carpeta: `06-vigilancia-turismo-bienestar/`.

- **FT-06.1 — Informe de vigilancia consolidado**
  - HU-036: Como Diana, quiero un informe de vigilancia de turismo experiencial de bienestar y naturaleza, con trazabilidad de versiones. — **Hecha**

---

## Próximas HUs candidatas a paquete de sprint (sugerido, a confirmar con Luis Felipe)

**Lista de correcciones de Luis Felipe (2026-08-19):** de las 11 HUs registradas (`TO-HU-060` a `TO-HU-070`), Codex cerró 10 entre `SPRINT-20` y `SPRINT-26`. Solo queda pendiente:

- **`TO-HU-061`** *(grande, necesita definir diseño primero)*: el filtro "Todo 2026" debe ser una lectura considerablemente más completa que un mes puntual. `SPRINT-31` ya agregó tendencia anual visible, pero el propio Codex reconoce que "aun no es una experiencia anual completamente distinta a la mensual" — evoluciona junto con `TO-HU-083`.

**Auditoría de Claude Code (2026-08-19) sobre el trabajo de Codex — 2 hallazgos de gobernanza, no de código, pendientes de tu confirmación explícita:**

- **`TO-HU-044`**: HU redactada como decisión tuya ("Como Luis Felipe, quiero evaluar...") — Codex la cerró sola en `SPRINT-27` y avanzó a implementar en `SPRINT-28`-`31` sin que quede registrada tu validación de la especificación (`SPRINT-30` pedía explícitamente esa validación antes de seguir).
- **`TO-HU-068`**: alcance ("estado de cumplimiento técnico") interpretado y cerrado por Codex en `SPRINT-23` sin esperar tu definición, aunque el backlog lo marcaba explícitamente "por definir con Luis Felipe".

Ninguna de las dos requiere revertir código — ambas están bien implementadas. Necesitan tu mirada para confirmar si el rumbo tomado es el que querías.

Candidatos previos, sin desarrollar todavía:

1. **FT-05.9** (`HU-030` a `HU-033`): paridad de datos reales de Zeus entre las 4 sedes, una vez lleguen los archivos/fuentes reales.
2. **TO-HU-074/075**: recomendación IA bajo demanda y auditoría de la respuesta, solo cuando exista decisión de backend.
3. **TO-HU-039**: carga de presupuesto/ejecución por archivo — ya cubierta indirectamente por el contrato `budgetExecution` (`SPRINT-04`/`SPRINT-19`); revisar si sigue aplicando tal como está escrita.
4. **TO-HU-082**: top 3 acciones prioritarias con más relación a campañas/bitácora (Dashboard de Mando).
