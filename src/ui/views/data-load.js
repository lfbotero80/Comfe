import { listContracts } from '../../domain/data-contracts.js';
import { buildReadinessSummary } from '../../domain/data-readiness.js';
import { readStructuredFile } from '../../services/file-reader.js';
import { exportOccupancyRows, sortedOccupancyRows } from '../../services/occupancy-export.js';
import { validateFileRows } from '../../services/validators.js';
import { appState, DATA_MODES, registerLoad, setCurrentOperator, setDataMode } from '../../state/app-state.js';
import { badge, escapeHTML } from '../html.js';

export function renderDataLoad(){
  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Carga por archivo</h2>
          <p class="metric-note">Suba archivos normalizados de ocupacion, presupuesto o reglas de Revenue. El tablero valida la estructura antes de incorporar la informacion al seguimiento.</p>
        </div>
        <button type="button" class="btn-ghost" id="btnExportOccupancyAll" ${appState.occupancyInventoryRows.length ? '' : 'disabled'}>Exportar ocupacion CSV</button>
      </div>
      <div class="data-load-controls">
        ${renderDataModeControl()}
        ${renderResponsibleControl()}
      </div>
    </section>
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Estado de informacion por sede</h2>
          <p class="metric-note">Control operativo de fuentes cargadas: ocupacion/inventario, presupuesto y reglas de Revenue.</p>
        </div>
      </div>
      <div id="readinessSummary">
        ${renderReadinessSummary()}
      </div>
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
      <div class="validation-item ok">Los PDFs Zeus se pueden subir directamente en Ocupacion e inventario diario; el tablero extrae sede, corte y filas diarias cuando el formato coincide con el forecast esperado.</div>
    </section>
    <div class="upload-grid">
      ${listContracts().map(contract => uploadCard(contract)).join('')}
    </div>
  `;
}

export function bindDataLoadHandlers({ rerender, setStatus }){
  const exportAllBtn = document.getElementById('btnExportOccupancyAll');
  if(exportAllBtn){
    exportAllBtn.addEventListener('click', () => {
      exportOccupancyRows(sortedOccupancyRows(appState.occupancyInventoryRows), 'comfenalco-ocupacion-todas-las-sedes');
    });
  }

  document.querySelectorAll('[data-mode-option]').forEach(button => {
    button.addEventListener('click', () => {
      const mode = button.dataset.modeOption;
      if(mode === appState.dataMode) return;
      setDataMode(mode);
      const status = mode === DATA_MODES.real.id
        ? 'Modo datos reales: cargue archivos para activar metricas.'
        : 'Modo demo: datos semilla restaurados.';
      setStatus(status, mode === DATA_MODES.real.id ? 'pending' : 'ok');
      rerender();
    });
  });

  const responsibleForm = document.querySelector('[data-responsible-form]');
  if(responsibleForm){
    responsibleForm.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(responsibleForm);
      const name = String(data.get('responsible') || '').trim();
      setCurrentOperator(name);
      setStatus(name ? `Responsable activo: ${name}` : 'Responsable de carga sin definir.', name ? 'ok' : 'warn');
      rerender();
    });
  }

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
          refreshReadinessSummary();
          if(contractId === 'occupancyInventory') exportAllBtn.disabled = !appState.occupancyInventoryRows.length;
          const withWarnings = validation.rejectedRows.length ? ` (${validation.rejectedRows.length} fila(s) rechazadas)` : '';
          const responsible = appState.currentOperator || 'sin responsable definido';
          setStatus(`${file.name}: ${validation.acceptedRows.length} fila(s) cargadas${withWarnings} · ${responsible}`, validation.rejectedRows.length ? 'warn' : 'ok');
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

function refreshReadinessSummary(){
  const target = document.getElementById('readinessSummary');
  if(target) target.innerHTML = renderReadinessSummary();
}

function renderReadinessSummary(){
  const summary = buildReadinessSummary(appState);
  return `
    <div class="readiness-groups">
      ${renderReadinessGroup('Hoteles', summary.hotels)}
      ${renderReadinessGroup('Parques', summary.parks)}
    </div>
  `;
}

function renderDataModeControl(){
  const currentMode = DATA_MODES[appState.dataMode] || DATA_MODES.demo;
  return `
    <div class="data-mode-panel ${escapeHTML(appState.dataMode)}">
      <div>
        <strong>Modo de datos</strong>
        <span>${escapeHTML(currentMode.description)}</span>
      </div>
      <div class="mode-toggle" aria-label="Modo de datos">
        ${Object.values(DATA_MODES).map(mode => `
          <button type="button" class="${appState.dataMode === mode.id ? 'active' : ''}" data-mode-option="${escapeHTML(mode.id)}">
            ${escapeHTML(mode.label)}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderResponsibleControl(){
  return `
    <form class="responsible-panel" data-responsible-form>
      <label class="form-field">
        <span>Responsable activo</span>
        <input name="responsible" value="${escapeHTML(appState.currentOperator)}" placeholder="Nombre de quien carga o modifica">
      </label>
      <button type="submit" class="btn-ghost">Guardar</button>
    </form>
  `;
}

function renderReadinessGroup(title, items){
  return `
    <div class="readiness-group">
      <h3>${escapeHTML(title)}</h3>
      <div class="readiness-list">
        ${items.map(renderReadinessItem).join('')}
      </div>
    </div>
  `;
}

function renderReadinessItem(item){
  return `
    <article class="readiness-item ${item.status.severity}">
      <div class="readiness-main">
        <div>
          <strong>${escapeHTML(item.site.name)}</strong>
          <span>${escapeHTML(item.site.role)}</span>
        </div>
        ${badge(`${item.coverage}%`, item.status.severity)}
      </div>
      <div class="readiness-bar" aria-label="Cobertura de datos">
        <span class="${item.status.severity}" style="width:${item.coverage}%"></span>
      </div>
      <div class="readiness-contracts">
        ${item.contracts.map(renderContractChip).join('')}
      </div>
      <p class="readiness-source">${escapeHTML(item.status.label)} · ${item.loadedCount} de ${item.totalCount} frentes · ${escapeHTML(item.lastSource)}</p>
    </article>
  `;
}

function renderContractChip(contract){
  const state = contract.loaded ? 'ok' : 'missing';
  const title = contract.loaded
    ? `${contract.rows} fila(s)${contract.detail ? ` · ${contract.detail}` : ''}`
    : 'Pendiente';
  return `
    <span class="readiness-chip ${state}">
      <b>${escapeHTML(contract.label)}</b>
      <small>${escapeHTML(title)}</small>
    </span>
  `;
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
