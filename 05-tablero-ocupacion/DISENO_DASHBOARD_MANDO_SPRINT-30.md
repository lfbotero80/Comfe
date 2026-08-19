# Diseno funcional — Dashboard de Mando

**Proyecto:** Tablero de ocupacion  
**Sprint:** SPRINT-30  
**Agente:** Codex  
**Fecha:** 2026-08-19  
**Estado:** especificacion funcional previa a desarrollo

## 1. Problema a resolver

El Dashboard general ha mejorado visualmente, pero todavia se lee como una suma de bloques: ocupacion, parques, presupuesto y filtros. Eso no basta para un usuario directivo.

El director necesita responder en menos de 10 segundos:

1. Si la Unidad de Turismo esta critica, en atencion, bajo control o sin dato suficiente.
2. Donde esta el riesgo principal.
3. Si el riesgo es de ocupacion, presupuesto, tendencia, datos faltantes o una combinacion.
4. Que accion debe ejecutarse primero.
5. Quien queda responsable y con que fuente se sustenta la decision.

La pantalla actual muestra datos, pero no ordena la decision. Por eso cada sprint visual ha corregido sintomas sin cerrar la experiencia directiva.

## 2. Principio de producto

El Dashboard general no debe ser una pagina resumen de todas las secciones. Debe ser un tablero de mando.

Regla:

- Dashboard general: decide y prioriza.
- Hoteles / Parques: explican el detalle operativo por sede.
- Presupuesto: profundiza en ejecucion financiera y desglose.
- Carga de datos: controla fuentes.
- Bitacora: registra compromisos, responsables y trazabilidad.

Si un elemento del Dashboard no ayuda a decidir prioridad, debe salir o bajar de jerarquia.

## 3. Lectura directiva propuesta

### 3.1 Banda de mando

Primer bloque de la pantalla.

Debe mostrar un estado unico de la unidad:

- **Critico:** hay al menos una sede con ocupacion/uso rojo y presupuesto rojo, o varias sedes rojas con datos suficientes.
- **Atencion:** hay sedes en amarillo, baja cobertura de datos relevante o presupuesto en amarillo.
- **Bajo control:** ocupacion/uso y presupuesto cumplen umbrales principales con cobertura suficiente.
- **Sin dato suficiente:** faltan fuentes centrales para leer el estado sin riesgo.

La banda debe incluir:

- Estado general.
- Motivo principal en una frase.
- Periodo filtrado.
- Cobertura de datos.

No debe incluir explicaciones largas ni frases tipo demo.

### 3.2 Tres indicadores directivos

Debajo de la banda:

1. **Ocupacion / uso consolidado:** promedio ponderado cuando exista inventario/capacidad; promedio simple solo como fallback visible.
2. **Ejecucion presupuestal:** real / proyectado, % de ejecucion y brecha absoluta en pesos.
3. **Sedes que requieren accion:** conteo de sedes con accion comercial, presupuestal o de carga de datos pendiente.

Estos indicadores deben abrir la lectura, no competir con graficas grandes.

### 3.3 Matriz de mando por sede

Debe ser el centro del dashboard.

Una fila por sede, agrupada por Hoteles y Parques o con columna tipo de sede. Columnas minimas:

- Sede.
- Tipo: Hotel / Parque.
- Ocupacion o uso del periodo.
- Cumplimiento presupuestal.
- Tendencia reciente.
- Estado combinado.
- Accion sugerida.
- Responsable / ultimo registro.
- Fuente o dato faltante principal.

La matriz debe ordenar por prioridad:

1. Rojo combinado.
2. Rojo de ocupacion/uso.
3. Rojo presupuestal.
4. Amarillo.
5. Sin dato critico.
6. Verde.

La matriz no reemplaza las pestanas por sede; solo indica donde entrar.

### 3.4 Cuadrante ocupacion vs presupuesto

Grafica visual principal para direccion.

Eje X: ocupacion/uso.  
Eje Y: cumplimiento presupuestal.  
Punto: sede.  
Color: estado combinado.  
Tamano opcional: presupuesto proyectado o inventario/capacidad, si existe dato confiable.

Cuadrantes:

- Alta ocupacion + alto presupuesto: proteger tarifa / mantener.
- Alta ocupacion + bajo presupuesto: revisar tarifa, mix o ejecucion financiera.
- Baja ocupacion + alto presupuesto: revisar presupuesto/meta o temporalidad.
- Baja ocupacion + bajo presupuesto: activar accion comercial prioritaria.

Este grafico debe ser mas importante que las barras repetidas por sede.

### 3.5 Top 3 acciones

Bloque de accion ejecutiva, no lista larga.

Cada accion debe mostrar:

- Sede.
- Alerta.
- Accion sugerida.
- Responsable si existe en bitacora.
- Fuente o dato usado.

La accion debe venir del motor deterministico actual cuando exista dato suficiente. Si faltan datos, la accion prioritaria puede ser cargar fuente faltante.

