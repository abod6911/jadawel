import { Itinerary, ItineraryStop } from '@/types';

/**
 * Generates an RFC 5545 compliant .ics (iCalendar) string for an entire itinerary.
 */
export function generateIcsContent(itinerary: Itinerary, language: 'ar' | 'en' = 'ar'): string {
  const now = new Date();
  const nowUtc = formatDateToIcsUtc(now);

  let icsString = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Jadawel//Jeddah Smart Itinerary Planner//AR_EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(language === 'ar' ? itinerary.titleAr : itinerary.titleEn)}`,
    'X-WR-TIMEZONE:Asia/Riyadh',
  ].join('\r\n');

  // Base date for events (tomorrow at start times, or sequential days)
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // schedule starting tomorrow

  itinerary.stops.forEach((stop, index) => {
    const eventDate = new Date(baseDate);
    const dayOffset = (stop.dayNumber ? stop.dayNumber - 1 : 0);
    eventDate.setDate(baseDate.getDate() + dayOffset);

    const [startH, startM] = stop.startTime.split(':').map(Number);
    const [endH, endM] = stop.endTime.split(':').map(Number);

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(startH || 10, startM || 0, 0, 0);

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(endH || 12, endM || 0, 0, 0);

    const title = language === 'ar' ? stop.place.nameAr : stop.place.nameEn;
    const district = language === 'ar' ? stop.place.districtNameAr : stop.place.districtNameEn;
    const description = language === 'ar'
      ? `${stop.place.descriptionAr}\\n\\n💡 نصيحة محلية: ${stop.place.insiderTipAr || ''}\\n📍 الحي: ${district}\\n💰 التكلفة المقدرة: ${stop.place.averageCostSAR} ر.س`
      : `${stop.place.descriptionEn}\\n\\n💡 Insider Tip: ${stop.place.insiderTipEn || ''}\\n📍 District: ${district}\\n💰 Est. Cost: ${stop.place.averageCostSAR} SAR`;

    const location = `${title}, ${district}, Jeddah, Saudi Arabia`;
    const geo = `${stop.place.coordinates.lat};${stop.place.coordinates.lng}`;
    const uid = `jadawel-${itinerary.id}-stop-${index}-${Date.now()}@jadawel.app`;

    const eventBlock = [
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART:${formatDateToIcsUtc(startDateTime)}`,
      `DTEND:${formatDateToIcsUtc(endDateTime)}`,
      `SUMMARY:${escapeIcsText(title)} (${language === 'ar' ? 'جدول جدة' : 'Jadawel Jeddah'})`,
      `DESCRIPTION:${escapeIcsText(description)}`,
      `LOCATION:${escapeIcsText(location)}`,
      `GEO:${geo}`,
      `URL:${stop.place.googleMapsUrl}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
    ].join('\r\n');

    icsString += '\r\n' + eventBlock;
  });

  icsString += '\r\nEND:VCALENDAR';
  return icsString;
}

/**
 * Initiates the client-side download of the generated .ics calendar file.
 */
export function downloadIcsFile(itinerary: Itinerary, language: 'ar' | 'en' = 'ar'): void {
  const content = generateIcsContent(itinerary, language);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const filename = `jadawel-jeddah-plan-${itinerary.id.slice(-6)}.ics`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDateToIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcsText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
}
