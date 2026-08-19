import { appState } from '../../state/app-state.js';
import { addCampaign } from '../../state/app-state.js';
import { badge, escapeHTML } from '../html.js';

let showNewCampaignForm = false;

export function renderCampaigns(){
  return `
    <section class="panel">
      <div class="section-head">
        <div>
          <h2>Catalogo de campanas</h2>
          <p class="metric-note">Acciones disponibles para activar cuando una sede entra en Preventa o Mas cerca.</p>
        </div>
        <div class="section-actions">
          <strong class="section-count">${appState.campaignRows.length} campanas</strong>
          <button type="button" class="btn-secondary" data-add-campaign-toggle>Agregar campaña nueva</button>
        </div>
      </div>
      ${showNewCampaignForm ? renderNewCampaignForm() : ''}
    </section>

    <section class="panel tight">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Campana</th>
              <th>Causa</th>
              <th>Sedes</th>
              <th>Tarifa o producto</th>
              <th>Estado</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            ${appState.campaignRows.map(campaign => renderCampaignRow(campaign)).join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

export function bindCampaignHandlers({ rerender, setStatus }){
  const toggle = document.querySelector('[data-add-campaign-toggle]');
  if(toggle){
    toggle.addEventListener('click', () => {
      showNewCampaignForm = !showNewCampaignForm;
      rerender();
    });
  }

  const form = document.querySelector('[data-campaign-form]');
  if(form){
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const campaign = {
        name: String(data.get('name') || '').trim(),
        cause: String(data.get('cause') || '').trim(),
        sites: String(data.get('sites') || '').trim(),
        rate: String(data.get('rate') || '').trim(),
        status: String(data.get('status') || 'propuesta')
      };
      if(!campaign.name || !campaign.cause || !campaign.sites || !campaign.rate){
        setStatus('Complete nombre, causa, sedes y tarifa/producto.');
        return;
      }
      addCampaign(campaign);
      showNewCampaignForm = false;
      setStatus(`${campaign.name}: campana agregada`);
      rerender();
    });
  }
}

function renderNewCampaignForm(){
  return `
    <form class="campaign-form" data-campaign-form>
      <label>
        <span>Nombre</span>
        <input name="name" required placeholder="Ej. Puente de baja ocupacion">
      </label>
      <label>
        <span>Causa</span>
        <input name="cause" required placeholder="Ej. Baja proyeccion entre semana">
      </label>
      <label>
        <span>Sedes</span>
        <input name="sites" required placeholder="Ej. Hosteria Los Farallones">
      </label>
      <label>
        <span>Tarifa o producto</span>
        <input name="rate" required placeholder="Ej. Preventa 48 horas">
      </label>
      <label>
        <span>Estado</span>
        <select name="status">
          <option value="propuesta">Propuesta</option>
          <option value="ejecutada">Ejecutada</option>
        </select>
      </label>
      <button type="submit" class="btn-upload">Guardar campaña</button>
    </form>
  `;
}

function renderCampaignRow(campaign){
  const effectiveness = campaignEffectiveness(campaign);
  return `
    <tr>
      <td><strong>${escapeHTML(campaign.name)}</strong></td>
      <td>${escapeHTML(campaign.cause)}</td>
      <td>${escapeHTML(campaign.sites)}</td>
      <td>${escapeHTML(campaign.rate)}</td>
      <td>${badge(statusLabel(campaign.status), statusSeverity(campaign.status))}</td>
      <td>
        ${effectiveness === null ? '<span class="metric-note">Pendiente de medicion</span>' : `
          <div class="eff-cell">
            <div class="eff-bar-wrap"><div class="eff-bar" style="width:${Math.min(effectiveness, 130)}%"></div></div>
            <strong>${effectiveness.toFixed(0)}%</strong>
          </div>
        `}
      </td>
    </tr>
  `;
}

function campaignEffectiveness(campaign){
  const projected = Number(campaign.projectedOccupancy);
  const actual = Number(campaign.actualOccupancy);
  if(Number.isNaN(projected) || Number.isNaN(actual) || projected === 0) return null;
  return (actual / projected) * 100;
}

function statusLabel(value){
  if(value === 'ejecutada') return 'Ejecutada';
  if(value === 'propuesta') return 'Propuesta';
  return value || 'Pendiente';
}

function statusSeverity(value){
  if(value === 'ejecutada') return 'green';
  if(value === 'propuesta') return 'amber';
  return 'gray';
}
