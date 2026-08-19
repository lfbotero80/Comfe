# Cadena de prompts para la investigación de vigilancia — Turismo experiencial de bienestar (Comfenalco)

Adaptación de los tres prompts de "Formación 2- Prompts" con el KIT y los KIQ ya confirmados. Reemplazan los ejemplos genéricos del archivo original (personalización de viaje con IA, salud mental) que no aplican a este ejercicio.

Orden de uso: Prompt 1 en una herramienta con Deep Research real (Gemini, ChatGPT, Perplexity) → Prompt 2 sobre el reporte que arroje el Prompt 1, para extraer las URL → cargar esas URL/fuentes en NotebookLM → Prompt 3 dentro de NotebookLM para el informe final.

---

## Prompt 1 — Deep Research (Gemini, ChatGPT, etc.)

```
ROLE: Senior Strategic Research Agent

Actúa como un experto en Inteligencia Estratégica y Deep Research. Tu objetivo es realizar una investigación exhaustiva, crítica y altamente estructurada sobre el tema definido, cumpliendo estrictamente con el protocolo de proceso y el formato de entrega.

1. CONTEXTO DE LA MISIÓN

Propósito: Evaluar el estado actual y las tendencias del turismo experiencial de bienestar y naturaleza a nivel global y en Colombia, para identificar qué buscan los viajeros, cómo empaquetan y comunican esta experiencia hoteles y agencias de viaje comparables, y qué certificaciones o sellos de bienestar/sostenibilidad influyen en la decisión de compra, con el fin de orientar la oferta de hoteles y agencia de viajes de Comfenalco Antioquia (Hacienda Balandú, Recinto Quirama, Hostería y Camping Los Farallones). No incluye parques ecológicos (Piedras Blancas, Los Salados, Mario Aramburo).

Audiencia: Dirección de la Unidad de Turismo de Comfenalco Antioquia | equipo de innovación y desarrollo turístico.

Nivel de profundidad: Análisis profundo / estratégico de mercado y consumidor.

Alcance Geográfico y Temporal: Colombia / Latinoamérica / referentes globales relevantes | 2023-2026, priorizando información de los últimos 12-18 meses.

Filtros Críticos: El Lente de la Demanda del Viajero (qué servicios y actividades de bienestar buscan hoy), El Lente de la Oferta y Empaquetamiento (cómo diseñan y comunican esta experiencia hoteles/agencias comparables), El Lente de Confianza y Certificación (sellos de bienestar/sostenibilidad que valora el viajero), El Lente de la Realidad Local (aplicabilidad a un modelo de caja de compensación familiar operando en zonas rurales/de montaña en Colombia).

2. OBJETIVOS DE INVESTIGACIÓN (SUB-PREGUNTAS)

Investiga y resuelve los siguientes puntos con evidencia directa:

¿Qué servicios y actividades de bienestar buscan hoy los viajeros en hoteles vacacionales y de naturaleza en Colombia y Latinoamérica?

¿Cómo están empaquetando y comunicando hoteles y agencias de viaje comparables sus experiencias de bienestar y naturaleza?

¿Qué certificaciones o sellos de bienestar/sostenibilidad están valorando los viajeros al elegir un hotel o paquete turístico?

3. PROTOCOLO DE FUENTES Y RIGOR

Calidad de fuentes: Prioriza reportes de organismos turísticos (OMT/UNWTO), plataformas de tendencias (Skift, Euromonitor Travel, Booking.com Travel Predictions), gremios y cámaras colombianas (Cotelco, ANATO), estudios de cajas de compensación familiar, prensa especializada en turismo y bienestar, artículos académicos, informes sectoriales de alto impacto y la Guía Nacional de Vigilancia e Inteligencia Estratégica.

Idioma de fuentes: español, inglés, portugués.

Validación: Mínimo 12 fuentes únicas y 8-12 casos de estudio detallados (hoteles o agencias de viaje comparables, en Colombia y/o Latinoamérica).

NO INVENTES FUENTES O DATOS. CUANDO NO ENCUENTRES UN DATO O FUENTE ESCRIBE EXACTAMENTE: "DATO NO DISPONIBLE".

Citación: Cada dato o afirmación relevante debe llevar cita en APA versión más reciente, Autor (año). Si no hay evidencia, marca como "DATO NO DISPONIBLE". No inventes citas.

4. PROCESO INTERNO DE EJECUCIÓN (Deep Research Steps)

Arquitectura de Búsqueda Semántica: Diseña múltiples queries combinando términos técnicos, sinónimos y variaciones regionales para maximizar el alcance de la búsqueda en fuentes secundarias.

Cosecha y Filtrado de Alta Fidelidad: Recolecta un set inicial de más de 25 fuentes. Descarta blogs de opinión o contenido de relleno SEO. Conserva solo aquellos que aporten metodologías, datos cuantitativos, marcos de trabajo (frameworks) o evidencia empírica.

Extracción de Evidencia y Triangulación: Extrae datos clave (cifras, citas breves, autores, fechas). Aplica triangulación: si dos o más fuentes de distinto origen coinciden, se considera "hallazgo robusto". Si hay discrepancias, decláralas como "puntos de controversia o incertidumbre".

Análisis de Patrones y Anomalías: Identifica recurrencias en los datos (tendencias) pero también busca "señales débiles" que la mayoría ignora.

Síntesis Transversal y Valor Agregado: No te limites a resumir. Conecta la información con el Propósito y traduce los datos en implicaciones directas para la toma de decisiones de la Audiencia.

5. ESTRUCTURA OBLIGATORIA DE ENTREGA

El informe final debe presentarse bajo el modo informe ejecutivo con las siguientes secciones:

Resumen Ejecutivo (máximo 250 palabras).

Cuerpo del Análisis: dividido por temas según los Objetivos de Investigación.

Matriz de Implicaciones Estratégicas: impacto directo en Propuesta de Valor, Journey Map y Modelo de Negocio.

Recomendaciones Accionables: clasificadas por prioridad o plazo.

Riesgos, Limitaciones y Vacíos de Información.

Bibliografía: listado completo en formato APA versión más reciente y URL directas.

6. RESTRICCIONES Y ESTILO

Idioma de entrega: español.

Tono: profesional, ejecutivo y neutral.

Evita adjetivos subjetivos ("maravilloso", "increíble") y generalidades vacías.

Extensión mínima: 3000 palabras para todo el reporte.

Visuales: si es pertinente, genera tablas comparativas o matrices de análisis para facilitar la lectura rápida.
```

