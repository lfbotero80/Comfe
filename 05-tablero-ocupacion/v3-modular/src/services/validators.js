import { getContract, SITE_TYPES } from '../domain/data-contracts.js';
import { findSiteByName } from '../domain/sites.js';
import { getExtension } from './file-reader.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const PERIOD_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

export function validateFileRows({ file, rows, contractId }){
  const contract = getContract(contractId);
  const extension = getExtension(file.name);
  const messages = [];

  if(!contract){
    return {
      ok: false,
      messages: [{ type: 'error', text: `Contrato no reconocido: ${contractId}.` }],
      acceptedRows: [],
      rejectedRows: []
    };
  }

  if(!contract.acceptedExtensions.includes(extension)){
    messages.push({
      type: 'error',
      text: `Formato ${extension || 'desconocido'} no permitido. Use: ${contract.acceptedExtensions.join(', ')}.`
    });
  }

  if(!rows.length){
    messages.push({ type: 'error', text: 'El archivo no tiene filas de datos.' });
    return { ok: false, messages, acceptedRows: [], rejectedRows: [] };
  }

  const columns = Object.keys(rows[0] || {});
  const missing = contract.requiredColumns.filter(column => !columns.includes(column));
  if(missing.length){
    messages.push({
      type: 'error',
      text: `Faltan columnas obligatorias: ${missing.join(', ')}.`
    });
  }

  const rejectedRows = [];
  const acceptedRows = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const problems = validateRow({ row, rowNumber, contract });

    if(problems.length){
      rejectedRows.push({
        rowNumber,
        reason: problems.join(' | '),
        row
      });
      return;
    }

    acceptedRows.push(normalizeRow(row, contract));
  });

  if(rejectedRows.length){
    messages.push({
      type: 'warn',
      text: `${rejectedRows.length} fila(s) rechazadas. Revise el detalle por fila antes de usar el archivo.`
    });
  }

  if(!missing.length && acceptedRows.length){
    messages.push({
      type: 'ok',
      text: `${acceptedRows.length} fila(s) listas para cargar como ${contract.label}.`
    });
  }

  if(!acceptedRows.length){
    messages.push({
      type: 'error',
      text: 'Ninguna fila cumple el contrato. El tablero no cargara este archivo.'
    });
  }

  return {
    ok: !messages.some(message => message.type === 'error'),
    messages,
    acceptedRows,
    rejectedRows
  };
}

function validateRow({ row, contract }){
  const problems = [];

  contract.requiredColumns.forEach(column => {
    if(isBlank(row[column])) problems.push(`Falta ${column}`);
  });

  if(problems.length) return problems;

  validateKnownSite(row, problems);
  validateEnums(row, contract, problems);
  validateDates(row, contract, problems);
  validateNumbers(row, contract, problems);
  validateInventoryMath(row, contract, problems);
  validateBudgetMath(row, contract, problems);
  validateRevenueThresholds(row, contract, problems);

  return problems;
}

function validateKnownSite(row, problems){
  if(!row.sede) return;
  const site = findSiteByName(row.sede);
  if(!site){
    problems.push(`Sede no reconocida: ${row.sede}`);
    return;
  }

  if(row.tipo_sede){
    const expected = site.kind;
    const received = normalizeToken(row.tipo_sede);
    if(expected && received !== expected){
      problems.push(`tipo_sede debe ser ${expected} para ${site.name}`);
    }
  }
}

function validateEnums(row, contract, problems){
  Object.entries(contract.enumColumns || {}).forEach(([column, allowed]) => {
    if(isBlank(row[column])) return;
    const value = normalizeToken(row[column]);
    if(!allowed.includes(value)){
      problems.push(`${column} invalido: ${row[column]} (use ${allowed.join(', ')})`);
    }
  });

  if(row.tipo_sede && row.tipo_unidad){
    const siteType = SITE_TYPES[normalizeToken(row.tipo_sede)];
    if(siteType && !siteType.unitTypes.includes(normalizeToken(row.tipo_unidad))){
      problems.push(`tipo_unidad ${row.tipo_unidad} no corresponde a ${siteType.label}`);
    }
  }
}

