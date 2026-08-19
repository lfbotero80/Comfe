import { downloadCSV, toCSV } from './csv-export.js';

const HEADERS = [
  'Sede',
  'Periodo',
  'Presupuesto',
  'Ppto Empresarial',
  'Ppto Individual',
  'Ejecutado',
  'Ejec Empresarial',
  'Ejec Individual',
  '% Cumplimiento',
  'Dato confiable',
  'Fuente',
  'Fecha corte',
  'Observaciones'
];

export function exportBudgetRows(rows, filenamePrefix){
  const csvRows = rows.map(row => {
    const confiable = row.dato_confiable !== 'no';
    const pct = (confiable && Number(row.presupuesto))
      ? ((Number(row.ejecutado) / Number(row.presupuesto)) * 100).toFixed(1)
      : '';
    return [
      row.sede,
      row.periodo,
      Math.round(Number(row.presupuesto)) || 0,
      row.presupuesto_empresarial ? Math.round(Number(row.presupuesto_empresarial)) : '',
      row.presupuesto_individual ? Math.round(Number(row.presupuesto_individual)) : '',
      confiable ? (Math.round(Number(row.ejecutado)) || 0) : 'Pendiente de validar',
      row.ejecutado_empresarial ? Math.round(Number(row.ejecutado_empresarial)) : '',
      row.ejecutado_individual ? Math.round(Number(row.ejecutado_individual)) : '',
      pct,
      row.dato_confiable || '',
      row.fuente || '',
      row.fecha_corte || '',
      row.observaciones || ''
    ];
  });
  downloadCSV(`${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(HEADERS, csvRows));
}

export function budgetRowsForSites(budgetRows, sites){
  const names = new Set(sites.map(site => site.name));
  return budgetRows
    .filter(row => names.has(row.sede))
    .slice()
    .sort(compareBudgetRows);
}

export function sortedBudgetRows(budgetRows){
  return budgetRows.slice().sort(compareBudgetRows);
}

function compareBudgetRows(a, b){
  return String(a.sede).localeCompare(String(b.sede))
    || String(a.periodo).localeCompare(String(b.periodo));
}
