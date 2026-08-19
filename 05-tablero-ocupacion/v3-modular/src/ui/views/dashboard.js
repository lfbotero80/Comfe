import { buildDashboardCommand, formatCOP, OCCUPANCY_TARGET } from '../../domain/dashboard-command.js';
import { appState } from '../../state/app-state.js';
import { badge, escapeHTML } from '../html.js';
import { monthLabel } from '../global-filters.js';

export function renderDashboard(){
  const command = buildDashboardCommand(appState);
  const periodLabel = monthLabel(command.period);

  return `
    ${renderCommandBand(command, periodLabel)}
    ${renderExecutiveKpis(command)}

    <section class="command-layout">
      ${renderQuadrant(command.rows)}
      ${renderActionFocus(command.rows)}
    </section>

    <section class="command-layout secondary">
      ${renderTrendPanel(command.monthlyTrend)}
      ${renderRadarPanel(command.radar)}
    </section>

    ${renderVerticalBudget(command.rows)}
    ${renderCommandMatrix(command.rows)}
    ${renderDataQuality(command.rows)}
  `;
}

function renderCommandBand(command, periodLabel){
  const totals = command.totals;
  return `
    <section class="command-band ${totals.unitSeverity}">
      <div>
        <span class="eyebrow">Tablero de mando · ${escapeHTML(periodLabel)}</span>
        <h2>${escapeHTML(totals.unitTitle)}</h2>
        <p>${escapeHTML(totals.unitReason)}</p>
      </div>
      <div class="command-status-strip" aria-label="Distribucion de sedes por estado">
        ${totals.statusStrip.map(segment => `
          <span class="${segment.severity}" style="width:${Math.max(segment.count ? 10 : 0, segment.pct)}%" title="${segment.count} sede(s)"></span>
        `).join('')}
      </div>
      <div class="command-band-meta">
        <strong>${totals.dataCoverage}%</strong>
        <span>cobertura de datos</span>
      </div>
    </section>
  `;
}

