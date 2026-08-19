import { HOTELS, PARKS } from './sites.js';

export function buildReadinessSummary(state){
  return {
    hotels: HOTELS.map(site => siteReadiness(site, state)),
    parks: PARKS.map(site => siteReadiness(site, state))
  };
}

function siteReadiness(site, state){
  const occupancyRows = rowsForSite(state.occupancyInventoryRows, site.name);
  const budgetRows = rowsForSite(state.budgetRows, site.name);
  const revenueRows = rowsForSite(state.revenueRuleRows, site.name);
  const contracts = [
    contractState('Ocupacion', occupancyRows, latestValue(occupancyRows, 'fecha'), latestValue(occupancyRows, 'fecha_corte')),
    contractState('Presupuesto', budgetRows, latestValue(budgetRows, 'periodo'), latestValue(budgetRows, 'fecha_corte')),
    contractState('Revenue', revenueRows, latestValue(revenueRows, 'tramo'), latestValue(revenueRows, 'fecha_corte'))
  ];
  const loadedCount = contracts.filter(contract => contract.loaded).length;

  return {
    site,
    contracts,
    loadedCount,
    totalCount: contracts.length,
    coverage: Math.round((loadedCount / contracts.length) * 100),
    status: readinessStatus(loadedCount, contracts.length),
    lastSource: latestSource([...occupancyRows, ...budgetRows, ...revenueRows])
  };
}

function contractState(label, rows, detail, cutoff){
  return {
    label,
    loaded: rows.length > 0,
    rows: rows.length,
    detail: detail || '',
    cutoff: cutoff || ''
  };
}

function rowsForSite(rows, siteName){
  return rows.filter(row => row.sede === siteName || String(row.sede || '').toLowerCase() === 'todas');
}

function latestValue(rows, field){
  return rows
    .map(row => row[field])
    .filter(Boolean)
    .sort((a, b) => String(a).localeCompare(String(b)))
    .at(-1) || '';
}

function latestSource(rows){
  const sorted = rows
    .filter(row => row.fuente || row.fecha_corte || row.fecha || row.periodo)
    .sort((a, b) => {
      const aDate = a.fecha_corte || a.fecha || a.periodo || '';
      const bDate = b.fecha_corte || b.fecha || b.periodo || '';
      return String(aDate).localeCompare(String(bDate));
    });
  const latest = sorted.at(-1);
  if(!latest) return 'Sin fuente cargada';
  return latest.fuente || 'Fuente no reportada';
}

function readinessStatus(loadedCount, totalCount){
  if(loadedCount === totalCount) return { severity:'green', label:'Completo' };
  if(loadedCount > 0) return { severity:'amber', label:'Parcial' };
  return { severity:'gray', label:'Sin datos' };
}
