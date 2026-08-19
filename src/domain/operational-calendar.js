import { COLOMBIA_HOLIDAYS_2026 } from '../data/colombia-holidays-2026.js';

const HOLIDAYS_BY_DATE = new Map(COLOMBIA_HOLIDAYS_2026.map(holiday => [holiday.date, holiday]));
const DAY_NAMES = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];

export const HIGH_SEASON_WINDOWS = [
  { start:'2026-04-02', end:'2026-04-05', name:'Semana Santa' },
  { start:'2026-06-15', end:'2026-07-20', name:'Temporada de mitad de ano' },
  { start:'2026-10-05', end:'2026-10-12', name:'Semana de receso escolar' },
  { start:'2026-12-08', end:'2026-12-31', name:'Temporada de fin de ano' }
];

export function holidayForDate(date){
  return HOLIDAYS_BY_DATE.get(date) || null;
}

export function isHoliday(date){
  return Boolean(holidayForDate(date));
}

export function highSeasonForDate(date){
  if(!date) return null;
  return HIGH_SEASON_WINDOWS.find(window => date >= window.start && date <= window.end) || null;
}

export function isNormalClosure(date){
  if(!date) return false;
  const day = new Date(`${date}T00:00:00`).getDay();
  return (day === 0 || day === 1) && !isHoliday(date);
}

export function operationalContextForDate(date){
  const holiday = holidayForDate(date);
  const highSeason = highSeasonForDate(date);
  const closure = isNormalClosure(date);
  const day = date ? new Date(`${date}T00:00:00`).getDay() : null;
  const dayName = DAY_NAMES[day] || 'Sin fecha';

  return {
    date,
    holiday,
    highSeason,
    normalClosure: closure,
    dayName,
    dayType: closure
      ? 'cierre_operativo'
      : holiday
        ? 'festivo'
        : highSeason
          ? 'temporada_alta'
          : [0, 6].includes(day)
            ? 'fin_de_semana'
            : 'entre_semana',
    label: closure
      ? `${dayName} - cierre operativo normal`
      : holiday
        ? `${dayName} festivo: ${holiday.name}`
        : highSeason
          ? `${dayName} - temporada alta: ${highSeason.name}`
          : dayName
  };
}

export function operationalModifierForRecommendation(date){
  const context = operationalContextForDate(date);
  if(context.normalClosure){
    return 'No activar campana: es cierre operativo normal, no una caida de demanda.';
  }
  if(context.holiday || context.highSeason){
    return 'Proteger tarifa antes de descontar: la fecha tiene senal de demanda por calendario.';
  }
  return '';
}

export { COLOMBIA_HOLIDAYS_2026 };
