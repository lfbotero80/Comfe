import { HOTELS, PARKS } from '../../domain/sites.js';
import { addDecisionLog, appState } from '../../state/app-state.js';
import { badge, escapeHTML } from '../html.js';

const DECISION_TYPES = ['Campaña', 'Tarifa', 'Presupuesto', 'Seguimiento', 'Validación de datos'];
const DECISION_STATUSES = ['Abierta', 'En seguimiento', 'Cerrada'];

export function renderDecisions(){
  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Bitácora de decisiones</h2>
          <p class="metric-note">Registro operativo de cargas, campañas, tarifas, presupuesto y compromisos por sede.</p>
        </div>
        <strong class="section-count">${appState.decisionRows.length} registros</strong>
      </div>
      ${renderDecisionForm()}
    </section>

    <section class="panel tight">
      ${appState.decisionRows.length ? renderDecisionTable() : renderEmptyState()}
    </section>
  `;
}

export function bindDecisionHandlers({ rerender, setStatus }){
  const form = document.querySelector('[data-decision-form]');
  if(!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const decision = String(data.get('decision') || '').trim();
    const responsible = String(data.get('responsible') || '').trim();

    if(!decision || !responsible){
      setStatus('Complete decision y responsable antes de guardar.', 'warn');
      return;
    }

    addDecisionLog({
      type: String(data.get('type') || 'Seguimiento'),
      site: String(data.get('site') || 'General'),
      responsible,
      decision,
      dueDate: String(data.get('dueDate') || ''),
      status: String(data.get('status') || 'Abierta'),
      notes: String(data.get('notes') || '').trim(),
      source: 'Registro manual'
    });

    setStatus('Decision registrada en bitacora.', 'ok');
    rerender();
  });
}

function renderDecisionForm(){
  return `
    <form class="decision-form" data-decision-form>
      <div class="form-grid two">
        <label class="form-field">
          <span>Sede</span>
          <select name="site">
            ${siteOptions().map(site => `<option value="${escapeHTML(site)}">${escapeHTML(site)}</option>`).join('')}
          </select>
        </label>
        <label class="form-field">
          <span>Tipo de decisión</span>
          <select name="type">
            ${DECISION_TYPES.map(type => `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`).join('')}
          </select>
        </label>
      </div>
      <label class="form-field">
        <span>Decisión o compromiso</span>
        <input name="decision" required placeholder="Ej. Activar Preventa entre semana para septiembre">
      </label>
      <div class="form-grid three">
        <label class="form-field">
          <span>Responsable</span>
          <input name="responsible" required value="${escapeHTML(appState.currentOperator)}" placeholder="Nombre del responsable">
        </label>
        <label class="form-field">
          <span>Fecha compromiso</span>
          <input name="dueDate" type="date">
        </label>
        <label class="form-field">
          <span>Estado</span>
          <select name="status">
            ${DECISION_STATUSES.map(status => `<option value="${escapeHTML(status)}">${escapeHTML(status)}</option>`).join('')}
          </select>
        </label>
      </div>
      <label class="form-field">
        <span>Notas</span>
        <textarea name="notes" rows="3" placeholder="Contexto breve: dato usado, campaña relacionada o validación pendiente"></textarea>
      </label>
      <div class="decision-actions">
        <button type="submit" class="btn-primary">Guardar decisión</button>
      </div>
    </form>
  `;
}

function renderDecisionTable(){
  return `
    <div class="table-wrap">
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Sede</th>
            <th>Tipo</th>
            <th>Decisión / evento</th>
            <th>Responsable</th>
            <th>Estado</th>
            <th>Fuente</th>
          </tr>
        </thead>
        <tbody>
          ${appState.decisionRows.map(renderDecisionRow).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderDecisionRow(row){
  return `
    <tr>
      <td>
        <strong>${escapeHTML(formatDateTime(row.createdAt))}</strong>
        ${row.dueDate ? `<span class="cell-note">Compromiso: ${escapeHTML(formatDate(row.dueDate))}</span>` : ''}
      </td>
      <td>${escapeHTML(row.site)}</td>
      <td>${escapeHTML(row.type)}</td>
      <td>
        <strong>${escapeHTML(row.decision)}</strong>
        ${row.notes ? `<span class="cell-note">${escapeHTML(row.notes)}</span>` : ''}
      </td>
      <td>${escapeHTML(row.responsible)}</td>
      <td>${badge(row.status, statusSeverity(row.status))}</td>
      <td>${escapeHTML(row.source)}</td>
    </tr>
  `;
}

function renderEmptyState(){
  return `
    <div class="empty-state">
      <strong>Sin decisiones registradas</strong>
      <span>Las cargas de archivos y los compromisos manuales quedarán listados aquí.</span>
    </div>
  `;
}

function siteOptions(){
  return ['General', ...HOTELS.map(site => site.name), ...PARKS.map(site => site.name)];
}

function statusSeverity(status){
  if(status === 'Cerrada' || status === 'Registrada') return 'green';
  if(status === 'En seguimiento' || status === 'Con advertencias') return 'amber';
  return 'gray';
}

function formatDateTime(value){
  if(!value) return 'Sin fecha';
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}

function formatDate(value){
  const date = new Date(`${value}T00:00:00`);
  if(Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('es-CO', { day:'2-digit', month:'short', year:'numeric' });
}