function renderExecutiveKpis(command){
  const totals = command.totals;
  return `
    <div class="score-grid three">
      ${score('Ocupacion / uso', totals.avgOccupancy === null ? 'Sin dato' : `${totals.avgOccupancy.toFixed(0)}%`, `${totals.withOccupancy} de ${totals.siteCount} sedes con dato`, severityFromValue(totals.avgOccupancy, 70, 40))}
      ${score('Ejecucion presupuestal', totals.budgetPct === null ? 'Sin dato' : `${totals.budgetPct.toFixed(0)}%`, `${formatCOP(totals.executed)} de ${formatCOP(totals.budget)}`, totals.budgetSeverity)}
      ${score('Sedes con accion', String(totals.actionCount), 'Incluye riesgo o fuente pendiente', totals.actionCount ? 'amber' : 'green')}
    </div>
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

function renderQuadrant(rows){
  const points = rows.filter(row => row.occupancyPct !== null && row.budgetPct !== null);
  return `
    <section class="panel command-card quadrant-card">
      <div class="section-head">
        <div>
          <h2>Riesgo ocupacion vs presupuesto</h2>
          <p class="metric-note">Cada punto es una sede. Abajo a la izquierda concentra riesgo comercial y financiero.</p>
        </div>
      </div>
      <div class="quadrant-plot">
        <span class="axis-label y">Presupuesto</span>
        <span class="axis-label x">Ocupacion / uso</span>
        <span class="target-line vertical" style="left:${OCCUPANCY_TARGET}%"></span>
        <span class="target-line horizontal" style="bottom:90%"></span>
        <span class="quad-label top-left">Buena ejecucion<br>baja ocupacion</span>
        <span class="quad-label top-right">Proteger tarifa<br>mantener</span>
        <span class="quad-label bottom-left">Accion prioritaria</span>
        <span class="quad-label bottom-right">Revisar mix / tarifa</span>
        ${points.map(point => `
          <span class="quadrant-point ${point.combinedSeverity}" style="left:${point.occupancyPct}%; bottom:${Math.min(point.budgetPct, 120) / 1.2}%">
            <b>${escapeHTML(shortName(point.name))}</b>
          </span>
        `).join('')}
        ${points.length ? '' : '<div class="empty-state"><strong>Sin puntos suficientes</strong><span>Cargue ocupacion y presupuesto de las sedes.</span></div>'}
      </div>
    </section>
  `;
}

function renderActionFocus(rows){
  const priorityRows = rows.filter(row => row.combinedSeverity !== 'green').slice(0, 3);
  return `
    <section class="panel command-card action-focus">
      <div class="section-head">
        <div>
          <h2>Prioridad directiva</h2>
          <p class="metric-note">Tres frentes para revisar primero.</p>
        </div>
      </div>
      <div class="priority-list">
        ${priorityRows.length ? priorityRows.map((row, index) => `
          <article class="priority-item ${row.combinedSeverity}">
            <span class="priority-rank">${index + 1}</span>
            <div>
              <strong>${escapeHTML(row.name)}</strong>
              <p>${escapeHTML(row.action)}</p>
              <small>${escapeHTML(row.responsible)} · ${escapeHTML(row.source)}</small>
            </div>
            ${badge(row.combinedLabel, row.combinedSeverity)}
          </article>
        `).join('') : '<div class="empty-state"><strong>Sin acciones criticas</strong><span>Las sedes filtradas estan bajo control.</span></div>'}
      </div>
    </section>
  `;
}

function renderTrendPanel(trendRows){
  const occPoints = trendRows.map((row, index) => ({ x: index, y: row.occupancy }));
  const budgetPoints = trendRows.map((row, index) => ({ x: index, y: row.budget }));
  return `
    <section class="panel command-card trend-card">
      <div class="section-head">
        <div>
          <h2>Tendencia 2026</h2>
          <p class="metric-note">Linea verde: ocupacion/uso. Linea lima: presupuesto.</p>
        </div>
      </div>
      <svg class="trend-line-chart" viewBox="0 0 620 240" role="img" aria-label="Tendencia anual de ocupacion y presupuesto">
        <line x1="42" y1="32" x2="42" y2="202" class="chart-axis"/>
        <line x1="42" y1="202" x2="594" y2="202" class="chart-axis"/>
        <line x1="42" y1="83" x2="594" y2="83" class="chart-guide"/>
        <line x1="42" y1="142" x2="594" y2="142" class="chart-guide"/>
        <polyline class="trend-line occ" points="${linePoints(occPoints)}"/>
        <polyline class="trend-line budget" points="${linePoints(budgetPoints)}"/>
        ${trendRows.map((row, index) => `<text x="${pointX(index)}" y="226" class="trend-month">${escapeHTML(row.label)}</text>`).join('')}
      </svg>
    </section>
  `;
}

function renderRadarPanel(metrics){
  const points = radarPoints(metrics);
  return `
    <section class="panel command-card radar-card">
      <div class="section-head">
        <div>
          <h2>Perfil de control</h2>
          <p class="metric-note">Radar consolidado para leer equilibrio del negocio.</p>
        </div>
      </div>
      <svg class="radar-chart" viewBox="0 0 260 250" role="img" aria-label="Radar de perfil de control">
        <polygon class="radar-grid" points="${radarPolygon(100)}"/>
        <polygon class="radar-grid inner" points="${radarPolygon(66)}"/>
        <polygon class="radar-grid inner" points="${radarPolygon(33)}"/>
        ${metrics.map((metric, index) => `
          <line x1="130" y1="124" x2="${radarAxisPoint(index, 108).x}" y2="${radarAxisPoint(index, 108).y}" class="radar-axis"/>
          <text x="${radarAxisPoint(index, 121).x}" y="${radarAxisPoint(index, 121).y}" class="radar-label">${escapeHTML(metric.label)}</text>
        `).join('')}
        <polygon class="radar-fill" points="${points}"/>
      </svg>
    </section>
  `;
}

function renderVerticalBudget(rows){
  const dataRows = rows.filter(row => row.budgetPct !== null);
  return `
    <section class="panel vertical-budget-card">
      <div class="section-head">
        <div>
          <h2>Cumplimiento presupuestal por sede</h2>
          <p class="metric-note">Barras verticales para comparar ejecucion; la linea marca 90%.</p>
        </div>
      </div>
      <div class="vertical-bars">
        <span class="vertical-target" style="bottom:90%"></span>
        ${dataRows.length ? dataRows.map(row => `
          <div class="vertical-bar-item">
            <strong>${row.budgetPct.toFixed(0)}%</strong>
            <span class="vertical-bar ${row.budgetSeverity}" style="height:${Math.min(row.budgetPct, 120) / 1.2}%"></span>
            <em>${escapeHTML(shortName(row.name))}</em>
          </div>
        `).join('') : '<div class="empty-state"><strong>Sin presupuesto cargado</strong><span>Cargue presupuesto para activar esta comparacion.</span></div>'}
      </div>
    </section>
  `;
}

function renderCommandMatrix(rows){
  return `
    <section class="panel tight command-matrix-card">
      <div class="section-head matrix-head">
        <div>
          <h2>Matriz de mando por sede</h2>
          <p class="metric-note">Ordenada por prioridad directiva, no por orden alfabetico.</p>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table command-table">
          <thead>
            <tr>
              <th>Sede</th>
              <th>Tipo</th>
              <th>Ocupacion / uso</th>
              <th>Presupuesto</th>
              <th>Tendencia</th>
              <th>Estado</th>
              <th>Accion sugerida</th>
              <th>Responsable</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(renderMatrixRow).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderMatrixRow(row){
  return `
    <tr>
      <td><strong>${escapeHTML(row.name)}</strong><span class="cell-note">${escapeHTML(row.source)}</span></td>
      <td>${escapeHTML(row.kind === 'hotel' ? 'Hotel' : 'Parque')}</td>
      <td>${heatCell(row.occupancyLabel, row.occupancySeverity)}</td>
      <td>${heatCell(row.budgetLabel, row.budgetSeverity)}</td>
      <td><span class="trend-pill ${escapeHTML(row.trend.direction)}">${escapeHTML(row.trend.label)}</span></td>
      <td>${badge(row.combinedLabel, row.combinedSeverity)}</td>
      <td>${escapeHTML(row.action)}</td>
      <td>${escapeHTML(row.responsible)}</td>
    </tr>
  `;
}

function heatCell(value, severity){
  return `<span class="heat-cell ${severity}">${escapeHTML(value)}</span>`;
}

function renderDataQuality(rows){
  const withoutOcc = rows.filter(row => row.occupancyPct === null).length;
  const withoutBudget = rows.filter(row => row.budgetPct === null).length;
  const partial = rows.filter(row => row.dataCoverage < 100).length;
  return `
    <section class="data-quality-strip">
      <span><b>${withoutOcc}</b> sin ocupacion/uso</span>
      <span><b>${withoutBudget}</b> sin presupuesto</span>
      <span><b>${partial}</b> con fuente pendiente</span>
    </section>
  `;
}

function severityFromValue(value, greenMin, amberMin){
  if(value === null || value === undefined) return 'gray';
  if(value >= greenMin) return 'green';
  if(value >= amberMin) return 'amber';
  return 'red';
}

function linePoints(points){
  const usable = points.filter(point => point.y !== null && Number.isFinite(point.y));
  if(usable.length < 2) return '';
  return usable.map(point => `${pointX(point.x)},${pointY(point.y)}`).join(' ');
}

function pointX(index){
  return 42 + (index * (552 / 11));
}

function pointY(value){
  return 202 - (Math.max(0, Math.min(value, 120)) / 120) * 170;
}

function radarPoints(metrics){
  return metrics.map((metric, index) => {
    const point = radarAxisPoint(index, Math.max(0, Math.min(metric.value, 100)));
    return `${point.x},${point.y}`;
  }).join(' ');
}

function radarPolygon(radius){
  return Array.from({ length: 5 }, (_, index) => {
    const point = radarAxisPoint(index, radius);
    return `${point.x},${point.y}`;
  }).join(' ');
}

function radarAxisPoint(index, radius){
  const angle = (-90 + index * 72) * (Math.PI / 180);
  const scaled = radius * 0.9;
  return {
    x: 130 + Math.cos(angle) * scaled,
    y: 124 + Math.sin(angle) * scaled
  };
}

function shortName(name){
  return String(name)
    .replace('Hosteria Los ', '')
    .replace('Hotel ', '')
    .replace('Hacienda ', '')
    .replace('Parque Ecologico Los ', '')
    .replace('Parque ', '')
    .replace('Ecoparque ', '')
    .replace('Camping Los ', '');
}
