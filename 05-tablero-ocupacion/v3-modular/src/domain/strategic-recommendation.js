import { OCCUPANCY_TARGET } from './occupancy.js';

export function buildStrategicRecommendation({ siteName, monthRows, latestRow, status, commercialContext }){
  if(!latestRow || !monthRows.length || !status){
    return {
      severity: 'gray',
      title: 'Accion sugerida',
      action: 'Cargar forecast del mes antes de decidir.',
      rationale: 'Sin ocupacion diaria no hay base suficiente para recomendar campana, tarifa o cierre de comunicacion.'
    };
  }

  const summary = occupancySummary(monthRows);
  const trend = recentTrend(monthRows);
  const campaign = commercialContext?.campaigns?.[0] || null;
  const activity = commercialContext?.activities?.[0] || null;
  const campaignText = campaign ? ` Campana disponible: ${campaign.name}.` : '';
  const activityText = activity ? ` Calendario: ${activity.activity}.` : '';

  if(status.id === 'closure'){
    return {
      severity: 'gray',
      title: 'Accion sugerida',
      action: 'Cerrar comunicacion promocional para este cierre operativo.',
      rationale: 'El dia esta marcado como cierre normal; no debe leerse como baja demanda.'
    };
  }

  if(status.id === 'price-up'){
    return {
      severity: 'green',
      title: 'Accion sugerida',
      action: 'Cerrar comunicacion promocional y proteger tarifa.',
      rationale: `La ocupacion vigente esta en ${Number(latestRow.ocupacion_porcentaje).toFixed(1)}% y supera alta demanda.${trendText(trend)}`
    };
  }

  if(summary.compliance < 100 && status.severity === 'green'){
    return {
      severity: 'amber',
      title: 'Accion sugerida',
      action: campaign ? `Mantener tarifa en dias fuertes y activar ${campaign.name} para dias bajos.` : 'Mantener tarifa en dias fuertes y activar comunicacion preventiva para dias bajos.',
      rationale: `Aunque el ultimo dato esta en tramo ${status.label}, el mes solo cumple ${summary.compliance.toFixed(0)}% de la meta (${summary.average.toFixed(1)}% vs ${OCCUPANCY_TARGET}%).${trendText(trend)}${campaignText}${activityText}`
    };
  }

  if(status.severity === 'red'){
    return {
      severity: 'red',
      title: 'Accion sugerida',
      action: campaign ? `Activar ${campaign.name}.` : 'Activar campana de choque y tarifa Mas cerca.',
      rationale: `El mes cumple ${summary.compliance.toFixed(0)}% de la meta de ocupacion (${summary.average.toFixed(1)}% vs ${OCCUPANCY_TARGET}%).${trendText(trend)}${campaignText}${activityText}`
    };
  }

  if(status.severity === 'amber'){
    return {
      severity: 'amber',
      title: 'Accion sugerida',
      action: campaign ? `Activar comunicacion preventiva con ${campaign.name}.` : 'Activar comunicacion preventiva y tramo Preventa.',
      rationale: `La sede esta por debajo de meta, pero aun en rango recuperable: ${summary.average.toFixed(1)}% promedio del mes.${trendText(trend)}${campaignText}${activityText}`
    };
  }

  return {
    severity: 'green',
    title: 'Accion sugerida',
    action: 'Mantener comunicacion normal y proteger descuento.',
    rationale: `El mes cumple ${summary.compliance.toFixed(0)}% de la meta de ocupacion.${trendText(trend)}`
  };
}

function occupancySummary(rows){
  const values = rows.map(row => Number(row.ocupacion_porcentaje)).filter(value => !Number.isNaN(value));
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  return {
    average,
    compliance: OCCUPANCY_TARGET ? (average / OCCUPANCY_TARGET) * 100 : 0
  };
}

function recentTrend(rows){
  const values = rows.map(row => Number(row.ocupacion_porcentaje)).filter(value => !Number.isNaN(value));
  if(values.length < 4) return null;
  const recent = values.slice(-3);
  const previous = values.slice(Math.max(0, values.length - 6), Math.max(0, values.length - 3));
  if(!previous.length) return null;
  const recentAvg = average(recent);
  const previousAvg = average(previous);
  return recentAvg - previousAvg;
}

function average(values){
  return values.reduce((sum, value) => sum + value, 0) / (values.length || 1);
}

function trendText(trend){
  if(trend === null) return '';
  if(trend >= 5) return ` Tendencia reciente sube ${trend.toFixed(1)} pp.`;
  if(trend <= -5) return ` Tendencia reciente cae ${Math.abs(trend).toFixed(1)} pp.`;
  return ' Tendencia reciente estable.';
}
