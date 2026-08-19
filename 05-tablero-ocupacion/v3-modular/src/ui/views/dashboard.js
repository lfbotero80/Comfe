import { appState } from '../../state/app-state.js';
import { HOTELS, PARKS } from '../../domain/sites.js';
import { classifyOccupancy } from '../../domain/occupancy.js';
import { escapeHTML } from '../html.js';

const SEVERITY_RANK = { red: 0, amber: 1, green: 2, gray: 3 };

export function renderDashboard(){
  const inventoryRows = latestInventoryRows();
  const hotelRows = inventoryRows.filter(row => row.tipo_sede === 'hotel');
  const alertItems = inventoryRows
    .map(row => ({ row, status: classifyOccupancy(row.ocupacion_porcentaje, row.fecha) }))
    .filter(item => ['red', 'amber'].includes(item.status.severity));
  const avgOccupancy = average(hotelRows.map(row => Number(row.ocupacion_porcentaje)));
  const budgetRows = budgetSummaryRows().sort((a, b) => a.pct - b.pct);
  const budgetTotal = budgetTotals(budgetRows);
  const urgent = alertItems.filter(item => item.status.severity === 'red').length;

  const hotelItems = HOTELS.map(site => siteOccupancy(site)).sort(bySeverity);
  const parkItems = PARKS.map(site => siteOccupancy(site)).sort(bySeverity);

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

    <div class="score-grid three">
      ${score('Ocupacion hotelera', avgOccupancy === null ? 'Sin dato' : `${avgOccupancy.toFixed(0)}%`, 'Promedio vs. meta 70%', avgOccupancy === null ? 'gray' : avgOccupancy >= 70 ? 'green' : avgOccupancy >= 40 ? 'amber' : 'red')}
      ${score('Presupuesto ejecutado', budgetTotal.budget ? `${budgetTotal.pct.toFixed(0)}%` : 'Sin dato', `${formatCOP(budgetTotal.executed)} de ${formatCOP(budgetTotal.budget)}`, budgetTotal.severity)}
      ${score('Alertas activas', alertItems.length, 'Preventa o Mas cerca, todas las sedes', urgent ? 'red' : alertItems.length ? 'amber' : 'green')}
    </div>

    <div class="chart-grid">
      ${occupancyPanel('Hoteles — ocupacion', 'Ordenado de mas critico a mas alto. Detalle diario en la pestana Hoteles.', hotelItems)}
      ${occupancyPanel('Parques — ocupacion / uso', 'Ordenado de mas critico a mas alto. Detalle diario en la pestana Parques.', parkItems)}
    </div>

    <section class="panel budget-panel">
      <div class="section-head">
        <div>
          <h2>Presupuesto ejecutado vs. proyectado</h2>
          <p class="metric-note">Ordenado de menor a mayor cumplimiento, todas las sedes con dato cargado.</p>
        </div>
      </div>
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
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>${escapeHTML(title)}</h2>
          <p class="metric-note">${escapeHTML(note)}</p>
        </div>
      </div>
      <div class="bar-chart">
        ${items.map(occupancyRow).join('')}
      </div>
    </section>
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
  const rows = appState.occupancyInventoryRows.filter(row => row.sede === site.name);
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
  appState.occupancyInventoryRows.forEach(row => {
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
        <span class="badge ${row.severity}">${row.pct.toFixed(0)}% cumplido</span>
      </div>
      <div class="budget-compare-bars">
        <div class="budget-compare-bar">
          <span class="budget-compare-label">Proyectado</span>
          <div class="bar-track"><div class="bar-fill" style="width:${projectedWidth}%"></div></div>
          <strong>${formatCOP(row.presupuesto)}</strong>
        </div>
        <div class="budget-compare-bar">
          <span class="budget-compare-label">Real cumplido</span>
          <div class="bar-track"><div class="bar-fill ${row.severity}" style="width:${actualWidth}%"></div></div>
          <strong>${formatCOP(row.ejecutado)}</strong>
        </div>
      </div>
    </div>
  `;
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
