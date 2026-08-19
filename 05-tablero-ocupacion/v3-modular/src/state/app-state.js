import { DEMO_BUDGET_ROWS, DEMO_HOTEL_FORECAST, DEMO_PARK_ROWS } from '../data/demo-data.js';
import { COMMERCIAL_CALENDAR } from '../data/commercial-calendar.js';
import { CAMPAIGNS } from '../data/campaigns.js';

const DATA_MODE_KEY = 'comfenalco_data_mode_v1';
const OPERATOR_KEY = 'comfenalco_operator_v1';
const DECISION_LOG_KEY = 'comfenalco_decision_log_v1';
export const DATA_MODES = {
  demo: {
    id: 'demo',
    label: 'Modo demo',
    description: 'Usa datos semilla para revisar el tablero sin cargar archivos.'
  },
  real: {
    id: 'real',
    label: 'Datos reales',
    description: 'Arranca sin ocupacion, presupuesto ni Revenue hasta cargar archivos.'
  }
};

const initialDataMode = readDataMode();

export const appState = {
  dataMode: initialDataMode,
  ...dataForMode(initialDataMode),
  currentOperator: readCurrentOperator(),
  decisionRows: readDecisionRows(),
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

export function setDataMode(mode){
  const nextMode = mode === DATA_MODES.real.id ? DATA_MODES.real.id : DATA_MODES.demo.id;
  try{
    localStorage.setItem(DATA_MODE_KEY, nextMode);
  }catch(error){
    // localStorage can be unavailable in some embedded previews; keep session mode.
  }
  Object.assign(appState, {
    dataMode: nextMode,
    ...dataForMode(nextMode)
  });
}

export function registerLoad({ contractId, filename, acceptedRows, rejectedRows }){
  const loadedAt = new Date().toISOString();
  const loadedBy = appState.currentOperator || 'Sin responsable definido';
  appState.loadedFiles.push({
    contractId,
    filename,
    acceptedRows: acceptedRows.length,
    rejectedRows: rejectedRows.length,
    loadedAt,
    loadedBy
  });

  addDecisionLog({
    type: 'Carga de datos',
    site: sitesFromRows(acceptedRows),
    responsible: loadedBy,
    decision: `${filename}: ${acceptedRows.length} fila(s) cargadas`,
    dueDate: '',
    status: rejectedRows.length ? 'Con advertencias' : 'Registrada',
    notes: rejectedRows.length
      ? `${rejectedRows.length} fila(s) rechazadas. Contrato: ${contractId}.`
      : `Contrato: ${contractId}.`,
    createdAt: loadedAt,
    source: filename
  });

  if(contractId === 'occupancyInventory'){
    appState.occupancyInventoryRows = mergeByKey(
      appState.occupancyInventoryRows, acceptedRows,
      row => `${row.sede}__${row.tipo_unidad}__${row.fecha}`,
      (a, b) => String(a.sede).localeCompare(String(b.sede)) || String(a.fecha).localeCompare(String(b.fecha))
    );
  }
  if(contractId === 'budgetExecution'){
    appState.budgetRows = mergeByKey(
      appState.budgetRows, acceptedRows,
      row => `${row.sede}__${row.periodo}`,
      (a, b) => String(a.sede).localeCompare(String(b.sede)) || String(a.periodo).localeCompare(String(b.periodo))
    );
  }
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

  addDecisionLog({
    type: 'Campaña',
    site: campaign.sites,
    responsible: appState.currentOperator || 'Sin responsable definido',
    decision: `Campaña agregada: ${campaign.name}`,
    dueDate: campaign.executionDate || '',
    status: campaign.status === 'ejecutada' ? 'Cerrada' : 'Abierta',
    notes: `${campaign.cause} · ${campaign.rate}`,
    source: 'Catálogo de campañas'
  });
}

export function setCurrentOperator(name){
  const cleanName = String(name || '').trim();
  appState.currentOperator = cleanName;
  try{
    localStorage.setItem(OPERATOR_KEY, cleanName);
  }catch(error){
    // localStorage can be unavailable in some embedded previews; keep session value.
  }
}

export function addDecisionLog(entry){
  const createdAt = entry.createdAt || new Date().toISOString();
  appState.decisionRows = [
    {
      id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: entry.type || 'Seguimiento',
      site: entry.site || 'General',
      responsible: entry.responsible || appState.currentOperator || 'Sin responsable definido',
      decision: entry.decision || '',
      dueDate: entry.dueDate || '',
      status: entry.status || 'Abierta',
      notes: entry.notes || '',
      source: entry.source || 'Registro manual',
      createdAt
    },
    ...appState.decisionRows
  ];
  persistDecisionRows();
}

function readDataMode(){
  try{
    return localStorage.getItem(DATA_MODE_KEY) === DATA_MODES.real.id ? DATA_MODES.real.id : DATA_MODES.demo.id;
  }catch(error){
    return DATA_MODES.demo.id;
  }
}

function readCurrentOperator(){
  try{
    return localStorage.getItem(OPERATOR_KEY) || '';
  }catch(error){
    return '';
  }
}

function readDecisionRows(){
  try{
    const stored = JSON.parse(localStorage.getItem(DECISION_LOG_KEY) || '[]');
    return Array.isArray(stored) ? stored : [];
  }catch(error){
    return [];
  }
}

function persistDecisionRows(){
  try{
    localStorage.setItem(DECISION_LOG_KEY, JSON.stringify(appState.decisionRows.slice(0, 250)));
  }catch(error){
    // Demo local: if persistence is unavailable, the in-session log still works.
  }
}

function dataForMode(mode){
  if(mode === DATA_MODES.real.id){
    return {
      loadedFiles: [],
      occupancyInventoryRows: [],
      parkRows: [],
      budgetRows: [],
      revenueRuleRows: []
    };
  }
  return {
    loadedFiles: [
      { contractId:'occupancyInventory', filename:'demo-farallones-zeus.csv', acceptedRows:DEMO_HOTEL_FORECAST.length, rejectedRows:0, loadedAt:'2026-08-17T00:00:00.000Z' },
      { contractId:'occupancyInventory', filename:'demo-parques-inventario.csv', acceptedRows:DEMO_PARK_ROWS.length, rejectedRows:0, loadedAt:'2026-08-17T00:00:00.000Z' },
      { contractId:'budgetExecution', filename:'demo-presupuesto-cortes-reales.csv', acceptedRows:DEMO_BUDGET_ROWS.length, rejectedRows:0, loadedAt:'2026-08-17T00:00:00.000Z' }
    ],
    occupancyInventoryRows: DEMO_HOTEL_FORECAST.concat(DEMO_PARK_ROWS),
    parkRows: DEMO_PARK_ROWS.slice(),
    budgetRows: DEMO_BUDGET_ROWS.slice(),
    revenueRuleRows: []
  };
}

function mergeByKey(existingRows, newRows, keyFn, sortFn){
  const rowsByKey = new Map();
  existingRows.forEach(row => rowsByKey.set(keyFn(row), row));
  newRows.forEach(row => rowsByKey.set(keyFn(row), row));
  return [...rowsByKey.values()].sort(sortFn);
}

function sitesFromRows(rows){
  const sites = [...new Set(rows.map(row => row.sede).filter(Boolean))];
  if(!sites.length) return 'Sin sede identificada';
  if(sites.length <= 3) return sites.join(', ');
  return `${sites.slice(0, 3).join(', ')} y ${sites.length - 3} más`;
}
