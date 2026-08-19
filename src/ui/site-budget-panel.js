import { appState } from '../state/app-state.js';
import { formatCOP, monthName, siteRowsSorted, summarizeSite } from '../domain/budget.js';
import { badge, escapeHTML } from './html.js';

export function renderSiteBudgetPanel(site, activePeriod){
  const rows = siteRowsSorted(appState.budgetRows, site.name);
  const activeSummary = activePeriod
    ? summarizeSite(site.name, rows, activePeriod)
    : { hasData: false };
  const latestSummary = summarizeSite(site.name, rows, 'latest');
  const summary = activeSummary.hasData ? activeSummary : latestSummary;
  const note = activeSummary.hasData
    ? `${monthName(activePeriod)} 2026`
    : summary.hasData && activePeriod
      ? `Sin presupuesto para ${activePeriod}; se muestra ultimo periodo cargado`
      : summary.hasData
        ? 'Sin periodo de ocupacion cargado; se muestra ultimo presupuesto cargado'
      : 'Sin presupuesto cargado para esta sede';

  return `
    <section class="site-budget-panel">
      <div class="section-head compact">
        <div>
          <h3>Seguimiento presupuestal de la sede</h3>
          <p class="metric-note">${escapeHTML(note)}</p>
        </div>
        ${summary.hasData ? badge(summary.confiable ? `${summary.pct.toFixed(0)}% cumplido` : 'Pendiente de validar', summary.confiable ? summary.severity : 'amber') : badge('Sin dato', 'gray')}
      </div>
      ${summary.hasData ? renderBudgetBars(summary) : renderEmptyBudget()}
    </section>
  `;
}

function renderBudgetBars(summary){
  const maxValue = Math.max(summary.presupuesto || 0, summary.ejecutado || 0, 1);
  const budgetWidth = ((summary.presupuesto || 0) / maxValue) * 100;
  const executedWidth = summary.confiable ? ((summary.ejecutado || 0) / maxValue) * 100 : 100;
  return `
    <div class="site-budget-bars">
      <div class="site-budget-bar">
        <span>Presupuesto</span>
        <div class="bar-track"><div class="bar-fill" style="width:${budgetWidth}%"></div></div>
        <strong>${formatCOP(summary.presupuesto)}</strong>
      </div>
      <div class="site-budget-bar">
        <span>Ejecutado</span>
        <div class="bar-track"><div class="bar-fill ${summary.confiable ? summary.severity : 'gray'}" style="width:${executedWidth}%"></div></div>
        <strong>${summary.confiable ? formatCOP(summary.ejecutado) : 'Pendiente'}</strong>
      </div>
    </div>
  `;
}

function renderEmptyBudget(){
  return `
    <div class="empty-state gray">
      <strong>Presupuesto pendiente.</strong>
      <span>Cargue presupuesto/ejecucion de esta sede para ver cumplimiento financiero junto a la ocupacion.</span>
    </div>
  `;
}
