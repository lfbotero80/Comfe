import { appState, addCampaign } from '../../state/app-state.js';
import { badge, escapeHTML } from '../html.js';

let showNewCampaignModal = false;

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
      ${showNewCampaignModal ? renderNewCampaignModal() : ''}
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
      showNewCampaignModal = true;
      rerender();
    });
  }

  document.querySelectorAll('[data-campaign-close]').forEach(button => {
    button.addEventListener('click', () => {
      showNewCampaignModal = false;
      rerender();
    });
  });

  const backdrop = document.querySelector('[data-campaign-modal-backdrop]');
  if(backdrop){
    backdrop.addEventListener('click', event => {
      if(event.target === backdrop){
        showNewCampaignModal = false;
        rerender();
      }
    });
  }

  const form = document.querySelector('[data-campaign-form]');
  if(form){
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const projectedOccupancy = parseOptionalNumber(data.get('projectedOccupancy'));
      const actualOccupancy = parseOptionalNumber(data.get('actualOccupancy'));
      const campaign = {
        name: String(data.get('name') || '').trim(),
        cause: String(data.get('cause') || '').trim(),
        sites: String(data.get('sites') || '').trim(),
        rate: String(data.get('rate') || '').trim(),
        executionDate: String(data.get('executionDate') || '').trim(),
        projectedOccupancy,
        actualOccupancy,
        status: actualOccupancy === null ? 'propuesta' : 'ejecutada'
      };
      if(!campaign.name || !campaign.cause || !campaign.sites || !campaign.rate){
        setStatus('Complete nombre, causa, sedes y tarifa/producto.');
        return;
      }
      addCampaign(campaign);
      showNewCampaignModal = false;
      setStatus(`${campaign.name}: campana agregada`);
      rerender();
    });
  }
}

function renderNewCampaignModal(){
  return `
    <div class="modal-backdrop" data-campaign-modal-backdrop>
      <form class="campaign-modal" data-campaign-form role="dialog" aria-modal="true" aria-labelledby="campaign-modal-title">
        <div class="modal-head">
          <h3 id="campaign-modal-title">Agregar campaña al catálogo</h3>
          <button type="button" class="modal-close" data-campaign-close aria-label="Cerrar">×</button>
        </div>
        <div class="modal-body">
          <label class="form-field">
            <span>Nombre de la campaña</span>
            <input name="name" required placeholder="Ej. Miércoles de nómada digital">
          </label>
          <label class="form-field">
            <span>Causa que resuelve</span>
            <input name="cause" required placeholder="Ej. Entre semana sin atractivo de calendario">
          </label>
          <label class="form-field">
            <span>Sede(s)</span>
            <input name="sites" required placeholder="Ej. Piedras Blancas, Balandú">
          </label>
          <div class="form-grid two">
            <label class="form-field">
              <span>Tarifa aplicada</span>
              <input name="rate" required placeholder="Ej. Tramo Preventa">
            </label>
            <label class="form-field">
              <span>Fecha de ejecución</span>
              <input name="executionDate" type="date">
            </label>
          </div>
          <div class="form-grid two">
            <label class="form-field">
              <span>Ocupación proyectada antes (%)</span>
              <input name="projectedOccupancy" type="number" min="0" max="100" step="0.01" inputmode="decimal">
            </label>
            <label class="form-field">
              <span>Ocupación real lograda (%)</span>
              <input name="actualOccupancy" type="number" min="0" max="100" step="0.01" inputmode="decimal">
            </label>
          </div>
          <p class="modal-helper">Deja las ocupaciones en blanco si la campaña todavía no se ha ejecutado; el % de efectividad se calcula solo cuando ambos datos existen.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-ghost" data-campaign-close>Cancelar</button>
          <button type="submit" class="btn-primary">Guardar campaña</button>
        </div>
      </form>
    </div>
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

function parseOptionalNumber(value){
  if(value === null || value === undefined || String(value).trim() === '') return null;
  const number = Number(value);
  return Number.isNaN(number) ? null : number;
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
