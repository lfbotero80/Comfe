import { downloadCSV, toCSV } from './csv-export.js';

const HEADERS = [
  'Sede',
  'Tipo sede',
  'Tipo unidad',
  'Fecha',
  'Inventario total',
  'Unidades ocupadas/usadas',
  'Unidades libres',
  '% Ocupacion/uso',
  'Fuente',
  'Fecha corte'
];

export function exportOccupancyRows(rows, filenamePrefix){
  const csvRows = rows.map(row => [
    row.sede,
    row.tipo_sede,
    row.tipo_unidad,
    row.fecha,
    row.inventario_total,
    row.unidades_ocupadas,
    row.unidades_libres,
    row.ocupacion_porcentaje,
    row.fuente || '',
    row.fecha_corte || ''
  ]);
  const csv = toCSV(HEADERS, csvRows);
  downloadCSV(`${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}

export function occupancyRowsBySite(rows, siteName){
  return rows
    .filter(row => row.sede === siteName)
    .slice()
    .sort(compareOccupancyRows);
}

export function occupancyRowsByType(rows, siteType){
  return rows
    .filter(row => row.tipo_sede === siteType)
    .slice()
    .sort(compareOccupancyRows);
}

export function sortedOccupancyRows(rows){
  return rows.slice().sort(compareOccupancyRows);
}

export function slug(value){
  return String(value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function compareOccupancyRows(a, b){
  return String(a.sede).localeCompare(String(b.sede))
    || String(a.tipo_unidad).localeCompare(String(b.tipo_unidad))
    || String(a.fecha).localeCompare(String(b.fecha));
}
