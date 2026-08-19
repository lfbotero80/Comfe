import { budgetSeverity, budgetSites, formatCOP, siteRowsSorted, summarizeSite } from './budget.js';
import { buildReadinessSummary } from './data-readiness.js';
import { classifyOccupancyValue, OCCUPANCY_TARGET } from './occupancy.js';
import { campaignsForSite } from './commercial-context.js';
import { aggregateOccupancy, coverageLabel, monthExtremes } from './occupancy-aggregate.js';

const SEVERITY_RANK = { red: 0, amber: 1, gray: 2, green: 3 };
const KIND_RANK = { hotel: 0, parque: 1 };

export function buildDashboardCommand(state){
  const sites = budgetSites().filter(site => {
    if(state.filters.unitType === 'all') return true;
    return site.kind === state.filters.unitType;
  });
  const readinessBySite = readinessMap(state);
  const rows = sites
    .map(site => siteCommandRow(site, state, readinessBySite.get(site.name)))
    .filter(row => state.filters.severity === 'all' || row.combinedSeverity === state.filters.severity)
    .sort(prioritySort);

  const totals = commandTotals(rows, state);
  return {
    period: state.filters.period,
    rows,
    totals,
    monthlyTrend: monthlyTrend(state, sites),
    radar: radarProfile(rows)
  };
}

function siteCommandRow(site, state, readiness){
  const occupancyRows = state.occupancyInventoryRows
    .filter(row => row.sede === site.name)
    .filter(row => state.filters.period === 'all' || String(row.fecha).startsWith(state.filters.period))
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
  const latestOccupancy = occupancyRows.at(-1) || null;
  // La ocupacion del periodo es la agregada ponderada por inventario, no la del
  // ultimo dia cargado: hasta `SPRINT-38`, "Todo 2026" mostraba un solo dia
  // presentado como si fuera el ano completo (ver `SPRINT-39` en SPRINTS.md).
  const occupancy = aggregateOccupancy(occupancyRows);
  const occupancyPct = occupancy.hasData ? boundedPct(occupancy.pct) : null;
  const occupancyStatus = occupancy.hasData
    ? classifyOccupancyValue(occupancyPct)
    : { severity: 'gray', label: 'Sin dato', recommendation: 'Cargar ocupacion antes de decidir.' };

  const budgetRows = siteRowsSorted(state.budgetRows, site.name);
  const budgetMode = state.filters.period === 'all' ? 'accumulated' : state.filters.period;
  const budget = summarizeSite(site.name, budgetRows, budgetMode);
  const trend = trendFromRows(occupancyRows);
  const dataSeverity = readiness?.status?.severity || 'gray';
  const combinedSeverity = combinedStatus(occupancyStatus.severity, budget.severity, dataSeverity, occupancyPct, budget.hasData);
  const missing = missingSources(readiness);
  const latestDecision = latestDecisionForSite(state.decisionRows, site.name);
  // Campanas aplicables segun la senal comercial (ocupacion), no segun el estado
  // combinado: si la sede esta en rojo por ejecucion presupuestal y no por
  // ocupacion, una campana no es la respuesta correcta y no se sugiere.
  const campaigns = campaignsForSite(site.name, occupancyStatus.severity);
  const action = actionForRow({ occupancyStatus, budget, combinedSeverity, missing, site });

  return {
    site,
    name: site.name,
    kind: site.kind,
    occupancyPct,
    occupancyLabel: occupancyPct === null ? 'Sin dato' : `${occupancyPct.toFixed(0)}%`,
    occupancySeverity: occupancyStatus.severity,
    budgetPct: budget.hasData ? budget.pct : null,
    budgetLabel: budget.hasData ? `${budget.pct.toFixed(0)}%` : 'Sin dato',
    budget,
    budgetSeverity: budget.severity,
    dataCoverage: readiness?.coverage || 0,
    dataSeverity,
    combinedSeverity,
    combinedLabel: statusLabel(combinedSeverity),
    trend,
    action,
    responsible: latestDecision?.responsible || 'Sin responsable',
    lastDecision: latestDecision,
    campaigns,
    source: latestOccupancy?.fuente || readiness?.lastSource || 'Sin fuente cargada',
    missing,
    occupancy,
    occupancyCoverage: coverageLabel(occupancy),
    occupancyMonths: monthExtremes(occupancy.byMonth),
    latestDate: latestOccupancy?.fecha || '',
    plotX: occupancyPct === null ? 4 : occupancyPct,
    plotY: budget.hasData ? Math.min(budget.pct, 120) / 1.2 : 4,
    plotIsPartial: occupancyPct === null || !budget.hasData,
    priority: priorityValue(combinedSeverity, occupancyStatus.severity, budget.severity, missing.length)
  };
}

