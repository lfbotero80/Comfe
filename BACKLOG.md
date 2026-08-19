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

- **FT-05.11 — Actualización diaria/tiempo real (evaluación arquitectónica)**
  - HU-035: Como Diana, quiero entender qué se necesita para que el tablero se actualice solo desde Zeus (API o export programado), sabiendo que hoy no hay backend. — **Bloqueada** (depende de confirmar con TI/proveedor de Zeus si existe API o exportación programada).

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

- **E1-F2 — Modelo de datos por sede y unidad**
  - TO-HU-005: Como Diana, quiero que cada sede tenga inventario total, ocupado, libre y % de ocupación, para auditar capacidad real y uso. — **Hecha**
  - TO-HU-006: Como gerente, quiero que el tablero diferencie habitación, cabaña, camping, sitio o cupo, para no mezclar hoteles y parques. — **Hecha**
  - TO-HU-007: Como Diana, quiero conservar la fuente, fecha de corte y periodo cargado, para saber de dónde viene cada dato. — **Hecha**

- **E1-F3 — Interpretación de archivos Zeus**
  - TO-HU-032: Como gerente hotelero, quiero que el tablero explique como interpreta un PDF Zeus por sede, corte y filas diarias, para saber que pasara al cargar cada hotel. — **Hecha**
  - TO-HU-037: Como gerente hotelero, quiero subir directamente el PDF Forecast Zeus de mi sede, para que el tablero cargue automaticamente ocupacion diaria sin convertir manualmente a CSV. — **En sprint actual** (`SPRINT-10`)
  - TO-HU-038: Como Diana, quiero que los archivos Zeus de sedes distintas se fusionen sin borrar la data ya cargada, para completar el tablero por hotel progresivamente. — **En sprint actual** (`SPRINT-10`)

### E2 · Control operativo por sede

- **E2-F1 — Dashboard general**
  - TO-HU-008: Como Diana, quiero un dashboard general con todas las sedes, para ver de un vistazo dónde hay alerta, cumplimiento o riesgo. — **Hecha**
  - TO-HU-009: Como jefatura, quiero ver ocupación proyectada, ocupación real, cumplimiento presupuestal y semáforo por sede, para entender el estado mensual/trimestral. — **Hecha**
  - TO-HU-010: Como Diana, quiero comparar cada sede contra meta/presupuesto y contra el mismo periodo del año anterior, para detectar brechas reales. — **Bloqueada** (comparacion contra ano anterior requiere fuente cargada; presupuesto/meta ya queda cubierto por TO-HU-022)
  - TO-HU-033: Como jefatura, quiero que el dashboard general tenga lectura visual tipo Power BI, para entender el estado del negocio sin recorrer cada sección. — **Hecha**

- **E2-F2 — Sección Hoteles**
  - TO-HU-011: Como gerente hotelero, quiero una sección de Hoteles con una pestaña por hotel, para revisar solo mi sede sin ruido. — **Hecha**
  - TO-HU-012: Como gerente hotelero, quiero ver por hotel la proyección del mes, ocupación real %, unidades disponibles, ocupadas y libres, para gestionar inventario diario. — **Hecha**
  - TO-HU-013: Como Diana, quiero que cada hotel muestre vista diaria y acumulada por periodo, para auditar evolución y cierre mensual. — **Hecha**

- **E2-F3 — Sección Parques / pasadía / camping**
  - TO-HU-014: Como gerente de parque, quiero una sección de Parques con una pestaña por sede, para controlar cupos, sitios o visitantes sin forzar lógica hotelera. — **Hecha**
  - TO-HU-015: Como Diana, quiero que parques y camping tengan métricas equivalentes: capacidad, ocupación/uso, libres, cumplimiento y alarma, para compararlos sin distorsionar su operación. — **Hecha**

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

- **E3-F3 — Control presupuestal**
  - TO-HU-022: Como Diana, quiero ver presupuesto, ejecutado y % de cumplimiento por sede y periodo, para controlar desempeño financiero. — **Hecha**
  - TO-HU-023: Como jefatura, quiero una vista acumulada mensual/trimestral, para usar el tablero como insumo de gestión. — **Pendiente**
  - TO-HU-024: Como Diana, quiero que los datos no confiables se marquen como pendientes de validar, para no tomar decisiones sobre cifras dudosas. — **Pendiente**

- **E3-F4 — Reportes y trazabilidad**
  - TO-HU-025: Como Diana, quiero exportar reportes por sede y consolidado, para compartirlos con jefatura o analizarlos en Excel. — **Pendiente**
  - TO-HU-026: Como Diana, quiero registrar decisiones y responsables en bitácora, para dar seguimiento a campañas, tarifas y compromisos. — **Pendiente**
  - TO-HU-027: Como administradora, quiero identificar quién cargó o modificó datos, para mantener control operativo mínimo. — **Pendiente**

- **E3-F5 — Calendario comercial y catálogo de campañas**
  - TO-HU-028: Como Diana, quiero conservar el calendario comercial como sección propia, para interpretar la ocupación según actividades, temporada y sede. — **Hecha**
  - TO-HU-029: Como Comercial/Reservas, quiero conservar el catálogo de campañas como sección propia, para tener acciones disponibles cuando el semáforo active una alerta. — **Hecha**
  - TO-HU-030: Como gerente de sede, quiero que la alerta de ocupación muestre campañas y actividades comerciales aplicables, para pasar del semáforo a una acción concreta. — **Hecha**
  - TO-HU-034: Como Comercial/Reservas, quiero agregar una campaña nueva desde el tablero, para ampliar el catálogo sin editar código. — **Hecha**

- **E3-F6 — Limpieza de interfaz ejecutiva**
  - TO-HU-035: Como usuario, quiero un menú con iconos y sin la sección técnica Estructura de archivos, para navegar el tablero como producto operativo. — **Hecha**
  - TO-HU-036: Como gerente, quiero ver ocupadas sobre inventario total en un solo indicador y el día de la semana real, para leer la ocupación sin duplicidad ni etiquetas genéricas. — **Hecha**

## EP-06 · Vigilancia turismo bienestar
Carpeta: `06-vigilancia-turismo-bienestar/`.

- **FT-06.1 — Informe de vigilancia consolidado**
  - HU-036: Como Diana, quiero un informe de vigilancia de turismo experiencial de bienestar y naturaleza, con trazabilidad de versiones. — **Hecha**

---

## Próximas HUs candidatas a paquete de sprint (sugerido, a confirmar con Luis Felipe)

`SPRINT-01` dejó creada la base modular paralela. Los paquetes naturales siguientes son:

1. **FT-05.12** restante (`HU-039`): carga de presupuesto/ejecución por archivo.
2. **FT-05.14** (`HU-044` a `HU-046`): dashboard decisional y reducción de carga cognitiva.
3. **FT-05.9** (`HU-030` a `HU-033`): paridad de datos reales de Zeus entre las 4 sedes, una vez lleguen los archivos/fuentes reales y ya exista el contrato de carga.
