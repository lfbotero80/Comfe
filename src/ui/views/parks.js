import { PARKS } from '../../domain/sites.js';
import { appState } from '../../state/app-state.js';
import { classifyOccupancy } from '../../domain/occupancy.js';
import { badge, escapeHTML, trafficLight } from '../html.js';

let activeParkId = PARKS[0].id;

export function renderParks(){
  const activePark = PARKS.find(park => park.id === activeParkId) || PARKS[0];
  const rows = rowsForPark(activePark);
  const monthRows = latestMonthRows(rows);
  const latest = monthRows[monthRows.length - 1] || rows[rows.length - 1] || null;
  const status = latest ? classifyOccupancy(latest.ocupacion_porcentaje, latest.fecha) : null;
  const monthLabel = latest ? String(latest.fecha).slice(0, 7) : 'Sin periodo cargado';

  return `
    <div class="tabs site-tabs">
      ${PARKS.map(park => `
        <button type="button" class="${park.id === activePark.id ? 'active' : ''}" data-park-tab="${park.id}">
          ${escapeHTML(park.name)}
        </button>
      `).join('')}
    </div>

    <section class="panel hotel-control">
      <div class="hotel-head">
        <div>
          <h2>${escapeHTML(activePark.name)}</h2>
          <p class="metric-note">${escapeHTML(activePark.role)}</p>
        </div>
        ${status ? `<div class="alarm-context">${trafficLight(status.severity, 'horizontal')}${badge(status.label, status.severity)}</div>` : '<span class="pending-dot">Sin datos de uso</span>'}
      </div>

      ${latest ? renderParkMetrics(activePark, monthRows, latest, status, monthLabel) : renderMissingState(activePark)}
      ${latest ? renderDailyDetail(monthRows.length ? monthRows : rows, monthLabel) : ''}
    </section>
  `;
}

export function bindParkHandlers({ rerender }){
  document.querySelectorAll('[data-park-tab]').forEach(button => {
    button.addEventListener('click', () => {
      activeParkId = button.dataset.parkTab;
      rerender();
    });
  });
}

function rowsForPark(park){
  return appState.occupancyInventoryRows
    .filter(row => row.sede === park.name)
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function latestMonthRows(rows){
  if(!rows.length) return [];
  const latestMonth = String(rows[rows.length - 1].fecha).slice(0, 7);
  return rows.filter(row => String(row.fecha).startsWith(latestMonth));
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
    <div class="action-note ${status.severity}">
      <strong>Accion sugerida:</strong> ${escapeHTML(status.recommendation)}
    </div>
  `;
}

function renderMissingState(park){
  return `
    <div class="grid four">
      ${metric('Uso del mes', 'Pendiente', 'Sin archivo cargado')}
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

function renderDailyDetail(rows, monthLabel){
  return `
    <div class="hotel-series">
      <h3>Detalle diario del mes ${escapeHTML(monthLabel)}</h3>
      <div class="daily-table-wrap">
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
      </div>
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

function metric(label, value, note){
  return `
    <section class="panel metric mini">
      <span class="metric-label">${escapeHTML(label)}</span>
      <strong class="metric-value">${escapeHTML(value)}</strong>
      <span class="metric-note">${escapeHTML(note)}</span>
    </section>
  `;
}
