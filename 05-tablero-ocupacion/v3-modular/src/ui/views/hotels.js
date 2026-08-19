import { HOTELS } from '../../domain/sites.js';
import { appState } from '../../state/app-state.js';
import { classifyOccupancy } from '../../domain/occupancy.js';
import { commercialContextForSite } from '../../domain/commercial-context.js';
import { badge, escapeHTML, trafficLight } from '../html.js';

let activeHotelId = HOTELS[0].id;

export function renderHotels(){
  const activeHotel = HOTELS.find(hotel => hotel.id === activeHotelId) || HOTELS[0];
  const rows = rowsForHotel(activeHotel);
  const monthRows = rowsForCurrentMonth(rows);
  const latest = monthRows[monthRows.length - 1] || rows[rows.length - 1] || null;
  const status = latest ? classifyOccupancy(latest.ocupacion_porcentaje, latest.fecha) : null;
  const monthLabel = latest ? String(latest.fecha).slice(0, 7) : 'Sin periodo cargado';

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
        ${status ? `<div class="alarm-context">${trafficLight(status.severity, 'horizontal')}${badge(status.label, status.severity)}</div>` : '<span class="pending-dot">Sin datos de ocupacion</span>'}
      </div>

      ${latest ? renderMetrics(monthRows, latest, status, monthLabel) : renderMissingState(activeHotel)}
      ${latest ? renderAction(status) : ''}
      ${latest ? renderCommercialContext(activeHotel, latest, status) : ''}
      ${latest ? renderDailyDetail(monthRows.length ? monthRows : rows, monthLabel) : ''}
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
}

function rowsForHotel(hotel){
  return appState.occupancyInventoryRows
    .filter(row => row.sede === hotel.name)
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function rowsForCurrentMonth(rows){
  if(!rows.length) return [];
  const latestMonth = String(rows[rows.length - 1].fecha).slice(0, 7);
  return rows.filter(row => String(row.fecha).startsWith(latestMonth));
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

function renderMissingState(hotel){
  return `
    <div class="grid four">
      ${metric('Ocupacion del mes', 'Pendiente', 'Sin archivo cargado')}
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

function renderAction(status){
  return `
    <div class="action-note ${status.severity}">
      <strong>Accion sugerida:</strong> ${escapeHTML(status.recommendation)}
    </div>
  `;
}

function renderCommercialContext(hotel, row, status){
  const context = commercialContextForSite(hotel.name, row.fecha, status);
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
  return `
    <div class="hotel-series">
      <h3>Detalle diario del mes ${escapeHTML(monthLabel)}</h3>
      <div class="forecast-strip">
        ${rows.map(row => {
          const pct = Math.max(0, Math.min(Number(row.ocupacion_porcentaje) || 0, 100));
          const status = classifyOccupancy(pct, row.fecha);
          return `
            <div class="forecast-day">
              <div class="forecast-value">${pct.toFixed(0)}%</div>
              <div class="forecast-column ${status.severity}" style="height:${Math.max(12, pct * 1.25)}px"></div>
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
