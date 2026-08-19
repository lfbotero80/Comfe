# Metodología de trabajo — Scrum personalizado Comfenalco IA

Este documento es la **regla operativa obligatoria** para cualquier agente (Claude Code, Codex, o cualquier otro) que trabaje en este repositorio: `Documentos/Claude/Projects/Comfenalco IA`. Ambos agentes trabajan en la misma ruta local, sobre los mismos archivos — este documento existe para que no se pisen el trabajo y para que Luis Felipe pueda entender qué hizo cada uno sin tener que leer código.

Léelo completo antes de tocar cualquier archivo. Si algo de aquí choca con una instrucción puntual de Luis Felipe en el chat, la instrucción del chat manda para esa tarea puntual, pero el proceso (backlog, sprint, registro, mapa) se actualiza igual.

---

## 1. Taxonomía

```
Proyecto
 └─ Épica          (EP-XX)   — una línea de trabajo grande, con valor de negocio propio
     └─ Feature    (FT-XX.Y) — un bloque funcional dentro de la épica
         └─ HU     (HU-NNN)  — una Historia de Usuario: la unidad mínima que se entrega en un sprint
```

- **Proyecto**: Comfenalco IA — Iniciativas Estratégicas UIT (todo el repositorio).
- **Épica**: hoy mapea 1:1 con cada carpeta numerada del repo (`01-oferta-y-calendario`, `02-benchmarking`, `03-ocupacion-hotelera`, `04-skills-uit`, `05-tablero-ocupacion`, `06-vigilancia-turismo-bienestar`) más las que se abran a futuro. Cada épica tiene su ID fijo `EP-01` a `EP-06` (ver `BACKLOG.md`).
- **Feature**: un bloque funcional reconocible dentro de una épica (ej. dentro de `EP-05` — tablero de ocupación: "Autenticación y roles", "Forecast diario de Zeus", "Seguimiento presupuestal"). ID: `FT-05.1`, `FT-05.2`, etc.
- **HU (Historia de Usuario)**: la unidad de trabajo real de un sprint. Formato: *"Como [rol], quiero [acción], para [beneficio]"*. ID correlativo global `HU-001`, `HU-002`... (no se reinicia por épica, para que nunca haya dos HUs con el mismo número aunque sean de features distintas).

Toda HU vive en `BACKLOG.md`, agrupada bajo su Feature y Épica, con estado: `Pendiente` / `En sprint actual` / `Hecha` / `Bloqueada`.

---

## 2. Sprints

- Un sprint es un paquete de HUs que **juntas generan valor entregable** — no HUs sueltas sin relación. Antes de abrir un sprint, agrupa HUs del backlog que tengan sentido como entrega conjunta.
- ID de sprint: `SPRINT-NN` correlativo (`SPRINT-01`, `SPRINT-02`...), nunca se reutiliza ni se reinicia, sin importar qué agente lo ejecute.
- No hay duración fija en días — un sprint termina cuando el paquete de HUs queda hecho y probado, no por calendario. Aun así, cada sprint debe poder ubicarse en una semana del `ROADMAP.md`.
- Antes de empezar un sprint nuevo: revisar `ROADMAP.md` para confirmar que el paquete elegido corresponde al objetivo de la semana vigente.

### Regla de arranque de sprint

1. Elegir HUs del `BACKLOG.md` (estado `Pendiente`) que formen un paquete con valor propio.
2. Marcarlas como `En sprint actual` en el backlog, anotando el número de sprint.
3. Anotar la apertura en `SPRINTS.md` (ver plantilla abajo) con estado `En curso`.

### Regla de cierre de sprint

Al terminar, **antes de dar la tarea por cerrada**:

1. Actualizar `BACKLOG.md`: cada HU entregada pasa a `Hecha` (o `Bloqueada` con motivo si no se pudo completar — no se deja en el limbo).
2. Agregar la entrada de cierre en `SPRINTS.md` con la plantilla de abajo, incluyendo el ID del sprint, el agente que lo ejecutó, el detalle HU por HU y un resumen de cierre suficientemente claro para que Luis Felipe pueda revisarlo con otra IA sin leer el código.
3. Actualizar `MAPA_CODIGO.md` si el sprint tocó código (ver sección 4).
4. Si el sprint movió el roadmap (adelantó, atrasó o cambió el objetivo de una semana), actualizar `ROADMAP.md`.
5. Entregar en la respuesta final del chat un bloque `HANDOFF` breve y auditable, sin referencias a GitHub/repo remoto, con HUs/tickets completos, pendientes, archivos tocados, archivos no tocados relevantes, validación, riesgos residuales y estado DoD.
6. Confirmar el cierre con un **commit local** (sin push, sin remoto configurado — el repo no tiene ninguno). Mensaje: primera línea `SPRINT-NN — <objetivo corto> (Claude Code | Codex)`, cuerpo con el mismo resumen de cierre ya redactado en el paso 2 (o el bloque `HANDOFF` del paso 5, que trae básicamente el mismo contenido). No hace falta redactar nada nuevo para el commit — es el mismo texto que ya se escribe, solo que ahora también queda versionado con diff real en vez de vivir solo como prosa en `SPRINTS.md`.