### 3.6 Calidad del dato

Bloque secundario al final o lateral inferior.

Debe mostrar:

- Sedes sin ocupacion/uso.
- Sedes sin presupuesto.
- Sedes sin reglas Revenue.
- Ultima fuente cargada.

No debe ocupar la zona principal del Dashboard, pero debe impedir decisiones falsas.

## 4. Reglas de calculo propuestas

### 4.1 Estado combinado por sede

Entradas:

- Estado de ocupacion/uso desde `classifyOccupancy()`.
- Cumplimiento presupuestal desde `budgetRows`.
- Cobertura de datos desde `data-readiness.js`.
- Accion sugerida desde `strategic-recommendation.js` o equivalente para parques.
- Ultimo responsable desde `decisionRows`.

Salida:

```text
{
  sede,
  tipo_sede,
  ocupacion_pct,
  presupuesto_pct,
  tendencia,
  estado_ocupacion,
  estado_presupuesto,
  estado_datos,
  estado_combinado,
  accion_sugerida,
  responsable,
  fuente_principal,
  prioridad
}
```

Regla base:

- `red`: ocupacion roja o presupuesto rojo con dato suficiente.
- `amber`: ocupacion amarilla, presupuesto amarillo o datos parciales relevantes.
- `green`: ocupacion y presupuesto en verde, con cobertura suficiente.
- `gray`: no hay dato suficiente para decidir.

Si hay conflicto entre buen presupuesto y mala ocupacion, gana el riesgo comercial para priorizar accion.

### 4.2 Estado general de unidad

El estado general no debe ser promedio puro. Debe tener logica de riesgo:

- `Critico`: cualquier sede prioritaria en rojo combinado, o dos o mas sedes rojas.
- `Atencion`: una o mas sedes en amarillo, o cobertura menor a la esperada.
- `Bajo control`: mayoria verde y sin rojos.
- `Sin dato suficiente`: mas de la mitad de sedes sin ocupacion o presupuesto para el periodo.

### 4.3 Lectura mensual vs anual

Mes especifico:

- Enfatiza accion operativa inmediata.
- Usa ultimo dato diario del mes.
- Muestra acciones y responsables.

Todo 2026:

- Enfatiza desempeno acumulado.
- Muestra tendencia por meses, no solo ultimo dato.
- Debe comparar avance anual, cobertura de meses cargados y sedes recurrentemente criticas.

Por eso `Todo 2026` no puede renderizar casi la misma pantalla que un mes.

## 5. Criterios de aceptacion para implementacion

El siguiente sprint de codigo no se acepta si:

- El dashboard queda como tres bloques independientes sin estado combinado.
- El director debe leer mas de 10 segundos para saber donde actuar.
- Las acciones sugeridas quedan escondidas en Hoteles/Parques.
- El modo `Todo 2026` se parece demasiado al mensual.
- Los datos faltantes aparecen como falla visual sin explicar que fuente falta.

Se acepta si:

- La primera pantalla muestra estado general, tres KPIs directivos, matriz de sedes, cuadrante y top 3 acciones.
- Cada sede tiene una prioridad calculada.
- Rojo/amarillo/verde/gris tienen reglas visibles pero no invasivas.
- La bitacora alimenta responsable/ultimo registro cuando exista.
- Hoteles/Parques siguen siendo el detalle, no el lugar obligado para saber si actuar.

## 6. HUs derivadas

- `TO-HU-079`: Estado general combinado de la unidad.
- `TO-HU-080`: Matriz de mando por sede.
- `TO-HU-081`: Cuadrante ocupacion vs presupuesto.
- `TO-HU-082`: Top 3 acciones con responsable y fuente.
- `TO-HU-083`: Lectura anual distinta de lectura mensual.

## 7. Recomendacion de ejecucion

No implementar todo en un solo sprint de codigo.

Secuencia recomendada:

1. **SPRINT-31:** dominio de mando + banda de mando + matriz por sede.
2. **SPRINT-32:** cuadrante ocupacion vs presupuesto + top 3 acciones.
3. **SPRINT-33:** lectura anual diferenciada para `Todo 2026`.

Esto evita volver a mover piezas visuales sin una logica directiva compartida.

## 8. Ajuste visual adoptado en SPRINT-31

Luis Felipe marco una tension correcta: un dashboard basado casi solo en barras se vuelve monotono y no ayuda a interpretar el negocio desde distintos angulos.

Decision adoptada para la implementacion inicial:

- Usar **cuadrante** para leer tipo de riesgo: ocupacion/uso vs presupuesto.
- Usar **matriz heatmap** para decision por sede.
- Usar **lineas** para tendencia anual.
- Usar **barras verticales** solo para comparacion presupuestal.
- Usar **radar** como perfil consolidado, no como metrica de precision.

Regla: no agregar graficas por variedad decorativa. Cada visual debe responder una pregunta distinta del tablero de mando.
