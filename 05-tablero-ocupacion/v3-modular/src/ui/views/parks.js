import { PARKS } from '../../domain/sites.js';
import { appState } from '../../state/app-state.js';
import { classifyOccupancy, OCCUPANCY_TARGET } from '../../domain/occupancy.js';
import { exportOccupancyRows, occupancyRowsBySite, occupancyRowsByType, slug } from '../../services/occupancy-export.js';
import { renderAIContextPanel } from '../ai-context-panel.js';
import { badge, escapeHTML, trafficLight } from '../html.js';
import { renderSiteBudgetPanel, bindSiteBudgetHandlers } from '../site-budget-panel.js';
import { renderBudgetFamilyPanel, bindBudgetFamilyHandlers } from '../budget-family-panel.js';

const SUMMARY_ID = '__resumen__';
let activeParkId = SUMMARY_ID;
const activeMonthByParkId = {};
const MONTHS = [
  ['01', 'Ene'],
  ['02', 'Feb'],
  ['03', 'Mar'],
  ['04', 'Abr'],
  ['05', 'May'],
  ['06', 'Jun'],
  ['07', 'Jul'],
  ['08', 'Ago'],
  ['09', 'Sep'],
  ['10', 'Oct'],
  ['11', 'Nov'],
  ['12', 'Dic']
];

export function renderParks(){
  if(activeParkId === SUMMARY_ID) return renderParksSummary();
  const activePark = PARKS.find(park => park.id === activeParkId) || PARKS[0];
  const rows = rowsForPark(activePark);
  const year = activeYear(rows);
  const monthSummaries = monthlySummaries(rows, year);
  const activeMonth = rows.length ? (activeMonthByParkId[activePark.id] || latestMonth(rows)) : null;
  const monthRows = rowsForMonth(rows, activeMonth);
  const latest = monthRows[monthRows.length - 1] || rows[rows.length - 1] || null;
  const status = latest ? classifyOccupancy(latest.ocupacion_porcentaje, latest.fecha) : null;

  return `
    ${renderParkTabs(activePark.id)}

    <section class="panel hotel-control">
      <div class="hotel-head">
        <div>
          <h2>${escapeHTML(activePark.name)}</h2>
          <p class="metric-note">${escapeHTML(activePark.role)}</p>
        </div>
        <div class="section-actions">
          <button type="button" class="btn-ghost" data-export-park="${escapeHTML(activePark.name)}" ${rows.length ? '' : 'disabled'}>Exportar parque</button>
          <button type="button" class="btn-ghost" id="btnExportParksAll">Exportar parques</button>
          ${status ? `<div class="alarm-context">${trafficLight(status.severity, 'horizontal')}${badge(status.label, status.severity)}</div>` : '<span class="pending-dot">Sin datos de uso</span>'}
        </div>
      </div>

      ${renderYearMovement(monthSummaries, activeMonth, year)}
      ${renderCompliance(monthSummaries.find(month => month.period === activeMonth), activeMonth)}
      ${latest ? renderParkMetrics(activePark, monthRows, latest, status, activeMonth) : renderMissingState(activePark, activeMonth)}
      ${renderSiteBudgetPanel(activePark, activeMonth)}
      ${latest ? renderAction(status) : renderMissingAction(activePark)}
      ${renderAIContextPanel(activePark, activeMonth)}
      ${renderDailyDetail(monthRows, activeMonth)}
    </section>
  `;
}

function renderParkTabs(activeId){
  return `
    <div class="tabs site-tabs">
      <button type="button" class="${activeId === SUMMARY_ID ? 'active' : ''}" data-park-tab="${SUMMARY_ID}">Resumen</button>
      ${PARKS.map(park => `
        <button type="button" class="${park.id === activeId ? 'active' : ''}" data-park-tab="${park.id}">
          ${escapeHTML(park.name)}
        </button>
      `).join('')}
    </div>
  `;
}

function renderParksSummary(){
  return `
    ${renderParkTabs(SUMMARY_ID)}
    ${renderBudgetFamilyPanel({ familyId: 'parques', familyLabel: 'Parques', sites: PARKS })}
  `;
}

