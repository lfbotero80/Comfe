import { appState } from '../state/app-state.js';
import { getContract } from '../domain/data-contracts.js';
import { getExtension } from '../services/file-reader.js';
import { downloadCSV, toCSV } from '../services/csv-export.js';
import { badge, escapeHTML } from './html.js';

/**
 * Historial de cargas de archivos (SPRINT-41).
 *
 * No captura datos nuevos: `appState.loadedFiles` ya venia guardando fecha,
 * nombre, contrato, responsable y filas aceptadas/rechazadas, y persiste en
 * `localStorage` desde `SPRINT-35`. Lo unico que faltaba era mostrarlo.
 *
 * "Tipo" se muestra en sus dos sentidos, porque ambos sirven para auditar:
 * el **contrato** (que dato alimenta: ocupacion, presupuesto o Revenue) y el
 * **formato** del archivo (.pdf / .csv / .json), derivado del nombre — no se
 * guarda como campo aparte para que el historial ya existente tambien lo tenga.
 */
export function renderLoadHistoryPanel(){
  const entries = historyEntries();

  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Historial de cargas</h2>
          <p class="metric-note">Cada archivo cargado en este navegador: cuando, que archivo, que tipo de dato alimenta y quien lo subio.</p>
        </div>
        <button type="button" class="btn-ghost" id="btnExportLoadHistory" ${entries.length ? '' : 'disabled'}>Exportar historial CSV</button>
      </div>
      ${entries.length ? renderTable(entries) : renderEmpty()}
    </section>
  `;
}

export function bindLoadHistoryHandlers(){
  const button = document.getElementById('btnExportLoadHistory');
  if(!button) return;
  button.addEventListener('click', () => {
    const headers = ['Fecha', 'Hora', 'Archivo', 'Formato', 'Tipo de dato', 'Responsable', 'Filas aceptadas', 'Filas rechazadas'];
    const rows = historyEntries().map(entry => [
      entry.date,
      entry.time,
      entry.filename,
      entry.format,
      entry.contractLabel,
      entry.loadedBy,
      entry.acceptedRows,
      entry.rejectedRows
    ]);
    downloadCSV(`comfenalco-historial-cargas-${new Date().toISOString().slice(0, 10)}.csv`, toCSV(headers, rows));
  });
}

function historyEntries(){
  return (appState.loadedFiles || [])
    .map(file => {
      const contract = getContract(file.contractId);
      const stamp = parseStamp(file.loadedAt);
      return {
        loadedAt: file.loadedAt || '',
        date: stamp.date,
        time: stamp.time,
        filename: file.filename || 'Archivo sin nombre',
        format: getExtension(file.filename) || 'sin extension',
        contractLabel: contract ? contract.label : (file.contractId || 'Contrato no reconocido'),
        loadedBy: file.loadedBy || 'Sin responsable definido',
        acceptedRows: Number(file.acceptedRows) || 0,
        rejectedRows: Number(file.rejectedRows) || 0
      };
    })
    // Mas reciente arriba.
    .sort((a, b) => String(b.loadedAt).localeCompare(String(a.loadedAt)));
}

function parseStamp(value){
  if(!value) return { date: 'Sin fecha', time: '' };
  const parsed = new Date(value);
  if(Number.isNaN(parsed.getTime())) return { date: String(value), time: '' };
  return {
    date: parsed.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: parsed.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  };
}

function renderTable(entries){
  return `
    <div class="table-wrap">
      <table class="data-table compact-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Archivo</th>
            <th>Formato</th>
            <th>Tipo de dato</th>
            <th>Responsable</th>
            <th>Filas</th>
          </tr>
        </thead>
        <tbody>
          ${entries.map(renderRow).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderRow(entry){
  return `
    <tr>
      <td>
        <strong>${escapeHTML(entry.date)}</strong>
        ${entry.time ? `<span class="cell-note">${escapeHTML(entry.time)}</span>` : ''}
      </td>
      <td>${escapeHTML(entry.filename)}</td>
      <td><span class="format-chip">${escapeHTML(entry.format)}</span></td>
      <td>${escapeHTML(entry.contractLabel)}</td>
      <td>${escapeHTML(entry.loadedBy)}</td>
      <td>
        ${badge(`${entry.acceptedRows} aceptadas`, entry.acceptedRows ? 'green' : 'gray')}
        ${entry.rejectedRows ? badge(`${entry.rejectedRows} rechazadas`, 'amber') : ''}
      </td>
    </tr>
  `;
}

function renderEmpty(){
  return `
    <div class="empty-state">
      <strong>Todavia no se ha cargado ningun archivo en este navegador.</strong>
      <span>Cada carga quedara registrada aqui con su fecha, archivo, tipo y responsable.</span>
    </div>
  `;
}
