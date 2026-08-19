# Arquitectura IA para recomendaciones del Tablero de Ocupacion

**Sprint:** SPRINT-27  
**HU:** TO-HU-044  
**Fecha:** 2026-08-19  
**Agente:** Codex  
**Estado:** Documento de arquitectura para decision; no implementa backend ni IA real.

---

## 1. Decision que se esta evaluando

El tablero ya tiene una `Accion sugerida` deterministica. La pregunta no es si debe existir recomendacion: ya existe. La decision real es si conviene evolucionarla a una IA permanente que analice archivos cargados, contexto comercial y presupuesto para recomendar acciones con mayor criterio operativo.

**Recomendacion ejecutiva:** no conectar IA directamente desde el HTML local. Mantener el motor deterministico como linea base auditable y preparar una capa backend/API para recomendaciones asistidas. La IA debe explicar, priorizar y proponer, pero no cambiar tarifas ni activar campanas sin aprobacion humana.

---

## 2. Hechos verificados en la V3 modular

- `src/domain/strategic-recommendation.js` genera `Accion sugerida` para Hoteles con reglas deterministicas.
- La recomendacion actual combina ocupacion del mes, ultimo dato, semaforo, tendencia reciente, calendario comercial y campanas asociadas.
- `src/domain/occupancy.js` clasifica ocupacion con umbrales del negocio: alta demanda `>=90%`, estandar `>=70%`, preventa `40-69%`, mas cerca `<40%`, y cierre operativo normal en gris.
- `src/domain/commercial-context.js` cruza sede, fecha, calendario comercial y catalogo de campanas.
- Los contratos actuales separan tres fuentes: `occupancyInventory`, `budgetExecution` y `revenueRules`.
- La V3 modular funciona como demo local sin backend; no hay usuario real, persistencia central, jobs programados, API segura ni auditoria multiusuario.

---

## 3. Que puede hacer y que no puede hacer la IA

### Puede aportar valor

- Detectar patrones que una regla fija no ve bien: caidas por dia de semana, brechas por sede, meses atipicos, ocupacion alta con bajo cumplimiento presupuestal, o sedes con campanas repetidas sin efecto.
- Generar una recomendacion en lenguaje ejecutivo: que hacer, por que, hasta cuando revisarlo y que riesgo se corre si no se actua.
- Comparar opciones: activar campana, mantener comunicacion, proteger tarifa, pausar descuento, o escalar a gerente.
- Resumir anomalias de carga: datos faltantes, cortes viejos, presupuesto no confiable, reglas de Revenue ausentes.

### No debe hacer sin control humano

- Cambiar tarifas automaticamente.
- Activar campanas sin aprobacion de Comercial/Reservas.
- Reemplazar reglas aprobadas de Revenue por intuiciones generadas.
- Usar datos incompletos como si fueran verdad operativa.
- Guardar informacion sensible en prompts sin gobierno de acceso.

---

## 4. Arquitectura recomendada

### Capa 1: motor deterministico local

**Responsabilidad:** producir siempre una recomendacion minima auditable aun sin IA.

**Ya existe:** `strategic-recommendation.js`.

**Debe seguir existiendo:** si la IA falla, demora, no tiene permisos o no hay backend, el tablero no debe quedar mudo.

### Capa 2: paquete de contexto para IA

**Responsabilidad:** transformar datos del tablero en un resumen estructurado, no enviar todo el DOM ni tablas completas sin filtro.

Entrada minima por sede:

- Sede, tipo de sede y rol estrategico.
- Periodo activo.
- Ultimo corte cargado y fuente.
- Ocupacion diaria del periodo.
- Promedio del mes, tendencia reciente y brecha contra meta.
- Presupuesto, ejecutado, cumplimiento y confiabilidad del dato.
- Semaforo vigente y regla Revenue aplicable.
- Campanas disponibles y campanas ya ejecutadas.
- Eventos de calendario comercial y condicion operativa del periodo.

Salida esperada:

- `accion`: decision sugerida.
- `prioridad`: alta, media o baja.
- `rationale`: explicacion corta con datos citados.
- `riesgo_si_no_actua`: riesgo operativo/comercial.
- `siguiente_revision`: fecha o condicion de seguimiento.
- `requiere_aprobacion`: responsable sugerido.
- `confianza`: alta, media o baja.
- `datos_faltantes`: lista concreta si la recomendacion esta limitada.

### Capa 3: servicio backend de recomendaciones

**Responsabilidad:** recibir el contexto, llamar al modelo de IA, guardar auditoria y devolver una recomendacion estructurada.

Debe incluir:

- Autenticacion de usuario.
- Control de roles.
- Llaves de IA en servidor, nunca en el HTML.
- Registro de prompt/contexto resumido, respuesta, version del modelo y usuario solicitante.
- Politica de retencion de datos.
- Validacion de salida: la IA devuelve JSON estructurado y el backend valida campos obligatorios antes de enviarlos al tablero.

