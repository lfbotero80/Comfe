import { appState } from '../state/app-state.js';
import { BUDGET_MONTHS, formatCOP, monthName, siteRowsSorted, summarizeSite } from '../domain/budget.js';
import { exportBudgetRows } from '../services/budget-export.js';
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
        <div class="section-actions">
          <button type="button" class="btn-ghost" data-export-budget-site="${escapeHTML(site.name)}" ${rows.length ? '' : 'disabled'}>Exportar CSV</button>
          ${summary.hasData ? badge(summary.confiable ? `${summary.pct.toFixed(0)}% cumplido` : 'Pendiente de validar', summary.confiable ? summary.severity : 'amber') : badge('Sin dato', 'gray')}
        </div>
      </div>
      ${summary.hasData ? renderBudgetBars(summary) : renderEmptyBudget()}
      ${renderYearDetail(site, rows)}
    </section>
  `;
}

export function bindSiteBudgetHandlers(){
  document.querySelectorAll('[data-export-budget-site]').forEach(button => {
    button.addEventListener('click', () => {
      const siteName = button.dataset.exportBudgetSite;
      exportBudgetRows(siteRowsSorted(appState.budgetRows, siteName), `comfenalco-presupuesto-${slug(siteName)}`);
    });
  });
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

/**
 * Detalle de los 12 meses de la sede, con desglose empresarial/individual
 * cuando el archivo lo trae. Va colapsado para no alargar la vista de la sede,
 * pero vive aqui (y no en una pestana aparte) desde `SPRINT-38`.
 */
function renderYearDetail(site, rows){
  const rowsByMonth = new Map(rows.map(row => [row.periodo, row]));
  const total = rows.reduce((sum, row) => sum + (Number(row.presupuesto) || 0), 0);
  const monthRows = BUDGET_MONTHS.map(([value, label]) => {
    const row = rowsByMonth.get(value);
    if(!row){
      return `<tr class="muted"><td>${escapeHTML(label)}</td><td>Sin dato</td><td>&mdash;</td><td>&mdash;</td><td>Sin dato</td><td>&mdash;</td></tr>`;
    }
    const confiable = row.dato_confiable !== 'no';
    const ejecCell = !confiable
      ? '<span class="pending-text">Pendiente de validar</span>'
      : (row.ejecutado ? formatCOP(row.ejecutado) : 'Pendiente');
    const pct = (confiable && Number(row.presupuesto) && row.ejecutado)
      ? `${((Number(row.ejecutado) / Number(row.presupuesto)) * 100).toFixed(0)}%`
      : '&mdash;';
    return `
      <tr>
        <td>${escapeHTML(label)}</td>
        <td>${formatCOP(row.presupuesto)}</td>
        <td>${row.presupuesto_empresarial ? formatCOP(row.presupuesto_empresarial) : '&mdash;'}</td>
        <td>${row.presupuesto_individual ? formatCOP(row.presupuesto_individual) : '&mdash;'}</td>
        <td>${ejecCell}</td>
        <td>${pct}</td>
      </tr>
    `;
  }).join('');

  return `
    <details class="budget-detail-card">
      <summary>
        <span>Detalle mensual 2026</span>
        <span class="metric-note">${rows.length ? `Presupuesto cargado: ${formatCOP(total)}` : 'Sin archivos cargados'}</span>
      </summary>
      <div class="budget-detail-inner">
        <div class="daily-table-wrap">
          <table class="data-table compact-table">
            <thead>
              <tr><th>Mes</th><th>Presupuesto</th><th>Ppto. empresarial</th><th>Ppto. individual</th><th>Ejecutado</th><th>% Cumpl.</th></tr>
            </thead>
            <tbody>${monthRows}</tbody>
          </table>
        </div>
      </div>
    </details>
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

function slug(value){
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
