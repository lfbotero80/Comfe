export const HOTELS = [
  { id: 'farallones_hosteria', name: 'Hosteria Los Farallones', kind: 'hotel', defaultUnitType: 'habitacion', role: 'Retencion de afiliado recurrente', capacity: 48 },
  { id: 'quirama', name: 'Recinto Quirama', kind: 'hotel', defaultUnitType: 'habitacion', role: 'Corporativo/eventos; individual complementario', capacity: null },
  { id: 'piedras_blancas_hotel', name: 'Hotel Piedras Blancas', kind: 'hotel', defaultUnitType: 'habitacion', role: 'Bienestar y salud mental', capacity: null },
  { id: 'balandu', name: 'Hacienda Balandu', kind: 'hotel', defaultUnitType: 'habitacion', role: 'Destino y experiencia', capacity: null }
];

export const PARKS = [
  { id: 'farallones_camping', name: 'Camping Los Farallones', kind: 'parque', defaultUnitType: 'sitio', role: 'Escapada operativa, grupos y calendario escolar/laboral' },
  { id: 'piedras_blancas_parque', name: 'Parque Piedras Blancas', kind: 'parque', defaultUnitType: 'cupo', role: 'Pausa activa de dia' },
  { id: 'mario_aramburo', name: 'Ecoparque Mario Aramburo', kind: 'parque', defaultUnitType: 'cupo', role: 'Recurrencia joven' },
  { id: 'salados', name: 'Parque Ecologico Los Salados', kind: 'parque', defaultUnitType: 'cupo', role: 'Pasadia familiar y empresarial' },
  { id: 'tamarindos', name: 'Parque Los Tamarindos', kind: 'parque', defaultUnitType: 'cupo', role: 'Pasadia y eventos por validar' }
];

export function findSiteByName(name){
  const normalized = normalizeName(name);
  return [...HOTELS, ...PARKS].find(site => normalizeName(site.name) === normalized) || null;
}

export function normalizeName(value){
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
