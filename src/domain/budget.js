import { HOTELS, PARKS } from './sites.js';

export const BUDGET_MONTHS = [
  ['2026-01', 'Enero'],
  ['2026-02', 'Febrero'],
  ['2026-03', 'Marzo'],
  ['2026-04', 'Abril'],
  ['2026-05', 'Mayo'],
  ['2026-06', 'Junio'],
  ['2026-07', 'Julio'],
  ['2026-08', 'Agosto'],
  ['2026-09', 'Septiembre'],
  ['2026-10', 'Octubre'],
  ['2026-11', 'Noviembre'],
  ['2026-12', 'Diciembre']
];

export function monthName(periodo){
  return BUDGET_MONTHS.find(([value]) => value === periodo)?.[1] || periodo;
}

export function budgetSites(){
  return HOTELS.concat(PARKS);
}

export function formatCOP(value){
  const numeric = Number(value);
  if(!numeric) return '$0';
  return `$${Math.round(numeric).toLocaleString('es-CO')}`;
}

export function budgetSeverity(pct){
  return pct >= 90 ? 'green' : pct >= 70 ? 'amber' : 'red';
}

export function siteRowsSorted(budgetRows, sede){
  return budgetRows
    .filter(row => row.sede === sede)
    .slice()
    .sort((a, b) => String(a.periodo).localeCompare(String(b.periodo)));
}

/**
 * mode: 'latest' (ultimo periodo cargado) | 'accumulated' (suma de todos los
 * periodos cargados) | '2026-01'..'2026-12' (un mes especifico).
 */
export function summarizeSite(sede, rows, mode){
  if(!rows.length) return emptySummary(sede);

  if(mode === 'accumulated'){
    const reliableRows = rows.filter(row => row.dato_confiable !== 'no');
    const hasUnreliable = rows.some(row => row.dato_confiable === 'no');
    const presupuesto = sumField(rows, 'presupuesto');
    const ejecutado = sumField(reliableRows, 'ejecutado');
    const pct = presupuesto ? (ejecutado / presupuesto) * 100 : 0;
    return {
      sede, hasData: true, confiable: !hasUnreliable,
      presupuesto, ejecutado,
      presupuestoEmp: sumField(rows, 'presupuesto_empresarial'),
      presupuestoInd: sumField(rows, 'presupuesto_individual'),
      ejecutadoEmp: sumField(reliableRows, 'ejecutado_empresarial'),
      ejecutadoInd: sumField(reliableRows, 'ejecutado_individual'),
      pct, severity: budgetSeverity(pct),
      periodoLabel: `${rows.length} periodo(s) cargados`,
      periodosCount: rows.length
    };
  }

  const row = mode === 'latest' ? rows[rows.length - 1] : rows.find(item => item.periodo === mode);
  if(!row) return emptySummary(sede);

  const confiable = row.dato_confiable !== 'no';
  const presupuesto = Number(row.presupuesto) || 0;
  const ejecutado = confiable ? (Number(row.ejecutado) || 0) : null;
  const pct = (confiable && presupuesto) ? (ejecutado / presupuesto) * 100 : 0;
  return {
    sede, hasData: true, confiable,
    presupuesto, ejecutado,
    presupuestoEmp: numOrNull(row.presupuesto_empresarial),
    presupuestoInd: numOrNull(row.presupuesto_individual),
    ejecutadoEmp: confiable ? numOrNull(row.ejecutado_empresarial) : null,
    ejecutadoInd: confiable ? numOrNull(row.ejecutado_individual) : null,
    pct, severity: confiable ? budgetSeverity(pct) : 'gray',
    periodoLabel: monthName(row.periodo),
    periodosCount: 1,
    observaciones: row.observaciones || ''
  };
}

function emptySummary(sede){
  return {
    sede, hasData: false, confiable: true,
    presupuesto: 0, ejecutado: null,
    presupuestoEmp: null, presupuestoInd: null, ejecutadoEmp: null, ejecutadoInd: null,
    pct: 0, severity: 'gray', periodoLabel: 'Sin dato', periodosCount: 0
  };
}

function sumField(rows, field){
  return rows.reduce((sum, row) => sum + (Number(row[field]) || 0), 0);
}

function numOrNull(value){
  if(value === undefined || value === null || value === '') return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}
