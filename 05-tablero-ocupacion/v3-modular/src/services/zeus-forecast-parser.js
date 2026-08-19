const ZEUS_SITE_MAP = [
  { pattern: /HOTEL HACIENDA BALANDU/i, site:'Hacienda Balandu' },
  { pattern: /RECINTO QUIRAMA/i, site:'Recinto Quirama' },
  { pattern: /HOTEL PIEDRAS BLANCAS/i, site:'Hotel Piedras Blancas' },
  { pattern: /HOSTERIA LOS FARALLONES/i, site:'Hosteria Los Farallones' }
];

export function parseZeusForecastText(text){
  const sourceText = String(text || '');
  const site = detectZeusSite(sourceText);
  const cutDate = normalizeZeusDate(matchValue(sourceText, /Corte\s*:\s*(\d{4}\.\d{2}\.\d{2})/i));
  const reportDate = normalizeZeusDate(matchValue(sourceText, /Fecha\s*:\s*(\d{4}\.\d{2}\.\d{2})/i));
  const rows = [];

  sourceText.split(/\r?\n/).forEach(line => {
    const match = line.match(/(\d{4}\.\d{2}\.\d{2})-[A-ZÁÉÍÓÚÑ]{2}\s+(.+)/i);
    if(!match) return;

    const tokens = match[2].trim().split(/\s+/);
    const numbers = tokens.map(value => Number(value.replace(',', '.')));
    const pctIndex = tokens.findIndex((token, index) => {
      const value = numbers[index];
      return /^\d{1,3}[.,]\d{2}$/.test(token) && Number.isFinite(value) && value >= 0 && value <= 100;
    });
    if(pctIndex < 2) return;

    const available = numbers[pctIndex - 2];
    const occupied = numbers[pctIndex - 1];
    const occupancy = numbers[pctIndex];
    if(!Number.isFinite(available) || !Number.isFinite(occupied)) return;

    rows.push({
      sede: site || 'Sede no identificada',
      tipo_sede: 'hotel',
      tipo_unidad: 'habitacion',
      fecha: normalizeZeusDate(match[1]),
      inventario_total: String(available + occupied),
      unidades_ocupadas: String(occupied),
      unidades_libres: String(available),
      ocupacion_porcentaje: occupancy.toFixed(2),
      fuente: 'Zeus Forecast PDF',
      fecha_corte: cutDate || reportDate || ''
    });
  });

  return {
    site,
    cutDate,
    reportDate,
    rows
  };
}

export function detectZeusSite(text){
  const sourceText = String(text || '');
  const match = ZEUS_SITE_MAP.find(item => item.pattern.test(sourceText));
  return match ? match.site : '';
}

function matchValue(text, pattern){
  const match = String(text || '').match(pattern);
  return match ? match[1] : '';
}

function normalizeZeusDate(value){
  return value ? String(value).replaceAll('.', '-') : '';
}