Un sprint no está cerrado si estos 6 pasos no están hechos. No se pasa al siguiente sprint sin cerrar el anterior.

**Por qué se agregó el paso 6 (2026-08-19):** hasta `SPRINT-09` el repo tenía un solo commit en toda su historia (la estructura inicial) — todo el trabajo de los sprints siguientes, de los dos agentes, vivía sin confirmar en el working tree. Eso significa que no había forma de ver un diff real entre sprints ni un punto de rollback si algo se rompía; la única trazabilidad era la prosa de `SPRINTS.md`. El commit por sprint no reemplaza `SPRINTS.md` (que sigue siendo el resumen legible para Luis Felipe) — lo respalda con historial real.

---

## 3. Registro de sprints (`SPRINTS.md`)

Es el archivo que le permite a Luis Felipe (y a cada agente) saber qué se hizo, cuándo y quién, sin leer código — clave porque Codex y Claude Code trabajan en paralelo sobre la misma ruta.

**Regla dura: todo cierre de sprint identifica el agente que lo ejecutó** (`Claude Code` o `Codex`) y la fecha. Si un sprint lo trabajaron los dos agentes (ej. Codex hizo una HU y Claude Code otra), se listan ambos, HU por HU.

**Regla dura de auditabilidad:** cada sprint cerrado debe incluir un `Resumen de cierre` que permita a Luis Felipe entender qué se hizo y pedirle a otra IA una revisión independiente sin reconstruir el contexto desde cero. Ese resumen no puede ser genérico. Debe incluir:

1. **Qué cambió:** módulos, documentos o pantallas creadas/modificadas.
2. **HUs trabajadas:** lista explícita de HUs y estado final (`Hecha`, `Bloqueada`, parcial con motivo).
3. **Archivos tocados:** rutas principales, especialmente si hubo código.
4. **Validación realizada:** pruebas, comandos, revisión manual o motivo si no se pudo validar.
5. **Decisiones o límites:** qué se decidió, qué no se decidió y qué queda fuera del alcance.
6. **Pendientes / siguiente revisión:** qué debería revisar Luis Felipe u otra IA en el siguiente paso.

Plantilla de cada entrada (una por sprint, en orden correlativo, más reciente arriba):

```markdown
## SPRINT-NN — <nombre corto del paquete> [Estado: En curso | Cerrado]

- **Agente(s):** Claude Code | Codex | Claude Code + Codex
- **Fecha apertura:** AAAA-MM-DD
- **Fecha cierre:** AAAA-MM-DD (o "en curso")
- **Épica(s):** EP-XX
- **Objetivo del sprint:** una frase — qué valor entrega este paquete.

### HUs de este sprint

| HU | Descripción corta | Agente | Estado | Notas |
|---|---|---|---|---|
| HU-NNN | ... | Claude Code | Hecha | ... |
| HU-NNN | ... | Codex | Hecha | ... |

### Resumen de cierre

**Qué cambió:** ...

**HUs trabajadas:** ...

**Archivos tocados:** ...

**Validación realizada:** ...

**Decisiones / límites:** ...

**Pendientes para revisar:** ...
```

### Plantilla obligatoria de handoff final

Al cerrar cualquier desarrollo, Codex o Claude Code deben entregar en el chat un bloque similar a este. No se incluye repo de GitHub, commit remoto ni push, salvo que Luis Felipe lo pida explícitamente para otra tarea.

```text
HANDOFF — SPRINT-NN <nombre corto>
──────────────────────────────────────
HUs completas:        HU-000, HU-000
HUs pendientes:       ninguna | HU-000 <motivo>
Archivos tocados:     ruta/archivo.ext
                      ruta/archivo.ext
Archivos NO tocados:  ruta/archivo.ext
                      ruta/archivo.ext
Datos/contratos:      <si aplica: fuente, plantilla, contrato o dato cargado>
Decisiones tomadas:   <decisiones de alcance o producto tomadas en el sprint>
Riesgos residuales:
  - <riesgo concreto + impacto + condición de revisión>
Validación hecha:
  Sintaxis:           <comando> -> pass | no aplica
  Render/flujo:       <qué se probó> -> pass | pendiente
  Datos:              <qué se validó> -> pass | pendiente
  Documentación:      BACKLOG.md + SPRINTS.md + MAPA_CODIGO.md (+ ROADMAP.md si aplica)
Auto-reporte DoD:     Completo | Parcial
                      <qué queda pendiente para que Luis Felipe u otra IA lo revise>
```

Reglas del handoff:

- Debe caber en una lectura rápida. No reemplaza el detalle de `SPRINTS.md`; lo resume.
- Debe distinguir `Archivos tocados` de `Archivos NO tocados` cuando haya riesgo de regresión sobre un archivo sensible.
- Debe decir explícitamente qué validación se hizo y qué no se pudo validar.
- Debe incluir riesgos residuales aunque el sprint esté cerrado.
- Si no hubo código, reemplazar validación técnica por revisión documental o de fuente.
- Si el trabajo fue parcial, `Auto-reporte DoD` debe decir `Parcial` y explicar por qué.

