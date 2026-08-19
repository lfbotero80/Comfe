import { isNormalClosure, operationalContextForDate, operationalModifierForRecommendation } from './operational-calendar.js';

export const OCCUPANCY_TARGET = 70;

export function classifyOccupancy(value, date){
  const numeric = Number(value);
  const context = operationalContextForDate(date);
  if(isNormalClosure(date)){
    return {
      id: 'closure',
      label: 'Cierre operativo',
      severity: 'gray',
      recommendation: 'No activar campana por cierre normal.',
      context
    };
  }
  if(Number.isNaN(numeric)){
    return {
      id: 'missing',
      label: 'Sin dato',
      severity: 'gray',
      recommendation: 'Cargar forecast antes de decidir.',
      context
    };
  }
  if(numeric >= 90){
    return {
      id: 'price-up',
      label: 'Alta demanda',
      severity: 'green',
      recommendation: 'Proteger tarifa y evaluar incremento para la proxima ventana similar.',
      context
    };
  }
  if(numeric >= OCCUPANCY_TARGET){
    return {
      id: 'standard',
      label: 'Estandar',
      severity: 'green',
      recommendation: context.holiday || context.highSeason
        ? 'Mantener tarifa plena y proteger precio por calendario.'
        : 'Mantener tarifa y comunicacion normal.',
      context
    };
  }
  if(numeric >= 40){
    const modifier = operationalModifierForRecommendation(date);
    return {
      id: 'preventa',
      label: 'Preventa',
      severity: 'amber',
      recommendation: modifier || 'Activar comunicacion comercial y campana preventiva.',
      context
    };
  }
  const modifier = operationalModifierForRecommendation(date);
  return {
    id: 'mas-cerca',
    label: 'Mas cerca',
    severity: 'red',
    recommendation: modifier || 'Activar campana de choque y tarifa Mas cerca.',
    context
  };
}

export function occupancyGap(projected, actual){
  const p = Number(projected);
  const a = Number(actual);
  if(Number.isNaN(p) || Number.isNaN(a)) return null;
  return {
    points: a - p,
    compliance: p === 0 ? null : (a / p) * 100
  };
}