export function bindParkHandlers({ rerender }){
  document.querySelectorAll('[data-park-tab]').forEach(button => {
    button.addEventListener('click', () => {
      activeParkId = button.dataset.parkTab;
      rerender();
    });
  });

  bindSiteBudgetHandlers();
  bindBudgetFamilyHandlers({ familyId: 'parques', sites: PARKS, rerender });

  document.querySelectorAll('[data-park-month]').forEach(button => {
    button.addEventListener('click', () => {
      activeMonthByParkId[activeParkId] = button.dataset.parkMonth;
      rerender();
    });
  });

  document.querySelectorAll('[data-export-park]').forEach(button => {
    button.addEventListener('click', () => {
      const siteName = button.dataset.exportPark;
      exportOccupancyRows(occupancyRowsBySite(appState.occupancyInventoryRows, siteName), `comfenalco-ocupacion-${slug(siteName)}`);
    });
  });

  const exportAllBtn = document.getElementById('btnExportParksAll');
  if(exportAllBtn){
    exportAllBtn.addEventListener('click', () => {
      exportOccupancyRows(occupancyRowsByType(appState.occupancyInventoryRows, 'parque'), 'comfenalco-ocupacion-parques');
    });
  }
}

function rowsForPark(park){
  return appState.occupancyInventoryRows
    .filter(row => row.sede === park.name)
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function rowsForMonth(rows, period){
  if(!period) return [];
  return rows.filter(row => String(row.fecha).startsWith(period));
}

function renderParkMetrics(park, rows, latest, status, monthLabel){
  const summary = monthSummary(rows.length ? rows : [latest]);
  return `
    <div class="grid four">
      ${metric('Uso del mes', `${summary.average.toFixed(1)}%`, monthLabel)}
      ${metric('Capacidad vigente', latest.inventario_total, latest.tipo_unidad || park.defaultUnitType)}
      ${metric('Usados', summary.occupiedAverage.toFixed(0), `${summary.freeAverage.toFixed(0)} libres promedio`)}
      ${metric('Dia operativo', status.context.dayName, status.context.label)}
    </div>
  `;
}

function renderMissingState(park, activeMonth){
  return `
    <div class="grid four">
      ${metric('Uso del mes', 'Pendiente', periodLabel(activeMonth))}
      ${metric('Capacidad vigente', 'Pendiente', park.defaultUnitType)}
      ${metric('Usados', 'Pendiente', 'Libres pendientes')}
      ${metric('Dia operativo', 'Pendiente', 'Sin fecha cargada')}
    </div>
    <div class="empty-state gray">
      <strong>Estructura creada, datos pendientes.</strong>
      <span>Cargue el archivo de ${escapeHTML(park.name)} para calcular uso del mes, capacidad, libres y alarma.</span>
    </div>
  `;
}

function renderYearMovement(monthSummaries, activeMonth, year){
  return `
    <section class="year-panel">
      <div class="section-head compact">
        <div>
          <h3>Movimiento anual ${escapeHTML(year)}</h3>
          <p class="metric-note">Una barra por mes; gris indica que falta archivo cargado.</p>
        </div>
      </div>
      <div class="month-bars">
        ${monthSummaries.map(month => renderMonthBar(month, activeMonth)).join('')}
      </div>
    </section>
  `;
}

function renderMonthBar(month, activeMonth){
  const height = month.hasData ? Math.max(18, month.average * 1.75) : 18;
  const label = month.hasData ? `${month.average.toFixed(0)}%` : 's/d';
  return `
    <button type="button" class="month-bar ${month.severity} ${month.period === activeMonth ? 'active' : ''}" data-park-month="${escapeHTML(month.period)}">
      <span class="month-value">${escapeHTML(label)}</span>
      <span class="month-column ${month.severity}" style="height:${height}px"></span>
      <span class="month-label">${escapeHTML(month.label)}</span>
    </button>
  `;
}

function renderCompliance(month, activeMonth){
  const hasData = Boolean(month?.hasData);
  const compliance = hasData ? month.compliance : 0;
  const severity = hasData ? month.severity : 'gray';
  const note = activeMonth
    ? `${activeMonth} · meta ${OCCUPANCY_TARGET}% uso`
    : `Sin periodo cargado · meta ${OCCUPANCY_TARGET}% uso`;
  return `
    <section class="compliance-panel">
      <div class="compliance-head">
        <div>
          <strong>Cumplimiento del mes</strong>
          <span>${escapeHTML(note)}</span>
        </div>
        ${badge(hasData ? `${compliance.toFixed(0)}%` : 'Pendiente', severity)}
      </div>
      <div class="compliance-track">
        <div class="compliance-fill ${severity}" style="width:${Math.min(compliance, 130)}%"></div>
        <span class="compliance-target" style="left:${Math.min(100, 100)}%"></span>
      </div>
    </section>
  `;
}

function renderAction(status){
  return `
    <div class="action-note strategic ${status.severity}">
      <strong>Accion sugerida:</strong> ${escapeHTML(status.recommendation)}
      <span>Se calcula con el semaforo de uso del mes activo y el calendario operativo.</span>
    </div>
  `;
}

function renderMissingAction(park){
  return `
    <div class="action-note strategic gray">
      <strong>Accion sugerida:</strong> Cargar uso operativo de ${escapeHTML(park.name)}.
      <span>Sin uso diario no se debe activar ni cerrar comunicacion comercial desde esta sede.</span>
    </div>
  `;
}

function renderDailyDetail(rows, monthLabel){
  const title = monthLabel ? `Detalle diario del mes ${monthLabel}` : 'Detalle diario pendiente';
  return `
    <div class="hotel-series">
      <h3>${escapeHTML(title)}</h3>
      ${rows.length ? `<div class="daily-table-wrap">
        <table class="data-table compact-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Capacidad</th>
              <th>Usados</th>
              <th>Libres</th>
              <th>Uso</th>
              <th>Dia</th>
              <th>Alarma</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => {
              const status = classifyOccupancy(row.ocupacion_porcentaje, row.fecha);
              return `
                <tr>
                  <td>${escapeHTML(row.fecha)}</td>
                  <td>${escapeHTML(row.tipo_unidad)}</td>
                  <td>${escapeHTML(row.inventario_total)}</td>
                  <td>${escapeHTML(row.unidades_ocupadas)}</td>
                  <td>${escapeHTML(row.unidades_libres)}</td>
                  <td><strong>${Number(row.ocupacion_porcentaje).toFixed(1)}%</strong></td>
                  <td>${escapeHTML(status.context.dayName)}</td>
                  <td>${badge(status.label, status.severity)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>` : '<div class="empty-state"><strong>Sin detalle diario para este mes.</strong><span>Cargue el archivo del parque para activar uso, capacidad, libres y alarma.</span></div>'}
    </div>
  `;
}

function monthSummary(rows){
  const clean = rows.filter(row => !Number.isNaN(Number(row.ocupacion_porcentaje)));
  const divisor = clean.length || 1;
  return {
    average: clean.reduce((sum, row) => sum + Number(row.ocupacion_porcentaje), 0) / divisor,
    occupiedAverage: clean.reduce((sum, row) => sum + Number(row.unidades_ocupadas || 0), 0) / divisor,
    freeAverage: clean.reduce((sum, row) => sum + Number(row.unidades_libres || 0), 0) / divisor
  };
}

function activeYear(rows){
  const latest = rows[rows.length - 1];
  return latest ? String(latest.fecha).slice(0, 4) : '2026';
}

function latestMonth(rows){
  const latest = rows[rows.length - 1];
  return latest ? String(latest.fecha).slice(0, 7) : null;
}

function periodLabel(period){
  return period || 'Sin periodo cargado';
}

function monthlySummaries(rows, year){
  return MONTHS.map(([month, label]) => {
    const period = `${year}-${month}`;
    const monthRows = rowsForMonth(rows, period);
    if(!monthRows.length){
      return { period, label, hasData: false, average: 0, compliance: 0, severity: 'gray' };
    }
    const summary = monthSummary(monthRows);
    const severity = summary.average >= OCCUPANCY_TARGET ? 'green' : summary.average >= 40 ? 'amber' : 'red';
    return {
      period,
      label,
      hasData: true,
      average: summary.average,
      compliance: OCCUPANCY_TARGET ? (summary.average / OCCUPANCY_TARGET) * 100 : 0,
      severity
    };
  });
}

function metric(label, value, note){
  return `
    <section class="panel metric mini">
      <span class="metric-label">${escapeHTML(label)}</span>
      <strong class="metric-value">${escapeHTML(value)}</strong>
      <span class="metric-note">${escapeHTML(note)}</span>
    </section>
  `;
}