Antes de abrir cualquier sprint nuevo, cada agente **debe leer `SPRINTS.md` completo** (al menos las últimas 2-3 entradas) para saber qué hizo el otro agente recientemente y no duplicar ni pisar trabajo.

---

## 4. Mapa de código (`MAPA_CODIGO.md`)

Es un resumen navegable del repositorio — qué archivo hace qué, y dentro de los archivos grandes (como el tablero HTML), qué sección/función hace qué. El objetivo es que un agente nuevo (o el mismo agente en una sesión nueva) entienda la estructura **sin leer el código completo**.

**Regla dura: se actualiza en el mismo sprint en que el código cambia.** No se deja para después. Si un sprint agrega una función, una sección de UI, o reorganiza algo, `MAPA_CODIGO.md` refleja ese cambio antes de cerrar el sprint.

No hace falta detallar cada línea — sí hace falta que alguien pueda ubicar "¿dónde está la lógica de X?" en segundos.

### 4.1 — Versionado de código vs. versionado de documentos

La regla de `CLAUDE.md` ("no sobrescribir, versionar `v1`/`v2`/`v3`") es para **documentos** (`.md`/`.docx` de las carpetas 01, 02, 03, 06), donde no hay otra forma de dejar un punto de retorno legible para Luis Felipe.

Para **código** (`05-tablero-ocupacion/`), esa misma regla no aplica igual:

- No se crean carpetas nuevas por versión de la base modular (`v4-modular/`, `v5-modular/`...). `v3-modular/` se sigue editando in place, sprint tras sprint — así ya se ha venido haciendo desde `SPRINT-01`. Duplicar la carpeta completa por cada incremento reproduce el mismo problema de archivos gigantes redundantes que la modularización buscaba resolver, ahora multiplicado por carpeta.
- La identidad de versión de la base modular la lleva **git** (commits y, si hace falta un punto de revisión congelado para Luis Felipe, un tag), no el nombre de la carpeta ni un archivo duplicado.
- Los archivos HTML monolíticos ya existentes (`tablero-seguimiento-ocupacion.html`, `-v2.html`, `-v3-demo.html`) siguen su convención actual (no se tocan sin decisión explícita de Luis Felipe — ver `HU-034`); esto no cambia. La regla nueva aplica hacia adelante, para el código modular.

---

## 5. Roadmap (`ROADMAP.md`)

Organiza el trabajo por semana calendario, con el objetivo de esa semana en una frase y qué épicas/features se tocan. Se ajusta cada vez que el alcance real (lo que se ve en `SPRINTS.md`) se desvía de lo planeado — el roadmap se actualiza para reflejar la realidad, no se deja desactualizado como aspiración.

---

## 6. Reglas para trabajo simultáneo Codex + Claude Code

- **Misma ruta local:** ambos agentes trabajan sobre `Documentos/Claude/Projects/Comfenalco IA` — no hay copias paralelas del repo.
- Antes de tocar un archivo, revisar `SPRINTS.md` (últimas entradas) y el estado en `BACKLOG.md` para confirmar que esa HU no la está trabajando el otro agente en este momento.
- Si dos HUs del mismo sprint tocan el mismo archivo, coordinarlas dentro de la misma entrada de sprint en vez de abrir sprints paralelos sobre el mismo archivo.
- Ningún agente sobrescribe una versión de trabajo del otro sin decirlo explícitamente en el cierre del sprint. Para documentos: versionar `v1`, `v2`, `v3`... o decir explícitamente que se reemplaza (regla de `CLAUDE.md`). Para código modular: no crear carpetas nuevas por versión — editar in place y dejar el historial en el commit del cierre de sprint (ver 4.1).
- Cualquier decisión de producto ambigua (qué construir, qué prioridad) se resuelve preguntando a Luis Felipe, no asumiéndola en silencio — mismo criterio que ya rige en este proyecto.

---

## 7. Checklist rápido por sesión

Al empezar una sesión nueva:
- [ ] Leer `CLAUDE.md`, `BACKLOG.md`, `ROADMAP.md`, `SPRINTS.md` (últimas entradas), `MAPA_CODIGO.md`.

Al cerrar un sprint:
- [ ] `BACKLOG.md` actualizado (HUs a `Hecha`/`Bloqueada`)
- [ ] Entrada de cierre agregada en `SPRINTS.md`, con agente identificado, HUs trabajadas y resumen auditable para revisión externa
- [ ] `MAPA_CODIGO.md` actualizado si hubo cambios de código
- [ ] `ROADMAP.md` ajustado si el alcance real se movió
- [ ] Respuesta final del chat incluye bloque `HANDOFF` sin GitHub, con validación y riesgos residuales
- [ ] Commit local hecho (sin push), mensaje `SPRINT-NN — <objetivo corto> (Agente)`, cuerpo = resumen de cierre / `HANDOFF`
