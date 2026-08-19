import { appState } from '../../state/app-state.js';
import { BUDGET_MONTHS, budgetSites, formatCOP, siteRowsSorted, summarizeSite } from '../../domain/budget.js';
import { downloadCSV, toCSV } from '../../services/csv-export.js';
import { badge, escapeHTML } from '../html.js';

let activeMode = 'latest';

export function renderBudget(){
  const sites = budgetSites();
  const entries = sites.map(site => ({
    site,
    summary: summarizeSite(site.name, siteRowsSorted(appState.budgetRows, site.name), activeMode)
  }));
  const maxValue = Math.max(1, ...entries.map(({ summary }) => Math.max(summary.presupuesto || 0, summary.ejecutado || 0)));
  const sitesWithData = entries.filter(({ summary }) => summary.hasData).length;

  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Seguimiento presupuestal</h2>
          <p class="metric-note">Presupuesto vs. ejecucion por sede, con escala comun para poder comparar el tamano entre sedes.</p>
        </div>
        <button type="button" class="btn-ghost" id="btnExportBudgetAll">Exportar CSV (todas las sedes)</button>
      </div>
      <div class="validation-item pending">El presupuesto y la ejecucion se muestran solo para los meses y sedes con archivo cargado. Una fila marcada como "dato no confiable" se muestra pendiente de validar en vez de calcular un % de cumplimiento enganoso.</div>
      <div class="filter-bar">
        <label class="filter-control">
          <span>Periodo a visualizar</span>
          <select id="budgetModeSelect">
            <option value="latest" ${activeMode === 'latest' ? 'selected' : ''}>Periodo mas reciente por sede</option>
            <option value="accumulated" ${activeMode === 'accumulated' ? 'selected' : ''}>Acumulado (todos los meses cargados)</option>
            ${BUDGET_MONTHS.map(([value, label]) => `<option value="${value}" ${activeMode === value ? 'selected' : ''}>${label} 2026</option>`).join('')}
          </select>
        </label>
        <span class="metric-note">${sitesWithData} de ${sites.length} sedes con dato en este periodo.</span>
      </div>
      <div class="budget-legend">
        <span><span class="dot ppto"></span>Presupuesto</span>
        <span><span class="dot ejec"></span>Ejecutado</span>
        <span><span class="dot pending"></span>Pendiente / dato no confiable</span>
      </div>
      <div class="budget-report-list">
        ${entries.map(({ site, summary }) => budgetReportRow(site, summary, maxValue)).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Detalle mensual por sede</h2>
          <p class="metric-note">Los 12 meses de 2026, con desglose empresarial/individual cuando el archivo lo trae.</p>
        </div>
      </div>
      <div class="budget-detail-list">
        ${sites.map(site => budgetDetailCard(site, siteRowsSorted(appState.budgetRows, site.name))).join('')}
      </div>
    </section>
  `;
}

export function bindBudgetHandlers({ rerender }){
  const select = document.getElementById('budgetModeSelect');
  if(select){
    select.addEventListener('change', () => {
      activeMode = select.value;
      rerender();
    });
  }

  const exportAllBtn = document.getElementById('btnExportBudgetAll');
  if(exportAllBtn){
    exportAllBtn.addEventListener('click', () => {
      exportRows(appState.budgetRows, 'comfenalco-presupuesto-todas-las-sedes');
    });
  }

  document.querySelectorAll('[data-export-site]').forEach(button => {
    button.addEventListener('click', () => {
      const sede = button.dataset.exportSite;
      exportRows(siteRowsSorted(appState.budgetRows, sede), `comfenalco-presupuesto-${slug(sede)}`);
    });
  });
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
  const statusBadge = !summary.confiable ? badge('No confiable', 'amber') : badge(`${summary.pct.toFixed(0)}% cumplido`, summary.severity);

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

function budgetDetailCard(site, rows){
  const totalPresupuesto = rows.reduce((sum, row) => sum + (Number(row.presupuesto) || 0), 0);
  const rowsByMonth = new Map(rows.map(row => [row.periodo, row]));
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
        <span>${escapeHTML(site.name)}</span>
        <span class="metric-note">${rows.length ? `Presupuesto cargado: ${formatCOP(totalPresupuesto)}` : 'Sin archivos cargados'}</span>
      </summary>
      <div class="budget-detail-inner">
        <button type="button" class="btn-ghost" data-export-site="${escapeHTML(site.name)}">Exportar CSV de esta sede</button>
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

function exportRows(rows, filenamePrefix){
  const headers = ['Sede', 'Periodo', 'Presupuesto', 'Ppto Empresarial', 'Ppto Individual', 'Ejecutado', 'Ejec Empresarial', 'Ejec Individual', '% Cumplimiento', 'Dato confiable', 'Fuente', 'Fecha corte', 'Observaciones'];
  const csvRows = rows.map(row => {
    const confiable = row.dato_confiable !== 'no';
    const pct = (confiable && Number(row.presupuesto)) ? ((Number(row.ejecutado) / Number(row.presupuesto)) * 100).toFixed(1) : '';
    return [
      row.sede,
      row.periodo,
      Math.round(Number(row.presupuesto)) || 0,
      row.presupuesto_empresarial ? Math.round(Number(row.presupuesto_empresarial)) : '',
      row.presupuesto_individual ? Math.round(Number(row.presupuesto_individual)) : '',
      confiable ? (Math.round(Number(row.ejecutado)) || 0) : 'Pendiente de validar',
      row.ejecutado_empresarial ? Math.round(Number(row.ejecutado_empresarial)) : '',
      row.ejecutado_individual ? Math.round(Number(row.ejecutado_individual)) : '',
      pct,
      row.dato_confiable || '',
      row.fuente || '',
      row.fecha_corte || '',
      row.observaciones || ''
    ];
  });
  const csv = toCSV(headers, csvRows);
  downloadCSV(`${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

function slug(value){
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-');
}
