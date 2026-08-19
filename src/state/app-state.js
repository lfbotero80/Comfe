import { DEMO_BUDGET_ROWS, DEMO_HOTEL_FORECAST, DEMO_PARK_ROWS } from '../data/demo-data.js';
import { COMMERCIAL_CALENDAR } from '../data/commercial-calendar.js';
import { CAMPAIGNS } from '../data/campaigns.js';

export const appState = {
  loadedFiles: [
    { contractId:'occupancyInventory', filename:'demo-farallones-zeus.csv', acceptedRows:DEMO_HOTEL_FORECAST.length, rejectedRows:0, loadedAt:'2026-08-17T00:00:00.000Z' },
    { contractId:'occupancyInventory', filename:'demo-parques-inventario.csv', acceptedRows:DEMO_PARK_ROWS.length, rejectedRows:0, loadedAt:'2026-08-17T00:00:00.000Z' },
    { contractId:'budgetExecution', filename:'demo-presupuesto-cortes-reales.csv', acceptedRows:DEMO_BUDGET_ROWS.length, rejectedRows:0, loadedAt:'2026-08-17T00:00:00.000Z' }
  ],
  occupancyInventoryRows: DEMO_HOTEL_FORECAST.concat(DEMO_PARK_ROWS),
  parkRows: DEMO_PARK_ROWS.slice(),
  budgetRows: DEMO_BUDGET_ROWS.slice(),
  revenueRuleRows: [],
  calendarRows: COMMERCIAL_CALENDAR.slice(),
  campaignRows: CAMPAIGNS.slice(),
  filters: {
    period: 'all',
    unitType: 'all',
    severity: 'all'
  }
};

export function setGlobalFilter(key, value){
  appState.filters[key] = value;
}

export function registerLoad({ contractId, filename, acceptedRows, rejectedRows }){
  appState.loadedFiles.push({
    contractId,
    filename,
    acceptedRows: acceptedRows.length,
    rejectedRows: rejectedRows.length,
    loadedAt: new Date().toISOString()
  });

  if(contractId === 'occupancyInventory') appState.occupancyInventoryRows = mergeByKey(appState.occupancyInventoryRows, acceptedRows, row => `${row.sede}__${row.tipo_unidad}__${row.fecha}`);
  if(contractId === 'budgetExecution') appState.budgetRows = acceptedRows;
  if(contractId === 'revenueRules') appState.revenueRuleRows = acceptedRows;
}

export function addCampaign(campaign){
  appState.campaignRows.push({
    id: `camp-user-${Date.now()}`,
    name: campaign.name,
    cause: campaign.cause,
    sites: campaign.sites,
    rate: campaign.rate,
    executionDate: campaign.executionDate || '',
    projectedOccupancy: campaign.projectedOccupancy ?? null,
    actualOccupancy: campaign.actualOccupancy ?? null,
    status: campaign.status || 'propuesta'
  });
}

function mergeByKey(existingRows, newRows, keyFn){
  const rowsByKey = new Map();
  existingRows.forEach(row => rowsByKey.set(keyFn(row), row));
  newRows.forEach(row => rowsByKey.set(keyFn(row), row));
  return [...rowsByKey.values()].sort((a, b) => {
    const siteCompare = String(a.sede).localeCompare(String(b.sede));
    return siteCompare || String(a.fecha).localeCompare(String(b.fecha));
  });
}
