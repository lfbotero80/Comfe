import { appState } from '../state/app-state.js';
import { HOTELS } from './sites.js';

export function normalizeText(value){
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function monthNameFromDate(date){
  if(!date) return '';
  const monthIndex = new Date(`${date}T00:00:00`).getMonth();
  return ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][monthIndex] || '';
}

export function calendarItemsForSite(siteName, date){
  const month = monthNameFromDate(date);
  return appState.calendarRows.filter(item => {
    const sameSite = normalizeText(item.site) === normalizeText(siteName);
    const sameMonth = !month || normalizeText(item.month) === normalizeText(month);
    return sameSite && sameMonth;
  });
}

export function campaignsForSite(siteName, status){
  const severity = typeof status === 'string' ? status : status?.severity;
  if(!['red', 'amber'].includes(severity)) return [];

  const site = normalizeText(siteName);
  const isHotel = HOTELS.some(hotel => normalizeText(hotel.name) === site);

  return appState.campaignRows.filter(campaign => {
    const sites = normalizeText(campaign.sites);
    return sites.includes(site) ||
      sites.includes('sede que senale el forecast') ||
      (isHotel && sites.includes('las cuatro sedes con alojamiento'));
  });
}

export function commercialContextForSite(siteName, date, status){
  const activities = calendarItemsForSite(siteName, date).slice(0, 3);
  const campaigns = campaignsForSite(siteName, status).slice(0, 3);
  const firstCampaign = campaigns[0];
  const firstActivity = activities[0];

  return {
    activities,
    campaigns,
    action: firstCampaign
      ? `Campana sugerida: ${firstCampaign.name}.`
      : firstActivity
        ? `Usar actividad comercial: ${firstActivity.activity}.`
        : 'Sin campana o actividad registrada para esta sede y periodo.'
  };
}