function commandTotals(rows, state){
  const withOccupancy = rows.filter(row => row.occupancyPct !== null);
  // Ocupacion consolidada ponderada por inventario, no promedio simple de los
  // porcentajes de cada sede: una sede de 500 cupos y una de 48 habitaciones no
  // pesan igual, y promediar sus tasas distorsiona la cifra real.
  const totalOccupied = withOccupancy.reduce((sum, row) => sum + (row.occupancy?.occupied || 0), 0);
  const totalInventory = withOccupancy.reduce((sum, row) => sum + (row.occupancy?.inventory || 0), 0);
  const avgOccupancy = totalInventory ? (totalOccupied / totalInventory) * 100 : null;
  // Mezclar habitaciones y cupos en una sola tasa no es estrictamente
  // comparable; se advierte en la vista cuando el filtro incluye ambas familias.
  const mixedUnitKinds = new Set(withOccupancy.map(row => row.kind)).size > 1;
  const occupancyDays = withOccupancy.reduce((sum, row) => sum + (row.occupancy?.days || 0), 0);
  const budget = rows.reduce((sum, row) => sum + (Number(row.budget.presupuesto) || 0), 0);
  const executed = rows.reduce((sum, row) => sum + (Number(row.budget.ejecutado) || 0), 0);
  const budgetPct = budget ? (executed / budget) * 100 : null;
  const severityCounts = countBy(rows, row => row.combinedSeverity);
  const missingCore = rows.filter(row => row.occupancyPct === null || !row.budget.hasData).length;
  const unitSeverity = unitStatus(rows, missingCore);
  return {
    siteCount: rows.length,
    withOccupancy: withOccupancy.length,
    avgOccupancy,
    occupancyOccupied: totalOccupied,
    occupancyInventory: totalInventory,
    occupancyDays,
    mixedUnitKinds,
    budget,
    executed,
    budgetPct,
    budgetGap: budget - executed,
    budgetSeverity: budgetPct === null ? 'gray' : budgetSeverity(budgetPct),
    severityCounts,
    actionCount: rows.filter(row => row.combinedSeverity !== 'green').length,
    dataCoverage: rows.length ? Math.round(average(rows.map(row => row.dataCoverage))) : 0,
    unitSeverity,
    unitTitle: unitTitle(unitSeverity),
    unitReason: unitReason(rows, missingCore, state.filters.period),
    statusStrip: ['red', 'amber', 'green', 'gray'].map(severity => ({
      severity,
      count: severityCounts[severity] || 0,
      pct: rows.length ? ((severityCounts[severity] || 0) / rows.length) * 100 : 0
    }))
  };
}

function monthlyTrend(state, sites){
  return Array.from({ length: 12 }, (_, index) => {
    const month = `2026-${String(index + 1).padStart(2, '0')}`;
    const occupancyValues = state.occupancyInventoryRows
      .filter(row => sites.some(site => site.name === row.sede))
      .filter(row => String(row.fecha).startsWith(month))
      .map(row => Number(row.ocupacion_porcentaje))
      .filter(Number.isFinite);
    const budgetRows = state.budgetRows.filter(row => row.periodo === month && sites.some(site => site.name === row.sede));
    const budget = budgetRows.reduce((sum, row) => sum + (Number(row.presupuesto) || 0), 0);
    const executed = budgetRows.reduce((sum, row) => sum + (Number(row.ejecutado) || 0), 0);
    return {
      month,
      label: month.slice(5),
      occupancy: occupancyValues.length ? average(occupancyValues) : null,
      budget: budget ? (executed / budget) * 100 : null
    };
  });
}

function radarProfile(rows){
  const dataRows = rows.filter(row => row.occupancyPct !== null || row.budgetPct !== null);
  const avgOccupancy = average(dataRows.map(row => row.occupancyPct).filter(value => value !== null));
  const avgBudget = average(dataRows.map(row => row.budgetPct).filter(value => value !== null));
  const coverage = rows.length ? average(rows.map(row => row.dataCoverage)) : 0;
  const trend = average(dataRows.map(row => Math.max(-20, Math.min(20, row.trend.value || 0)) + 20));
  const risk = rows.length ? ((rows.filter(row => row.combinedSeverity === 'green').length / rows.length) * 100) : 0;
  return [
    { label: 'Ocup.', value: avgOccupancy || 0 },
    { label: 'Ppto.', value: avgBudget || 0 },
    { label: 'Datos', value: coverage || 0 },
    { label: 'Tend.', value: trend ? (trend / 40) * 100 : 50 },
    { label: 'Control', value: risk || 0 }
  ];
}

