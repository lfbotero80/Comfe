import { appState } from '../state/app-state.js';
import { siteRowsSorted, summarizeSite } from './budget.js';
import { commercialContextForSite } from './commercial-context.js';
import { classifyOccupancy, OCCUPANCY_TARGET } from './occupancy.js';

export function buildAIRecommendationContext(site, activePeriod){
  const occupancyRows = rowsForSite(appState.occupancyInventoryRows, site.name);
  const periodRows = activePeriod ? rowsForPeriod(occupancyRows, activePeriod) : [];
  const latestRow = periodRows[periodRows.length - 1] || occupancyRows[occupancyRows.length - 1] || null;
  const status = latestRow ? classifyOccupancy(latestRow.ocupacion_porcentaje, latestRow.fecha) : null;
  const budgetRows = siteRowsSorted(appState.budgetRows, site.name);
  const activeBudget = activePeriod ? summarizeSite(site.name, budgetRows, activePeriod) : { hasData: false };
  const latestBudget = summarizeSite(site.name, budgetRows, 'latest');
  const budget = activeBudget.hasData ? activeBudget : latestBudget;
  const revenueRules = appState.revenueRuleRows.filter(row => row.sede === site.name || row.tipo_sede === site.kind);
  const commercialContext = latestRow
    ? commercialContextForSite(site.name, latestRow.fecha, status)
    : { campaigns: [], activities: [], action: 'Sin fecha de ocupacion cargada.' };
  const occupancy = summarizeOccupancy(periodRows.length ? periodRows : occupancyRows);
  const sources = sourceSummary({ occupancyRows, budgetRows, revenueRules });
  const missingData = missingDataFor({
    activePeriod,
    occupancyRows,
    periodRows,
    latestRow,
    budget,
    revenueRules,
    commercialContext,
    sources
  });
  const confidence = confidenceFor(missingData);

  return {
    version: 'ai-context-v1',
    generatedAt: new Date().toISOString(),
    site: {
      id: site.id,
      name: site.name,
      kind: site.kind,
      role: site.role,
      defaultUnitType: site.defaultUnitType
    },
    activePeriod: activePeriod || null,
    sources,
    occupancy,
    budget: {
      hasData: budget.hasData,
      periodLabel: budget.periodoLabel,
      reliable: budget.confiable,
      presupuesto: budget.presupuesto,
      ejecutado: budget.ejecutado,
      cumplimientoPorcentaje: budget.hasData && budget.confiable ? budget.pct : null,
      severity: budget.severity
    },
    revenue: {
      hasRules: revenueRules.length > 0,
      rulesCount: revenueRules.length,
      currentStatus: status ? {
        id: status.id,
        label: status.label,
        severity: status.severity,
        recommendation: status.recommendation,
        operationalContext: status.context
      } : null
    },
    commercial: {
      campaigns: commercialContext.campaigns.map(campaign => ({
        name: campaign.name,
        cause: campaign.cause,
        rate: campaign.rate,
        status: campaign.status
      })),
      activities: commercialContext.activities.map(activity => ({
        month: activity.month,
        activity: activity.activity,
        type: activity.type,
        audience: activity.audience
      }))
    },
    confidence,
    missingData
  };
}

function rowsForSite(rows, siteName){
  return rows
    .filter(row => row.sede === siteName)
    .slice()
    .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
}

function rowsForPeriod(rows, period){
  return rows.filter(row => String(row.fecha).startsWith(period));
}

function summarizeOccupancy(rows){
  const values = rows.map(row => Number(row.ocupacion_porcentaje)).filter(Number.isFinite);
  const latest = rows[rows.length - 1] || null;
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  const compliance = average === null ? null : (average / OCCUPANCY_TARGET) * 100;
  return {
    hasData: rows.length > 0,
    rowsCount: rows.length,
    startDate: rows[0]?.fecha || null,
    endDate: latest?.fecha || null,
    latestDate: latest?.fecha || null,
    latestPercentage: latest ? Number(latest.ocupacion_porcentaje) : null,
    averagePercentage: average,
    targetPercentage: OCCUPANCY_TARGET,
    compliancePercentage: compliance,
    inventoryTotal: latest ? Number(latest.inventario_total) : null,
    occupiedUnits: latest ? Number(latest.unidades_ocupadas) : null,
    freeUnits: latest ? Number(latest.unidades_libres) : null,
    unitType: latest?.tipo_unidad || null
  };
}

function sourceSummary({ occupancyRows, budgetRows, revenueRules }){
  return {
    occupancy: latestSource(occupancyRows, 'fecha_corte'),
    budget: latestSource(budgetRows, 'fecha_corte'),
    revenue: latestSource(revenueRules, 'fecha_corte')
  };
}

function latestSource(rows, cutoffField){
  if(!rows.length) return null;
  const latest = rows.slice().sort((a, b) => String(a[cutoffField] || '').localeCompare(String(b[cutoffField] || ''))).pop();
  return {
    fuente: latest.fuente || 'Fuente sin nombre',
    fechaCorte: latest[cutoffField] || null,
    rowsCount: rows.length
  };
}

function missingDataFor({ activePeriod, occupancyRows, periodRows, latestRow, budget, revenueRules, commercialContext, sources }){
  const missing = [];
  if(!occupancyRows.length) missing.push(missingItem('critical', 'ocupacion_diaria', 'Falta forecast/ocupacion diaria de la sede.'));
  if(occupancyRows.length && activePeriod && !periodRows.length) missing.push(missingItem('critical', 'ocupacion_periodo', `No hay filas de ocupacion para ${activePeriod}.`));
  if(occupancyRows.length && !activePeriod) missing.push(missingItem('medium', 'periodo_activo', 'No hay periodo activo seleccionado para la sede.'));
  if(latestRow && (!latestRow.fuente || !latestRow.fecha_corte)) missing.push(missingItem('medium', 'fuente_ocupacion', 'Falta fuente o fecha de corte en ocupacion.'));
  if(!budget.hasData) missing.push(missingItem('critical', 'presupuesto', 'Falta presupuesto/ejecucion de la sede.'));
  if(budget.hasData && !budget.confiable) missing.push(missingItem('critical', 'presupuesto_confiable', 'El presupuesto esta marcado como no confiable o pendiente.'));
  if(!revenueRules.length) missing.push(missingItem('medium', 'reglas_revenue', 'Faltan reglas de Revenue cargadas para esta sede o tipo de sede.'));
  if(!commercialContext.campaigns.length) missing.push(missingItem('low', 'campanas', 'No hay campanas asociadas al tramo actual.'));
  if(!commercialContext.activities.length) missing.push(missingItem('low', 'calendario', 'No hay actividades de calendario asociadas al periodo.'));
  if(!sources.occupancy && !sources.budget && !sources.revenue) missing.push(missingItem('medium', 'trazabilidad_fuentes', 'No hay fuentes cargadas para auditar la recomendacion.'));
  return missing;
}

function missingItem(severity, field, message){
  return { severity, field, message };
}

function confidenceFor(missingData){
  const critical = missingData.filter(item => item.severity === 'critical').length;
  const medium = missingData.filter(item => item.severity === 'medium').length;
  if(critical >= 2) return confidence('low', 'Baja', 'red', 'No usar para decision comercial sin completar datos criticos.');
  if(critical === 1 || medium >= 2) return confidence('medium', 'Media', 'amber', 'Usar solo como lectura preliminar; revisar datos faltantes.');
  return confidence('high', 'Alta', 'green', 'Contexto suficiente para analisis asistido bajo demanda.');
}

function confidence(id, label, severity, guidance){
  return { id, label, severity, guidance };
}
