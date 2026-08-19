import { appState } from '../../state/app-state.js';
import { COLOMBIA_HOLIDAYS_2026, HIGH_SEASON_WINDOWS } from '../../domain/operational-calendar.js';
import { escapeHTML } from '../html.js';

let activeMonth = 'Todas';
let activeSite = 'Todas';

export function renderCalendar(){
  const months = uniqueValues(appState.calendarRows.map(row => row.month));
  const sites = uniqueValues(appState.calendarRows.map(row => row.site));
  const rows = filteredRows();

  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Calendario comercial</h2>
          <p class="metric-note">Actividades por sede para interpretar demanda, temporada y ventanas comerciales.</p>
        </div>
        <strong class="section-count">${rows.length} actividades</strong>
      </div>

      <div class="filter-block">
        <span class="filter-label">Mes</span>
        <div class="tabs compact">
          ${['Todas'].concat(months).map(month => chip(month, activeMonth, 'month')).join('')}
        </div>
      </div>

      <div class="filter-block">
        <span class="filter-label">Sede</span>
        <div class="tabs compact">
          ${['Todas'].concat(sites).map(site => chip(site, activeSite, 'site')).join('')}
        </div>
      </div>
    </section>

    <section class="panel tight">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Sede</th>
              <th>Actividad</th>
              <th>Tipo</th>
              <th>Publico</th>
              <th>Descripcion</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => `
              <tr>
                <td>${escapeHTML(row.month)}</td>
                <td>${escapeHTML(row.site)}</td>
                <td><strong>${escapeHTML(row.activity)}</strong></td>
                <td><span class="type-tag ${normalizeClass(row.type)}">${escapeHTML(row.type)}</span></td>
                <td>${escapeHTML(row.audience)}</td>
                <td>${escapeHTML(row.description)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Calendario operativo 2026</h2>
          <p class="metric-note">Fechas que modifican la lectura del semaforo para evitar falsas alarmas.</p>
        </div>
      </div>
      <div class="grid two">
        <div>
          <h3>Festivos registrados</h3>
          <div class="calendar-marker-list">
            ${COLOMBIA_HOLIDAYS_2026.filter(item => item.date >= '2026-08-01').slice(0, 6).map(item => `
              <div class="calendar-marker">
                <strong>${escapeHTML(item.date)}</strong>
                <span>${escapeHTML(item.name)}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div>
          <h3>Ventanas de temporada alta</h3>
          <div class="calendar-marker-list">
            ${HIGH_SEASON_WINDOWS.map(item => `
              <div class="calendar-marker">
                <strong>${escapeHTML(item.start)} / ${escapeHTML(item.end)}</strong>
                <span>${escapeHTML(item.name)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function bindCalendarHandlers({ rerender }){
  document.querySelectorAll('[data-calendar-month]').forEach(button => {
    button.addEventListener('click', () => {
      activeMonth = button.dataset.calendarMonth;
      rerender();
    });
  });
  document.querySelectorAll('[data-calendar-site]').forEach(button => {
    button.addEventListener('click', () => {
      activeSite = button.dataset.calendarSite;
      rerender();
    });
  });
}

function filteredRows(){
  return appState.calendarRows.filter(row => {
    const byMonth = activeMonth === 'Todas' || row.month === activeMonth;
    const bySite = activeSite === 'Todas' || row.site === activeSite;
    return byMonth && bySite;
  });
}

function chip(value, active, kind){
  const attr = kind === 'month' ? 'data-calendar-month' : 'data-calendar-site';
  return `<button type="button" class="${value === active ? 'active' : ''}" ${attr}="${escapeHTML(value)}">${escapeHTML(value)}</button>`;
}

function uniqueValues(values){
  return [...new Set(values)].filter(Boolean);
}

function normalizeClass(value){
  return String(value || '').toLowerCase().replace(/\s+/g, '-');
}
