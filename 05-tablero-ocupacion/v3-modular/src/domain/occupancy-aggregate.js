/**
 * Agregacion de ocupacion sobre un conjunto de filas diarias.
 *
 * Regla de calculo (SPRINT-39): la ocupacion de un periodo es
 * `sum(unidades_ocupadas) / sum(inventario_total)`, **no** el promedio simple
 * de los porcentajes diarios. Cuando el inventario cambia entre dias (bloqueos,
 * mantenimiento, cierre parcial), el promedio simple sobre o subestima la
 * ocupacion real. Ejemplo: 10/100 un dia y 9/10 otro dia da 50% como promedio
 * simple, pero la ocupacion real del periodo es 19/110 = 17.3%.
 *
 * Ademas devuelve siempre la cobertura del calculo (dias contados, meses,
 * rango de fechas y filas descartadas) para que ninguna pantalla presente una
 * cifra parcial como si fuera el periodo completo.
 */
export function aggregateOccupancy(rows){
  const valid = [];
  let ignored = 0;

  (rows || []).forEach(row => {
    const occupied = Number(row.unidades_ocupadas);
    const inventory = Number(row.inventario_total);
    if(!Number.isFinite(occupied) || !Number.isFinite(inventory) || inventory <= 0 || occupied < 0){
      ignored += 1;
      return;
    }
    valid.push({ row, occupied, inventory });
  });

  if(!valid.length){
    return {
      hasData: false,
      pct: null,
      occupied: 0,
      inventory: 0,
      days: 0,
      ignoredRows: ignored,
      months: [],
      monthsCovered: 0,
      firstDate: null,
      lastDate: null,
      byMonth: []
    };
  }

  const occupied = valid.reduce((sum, item) => sum + item.occupied, 0);
  const inventory = valid.reduce((sum, item) => sum + item.inventory, 0);
  const dates = valid.map(item => String(item.row.fecha)).filter(Boolean).sort();
  const byMonth = aggregateByMonth(valid);

  return {
    hasData: true,
    pct: (occupied / inventory) * 100,
    occupied,
    inventory,
    days: valid.length,
    ignoredRows: ignored,
    months: byMonth.map(month => month.month),
    monthsCovered: byMonth.length,
    firstDate: dates[0] || null,
    lastDate: dates[dates.length - 1] || null,
    byMonth
  };
}

function aggregateByMonth(valid){
  const buckets = new Map();
  valid.forEach(item => {
    const month = String(item.row.fecha || '').slice(0, 7);
    if(!month) return;
    const bucket = buckets.get(month) || { month, occupied: 0, inventory: 0, days: 0 };
    bucket.occupied += item.occupied;
    bucket.inventory += item.inventory;
    bucket.days += 1;
    buckets.set(month, bucket);
  });
  return [...buckets.values()]
    .map(bucket => ({ ...bucket, pct: bucket.inventory ? (bucket.occupied / bucket.inventory) * 100 : null }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/** Mes con mayor y menor ocupacion real dentro del periodo agregado. */
export function monthExtremes(byMonth){
  const withPct = (byMonth || []).filter(month => month.pct !== null);
  if(withPct.length < 2) return null;
  const sorted = withPct.slice().sort((a, b) => a.pct - b.pct);
  return { lowest: sorted[0], highest: sorted[sorted.length - 1] };
}

/**
 * Etiqueta de cobertura honesta para acompanar cualquier cifra agregada.
 * Nunca presenta el dato como "el mes" o "el ano" completo: dice exactamente
 * sobre cuantos dias cargados se calculo.
 */
export function coverageLabel(aggregate){
  if(!aggregate || !aggregate.hasData) return 'Sin dias cargados';
  const days = `${aggregate.days} dia${aggregate.days === 1 ? '' : 's'} cargado${aggregate.days === 1 ? '' : 's'}`;
  if(aggregate.monthsCovered > 1) return `${days} · ${aggregate.monthsCovered} meses`;
  return days;
}
