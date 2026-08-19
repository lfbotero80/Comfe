const OPERATOR_KEY = 'comfenalco_operator_v1';
const DECISION_LOG_KEY = 'comfenalco_decision_log_v1';
const OCCUPANCY_KEY = 'comfenalco_occupancy_rows_v1';
const BUDGET_KEY = 'comfenalco_budget_rows_v1';
const REVENUE_KEY = 'comfenalco_revenue_rows_v1';
const LOADED_FILES_KEY = 'comfenalco_loaded_files_v1';
const CAMPAIGNS_KEY = 'comfenalco_campaign_rows_v1';
const STORAGE_SCHEMA_KEY = 'comfenalco_public_storage_schema_v1';
const STORAGE_SCHEMA_VERSION = 'real-empty-2026-08-19';

migrateLegacyDemoStorage();

export const appState = {
  loadedFiles: readPersistedRows(LOADED_FILES_KEY) ?? [],
  occupancyInventoryRows: readPersistedRows(OCCUPANCY_KEY) ?? [],
  budgetRows: readPersistedRows(BUDGET_KEY) ?? [],
  revenueRuleRows: readPersistedRows(REVENUE_KEY) ?? [],
  currentOperator: readCurrentOperator(),
  decisionRows: readDecisionRows(),
  calendarRows: [],
  campaignRows: readPersistedRows(CAMPAIGNS_KEY) ?? [],
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
  persistRows(LOADED_FILES_KEY, appState.loadedFiles);

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
    persistRows(OCCUPANCY_KEY, appState.occupancyInventoryRows);
  }
  if(contractId === 'budgetExecution'){
    appState.budgetRows = mergeByKey(
      appState.budgetRows, acceptedRows,
      row => `${row.sede}__${row.periodo}`,
      (a, b) => String(a.sede).localeCompare(String(b.sede)) || String(a.periodo).localeCompare(String(b.periodo))
    );
    persistRows(BUDGET_KEY, appState.budgetRows);
  }
  if(contractId === 'revenueRules'){
    appState.revenueRuleRows = acceptedRows;
    persistRows(REVENUE_KEY, appState.revenueRuleRows);
  }
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
  persistRows(CAMPAIGNS_KEY, appState.campaignRows);

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

function readPersistedRows(key){
  try{
    const raw = localStorage.getItem(key);
    if(raw === null) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  }catch(error){
    return null;
  }
}

function persistRows(key, rows){
  try{
    localStorage.setItem(key, JSON.stringify(rows));
  }catch(error){
    // localStorage can be unavailable in some embedded previews; keep session data.
  }
}

function migrateLegacyDemoStorage(){
  try{
    if(localStorage.getItem(STORAGE_SCHEMA_KEY) === STORAGE_SCHEMA_VERSION) return;
    [
      'comfenalco_data_mode_v1',
      DECISION_LOG_KEY,
      OCCUPANCY_KEY,
      BUDGET_KEY,
      REVENUE_KEY,
      LOADED_FILES_KEY,
      CAMPAIGNS_KEY
    ].forEach(key => localStorage.removeItem(key));
    localStorage.setItem(STORAGE_SCHEMA_KEY, STORAGE_SCHEMA_VERSION);
  }catch(error){
    // If localStorage is unavailable, the app still starts from the in-memory real mode.
  }
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
