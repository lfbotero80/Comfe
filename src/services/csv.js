export function parseCSV(text){
  const rows = [];
  let row = [];
  let cell = '';
  let insideQuotes = false;

  for(let i = 0; i < text.length; i += 1){
    const char = text[i];
    const next = text[i + 1];

    if(char === '"' && insideQuotes && next === '"'){
      cell += '"';
      i += 1;
      continue;
    }
    if(char === '"'){
      insideQuotes = !insideQuotes;
      continue;
    }
    if((char === ';' || char === ',') && !insideQuotes){
      row.push(cell.trim());
      cell = '';
      continue;
    }
    if((char === '\n' || char === '\r') && !insideQuotes){
      if(char === '\r' && next === '\n') i += 1;
      row.push(cell.trim());
      if(row.some(Boolean)) rows.push(row);
      row = [];
      cell = '';
      continue;
    }
    cell += char;
  }

  row.push(cell.trim());
  if(row.some(Boolean)) rows.push(row);
  if(!rows.length) return [];

  const headers = rows[0].map(normalizeHeader);
  return rows.slice(1).map(values => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? '';
    });
    return record;
  });
}

export function normalizeHeader(value){
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}
