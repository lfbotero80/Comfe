# CLAUDE.md — Contexto Operativo Comfenalco IA

Este repositorio apoya a Diana Florez, Lider Tecnica de Hoteleria de la Unidad de Turismo de Comfenalco Antioquia, en iniciativas estrategicas, comerciales y de gestion.

## Proceso De Trabajo (obligatorio, para cualquier agente: Claude Code o Codex)

Este repositorio usa un Scrum personalizado. Ambos agentes trabajan en la misma ruta local (`Documentos/Claude/Projects/Comfenalco IA`), sobre los mismos archivos — este proceso existe para que no se pisen el trabajo.

**Al empezar cualquier sesion, leer en este orden:**

1. Este archivo (`CLAUDE.md`).
2. `METODOLOGIA_SCRUM.md` — reglas completas del proceso (taxonomia, sprints, registro, mapa de codigo).
3. `BACKLOG.md` — que HUs estan pendientes, en curso o hechas.
4. `ROADMAP.md` — objetivo de la semana vigente.
5. `SPRINTS.md` — las 2-3 entradas mas recientes, para saber que hizo el otro agente hace poco.
6. `MAPA_CODIGO.md` — para ubicar codigo sin tener que leerlo completo.

**Al cerrar cualquier tarea que corresponda a una o mas HUs:** actualizar `BACKLOG.md` (estado de la HU), agregar la entrada de cierre en `SPRINTS.md` (identificando el agente: `Claude Code` o `Codex`) y actualizar `MAPA_CODIGO.md` si hubo cambios de codigo. El cierre de `SPRINTS.md` debe incluir un resumen auditable: HUs trabajadas, archivos tocados, validacion realizada, decisiones/limites y pendientes, para que Luis Felipe pueda revisarlo con otra IA sin leer todo el codigo. **El cierre termina con un commit local (sin push, no hay remoto configurado)**, mensaje `SPRINT-NN — <objetivo corto> (Agente)`, cuerpo = el mismo resumen de cierre ya escrito. Un sprint no se da por cerrado sin estos pasos (detalle completo en `METODOLOGIA_SCRUM.md`, seccion 2).

## Regla Principal

No sobrescribir archivos sustantivos. Cada actualizacion relevante debe guardarse como nueva version (`v1`, `v2`, `v3`) o como documento nuevo con fecha/estado claro. Mantener trazabilidad es parte del metodo de trabajo.

**Esta regla es para documentos** (`.md`/`.docx` de las carpetas 01, 02, 03, 06). **Para codigo** (`05-tablero-ocupacion/`), no se duplican carpetas por version (nada de `v4-modular/`, `v5-modular/`) — se edita in place y la trazabilidad de version queda en los commits de git, no en el nombre de la carpeta. Detalle en `METODOLOGIA_SCRUM.md`, seccion 4.1.

## Fuente De Entrada

Antes de producir recomendaciones, leer primero:

1. `README.md`.
2. El documento vigente de la linea de trabajo solicitada.
3. Los documentos fuente de la carpeta correspondiente.

Cuando exista conflicto entre versiones, usar el README de la carpeta o la version mas reciente declarada como vigente.

## Lineas De Trabajo

- `01-oferta-y-calendario/`: oferta focalizada por sede y calendario agosto-diciembre 2026.
- `02-benchmarking/`: tendencias y referencias de otras cajas de compensacion.
- `03-ocupacion-hotelera/`: estrategia de ocupacion, Zeus Forecast, tramos tarifarios y campanas comerciales.
- `04-skills-uit/`: instrucciones especializadas para tareas recurrentes.
- `05-tablero-ocupacion/`: tablero HTML local de seguimiento.
- `06-vigilancia-turismo-bienestar/`: vigilancia de turismo experiencial de bienestar y naturaleza.

## Criterios Estrategicos Ya Instalados

- Las sedes no deben venderse como si fueran iguales; cada una tiene un rol de negocio.
- Hosteria Los Farallones y Camping Los Farallones son unidades distintas aunque compartan administracion.
- Hotel Piedras Blancas y Parque Piedras Blancas son unidades distintas aunque compartan administracion.
- Parque Ecologico Los Salados no tiene alojamiento; se analiza como pasadia, visitantes o cupos, no como ocupacion hotelera.
- Recinto Quirama es principalmente corporativo/eventos; el individual es complementario.
- Balandu compite como destino de pueblo/experiencia, no por cercania.
- Los Farallones Hosteria es retencion de afiliado recurrente.
- Camping Los Farallones tiene logica de escapada operativa, grupos y calendario escolar/laboral.
- Mario Aramburo es recurrencia joven.
- Hotel Piedras Blancas es el eje de bienestar/salud mental; Parque Piedras Blancas es pausa activa de dia.

## Reglas De Lenguaje

- No usar "gratis", "gratuito" o "gratuidad". Usar "tarifa sin costo" o "tarifa a cero pesos".
- Distinguir siempre hechos, inferencias y propuestas.
- No presentar propuestas de producto como hallazgos de vigilancia.
- Cuando falte evidencia, escribir "DATO NO DISPONIBLE" o "sin dato reportado a la fecha", segun aplique.
- Mantener tono ejecutivo, directo, sustentado y no inflado.

## Trabajo Con Cifras

- No inventar cifras ni interpolar datos faltantes.
- Citar archivo, sede, periodo y fuente.
- Diferenciar presupuesto, ejecucion, ocupacion, ADR, RevPAR, visitantes y cupos.
- Zeus Forecast es la fuente operativa para ocupacion futura; Power BI "Tablero del alojado" es la vista consolidada existente.
- En Quirama, aplicar revenue individual solo sobre la porcion individual; el negocio empresarial se cotiza por contrato.

## Normativa

Cuando una oferta, tarifa, promocion, politica o experiencia tenga implicaciones regulatorias, revisar con el skill `especialista-reglamentacion-hotelera-turistica` y recomendar validacion con juridica/cumplimiento si hay riesgo significativo.

## Entregables

Por defecto, trabajar primero en Markdown para revision. Si Diana necesita socializar, convertir despues a Word o presentacion. No entregar como definitivo si faltan datos internos o validaciones con gerentes, Comercial, Diseno de Producto, Coordinacion Administrativa y Financiera o Sistemas/TI.
