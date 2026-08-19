import { listContracts } from '../../domain/data-contracts.js';
import { readStructuredFile } from '../../services/file-reader.js';
import { validateFileRows } from '../../services/validators.js';
import { registerLoad } from '../../state/app-state.js';
import { escapeHTML } from '../html.js';

export function renderDataLoad(){
  return `
    <section class="panel">
      <h2>Carga por archivo</h2>
      <p class="metric-note">Suba archivos normalizados de ocupacion, presupuesto o reglas de Revenue. El tablero valida la estructura antes de incorporar la informacion al seguimiento.</p>
    </section>
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Archivos Zeus por hotel</h2>
          <p class="metric-note">Zeus exporta un PDF por sede. El tablero debe convertir cada reporte a filas diarias del contrato de ocupacion e inventario.</p>
        </div>
      </div>
      <div class="grid four">
        ${zeusStep('1', 'Identificar sede', 'Titulo del PDF: Hacienda Balandu, Recinto Quirama, Hotel Piedras Blancas o Hosteria Los Farallones.')}
        ${zeusStep('2', 'Leer corte', 'Campo Corte del reporte; queda como fecha_corte para trazabilidad.')}
        ${zeusStep('3', 'Tomar filas diarias', 'Cada fecha trae habitaciones disponibles, ocupadas y porcentaje de ocupacion.')}
        ${zeusStep('4', 'Normalizar', 'La salida queda en occupancyInventory: sede, fecha, total, ocupadas, libres, porcentaje y fuente.')}
      </div>
      <div class="validation-item warn">Carga directa de PDF en navegador: pendiente de incorporar extractor PDF local. Hoy la carga confiable sigue siendo CSV/JSON normalizado.</div>
    </section>
    <div class="upload-grid">
      ${listContracts().map(contract => uploadCard(contract)).join('')}
    </div>
  `;
}

export function bindDataLoadHandlers({ setStatus }){
  document.querySelectorAll('[data-file-contract]').forEach(input => {
    input.addEventListener('change', async event => {
      const file = event.target.files[0];
      const contractId = event.target.dataset.fileContract;
      const resultTarget = document.querySelector(`[data-validation-result="${contractId}"]`);
      if(!file) return;

      resultTarget.innerHTML = `<div class="validation-item pending">Leyendo ${escapeHTML(file.name)}...</div>`;
      setStatus(`Leyendo ${file.name}...`, 'pending');

      try{
        const rows = await readStructuredFile(file, contractId);
        const validation = validateFileRows({ file, rows, contractId });
        resultTarget.innerHTML = renderValidation(validation);

        if(validation.ok){
          registerLoad({
            contractId,
            filename: file.name,
            acceptedRows: validation.acceptedRows,
            rejectedRows: validation.rejectedRows
          });
          const withWarnings = validation.rejectedRows.length ? ` (${validation.rejectedRows.length} fila(s) rechazadas)` : '';
          setStatus(`${file.name}: ${validation.acceptedRows.length} fila(s) cargadas${withWarnings}`, validation.rejectedRows.length ? 'warn' : 'ok');
        }else{
          setStatus(`${file.name}: no se cargo. Revise el detalle abajo.`, 'error');
        }
      }catch(error){
        resultTarget.innerHTML = `<div class="validation-item error">${escapeHTML(error.message)}</div>`;
        setStatus(`${file.name}: archivo no compatible`, 'error');
      }finally{
        event.target.value = '';
      }
    });
  });
}

function uploadCard(contract){
  return `
    <article class="upload-card">
      <div class="contract-head">
        <h3>${escapeHTML(contract.label)}</h3>
        <a href="${escapeHTML(contract.templatePath)}" download>Descargar plantilla</a>
      </div>
      <p class="metric-note">${escapeHTML(contract.businessUse)}</p>
      <dl class="contract-meta">
        <div><dt>Grano</dt><dd>${escapeHTML(contract.grain)}</dd></div>
        <div><dt>Fuente esperada</dt><dd>${escapeHTML(contract.source)}</dd></div>
      </dl>
      <input type="file" data-file-contract="${contract.id}" accept="${contract.acceptedExtensions.join(',')}">
      <div class="field-hint">Formatos: ${contract.acceptedExtensions.join(', ')}. Columnas obligatorias para CSV/JSON: ${contract.requiredColumns.join(', ')}.</div>
      <div class="validation" data-validation-result="${contract.id}"></div>
    </article>
  `;
}

function zeusStep(number, title, note){
  return `
    <div class="zeus-step">
      <strong>${escapeHTML(number)}</strong>
      <span>${escapeHTML(title)}</span>
      <p>${escapeHTML(note)}</p>
    </div>
  `;
}

function renderValidation(validation){
  const messages = validation.messages.map(message => `
    <div class="validation-item ${message.type}">${escapeHTML(message.text)}</div>
  `).join('');

  if(!validation.rejectedRows.length) return messages;

  const rejected = validation.rejectedRows.slice(0, 8).map(row => `
    <tr>
      <td>${row.rowNumber}</td>
      <td>${escapeHTML(row.reason)}</td>
    </tr>
  `).join('');
  const extra = validation.rejectedRows.length > 8
    ? `<p class="metric-note">Se muestran las primeras 8 filas rechazadas de ${validation.rejectedRows.length}.</p>`
    : '';

  return `
    ${messages}
    <table class="contract-table">
      <thead><tr><th>Fila</th><th>Error</th></tr></thead>
      <tbody>${rejected}</tbody>
    </table>
    ${extra}
  `;
}