function validateDates(row, contract, problems){
  (contract.dateColumns || []).forEach(column => {
    if(isBlank(row[column])) return;
    if(!isValidDate(row[column])) problems.push(`${column} debe venir como AAAA-MM-DD`);
  });

  if(row.periodo && !PERIOD_RE.test(String(row.periodo).trim())){
    problems.push('periodo debe venir como AAAA-MM');
  }
}

function validateNumbers(row, contract, problems){
  (contract.numericColumns || []).forEach(column => {
    if(isBlank(row[column])) return;
    const value = toNumber(row[column]);
    if(!Number.isFinite(value)) problems.push(`${column} debe ser numerico`);
    if(Number.isFinite(value) && value < 0) problems.push(`${column} no puede ser negativo`);
  });

  (contract.percentageColumns || []).forEach(column => {
    if(isBlank(row[column])) return;
    const value = toNumber(row[column]);
    if(Number.isFinite(value) && (value < 0 || value > 100)){
      problems.push(`${column} debe estar entre 0 y 100`);
    }
  });
}

function validateInventoryMath(row, contract, problems){
  if(contract.id !== 'occupancyInventory') return;
  const total = toNumber(row.inventario_total);
  const occupied = toNumber(row.unidades_ocupadas);
  const free = toNumber(row.unidades_libres);
  const blocked = isBlank(row.unidades_bloqueadas) ? 0 : toNumber(row.unidades_bloqueadas);
  const pct = toNumber(row.ocupacion_porcentaje);

  if([total, occupied, free, blocked, pct].some(value => !Number.isFinite(value))) return;
  if(total <= 0){
    problems.push('inventario_total debe ser mayor que cero');
    return;
  }
  if(occupied + free + blocked !== total){
    problems.push('inventario_total debe ser igual a ocupadas + libres + bloqueadas');
  }

  const expectedPct = roundTwo((occupied / total) * 100);
  if(Math.abs(expectedPct - roundTwo(pct)) > 0.5){
    problems.push(`ocupacion_porcentaje no cuadra con unidades_ocupadas/inventario_total (${expectedPct}%)`);
  }
}

function validateBudgetMath(row, contract, problems){
  if(contract.id !== 'budgetExecution') return;
  if(isBlank(row.cumplimiento_porcentaje) || isBlank(row.presupuesto) || isBlank(row.ejecutado)) return;
  const budget = toNumber(row.presupuesto);
  const executed = toNumber(row.ejecutado);
  const pct = toNumber(row.cumplimiento_porcentaje);
  if(!Number.isFinite(budget) || !Number.isFinite(executed) || !Number.isFinite(pct) || budget <= 0) return;

  const expectedPct = roundTwo((executed / budget) * 100);
  if(Math.abs(expectedPct - roundTwo(pct)) > 0.5){
    problems.push(`cumplimiento_porcentaje no cuadra con ejecutado/presupuesto (${expectedPct}%)`);
  }
}

function validateRevenueThresholds(row, contract, problems){
  if(contract.id !== 'revenueRules') return;
  const min = toNumber(row.umbral_min);
  const max = toNumber(row.umbral_max);
  if(!Number.isFinite(min) || !Number.isFinite(max)) return;
  if(min > max) problems.push('umbral_min no puede ser mayor que umbral_max');
}

function normalizeRow(row, contract){
  const normalized = { ...row };
  (contract.numericColumns || []).forEach(column => {
    if(!isBlank(normalized[column])) normalized[column] = toNumber(normalized[column]);
  });
  Object.keys(contract.enumColumns || {}).forEach(column => {
    if(!isBlank(normalized[column])) normalized[column] = normalizeToken(normalized[column]);
  });
  if(normalized.sede){
    const site = findSiteByName(normalized.sede);
    if(site) normalized.sede = site.name;
  }
  normalized._loadedContract = contract.id;
  return normalized;
}

function isBlank(value){
  return value === undefined || value === null || String(value).trim() === '';
}

function isValidDate(value){
  const text = String(value || '').trim();
  if(!DATE_RE.test(text)) return false;
  const date = new Date(`${text}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text;
}

function normalizeToken(value){
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function toNumber(value){
  if(typeof value === 'number') return value;
  const text = String(value || '').trim();
  const normalized = text.includes(',')
    ? text.replace(/\./g, '').replace(',', '.')
    : text.replace(/,/g, '');
  return Number(normalized);
}

function roundTwo(value){
  return Math.round(value * 100) / 100;
}
