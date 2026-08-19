import { HOTELS } from '../../domain/sites.js';
import { appState } from '../../state/app-state.js';
import { classifyOccupancy, OCCUPANCY_TARGET } from '../../domain/occupancy.js';
import { commercialContextForSite } from '../../domain/commercial-context.js';
import { buildStrategicRecommendation } from '../../domain/strategic-recommendation.js';
import { exportOccupancyRows, occupancyRowsBySite, occupancyRowsByType, slug } from '../../services/occupancy-export.js';
import { badge, escapeHTML, trafficLight } from '../html.js';
import { renderSiteBudgetPanel } from '../site-budget-panel.js';

let activeHotelId = HOTELS[0].id;
const activeMonthByHotelId = {};
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

export function renderHotels(){
  const activeHotel = HOTELS.find(hotel => hotel.id === activeHotelId) || HOTELS[0];
  const rows = rowsForHotel(activeHotel);
  const year = activeYear(rows);
  const monthSummaries = monthlySummaries(rows, year);
  const activeMonth = rows.length ? (activeMonthByHotelId[activeHotel.id] || latestMonth(rows)) : null;
  const monthRows = rowsForMonth(rows, activeMonth);
  const latest = monthRows[monthRows.length - 1] || null;
  const status = latest ? classifyOccupancy(latest.ocupacion_porcentaje, latest.fecha) : null;
  const commercialContext = latest ? commercialContextForSite(activeHotel.name, latest.fecha, status) : { campaigns: [], activities: [] };
  const strategicRecommendation = buildStrategicRecommendation({
    siteName: activeHotel.name,
    monthRows,
    latestRow: latest,
    status,
    commercialContext
  });

  return `
    <div class="tabs site-tabs">
      ${HOTELS.map(hotel => `
        <button type="button" class="${hotel.id === activeHotel.id ? 'active' : ''}" data-hotel-tab="${hotel.id}">
          ${escapeHTML(hotel.name)}
        </button>
      `).join('')}
    </div>

    <section class="panel hotel-control">
      <div class="hotel-head">
        <div>
          <h2>${escapeHTML(activeHotel.name)}</h2>
          <p class="metric-note">${escapeHTML(activeHotel.role)}</p>
        </div>
        <div class="section-actions">
          <button type="button" class="btn-ghost" data-export-hotel="${escapeHTML(activeHotel.name)}" ${rows.length ? '' : 'disabled'}>Exportar hotel</button>
          <button type="button" class="btn-ghost" id="btnExportHotelsAll">Exportar hoteles</button>
          ${status ? `<div class="alarm-context">${trafficLight(status.severity, 'horizontal')}${badge(status.label, status.severity)}</div>` : '<span class="pending-dot">Sin datos de ocupacion</span>'}
        </div>
      </div>

      ${renderYearMovement(monthSummaries, activeMonth, year)}
      ${renderCompliance(monthSummaries.find(month => month.period === activeMonth), activeMonth)}
      ${latest ? renderMetrics(monthRows, latest, status, activeMonth) : renderMissingState(activeHotel, activeMonth)}
      ${renderSiteBudgetPanel(activeHotel, activeMonth)}
      ${renderAction(strategicRecommendation)}
      ${latest ? renderCommercialContext(activeHotel, latest, status, commercialContext) : ''}
      ${renderDailyDetail(monthRows, activeMonth)}
    </section>
  `;
}

export function bindHotelHandlers({ rerender }){
  document.querySelectorAll('[data-hotel-tab]').forEach(button => {
    button.addEventListener('click', () => {
      activeHotelId = button.dataset.hotelTab;
      rerender();
    });
  });

  document.querySelectorAll('[data-hotel-month]').forEach(button => {
    button.addEventListener('click', () => {
      activeMonthByHotelId[activeHotelId] = button.dataset.hotelMonth;
      rerender();
    });
  });

  document.querySelectorAll('[data-export-hotel]').forEach(button => {
    button.addEventListener('click', () => {
      const siteName = button.dataset.exportHotel;
      exportOccupancyRows(occupancyRowsBySite(appState.occupancyInventoryRows, siteName), `comfenalco-ocupacion-${slug(siteName)}`);
    });
  });

  const exportAllBtn = document.getElementById('btnExportHotelsAll');
  if(exportAllBtn){
    exportAllBtn.addEventListener('click', () => {
      exportOccupancyRows(occupancyRowsByType(appState.occupancyInventoryRows, 'hotel'), 'comfenalco-ocupacion-hoteles');
    });
  }
}