function combinedStatus(occupancySeverity, budgetSeverityValue, dataSeverity, occupancyPct, hasBudget){
  if(occupancyPct === null && !hasBudget) return 'gray';
  if(occupancySeverity === 'red' || budgetSeverityValue === 'red') return 'red';
  if(occupancySeverity === 'amber' || budgetSeverityValue === 'amber' || dataSeverity === 'amber') return 'amber';
  if(occupancySeverity === 'green' && budgetSeverityValue === 'green') return 'green';
  return 'amber';
}

function statusLabel(severity){
  if(severity === 'red') return 'Critico';
  if(severity === 'amber') return 'Atencion';
  if(severity === 'green') return 'Bajo control';
  return 'Sin dato';
}

function actionForRow({ occupancyStatus, budget, combinedSeverity, missing, site }){
  if(missing.includes('Ocupacion')) return `Cargar forecast de ${site.name}.`;
  if(missing.includes('Presupuesto')) return `Cargar presupuesto de ${site.name}.`;
  if(combinedSeverity === 'red'){
    if(occupancyStatus.severity === 'red') return occupancyStatus.recommendation;
    return 'Revisar ejecucion presupuestal y plan de recuperacion.';
  }
  if(combinedSeverity === 'amber'){
    if(occupancyStatus.severity === 'amber') return occupancyStatus.recommendation;
    if(budget.severity === 'amber') return 'Revisar ritmo de ejecucion presupuestal.';
    return 'Completar fuentes antes de decidir.';
  }
  return 'Mantener seguimiento y proteger desempeno.';
}

function missingSources(readiness){
  if(!readiness) return ['Ocupacion', 'Presupuesto', 'Revenue'];
  return readiness.contracts.filter(contract => !contract.loaded).map(contract => contract.label);
}

function latestDecisionForSite(decisionRows, siteName){
  return decisionRows.find(row => row.site === siteName || String(row.site || '').includes(siteName)) || null;
}

function trendFromRows(rows){
  const values = rows.map(row => Number(row.ocupacion_porcentaje)).filter(Number.isFinite);
  if(values.length < 4) return { label: 'Sin tendencia', value: 0, direction: 'flat' };
  const recent = average(values.slice(-3));
  const previous = average(values.slice(Math.max(0, values.length - 6), Math.max(0, values.length - 3)));
  const diff = recent - previous;
  if(diff >= 5) return { label: `Sube ${diff.toFixed(1)} pp`, value: diff, direction: 'up' };
  if(diff <= -5) return { label: `Cae ${Math.abs(diff).toFixed(1)} pp`, value: diff, direction: 'down' };
  return { label: 'Estable', value: diff, direction: 'flat' };
}

function readinessMap(state){
  const summary = buildReadinessSummary(state);
  return new Map([...summary.hotels, ...summary.parks].map(item => [item.site.name, item]));
}

function unitStatus(rows, missingCore){
  if(!rows.length) return 'gray';
  if(missingCore > rows.length / 2) return 'gray';
  if(rows.some(row => row.combinedSeverity === 'red')) return 'red';
  if(rows.some(row => row.combinedSeverity === 'amber') || missingCore > 0) return 'amber';
  return 'green';
}

function unitTitle(severity){
  if(severity === 'red') return 'Unidad en estado critico';
  if(severity === 'amber') return 'Unidad en atencion';
  if(severity === 'green') return 'Unidad bajo control';
  return 'Sin dato suficiente';
}

function unitReason(rows, missingCore){
  if(!rows.length) return 'No hay sedes para los filtros aplicados.';
  if(missingCore > rows.length / 2) return `${missingCore} sedes no tienen ocupacion o presupuesto suficiente.`;
  const red = rows.filter(row => row.combinedSeverity === 'red').length;
  if(red) return `${red} sede(s) requieren intervencion prioritaria.`;
  const amber = rows.filter(row => row.combinedSeverity === 'amber').length;
  if(amber) return `${amber} sede(s) requieren seguimiento o fuente pendiente.`;
  return 'Las sedes filtradas cumplen los umbrales principales.';
}

function priorityValue(combined, occupancy, budget, missingCount){
  return (SEVERITY_RANK[combined] ?? 4) * 100
    + (SEVERITY_RANK[occupancy] ?? 4) * 10
    + (SEVERITY_RANK[budget] ?? 4)
    + missingCount;
}

function prioritySort(a, b){
  return (KIND_RANK[a.kind] ?? 9) - (KIND_RANK[b.kind] ?? 9)
    || a.priority - b.priority
    || a.name.localeCompare(b.name);
}

function countBy(rows, fn){
  return rows.reduce((counts, row) => {
    const key = fn(row);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

function boundedPct(value){
  return Math.max(0, Math.min(Number(value) || 0, 100));
}

function average(values){
  const clean = values.filter(Number.isFinite);
  if(!clean.length) return 0;
  return clean.reduce((sum, value) => sum + value, 0) / clean.length;
}

export { formatCOP, OCCUPANCY_TARGET };
