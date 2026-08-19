import { listContracts } from '../../domain/data-contracts.js';
import { escapeHTML } from '../html.js';

export function renderContracts(){
  return `
    <div class="grid">
      ${listContracts().map(contract => `
        <section class="panel">
          <div class="contract-head">
            <h2>${escapeHTML(contract.label)}</h2>
            <a href="${escapeHTML(contract.templatePath)}" download>Descargar plantilla</a>
          </div>
          <p class="metric-note">${escapeHTML(contract.businessUse)}</p>
          <table class="contract-table">
            <tbody>
              <tr><th>Fuente esperada</th><td>${escapeHTML(contract.source)}</td></tr>
              <tr><th>Grano</th><td>${escapeHTML(contract.grain)}</td></tr>
              <tr><th>Formatos aceptados</th><td>${contract.acceptedExtensions.join(', ')}</td></tr>
              <tr><th>Obligatorias</th><td>${contract.requiredColumns.map(escapeHTML).join(', ')}</td></tr>
              <tr><th>Opcionales</th><td>${contract.optionalColumns.map(escapeHTML).join(', ')}</td></tr>
              <tr><th>Numericas</th><td>${contract.numericColumns.map(escapeHTML).join(', ')}</td></tr>
              <tr><th>Fechas</th><td>${contract.dateColumns.map(escapeHTML).join(', ')}</td></tr>
              <tr><th>Ejemplo</th><td><code>${escapeHTML(JSON.stringify(contract.sampleRow))}</code></td></tr>
            </tbody>
          </table>
        </section>
      `).join('')}
    </div>
  `;
}
