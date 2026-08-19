import { appState } from '../state/app-state.js';
import { BUDGET_MONTHS, formatCOP, siteRowsSorted, summarizeSite } from '../domain/budget.js';
import { budgetRowsForSites, exportBudgetRows } from '../services/budget-export.js';
import { badge, escapeHTML } from './html.js';

// Cada familia (hoteles / parques) conserva su propio periodo seleccionado,
// para que cambiar de pestana no arrastre el filtro de la otra.
const modeByFamily = {};

export function getFamilyBudgetMode(familyId){
  return modeByFamily[familyId] || 'latest';
}

/**
 * Comparacion presupuestal de una familia de sedes (hoteles o parques) con
 * escala comun **dentro de esa familia**: asi un parque chico no queda como
 * una raya al lado de un hotel grande, que era el problema de comparar las
 * 9 sedes juntas en la pestana Presupuesto que existia hasta `SPRINT-37`.
 */
export function renderBudgetFamilyPanel({ familyId, familyLabel, sites }){
  const mode = getFamilyBudgetMode(familyId);
  const entries = sites.map(site => ({
    site,
    summary: summarizeSite(site.name, siteRowsSorted(appState.budgetRows, site.name), mode)
  }));
  const withData = entries.filter(entry => entry.summary.hasData);
  const maxValue = Math.max(1, ...entries.map(({ summary }) => Math.max(summary.presupuesto || 0, summary.ejecutado || 0)));
  const totals = familyTotals(withData);

  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Presupuesto · ${escapeHTML(familyLabel)}</h2>
          <p class="metric-note">Presupuesto vs. ejecucion, con escala comun para comparar entre ${escapeHTML(familyLabel.toLowerCase())}.</p>
        </div>
        <button type="button" class="btn-ghost" data-export-budget-family="${escapeHTML(familyId)}" ${withData.length ? '' : 'disabled'}>Exportar CSV</button>
      </div>

      <div class="filter-bar">
        <label class="filter-control">
          <span>Periodo a visualizar</span>
          <select data-budget-family-mode="${escapeHTML(familyId)}">
            <option value="latest" ${mode === 'latest' ? 'selected' : ''}>Periodo mas reciente por sede</option>
            <option value="accumulated" ${mode === 'accumulated' ? 'selected' : ''}>Acumulado (todos los meses cargados)</option>
            ${BUDGET_MONTHS.map(([value, label]) => `<option value="${value}" ${mode === value ? 'selected' : ''}>${label} 2026</option>`).join('')}
          </select>
        </label>
        <span class="metric-note">${withData.length} de ${sites.length} sedes con dato en este periodo.</span>
      </div>

      ${totals ? renderFamilyTotals(totals) : ''}

      <div class="budget-legend">
        <span><span class="dot ppto"></span>Presupuesto</span>
        <span><span class="dot ejec"></span>Ejecutado</span>
        <span><span class="dot pending"></span>Pendiente / dato no confiable</span>
      </div>

      <div class="budget-report-list">
        ${entries.map(({ site, summary }) => budgetReportRow(site, summary, maxValue)).join('')}
      </div>
    </section>
  `;
}

export function bindBudgetFamilyHandlers({ familyId, sites, rerender }){
  const select = document.querySelector(`[data-budget-family-mode="${familyId}"]`);
  if(select){
    select.addEventListener('change', () => {
      modeByFamily[familyId] = select.value;
      rerender();
    });
  }

  const exportBtn = document.querySelector(`[data-export-budget-family="${familyId}"]`);
  if(exportBtn){
    exportBtn.addEventListener('click', () => {
      exportBudgetRows(budgetRowsForSites(appState.budgetRows, sites), `comfenalco-presupuesto-${familyId}`);
    });
  }
}

function familyTotals(entriesWithData){
  if(!entriesWithData.length) return null;
  const presupuesto = entriesWithData.reduce((sum, entry) => sum + (entry.summary.presupuesto || 0), 0);
  const ejecutado = entriesWithData
    .filter(entry => entry.summary.confiable)
    .reduce((sum, entry) => sum + (entry.summary.ejecutado || 0), 0);
  const pct = presupuesto ? (ejecutado / presupuesto) * 100 : 0;
  return {
    presupuesto,
    ejecutado,
    pct,
    severity: pct >= 90 ? 'green' : pct >= 70 ? 'amber' : 'red'
  };
}

function renderFamilyTotals(totals){
  return `
    <div class="budget-family-total">
      <div>
        <span class="metric-label">Total de la familia</span>
        <strong class="metric-value">${formatCOP(totals.ejecutado)}</strong>
        <span class="metric-note">de ${formatCOP(totals.presupuesto)} presupuestado</span>
      </div>
      ${badge(`${totals.pct.toFixed(0)}% ejecutado`, totals.severity)}
    </div>
  `;
}

function budgetReportRow(site, summary, maxValue){
  if(!summary.hasData){
    return `
      <div class="budget-report-row muted">
        <div class="budget-report-head">
          <strong>${escapeHTML(site.name)}</strong>
          ${badge('Sin dato', 'gray')}
        </div>
        <div class="budget-report-bars">
          <div class="budget-report-bar">
            <span class="budget-report-label">Presupuesto</span>
            <div class="bar-track"><div class="bar-fill gray" style="width:100%"></div></div>
            <strong>Sin dato</strong>
          </div>
        </div>
      </div>
    `;
  }

  const pptoWidth = (summary.presupuesto / maxValue) * 100;
  const ejecWidth = summary.confiable ? ((summary.ejecutado || 0) / maxValue) * 100 : 0;
  const statusBadge = summary.confiable
    ? badge(`${summary.pct.toFixed(0)}% cumplido`, summary.severity)
    : badge('No confiable', 'amber');

  return `
    <div class="budget-report-row">
      <div class="budget-report-head">
        <strong>${escapeHTML(site.name)}</strong>
        <span class="metric-note">${escapeHTML(summary.periodoLabel)}</span>
        ${statusBadge}
      </div>
      <div class="budget-report-bars">
        <div class="budget-report-bar">
          <span class="budget-report-label">Presupuesto</span>
          <div class="bar-track"><div class="bar-fill" style="width:${pptoWidth}%"></div></div>
          <strong>${formatCOP(summary.presupuesto)}</strong>
        </div>
        <div class="budget-report-bar">
          <span class="budget-report-label">Ejecutado</span>
          <div class="bar-track"><div class="bar-fill ${summary.confiable ? summary.severity : 'gray'}" style="width:${summary.confiable ? ejecWidth : 100}%"></div></div>
          <strong>${summary.confiable ? formatCOP(summary.ejecutado) : 'Pendiente de validar'}</strong>
        </div>
      </div>
    </div>
  `;
}
