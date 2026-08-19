import { NAV_ITEMS } from './config/navigation.js';
import { renderDashboard } from './ui/views/dashboard.js';
import { renderDataLoad, bindDataLoadHandlers } from './ui/views/data-load.js';
import { renderHotels, bindHotelHandlers } from './ui/views/hotels.js';
import { renderParks, bindParkHandlers } from './ui/views/parks.js';
import { renderCalendar, bindCalendarHandlers } from './ui/views/calendar.js';
import { renderCampaigns, bindCampaignHandlers } from './ui/views/campaigns.js';
import { renderGlobalFilters, bindGlobalFilterHandlers } from './ui/global-filters.js';

const viewRenderers = {
  dashboard: renderDashboard,
  'data-load': renderDataLoad,
  hotels: renderHotels,
  parks: renderParks,
  calendar: renderCalendar,
  campaigns: renderCampaigns
};

const navEl = document.getElementById('appNav');
const titleEl = document.getElementById('viewTitle');
const viewEl = document.getElementById('appView');
const globalFiltersEl = document.getElementById('globalFilters');
const statusEl = document.getElementById('dataStatus');
const headerDataLoadButton = document.getElementById('btnHeaderDataLoad');

let activeView = 'dashboard';

renderNav();
renderActiveView();

headerDataLoadButton.addEventListener('click', () => {
  activeView = 'data-load';
  renderNav();
  renderActiveView();
});

function renderNav(){
  navEl.innerHTML = NAV_ITEMS.map(item => `
    <button type="button" data-view="${item.id}" class="${item.id === activeView ? 'active' : ''}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  navEl.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => {
      activeView = button.dataset.view;
      renderNav();
      renderActiveView();
    });
  });
}

function renderActiveView(){
  const item = NAV_ITEMS.find(navItem => navItem.id === activeView) || { title: 'Carga de datos' };
  titleEl.textContent = item.title;
  globalFiltersEl.innerHTML = renderGlobalFilters();
  viewEl.innerHTML = viewRenderers[activeView]();
  headerDataLoadButton.classList.toggle('active', activeView === 'data-load');
  bindGlobalFilterHandlers({ rerender: renderActiveView });

  if(activeView === 'data-load'){
    bindDataLoadHandlers({ setStatus });
  }

  if(activeView === 'hotels'){
    bindHotelHandlers({ rerender: renderActiveView });
  }

  if(activeView === 'parks'){
    bindParkHandlers({ rerender: renderActiveView });
  }

  if(activeView === 'calendar'){
    bindCalendarHandlers({ rerender: renderActiveView });
  }

  if(activeView === 'campaigns'){
    bindCampaignHandlers({ rerender: renderActiveView, setStatus });
  }
}

function setStatus(text, type){
  statusEl.textContent = text;
  statusEl.hidden = !text;
  statusEl.classList.remove('ok', 'warn', 'error', 'pending');
  if(type) statusEl.classList.add(type);
}
