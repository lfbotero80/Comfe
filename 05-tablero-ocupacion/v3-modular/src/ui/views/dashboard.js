import { appState } from '../../state/app-state.js';
import { HOTELS, PARKS } from '../../domain/sites.js';
import { classifyOccupancy } from '../../domain/occupancy.js';
import { commercialContextForSite } from '../../domain/commercial-context.js';
import { badge, escapeHTML, trafficLight } from '../html.js';

export function renderDashboard(){
  const inventoryRows = latestInventoryRows();
  const hotelRows = inventoryRows.filter(row => row.tipo_sede === 'hotel');
  const parkRows = inventoryRows.filter(row => row.tipo_sede === 'parque');
  const alertItems = hotelRows
    .map(row => ({ row, status: classifyOccupancy(row.ocupacion_porcentaje, row.fecha) }))
    .filter(item => ['red', 'amber'].includes(item.status.severity));
  const avgOccupancy = average(hotelRows.map(row => Number(row.ocupacion_porcentaje)));
  const budgetRows = budgetSummaryRows();
  const budgetTotal = budgetTotals(budgetRows);
  const urgent = alertItems.filter(item => item.status.severity === 'red').length;
  const allSites = HOTELS.concat(PARKS);
  const sitesWithData = allSites.filter(site => appState.occupancyInventoryRows.some(row => row.sede === site.name)).length;

  return `
    <section class="powerbi-hero">
      <div>
        <span class="eyebrow">Tablero general</span>
        <h2>${urgent ? 'Atencion inmediata en ocupacion' : 'Ocupacion y presupuesto bajo control'}</h2>
        <p>${urgent ? 'Hay sedes en Preventa o Mas cerca. Priorice acciones comerciales por sede.' : 'Lectura consolidada por sede, inventario, alertas y ejecucion presupuestal.'}</p>
      </div>
      <div class="hero-status ${urgent ? 'red' : 'green'}">
        <strong>${urgent}</strong>
        <span>alertas criticas</span>
      </div>
    </section>

    <div class="score-grid">
      ${score('Ocupacion hotelera', avgOccupancy === null ? 'Sin dato' : `${avgOccupancy.toFixed(0)}%`, 'Promedio con datos cargados', avgOccupancy === null ? 'gray' : avgOccupancy >= 70 ? 'green' : avgOccupancy >= 40 ? 'amber' : 'red')}
      ${score('Sedes con datos', `${sitesWithData} de ${allSites.length}`, 'Estructura total del instrumento', sitesWithData === allSites.length ? 'green' : 'gray')}
      ${score('Presupuesto ejecutado', budgetTotal.budget ? `${budgetTotal.pct.toFixed(0)}%` : 'Sin dato', `${formatCOP(budgetTotal.executed)} de ${formatCOP(budgetTotal.budget)}`, budgetTotal.severity)}
      ${score('Alertas comerciales', alertItems.length, 'Preventa o Mas cerca', urgent ? 'red' : alertItems.length ? 'amber' : 'green')}
    </div>

    <div class="dashboard-grid">
      <section class="panel">
        <h2>Donde mirar hoy</h2>
        <div class="alert-list">
          ${alertItems.length ? alertItems.map(item => `
            <div class="alert-item">
              <div>
                <strong>${escapeHTML(item.row.sede)}</strong>
                <div class="metric-note">${escapeHTML(item.row.fecha)} · ${escapeHTML(item.row.ocupacion_porcentaje)}% · ${escapeHTML(item.row.unidades_libres)} libres</div>
                <div class="operation-note">${escapeHTML(item.status.context.label)}</div>
                ${renderCompactContext(item.row, item.status)}
              </div>
              <div style="display:flex;align-items:center;gap:10px">${trafficLight(item.status.severity, 'horizontal')}${badge(item.status.label, item.status.severity)}</div>
            </div>
          `).join('') : '<p class="metric-note">Carga un archivo de ocupacion e inventario para ver alertas reales.</p>'}
        </div>
      </section>

      <section class="panel">
        <h2>Ocupacion visual por sede</h2>
        <div class="bar-chart">
          ${allSites.map(site => occupancyBar(site)).join('')}
        </div>
      </section>

      <section class="panel budget-panel">
        <h2>Presupuesto proyectado vs real</h2>
        <div class="budget-list">
          ${budgetRows.map(row => `
            <div class="budget-row">
              <div>
                <strong>${escapeHTML(row.sede)}</strong>
                <span>${escapeHTML(row.periodo)} · ${formatCOP(row.ejecutado)} de ${formatCOP(row.presupuesto)}</span>
              </div>
              <div class="bar-track"><div class="bar-fill ${row.severity}" style="width:${Math.min(row.pct, 130)}%"></div></div>
              <strong>${row.pct.toFixed(0)}%</strong>
            </div>
          `).join('')}
        </div>
      </section>
    </div>

    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Hoteles</h2>
          <p class="metric-note">Sedes de alojamiento. Las sedes sin archivo cargado quedan en gris.</p>
        </div>
      </div>
      <div class="kpi-grid">
        ${HOTELS.map(hotel => siteCard(hotel)).join('')}
      </div>
    </section>

    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Parques</h2>
          <p class="metric-note">Pasadia, camping o cupos. La estructura queda visible aunque falte el archivo.</p>
        </div>
      </div>
      <div class="kpi-grid">
        ${PARKS.map(park => siteCard(park)).join('')}
      </div>
    </section>

  `;
}

