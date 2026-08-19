import { parseCSV } from './csv.js';
import { parseZeusForecastText } from './zeus-forecast-parser.js';

export async function readStructuredFile(file, contractId){
  const extension = getExtension(file.name);

  if(extension === '.json'){
    const text = await file.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : parsed.rows || [];
  }

  if(extension === '.csv'){
    const text = await file.text();
    return parseCSV(text);
  }

  if(extension === '.pdf' && contractId === 'occupancyInventory'){
    const text = await extractPDFText(file);
    const parsed = parseZeusForecastText(text);
    if(!parsed.rows.length){
      throw new Error('No se detectaron filas diarias de Zeus en el PDF.');
    }
    return parsed.rows;
  }

  if(extension === '.pdf'){
    throw new Error('PDF solo esta habilitado para ocupacion e inventario Zeus.');
  }

  throw new Error(`Formato no soportado todavia: ${extension}`);
}

export function getExtension(filename){
  const match = String(filename || '').toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : '';
}

async function extractPDFText(file){
  const pdfjs = await import('../../vendor/pdfjs/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('../../vendor/pdfjs/pdf.worker.mjs', import.meta.url).toString();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];

  for(let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1){
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(textItemsToLines(content.items));
  }

  return pages.join('\n');
}

function textItemsToLines(items){
  const lines = [];
  items.forEach(item => {
    const transform = item.transform || [];
    const x = transform[4] || 0;
    const y = transform[5] || 0;
    let line = lines.find(candidate => Math.abs(candidate.y - y) < 2);
    if(!line){
      line = { y, items: [] };
      lines.push(line);
    }
    line.items.push({ x, text: item.str || '' });
  });

  return lines
    .sort((a, b) => b.y - a.y)
    .map(line => line.items.sort((a, b) => a.x - b.x).map(item => item.text).join(' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('\n');
}
