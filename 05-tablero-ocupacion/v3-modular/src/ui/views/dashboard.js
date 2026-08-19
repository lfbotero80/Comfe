import { buildDashboardCommand, formatCOP, OCCUPANCY_TARGET, BUDGET_TARGET } from '../../domain/dashboard-command.js';
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
      ${renderRiskGroups(command.rows)}
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

/**
 * Nota del KPI de ocupacion: dice exactamente sobre que se calculo, para que
 * una cifra parcial nunca se lea como el periodo completo. Advierte tambien
 * cuando mezcla habitaciones y cupos, que no son unidades comparables.
 */
function occupancyKpiNote(totals){
  if(totals.avgOccupancy === null) return `${totals.withOccupancy} de ${totals.siteCount} sedes con dato`;
  const base = `${totals.occupancyOccupied.toLocaleString('es-CO')} de ${totals.occupancyInventory.toLocaleString('es-CO')} unidades · ${totals.withOccupancy} de ${totals.siteCount} sedes · ${totals.occupancyDays} dia(s) cargado(s)`;
  return totals.mixedUnitKinds ? `${base} · mezcla habitaciones y cupos` : base;
}

function renderExecutiveKpis(command){
  const totals = command.totals;
  return `
    <div class="score-grid three">
      ${score('Ocupacion / uso', totals.avgOccupancy === null ? 'Sin dato' : `${totals.avgOccupancy.toFixed(1)}%`, occupancyKpiNote(totals), severityFromValue(totals.avgOccupancy, 70, 40))}
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

// Orden de lectura: primero lo mas critico. El tipo de riesgo se ve en la forma
// de las barras (cual se va a la izquierda), no hace falta escribirlo.
const RISK_ORDER = { both: 0, occupancy: 1, budget: 2, ok: 3, insufficient: 4 };
const GAP_SCALE = 50; // pts de brecha que ocupan media barra; mas alla se topea

/**
 * Reemplaza al cuadrante cartesiano de `SPRINT-31` (ver `SPRINT-43`/`SPRINT-44`).
 *
 * Cada sede es una fila con dos barras divergentes desde la meta: ocupacion
 * arriba, presupuesto abajo. Si la barra se va a la izquierda esta por debajo
 * de su meta; a la derecha, por encima. Asi el **tipo** de riesgo se ve en la
 * forma —una barra izquierda o las dos— sin tener que nombrarlo por escrito,
 * y sin pedirle al lector que interprete coordenadas.
 */
function renderRiskGroups(rows){
  const ordered = rows.slice().sort((a, b) =>
    (RISK_ORDER[a.riskGroup] ?? 9) - (RISK_ORDER[b.riskGroup] ?? 9) || a.name.localeCompare(b.name));

  return `
    <section class="panel command-card risk-groups-card">
      <div class="section-head">
        <div>
          <h2>Riesgo por sede</h2>
          <p class="metric-note">Distancia a la meta. Izquierda = por debajo · derecha = por encima.</p>
        </div>
      </div>
      <div class="gap-legend">
        <span><i class="gap-swatch occ"></i>Ocupacion (meta ${OCCUPANCY_TARGET}%)</span>
        <span><i class="gap-swatch bud"></i>Presupuesto (meta ${BUDGET_TARGET}%)</span>
      </div>
      <div class="gap-chart">
        ${ordered.length ? ordered.map(renderGapRow).join('') : '<div class="empty-state"><strong>Sin sedes para el filtro</strong><span>Ajuste los filtros para ver el riesgo por sede.</span></div>'}
      </div>
    </section>
  `;
}

function renderGapRow(row){
  return `
    <div class="gap-row ${row.riskGroup}">
      <span class="gap-name" title="${escapeHTML(row.name)}">${escapeHTML(shortName(row.name))}</span>
      <div class="gap-bars">
        ${renderGapBar(row.occupancyPct, OCCUPANCY_TARGET, row.occupancySeverity, 'occ')}
        ${renderGapBar(row.budgetPct, BUDGET_TARGET, row.budgetSeverity, 'bud')}
      </div>
    </div>
  `;
}

function renderGapBar(pct, target, severity, kind){
  if(pct === null || pct === undefined){
    return `
      <div class="gap-line">
        <div class="gap-bar empty ${kind}"><span class="gap-axis"></span></div>
        <span class="gap-value muted">s/d</span>
      </div>
    `;
  }
  const gap = pct - target;
  const width = Math.min(Math.abs(gap), GAP_SCALE) / GAP_SCALE * 50;
  const side = gap < 0 ? 'left' : 'right';
  const capped = Math.abs(gap) > GAP_SCALE ? ' capped' : '';
  return `
    <div class="gap-line">
      <div class="gap-bar ${kind} ${side}${capped}">
        <span class="gap-axis"></span>
        <span class="gap-fill ${severity}" style="width:${width}%"></span>
      </div>
      <span class="gap-value ${severity}">${pct.toFixed(0)}%</span>
    </div>
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
        ${priorityRows.length ? priorityRows.map((row, index) => renderPriorityItem(row, index)).join('') : '<div class="empty-state"><strong>Sin acciones criticas</strong><span>Las sedes filtradas estan bajo control.</span></div>'}
      </div>
    </section>
  `;
}

/**
 * Cada accion prioritaria responde tres preguntas, no una (SPRINT-42):
 * que hacer (accion), **con que** hacerlo (campanas aplicables del catalogo) y
 * **que se decidio antes** (ultimo registro de la bitacora para esa sede).
 * Cuando no hay campana aplicable o no hay registro previo, se dice
 * explicitamente en vez de omitir la linea — la ausencia tambien es informacion.
 */
function renderPriorityItem(row, index){
  return `
    <article class="priority-item ${row.combinedSeverity}">
      <span class="priority-rank">${index + 1}</span>
      <div class="priority-body">
        <strong>${escapeHTML(row.name)}</strong>
        <p>${escapeHTML(row.action)}</p>
        ${renderPriorityCampaigns(row)}
        ${renderPriorityDecision(row)}
        <small>Fuente: ${escapeHTML(row.source)}</small>
      </div>
      ${badge(row.combinedLabel, row.combinedSeverity)}
    </article>
  `;
}

function renderPriorityCampaigns(row){
  if(!row.campaigns || !row.campaigns.length){
    return '<span class="priority-line muted">Sin campana aplicable en el catalogo para este tramo.</span>';
  }
  const names = row.campaigns.slice(0, 2).map(campaign => `${campaign.name}${campaign.rate ? ` (${campaign.rate})` : ''}`);
  const extra = row.campaigns.length > 2 ? ` +${row.campaigns.length - 2}` : '';
  return `<span class="priority-line campaign"><b>Campanas disponibles:</b> ${escapeHTML(names.join(' · '))}${escapeHTML(extra)}</span>`;
}

function renderPriorityDecision(row){
  const decision = row.lastDecision;
  if(!decision){
    return '<span class="priority-line muted">Sin registro previo en bitacora · responsable por definir.</span>';
  }
  const when = formatDecisionDate(decision.createdAt);
  return `<span class="priority-line decision"><b>Ultimo registro:</b> ${escapeHTML(decision.decision || decision.type || 'Registro sin detalle')} — ${escapeHTML(decision.responsible || 'sin responsable')}${when ? ` · ${escapeHTML(when)}` : ''}${decision.status ? ` · ${escapeHTML(decision.status)}` : ''}</span>`;
}

function formatDecisionDate(value){
  if(!value) return '';
  const parsed = new Date(value);
  if(Number.isNaN(parsed.getTime())) return '';
  return parsed.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
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
          <p class="metric-note">Barras verticales para comparar ejecucion; la linea marca la meta de ${BUDGET_TARGET}%.</p>
        </div>
      </div>
      <div class="vertical-bars">
        <span class="vertical-target" style="bottom:75.0%"></span>
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
      <td>
        ${heatCell(row.occupancyLabel, row.occupancySeverity)}
        <span class="cell-note">${escapeHTML(row.occupancyCoverage)}</span>
        ${row.occupancyMonths ? `<span class="cell-note">Mejor ${escapeHTML(row.occupancyMonths.highest.month)}: ${row.occupancyMonths.highest.pct.toFixed(0)}% · Peor ${escapeHTML(row.occupancyMonths.lowest.month)}: ${row.occupancyMonths.lowest.pct.toFixed(0)}%</span>` : ''}
      </td>
      <td>${heatCell(row.budgetLabel, row.budgetSeverity)}<span class="cell-note">${escapeHTML(row.budget.hasData ? row.budget.periodoLabel : 'Sin presupuesto')}</span></td>
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

/**
 * Nombre corto para etiquetas de grafica. Conserva la palabra que distingue la
 * sede (Hotel / Parque / Camping / Hosteria) porque hay dos pares que solo se
 * diferencian por ella: Hosteria vs Camping Los Farallones, y Hotel vs Parque
 * Piedras Blancas. La version anterior los reducia al mismo texto y los volvia
 * indistinguibles en el grafico (corregido en `SPRINT-43`).
 */
function shortName(name){
  return String(name)
    .replace('Los ', '')
    .replace('Ecologico ', '')
    .trim();
}