function score(label, value, note, severity){
  return `
    <section class="panel metric score-card ${severity}">
      <span class="metric-label">${escapeHTML(label)}</span>
      <strong class="metric-value">${escapeHTML(value)}</strong>
      <span class="metric-note">${escapeHTML(note)}</span>
    </section>
  `;
}

function latestInventoryRows(){
  const bySite = new Map();
  appState.occupancyInventoryRows.forEach(row => {
    const key = `${row.sede}__${row.tipo_unidad}`;
    const previous = bySite.get(key);
    if(!previous || String(row.fecha) > String(previous.fecha)){
      bySite.set(key, row);
    }
  });
  return [...bySite.values()];
}

function siteCard(site){
  const rows = appState.occupancyInventoryRows.filter(row => row.sede === site.name);
  const latest = rows[rows.length - 1];
  const status = latest ? classifyOccupancy(latest.ocupacion_porcentaje, latest.fecha) : null;
  const context = latest ? commercialContextForSite(site.name, latest.fecha, status) : null;
  const pct = latest ? Number(latest.ocupacion_porcentaje) : null;
  const occupancy = latest ? occupancyCompact(latest) : 'Pendiente';

  return `
    <article class="kpi-card">
      <div class="kpi-stripe ${status ? status.severity : 'gray'}"></div>
      <div class="kpi-body">
        <div class="kpi-title-row">
          <div class="kpi-name">
            <strong>${escapeHTML(site.name)}</strong>
            <span>${escapeHTML(site.role)}</span>
          </div>
          ${status ? trafficLight(status.severity) : '<span class="pending-dot">Sin datos</span>'}
        </div>
        <div class="kpi-row"><span class="label">Tramo</span>${status ? badge(status.label, status.severity) : badge('Pendiente', 'gray')}</div>
        ${status ? `<div class="kpi-row"><span class="label">Dia</span><span class="value">${escapeHTML(status.context.dayName)}</span></div>` : ''}
        <div class="kpi-row"><span class="label">Ocupacion</span><span class="value">${escapeHTML(occupancy)}</span></div>
        ${latest ? `<div class="kpi-row"><span class="label">Libres</span><span class="value">${escapeHTML(latest.unidades_libres)}</span></div>` : ''}
        <div class="action-note ${status ? status.severity : 'gray'}">${escapeHTML(status ? `${status.recommendation} ${context.action}` : 'Cargue el archivo de ocupacion de la sede para calcular tramo y accion.')}</div>
      </div>
    </article>
  `;
}

function occupancyBar(site){
  const rows = appState.occupancyInventoryRows.filter(row => row.sede === site.name);
  const latest = rows[rows.length - 1];
  if(!latest){
    return `
      <div class="bar-row muted">
        <span>${escapeHTML(site.name)}</span>
        <div class="bar-track"><div class="bar-fill gray" style="width:100%"></div></div>
        <strong>Sin dato</strong>
      </div>
    `;
  }
  const pct = Math.max(0, Math.min(Number(latest.ocupacion_porcentaje) || 0, 100));
  const status = classifyOccupancy(pct, latest.fecha);
  return `
    <div class="bar-row">
      <span>${escapeHTML(site.name)}</span>
      <div class="bar-track"><div class="bar-fill ${status.severity}" style="width:${pct}%"></div></div>
      <strong>${pct.toFixed(0)}%</strong>
    </div>
  `;
}

function occupancyCompact(row){
  const occupied = Number(row.unidades_ocupadas);
  const total = Number(row.inventario_total);
  const pct = Number(row.ocupacion_porcentaje);
  if(Number.isNaN(occupied) || Number.isNaN(total) || Number.isNaN(pct)) return 'Sin dato';
  return `${occupied} de ${total} (${pct.toFixed(1)}%)`;
}

function renderCompactContext(row, status){
  const context = commercialContextForSite(row.sede, row.fecha, status);
  const names = context.campaigns.length
    ? context.campaigns.map(campaign => campaign.name)
    : context.activities.map(activity => activity.activity);
  if(!names.length) return '';
  return `<div class="context-inline">Contexto comercial: ${escapeHTML(names.slice(0, 2).join(' · '))}</div>`;
}

function budgetSummaryRows(){
  return appState.budgetRows.map(row => {
    const presupuesto = Number(row.presupuesto);
    const ejecutado = Number(row.ejecutado);
    const pct = presupuesto ? (ejecutado / presupuesto) * 100 : 0;
    return {
      sede: row.sede,
      periodo: row.periodo,
      presupuesto,
      ejecutado,
      pct,
      severity: pct >= 90 ? 'green' : pct >= 70 ? 'amber' : 'red'
    };
  });
}

function budgetTotals(rows){
  const budget = rows.reduce((sum, row) => sum + (Number(row.presupuesto) || 0), 0);
  const executed = rows.reduce((sum, row) => sum + (Number(row.ejecutado) || 0), 0);
  const pct = budget ? (executed / budget) * 100 : 0;
  return {
    budget,
    executed,
    pct,
    severity: budget ? pct >= 90 ? 'green' : pct >= 70 ? 'amber' : 'red' : 'gray'
  };
}

function formatCOP(value){
  const numeric = Number(value);
  if(!numeric) return '$0';
  return `$${Math.round(numeric).toLocaleString('es-CO')}`;
}

function average(values){
  const clean = values.filter(value => !Number.isNaN(value));
  if(!clean.length) return null;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}
