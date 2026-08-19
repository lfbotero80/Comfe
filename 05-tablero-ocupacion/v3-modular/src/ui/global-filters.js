import { appState, setGlobalFilter } from '../state/app-state.js';
import { escapeHTML } from './html.js';

const MONTHS_2026 = [
  ['all', 'Todo 2026'],
  ['2026-01', 'Enero 2026'],
  ['2026-02', 'Febrero 2026'],
  ['2026-03', 'Marzo 2026'],
  ['2026-04', 'Abril 2026'],
  ['2026-05', 'Mayo 2026'],
  ['2026-06', 'Junio 2026'],
  ['2026-07', 'Julio 2026'],
  ['2026-08', 'Agosto 2026'],
  ['2026-09', 'Septiembre 2026'],
  ['2026-10', 'Octubre 2026'],
  ['2026-11', 'Noviembre 2026'],
  ['2026-12', 'Diciembre 2026']
];

const UNIT_TYPES = [
  ['all', 'Todas las unidades'],
  ['hotel', 'Hoteles'],
  ['parque', 'Parques']
];

const SEVERITIES = [
  ['all', 'Todos los estados'],
  ['red', 'Rojo'],
  ['amber', 'Amarillo'],
  ['green', 'Verde'],
  ['gray', 'Sin dato']
];

export function renderGlobalFilters(){
  const filters = appState.filters;
  return `
    <div class="filter-bar" aria-label="Filtros globales">
      ${selectFilter('Periodo', 'period', MONTHS_2026, filters.period)}
      ${selectFilter('Unidad', 'unitType', UNIT_TYPES, filters.unitType)}
      ${selectFilter('Semaforo', 'severity', SEVERITIES, filters.severity)}
    </div>
  `;
}

export function bindGlobalFilterHandlers({ rerender }){
  document.querySelectorAll('[data-global-filter]').forEach(select => {
    select.addEventListener('change', () => {
      setGlobalFilter(select.dataset.globalFilter, select.value);
      rerender();
    });
  });
}

export function monthLabel(period){
  if(period === 'all') return 'Todo 2026';
  return MONTHS_2026.find(([value]) => value === period)?.[1] || period;
}

function selectFilter(label, key, options, value){
  return `
    <label class="filter-control">
      <span>${escapeHTML(label)}</span>
      <select data-global-filter="${escapeHTML(key)}">
        ${options.map(([optionValue, optionLabel]) => `
          <option value="${escapeHTML(optionValue)}" ${optionValue === value ? 'selected' : ''}>${escapeHTML(optionLabel)}</option>
        `).join('')}
      </select>
    </label>
  `;
}
