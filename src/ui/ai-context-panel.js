import { buildAIRecommendationContext } from '../domain/ai-recommendation-context.js';
import { formatCOP } from '../domain/budget.js';
import { badge, escapeHTML } from './html.js';

export function renderAIContextPanel(site, activePeriod){
  const context = buildAIRecommendationContext(site, activePeriod);
  const missing = context.missingData.slice(0, 4);
  return `
    <section class="ai-context-panel">
      <div class="section-head compact">
        <div>
          <h3>Base para analisis asistido</h3>
          <p class="metric-note">Contexto estructurado por sede; no ejecuta IA ni cambia tarifas.</p>
        </div>
        ${badge(`Confianza ${context.confidence.label}`, context.confidence.severity)}
      </div>
      <div class="ai-context-grid">
        ${contextCard('Ocupacion', occupancyValue(context), occupancyNote(context))}
        ${contextCard('Presupuesto', budgetValue(context), budgetNote(context))}
        ${contextCard('Revenue', context.revenue.hasRules ? `${context.revenue.rulesCount} regla(s)` : 'Pendiente', context.revenue.currentStatus?.label || 'Sin tramo vigente')}
      </div>
      <div class="ai-context-footer">
        <div>
          <strong>${escapeHTML(context.confidence.guidance)}</strong>
          ${missing.length ? `
            <ul>
              ${missing.map(item => `<li>${escapeHTML(item.message)}</li>`).join('')}
            </ul>
          ` : '<span>Sin faltantes criticos para armar el contexto.</span>'}
        </div>
        <details>
          <summary>Ver paquete</summary>
          <pre>${escapeHTML(JSON.stringify(compactContext(context), null, 2))}</pre>
        </details>
      </div>
    </section>
  `;
}

function contextCard(label, value, note){
  return `
    <article class="ai-context-card">
      <span>${escapeHTML(label)}</span>
      <strong>${escapeHTML(value)}</strong>
      <small>${escapeHTML(note)}</small>
    </article>
  `;
}

function occupancyValue(context){
  if(!context.occupancy.hasData) return 'Sin dato';
  return `${context.occupancy.averagePercentage.toFixed(1)}%`;
}

function occupancyNote(context){
  if(!context.occupancy.hasData) return 'Forecast pendiente';
  return `${context.occupancy.rowsCount} fila(s) · ${context.occupancy.startDate} a ${context.occupancy.endDate}`;
}

function budgetValue(context){
  if(!context.budget.hasData) return 'Sin dato';
  if(!context.budget.reliable) return 'Pendiente';
  return `${context.budget.cumplimientoPorcentaje.toFixed(0)}%`;
}

function budgetNote(context){
  if(!context.budget.hasData) return 'Presupuesto pendiente';
  if(!context.budget.reliable) return 'Dato no confiable';
  return `${formatCOP(context.budget.ejecutado)} / ${formatCOP(context.budget.presupuesto)}`;
}

function compactContext(context){
  return {
    version: context.version,
    sede: context.site.name,
    tipo_sede: context.site.kind,
    periodo: context.activePeriod,
    confianza: context.confidence.label,
    faltantes: context.missingData.map(item => item.field),
    ocupacion: {
      filas: context.occupancy.rowsCount,
      promedio: context.occupancy.averagePercentage,
      ultimo_dato: context.occupancy.latestDate,
      fuente: context.sources.occupancy
    },
    presupuesto: {
      disponible: context.budget.hasData,
      confiable: context.budget.reliable,
      cumplimiento: context.budget.cumplimientoPorcentaje,
      fuente: context.sources.budget
    },
    revenue: {
      reglas: context.revenue.rulesCount,
      tramo_actual: context.revenue.currentStatus?.label || null,
      fuente: context.sources.revenue
    },
    comercial: {
      campanas: context.commercial.campaigns.length,
      calendario: context.commercial.activities.length
    }
  };
}
