---
name: generador-informes-gestion
description: Estructura informes de gestión, resultados y seguimiento para la Línea Técnica de Hotelería de Comfenalco Antioquia — PyG por sede, ejecución presupuestal vs. presupuesto, ocupación, PQR/PSNC, seguimiento a iniciativas estratégicas del cronograma UIT. Úsala siempre que Diana pida armar, resumir o analizar un informe de gestión, un reporte de resultados, un seguimiento mensual/trimestral, o cuando deba consolidar cifras de varias sedes en una narrativa ejecutiva.
---

# Generador de Informes y Reportes de Gestión

## Propósito

Convertir cifras y datos dispersos (presupuesto vs. ejecución, ocupación, PQR, avance del cronograma de iniciativas estratégicas, novedades operativas) en informes de gestión claros, con narrativa ejecutiva orientada a la toma de decisión, en el tono analítico y estratégico que exige el rol de Diana.

## Estructura estándar de informe recomendada

1. **Resumen ejecutivo** (máximo 5-7 líneas): qué pasó, qué tan bien/mal frente a la meta, y qué se recomienda hacer.
2. **Cifras clave por sede**, usando la lógica ya existente en los reportes de Comfenalco (ver `Distribución del Presupuesto Unidad de Turismo 2026.xlsx`):
   - Ingresos por línea: Empresarial / Individual / Eventos temáticos / Excedentes — esta es la taxonomía real que usa el presupuesto, no una clasificación genérica de "habitaciones vs. alimentos".
   - Presupuesto (Ppto) vs. Ejecución (Ejec), con % de cumplimiento, mes a mes.
   - Ocupación acumulada, tomada del sistema de reservas **Zeus** (módulo Forecast para ocupación proyectada; datos reales de ocupación ejecutada para el corte cerrado) y del tablero Power BI "Tablero del alojado" cuando esté disponible.
3. **Distribución de ingresos por centro de costos** cuando aplique (Alimentos y Bebidas, Alojamiento, Recreación, Eventos, Admón).
4. **Hallazgos relevantes**: novedades críticas de mantenimiento, movimientos de personal entre sedes, eventos relevantes del periodo — solo si son pertinentes al informe solicitado.
5. **PQR / PSNC**: estado y oportunidades de mejora identificadas (articular con Juliana Arroyo cuando el dato no esté disponible en el proyecto).
6. **Avance de iniciativas estratégicas** (cuando el informe lo requiera): reportar el estado tal como aparece en el cronograma maestro (`Cronograma Plan de trabajo Turismo.xlsm`, frente 3 "Hoteles y Parques"), citando actividad, % de avance real y estado (ej. "Vencida", "Retrasada", "En progreso"), sin suavizar el estado real por conveniencia narrativa.
7. **Riesgos y alertas**: desviaciones frente a presupuesto, temas críticos sin resolver, dependencias de otras áreas.
8. **Recomendaciones / próximos pasos**: accionables, con responsable sugerido si aplica.

## Reglas de trabajo con cifras

- **Nunca inventar o interpolar cifras.** Si un mes no tiene dato de ejecución (como ocurre en varios archivos de presupuesto del proyecto, con meses vacíos), decir explícitamente "sin dato reportado a la fecha" en vez de omitirlo silenciosamente o estimarlo.
- Citar siempre la sede, el periodo exacto y el archivo/fuente de la cifra utilizada (ej. "Distribución del Presupuesto Unidad de Turismo 2026.xlsx, corte a [mes]").
- Distinguir con claridad las unidades de negocio que comparten administración pero son predios y centros de costo distintos: **Hostería Los Farallones** vs. **Camping Los Farallones**, y **Hotel Piedras Blancas** vs. **Parque Piedras Blancas** — nunca sumarlas sin advertirlo explícitamente si el informe las consolida.
- **Parque Ecológico Los Salados** no tiene alojamiento (es una sede exclusivamente de pasadía/día de sol); no reportar "ocupación" para esta sede, sino número de visitantes o cupos utilizados.
- Cuando se calculen porcentajes de cumplimiento, mostrar la fórmula o el criterio usado (ej. Ejecución acumulada / Presupuesto acumulado al mismo corte).
- Al reportar mezcla de ingresos por sede, tener presente los roles de negocio ya identificados: Recinto Quirama es predominantemente empresarial (contratos/eventos), mientras Hostería Los Farallones y Hacienda Balandú son predominantemente individuales — una caída en ingreso individual en Quirama no tiene el mismo peso relativo que en las otras sedes.
- Si los datos provienen de una fuente pública (no interna), señalarlo para que no se confunda con cifras oficiales de Comfenalco.

## Formato de entrega

- Por defecto, entregar el informe en Markdown dentro del chat para revisión rápida (metodología del proyecto: primero `.md`, después el instrumento final).
- Si Diana pide el informe final para compartir con líderes o para presentación formal, ofrecer convertirlo a Word o PowerPoint (usar las skills de documentos correspondientes), aplicando el manual de marca cuando esté disponible.
- Si ya existe una versión previa del informe, no sobrescribirla: crear una nueva versión (v1, v2, v3...) para conservar el historial de decisiones.

## Qué NO hacer

- No usar juicios de valor sobre el desempeño de personas o sedes; describir hechos y cifras, dejar la interpretación de responsabilidad a Diana.
- No mezclar cifras de distintos cortes de tiempo sin aclararlo.
- No presentar el informe como definitivo si hay datos faltantes — siempre señalar los vacíos de información.
- No usar "gratis", "gratuito" o "gratuidad" para referirse a actividades sin cobro: usar siempre "tarifa sin costo" o "tarifa a cero pesos".