---

## Prompt 2 — Extracción de fuentes para NotebookLM

Se usa sobre el reporte que entregue el Prompt 1.

```
Identifica y accede a TODAS las URL y/o BIBLIOGRAFÍA de las fuentes citadas en el reporte, extrae solo las URL donde exista contenido dónde se mencione directamente información sobre el Propósito: Evaluar el estado actual y las tendencias del turismo experiencial de bienestar y naturaleza a nivel global y en Colombia, para identificar qué buscan los viajeros, cómo empaquetan y comunican esta experiencia hoteles y agencias de viaje comparables, y qué certificaciones o sellos de bienestar/sostenibilidad influyen en la decisión de compra. Entrega estas URL verificadas sin más texto, separadas entre sí por un espacio, llevaré estas URL a NotebookLM, por lo cual necesito solo las URL indicadas. NO INVENTES URL.
```

---

## Prompt 3 — Informe de vigilancia final (dentro de NotebookLM, con las fuentes ya cargadas)

```
# ROLEPLAY

Actúa como Consultor Senior en Vigilancia e Inteligencia Estratégica. Tu objetivo es transformar el contenido de las fuentes cargadas en un informe de vigilancia de alto valor, preciso y orientado a la acción.

# CONTEXTO Y ENFOQUE

El usuario requiere un análisis profundo basado estrictamente en las fuentes proporcionadas. El informe debe dirigirse a: Dirección de la Unidad de Turismo de Comfenalco Antioquia.

# INPUTS DE VIGILANCIA

- Tema de Vigilancia (KIT): Turismo experiencial de bienestar y naturaleza: tendencias que redefinen la oferta de hoteles y agencia de viajes de Comfenalco (Balandú, Quirama, Farallones; no incluye parques).

- Preguntas de Vigilancia (KIQ): ¿Qué servicios y actividades de bienestar buscan hoy los viajeros en hoteles vacacionales y de naturaleza en Colombia y Latinoamérica? ¿Cómo están empaquetando y comunicando hoteles y agencias de viaje comparables sus experiencias de bienestar y naturaleza? ¿Qué certificaciones o sellos de bienestar/sostenibilidad están valorando los viajeros al elegir un hotel o paquete turístico?

- Horizonte de tiempo: 2023 – 2026.

- Alcance Geográfico: Global (referentes relevantes) y Local (Colombia).

# REGLAS ESTRICTAS DE SOURCE GROUNDING

1. USE LOS ARCHIVOS SUBIDOS COMO SU ÚNICA Y EXCLUSIVA FUENTE; NO BUSQUE INFORMACIÓN EXTERNA.

2. NO INVENTE DATOS. Si un dato no existe en las fuentes, escriba exactamente: "DATOS NO DISPONIBLES".

3. CITACIÓN APA OBLIGATORIA: cada párrafo debe incluir al menos una cita en formato APA (Autor/Organización, Año) obtenida directamente de los documentos.

4. Si hay contradicciones entre fuentes, menciónalas explícitamente citando ambas partes.

# PROCESO DE ANÁLISIS (PASO A PASO)

1. Escaneo Profundo: procesa la totalidad de las fuentes cargadas para identificar respuestas a las KIQ.

2. Extracción de Evidencias: identifica datos, cifras y casos reales de los referentes analizados.

3. Síntesis Transversal: contrasta la información para identificar qué es tendencia (patrones) y qué es único (diferencias).

4. Generación de Valor: traduce los hallazgos en implicaciones e iniciativas accionables, y en las cinco fuerzas de Porter desde el microentorno y desde el macroentorno desde PESTEL.

# FORMATO DE SALIDA (ESTRUCTURA DEL INFORME)

Redacta el informe en español, en tercera persona, con un mínimo de 2000 palabras y la siguiente estructura:

1. RESUMEN EJECUTIVO: visión macro de los hallazgos más críticos.

2. ANÁLISIS POR PREGUNTAS DE VIGILANCIA (KIQs): respuesta detallada y citada a cada pregunta formulada.

3. MATRIZ COMPARATIVA TRANSVERSAL: tabla resumen comparando los referentes o temas clave encontrados.

4. PATRONES DETECTADOS: similitudes y estándares de la industria identificados en las fuentes.

5. DIFERENCIAS NOTABLES: anomalías, brechas o ventajas competitivas únicas de ciertos referentes.

6. IMPLICACIONES ESTRATÉGICAS: qué significan estos hallazgos para el KIT y las KIQ proporcionadas.

7. INSIGHTS CRÍTICOS: los 5 descubrimientos más potentes que cambian la perspectiva actual.

8. CINCO FUERZAS DE PORTER: desde la mirada del KIT y sus KIQ.

9. PESTEL: desde la mirada del KIT y sus KIQ.

10. OPORTUNIDADES Y AMENAZAS, con acciones del actuar ya.

11. INICIATIVAS Y ACCIONES SUGERIDAS: por cada insight crítico (5), presentar iniciativas específicas redactadas con (verbo en infinitivo + descripción detallada + tipo de innovación). Clasificarlas en Horizonte 1 (H1 - Core/Corto Plazo), Horizonte 2 (H2 - Adyacente/Medio Plazo), Horizonte 3 (H3 - Transformacional/Largo Plazo). Para cada iniciativa, incluir un "Caso de uso real" extraído de las fuentes.

12. PREGUNTAS PROBLEMA desde cada acción del actuar ya.

13. BIBLIOGRAFÍA: listado completo de fuentes consultadas en formato APA.
```

---

## Nota sobre el resto del archivo original

Los otros tres prompts de "Formación 2- Prompts" (extracción de datos de un documento, análisis cualitativo de comentarios de clientes, síntesis de tendencias en NotebookLM con plantilla) son plantillas generales, no específicas de este KIT. No se incluyen aquí porque no aplican al ciclo de investigación de este brief; quedan disponibles si en otro ejercicio necesitas procesar una base de comentarios de clientes o un informe de tendencias ya cargado.
