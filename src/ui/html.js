export function escapeHTML(value){
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function badge(label, severity = 'gray'){
  return `<span class="badge ${severity}">${escapeHTML(label)}</span>`;
}

export function trafficLight(severity = 'gray', direction = ''){
  return `
    <span class="semaforo ${direction}">
      <span class="luz red ${severity === 'red' ? 'active' : ''}"></span>
      <span class="luz amber ${severity === 'amber' ? 'active' : ''}"></span>
      <span class="luz green ${severity === 'green' ? 'active' : ''}"></span>
    </span>
  `;
}