### Capa 4: bitacora y aprobacion

**Responsabilidad:** convertir recomendacion en seguimiento operativo.

La IA propone. Diana, gerente o Comercial aprueba, ajusta o rechaza. Esa decision debe quedar en bitacora con responsable y fecha. Esto conecta con `TO-HU-026` y `TO-HU-027`.

---

## 5. Flujo recomendado

1. Usuario carga archivos de ocupacion, presupuesto y reglas de Revenue.
2. El tablero valida contratos y calcula semaforo deterministico.
3. El tablero arma un contexto compacto por sede.
4. Usuario solicita o el sistema programa analisis IA.
5. Backend llama a IA y devuelve recomendacion estructurada.
6. Tablero muestra:
   - recomendacion deterministica como base;
   - recomendacion IA como analisis asistido;
   - datos faltantes o baja confianza cuando aplique.
7. Usuario aprueba/rechaza y registra decision en bitacora.

---

## 6. Modos posibles de implementacion

### Opcion A: seguir solo con reglas deterministicas

**Ventaja:** simple, auditable, no requiere backend ni costos de IA.  
**Limite:** no captura patrones complejos ni redacta recomendaciones con criterio contextual amplio.  
**Uso recomendado:** mantener como base permanente y fallback.

### Opcion B: IA bajo demanda despues de cargar archivos

**Ventaja:** baja complejidad inicial; el usuario controla cuando analiza.  
**Limite:** no es "permanente"; depende de accion manual.  
**Uso recomendado:** primer piloto real.

### Opcion C: IA permanente con job programado

**Ventaja:** alertas automaticas y lectura diaria por sede.  
**Limite:** requiere backend, fuente programada de Zeus/Power BI, usuarios, auditoria, costos y reglas de aprobacion.  
**Uso recomendado:** solo despues de validar que las recomendaciones bajo demanda si cambian decisiones.

---

## 7. Datos minimos antes de pilotear IA

La IA no debe entrar a producir recomendaciones ejecutivas si faltan estos insumos:

- Forecast diario Zeus por sede.
- Presupuesto y ejecutado por sede/periodo.
- Reglas Revenue vigentes por sede o tipo de unidad.
- Catalogo de campanas actualizado.
- Calendario comercial por sede.
- Fuente y fecha de corte de cada carga.
- Responsable que solicita/aprueba la recomendacion.

Si falta alguno, la salida debe decir `confianza: baja` y listar el dato faltante.

---

## 8. Riesgos

- **Riesgo de falsa autoridad:** que una recomendacion redactada por IA parezca decision aprobada. Mitigacion: siempre mostrarla como "analisis asistido" y exigir aprobacion.
- **Riesgo de dato incompleto:** si solo se carga ocupacion pero no presupuesto, la IA puede recomendar vender mas sin ver rentabilidad. Mitigacion: campo obligatorio de datos faltantes y confianza.
- **Riesgo de seguridad:** una llave de IA en HTML local quedaria expuesta. Mitigacion: backend obligatorio para IA real.
- **Riesgo de trazabilidad:** sin usuario y bitacora, no se sabe quien acepto una accion. Mitigacion: cerrar `TO-HU-026` y `TO-HU-027` antes de activar recomendaciones operativas.
- **Riesgo regulatorio/comercial:** tarifas/promociones pueden requerir validacion interna. Mitigacion: IA no ejecuta; solo recomienda y escala.

---

## 9. Propuesta de backlog derivado

- **TO-HU-073:** Como Diana, quiero que cada sede tenga un paquete de contexto estructurado para IA, para que la recomendacion use solo datos validados y no lea la pantalla completa.
- **TO-HU-074:** Como Comercial/Reservas, quiero solicitar una recomendacion IA bajo demanda por sede, para comparar la accion sugerida deterministica con un analisis asistido.
- **TO-HU-075:** Como administradora, quiero que toda recomendacion IA guarde usuario, fecha, fuente de datos y version de respuesta, para auditar decisiones.
- **TO-HU-076:** Como Diana, quiero que una recomendacion IA con datos incompletos muestre confianza baja y datos faltantes, para no tomar decisiones con informacion insuficiente.
- **TO-HU-077:** Como jefatura, quiero recibir un resumen diario automatizado de sedes en riesgo, para actuar sin abrir manualmente cada pestaña.

---

## 10. Secuencia recomendada

1. Cerrar bitacora y responsables (`TO-HU-026`, `TO-HU-027`).
2. Crear el paquete de contexto para IA (`TO-HU-073`) sin llamar a ningun modelo todavia.
3. Agregar recomendacion IA bajo demanda (`TO-HU-074`) con backend minimo.
4. Validar durante 2-4 semanas si las recomendaciones cambian decisiones reales.
5. Solo despues evaluar IA permanente con job diario (`TO-HU-077`).

**Decision sugerida:** aprobar solo la fase bajo demanda como piloto. No construir IA permanente hasta tener trazabilidad, backend y evidencia de utilidad operativa.
