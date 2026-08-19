import { appState } from '../../state/app-state.js';
import { HOTELS, PARKS } from '../../domain/sites.js';
import { classifyOccupancy } from '../../domain/occupancy.js';
import { escapeHTML } from '../html.js';
import { monthLabel } from '../global-filters.js';

const SEVERITY_RANK = { red: 0, amber: 1, green: 2, gray: 3 };

export function renderDashboard(){
  const filters = appState.filters;
  const inventoryRows = latestInventoryRows();
  const hotelRows = inventoryRows.filter(row => row.tipo_sede === 'hotel');
  const alertItems = inventoryRows
    .map(row => ({ row, status: classifyOccupancy(row.ocupacion_porcentaje, row.fecha) }))
    .filter(item => ['red', 'amber'].includes(item.status.severity));
  const avgOccupancy = average(hotelRows.map(row => Number(row.ocupacion_porcentaje)));
  const budgetRows = budgetSummaryRows().filter(matchesSeverityFilter).sort((a, b) => a.pct - b.pct);
  const budgetTotal = budgetTotals(budgetRows);
  const urgent = alertItems.filter(item => item.status.severity === 'red').length;

  const hotelItems = filters.unitType === 'parque' ? [] : HOTELS.map(site => siteOccupancy(site)).filter(matchesSeverityFilter).sort(bySeverity);
  const parkItems = filters.unitType === 'hotel' ? [] : PARKS.map(site => siteOccupancy(site)).filter(matchesSeverityFilter).sort(bySeverity);

  return `
    <section class="powerbi-hero">
      <div>
        <span class="eyebrow">Tablero general</span>
        <h2>${urgent ? 'Atencion inmediata en ocupacion' : 'Ocupacion y presupuesto bajo control'}</h2>
        <p>${urgent ? 'Hay sedes en Preventa o Mas cerca. Priorice acciones comerciales por sede.' : 'Lectura consolidada por sede, inventario, alertas y ejecucion presupuestal.'}</p>
      </div>
    </section>

    <div class="score-grid two">
      ${score('Ocupacion hotelera', avgOccupancy === null ? 'Sin dato' : `${avgOccupancy.toFixed(0)}%`, 'Promedio vs. meta 70%', avgOccupancy === null ? 'gray' : avgOccupancy >= 70 ? 'green' : avgOccupancy >= 40 ? 'amber' : 'red')}
      ${score('Presupuesto ejecutado', budgetTotal.budget ? `${budgetTotal.pct.toFixed(0)}%` : 'Sin dato', `${formatCOP(budgetTotal.executed)} de ${formatCOP(budgetTotal.budget)}`, budgetTotal.severity)}
    </div>

    <div class="dashboard-stack">
      ${occupancyPanel('Hoteles — ocupacion', 'Ordenado de mas critico a mas alto. Detalle diario en la pestana Hoteles.', hotelItems)}
      ${occupancyPanel('Parques — ocupacion / uso', 'Ordenado de mas critico a mas alto. Detalle diario en la pestana Parques.', parkItems)}
    </div>

    <section class="panel budget-panel">
      <div class="section-head">
        <div>
          <h2>Presupuesto ejecutado vs. proyectado</h2>
          <p class="metric-note">${escapeHTML(monthLabel(filters.period))} · ordenado de menor a mayor cumplimiento.</p>
        </div>
      </div>
      ${renderBudgetConvention()}
      <div class="budget-compare-list">
        ${budgetRows.length ? budgetRows.map(budgetCompareRow).join('') : '<p class="metric-note">Sin datos de presupuesto cargados.</p>'}
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

function occupancyPanel(title, note, items){
  return `
    <section class="panel occupancy-panel">
      <div class="section-head">
        <div>
          <h2>${escapeHTML(title)}</h2>
          <p class="metric-note">${escapeHTML(note)}</p>
        </div>
      </div>
      <div class="occupancy-panel-body">
        <div class="bar-chart occupancy-chart">
          ${items.length ? items.map(occupancyRow).join('') : '<p class="metric-note">Sin sedes para los filtros aplicados.</p>'}
        </div>
        ${renderOccupancyInsight(items)}
      </div>
    </section>
  `;
}

function renderOccupancyInsight(items){
  const total = items.length || 1;
  const dataItems = items.filter(item => item.hasData);
  const counts = {
    red: items.filter(item => item.severity === 'red').length,
    amber: items.filter(item => item.severity === 'amber').length,
    green: items.filter(item => item.severity === 'green').length,
    gray: items.filter(item => item.severity === 'gray').length
  };
  const avg = dataItems.length ? average(dataItems.map(item => Number(item.pct))) : null;
  return `
    <aside class="occupancy-insight">
      <div class="insight-metric">
        <span>Promedio con dato</span>
        <strong>${avg === null ? 'Sin dato' : `${avg.toFixed(0)}%`}</strong>
      </div>
      <div class="status-stack" aria-label="Distribucion por semaforo">
        ${statusSegment('red', counts.red, total)}
        ${statusSegment('amber', counts.amber, total)}
        ${statusSegment('green', counts.green, total)}
        ${statusSegment('gray', counts.gray, total)}
      </div>
      <div class="status-counts">
        ${statusCount('red', 'Rojo', counts.red)}
        ${statusCount('amber', 'Amarillo', counts.amber)}
        ${statusCount('green', 'Verde', counts.green)}
        ${statusCount('gray', 'Sin dato', counts.gray)}
      </div>
      <div class="coverage-line">
        <span>Cobertura de datos</span>
        <strong>${dataItems.length} de ${items.length}</strong>
      </div>
    </aside>
  `;
}

function statusSegment(severity, count, total){
  if(!count) return '';
  const width = Math.max(8, (count / total) * 100);
  return `<span class="${severity}" style="width:${width}%"></span>`;
}

function statusCount(severity, label, count){
  return `
    <span class="status-count">
      <i class="legend-dot ${severity}"></i>
      <b>${count}</b>
      ${escapeHTML(label)}
    </span>
  `;
}

function renderBudgetConvention(){
  return `
    <div class="budget-convention">
      <strong>Convenciones presupuesto</strong>
      ${conventionItems([
        ['green', 'Verde', '90% o mas'],
        ['amber', 'Amarillo', '70% a 89%'],
        ['red', 'Rojo', 'Menos de 70%'],
        ['gray', 'Gris', 'Sin presupuesto']
      ])}
    </div>
  `;
}

function conventionItems(items){
  return `
    <div class="convention-items">
      ${items.map(([severity, label, text]) => `
        <span class="convention-item">
          <i class="legend-dot ${severity}"></i>
          <b>${escapeHTML(label)}</b>
          <em>${escapeHTML(text)}</em>
        </span>
      `).join('')}
    </div>
  `;
}

function occupancyRow(item){
  if(!item.hasData){
    return `
      <div class="occ-row muted">
        <span>${escapeHTML(item.name)}</span>
        <div class="bar-track"><div class="bar-fill gray" style="width:100%"></div></div>
        <strong>Sin dato</strong>
        <span class="trend-empty">—</span>
      </div>
    `;
  }
  return `
    <div class="occ-row">
      <span>${escapeHTML(item.name)}</span>
      <div class="bar-track"><div class="bar-fill ${item.severity}" style="width:${item.pct}%"></div></div>
      <strong>${item.pct.toFixed(0)}%</strong>
      ${sparkline(item.trendPoints, item.severity)}
    </div>
  `;
}

function siteOccupancy(site){
  const rows = appState.occupancyInventoryRows
    .filter(row => row.sede === site.name)
    .filter(row => appState.filters.period === 'all' || String(row.fecha).startsWith(appState.filters.period));
  const latest = rows[rows.length - 1];
  if(!latest){
    return { name: site.name, hasData: false, severity: 'gray', pct: null, trendPoints: [] };
  }
  const pct = Math.max(0, Math.min(Number(latest.ocupacion_porcentaje) || 0, 100));
  const status = classifyOccupancy(pct, latest.fecha);
  const trendPoints = rows.slice(-14).map(row => ({ fecha: row.fecha, pct: Number(row.ocupacion_porcentaje) })).filter(point => !Number.isNaN(point.pct));
  return { name: site.name, hasData: true, severity: status.severity, pct, trendPoints };
}

function bySeverity(a, b){
  return (SEVERITY_RANK[a.severity] ?? 4) - (SEVERITY_RANK[b.severity] ?? 4);
}

function sparkline(points, severity){
  if(points.length < 2) return '<span class="trend-empty">—</span>';
  const values = points.map(point => point.pct);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 64;
  const height = 22;
  const stepX = width / (values.length - 1);
  const coords = values.map((value, index) => {
    const x = (index * stepX).toFixed(1);
    const y = (height - ((value - min) / range) * height).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
  return `<svg class="trend-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none"><polyline class="${severity}" points="${coords}"/></svg>`;
}

function latestInventoryRows(){
  const bySite = new Map();
  appState.occupancyInventoryRows.filter(matchesGlobalPeriod).filter(matchesGlobalUnit).forEach(row => {
    const key = `${row.sede}__${row.tipo_unidad}`;
    const previous = bySite.get(key);
    if(!previous || String(row.fecha) > String(previous.fecha)){
      bySite.set(key, row);
    }
  });
  return [...bySite.values()];
}

function budgetCompareRow(row){
  const scale = Math.max(row.presupuesto, row.ejecutado, 1);
  const projectedWidth = (row.presupuesto / scale) * 100;
  const actualWidth = (row.ejecutado / scale) * 100;
  return `
    <div class="budget-compare-row">
      <div class="budget-compare-head">
        <strong>${escapeHTML(row.sede)}</strong>
      </div>
      <div class="budget-compare-bars">
        <div class="budget-compare-bar">
          <span class="budget-compare-label">Proyectado</span>
          <div class="bar-track"><div class="bar-fill" style="width:${projectedWidth}%"></div></div>
          <span class="bar-inline-pct"></span>
          <strong>${formatCOP(row.presupuesto)}</strong>
        </div>
        <div class="budget-compare-bar">
          <span class="budget-compare-label">Real cumplido</span>
          <div class="bar-track"><div class="bar-fill ${row.severity}" style="width:${actualWidth}%"></div></div>
          <span class="bar-inline-pct ${row.severity}">${row.pct.toFixed(0)}%</span>
          <strong>${formatCOP(row.ejecutado)}</strong>
        </div>
      </div>
    </div>
  `;
}

function budgetSummaryRows(){
  return appState.budgetRows.filter(row => {
    return (appState.filters.period === 'all' || row.periodo === appState.filters.period) && matchesBudgetUnit(row);
  }).map(row => {
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

function matchesSeverityFilter(item){
  return appState.filters.severity === 'all' || item.severity === appState.filters.severity;
}

function matchesGlobalPeriod(row){
  return appState.filters.period === 'all' || String(row.fecha).startsWith(appState.filters.period);
}

function matchesGlobalUnit(row){
  return appState.filters.unitType === 'all' || row.tipo_sede === appState.filters.unitType;
}

function matchesBudgetUnit(row){
  if(appState.filters.unitType === 'all') return true;
  const source = appState.filters.unitType === 'hotel' ? HOTELS : PARKS;
  return source.some(site => site.name === row.sede);
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