function rowsForHotel(hotel){
  return appState.occupancyInventoryRows
    .filter(row => row.sede === hotel.name)
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function rowsForMonth(rows, period){
  if(!period) return [];
  return rows.filter(row => String(row.fecha).startsWith(period));
}

function renderMetrics(rows, row, status, monthLabel){
  const summary = monthSummary(rows.length ? rows : [row]);
  return `
    <div class="grid four">
      ${metric('Ocupacion del mes', `${summary.average.toFixed(1)}%`, monthLabel)}
      ${metric('Ocupadas / inventario', occupancyCompact(row), `${summary.freeAverage.toFixed(0)} libres promedio`)}
      ${metric('Libres promedio', summary.freeAverage.toFixed(0), row.tipo_unidad)}
      ${metric('Dia operativo', status.context.dayName, status.context.label)}
    </div>
  `;
}

function renderMissingState(hotel, activeMonth){
  return `
    <div class="grid four">
      ${metric('Ocupacion del mes', 'Pendiente', periodLabel(activeMonth))}
      ${metric('Ocupadas / inventario', 'Pendiente', hotel.defaultUnitType)}
      ${metric('Libres promedio', 'Pendiente', 'Sin archivo cargado')}
      ${metric('Dia operativo', 'Pendiente', 'Sin fecha cargada')}
    </div>
    <div class="empty-state">
      <strong>No hay datos suficientes para calcular alarma.</strong>
      <span>Cargue ocupacion e inventario de ${escapeHTML(hotel.name)} para activar semaforo, tramo y accion comercial.</span>
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
    <button type="button" class="month-bar ${month.severity} ${month.period === activeMonth ? 'active' : ''}" data-hotel-month="${escapeHTML(month.period)}">
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
    ? `${activeMonth} · meta ${OCCUPANCY_TARGET}% ocupacion`
    : `Sin periodo cargado · meta ${OCCUPANCY_TARGET}% ocupacion`;
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

function renderAction(recommendation){
  return `
    <div class="action-note strategic ${recommendation.severity}">
      <strong>${escapeHTML(recommendation.title)}:</strong> ${escapeHTML(recommendation.action)}
      <span>${escapeHTML(recommendation.rationale)}</span>
    </div>
  `;
}

function renderCommercialContext(hotel, row, status, context){
  return `
    <div class="context-panel">
      <div>
        <h3>Contexto comercial</h3>
        <p class="metric-note">${escapeHTML(row.fecha)} · ${escapeHTML(status.label)}</p>
      </div>
      <div class="grid two">
        <div>
          <strong>Campanas sugeridas</strong>
          ${renderContextList(context.campaigns, campaign => `${campaign.name} · ${campaign.rate}`)}
        </div>
        <div>
          <strong>Calendario de la sede</strong>
          ${renderContextList(context.activities, activity => `${activity.activity} · ${activity.type}`)}
        </div>
      </div>
    </div>
  `;
}

function renderContextList(items, mapper){
  if(!items.length) return '<p class="metric-note">Sin registros asociados para esta sede y periodo.</p>';
  return `
    <ul class="context-list">
      ${items.map(item => `<li>${escapeHTML(mapper(item))}</li>`).join('')}
    </ul>
  `;
}

function renderDailyDetail(rows, monthLabel){
  const title = monthLabel ? `Detalle diario del mes ${monthLabel}` : 'Detalle diario pendiente';
  return `
    <div class="hotel-series">
      <h3>${escapeHTML(title)}</h3>
      ${rows.length ? `
        <div class="forecast-strip">
          ${rows.map(row => {
          const pct = Math.max(0, Math.min(Number(row.ocupacion_porcentaje) || 0, 100));
          const status = classifyOccupancy(pct, row.fecha);
          return `
            <div class="forecast-day">
              <div class="forecast-value">${pct.toFixed(0)}%</div>
              <div class="forecast-column ${status.severity}" style="height:${Math.max(14, pct * 2)}px"></div>
              <span>${escapeHTML(String(row.fecha).slice(5).replace('-', '/'))}</span>
            </div>
          `;
          }).join('')}
        </div>
        <div class="daily-table-wrap">
          <table class="data-table compact-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Inventario</th>
                <th>Ocupadas</th>
                <th>Libres</th>
                <th>Ocupacion</th>
                <th>Dia</th>
                <th>Tramo</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => {
              const status = classifyOccupancy(row.ocupacion_porcentaje, row.fecha);
              return `
                <tr>
                  <td>${escapeHTML(row.fecha)}</td>
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
        </div>
      ` : '<div class="empty-state"><strong>Sin detalle diario para este mes.</strong><span>Cargue el forecast de este hotel para activar barras, cumplimiento y accion sugerida.</span></div>'}
    </div>
  `;
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

function monthSummary(rows){
  const clean = rows.filter(row => !Number.isNaN(Number(row.ocupacion_porcentaje)));
  const divisor = clean.length || 1;
  return {
    average: clean.reduce((sum, row) => sum + Number(row.ocupacion_porcentaje), 0) / divisor,
    occupiedAverage: clean.reduce((sum, row) => sum + Number(row.unidades_ocupadas || 0), 0) / divisor,
    freeAverage: clean.reduce((sum, row) => sum + Number(row.unidades_libres || 0), 0) / divisor
  };
}

function occupancyCompact(row){
  const occupied = Number(row.unidades_ocupadas);
  const total = Number(row.inventario_total);
  const pct = Number(row.ocupacion_porcentaje);
  if(Number.isNaN(occupied) || Number.isNaN(total) || Number.isNaN(pct)) return 'Sin dato';
  return `${occupied} de ${total} (${pct.toFixed(1)}%)`;
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
