import { Itinerary } from '@/types';

/**
 * Safely opens a WhatsApp share link in a new window with noopener and noreferrer.
 */
export function openWhatsAppShare(text: string): void {
  if (typeof window === 'undefined') return;
  const encoded = encodeURIComponent(text);
  const url = `https://api.whatsapp.com/send?text=${encoded}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Builds a structured, beautifully formatted WhatsApp text payload for the itinerary.
 */
export function buildWhatsAppShareUrl(itinerary: Itinerary, language: 'ar' | 'en' = 'ar'): string {
  const isAr = language === 'ar';
  const title = isAr ? itinerary.titleAr : itinerary.titleEn;
  const daysCount = itinerary.daysCount || 1;
  const totalCost = itinerary.financials.totalPerPersonSAR;

  let message = '';

  if (isAr) {
    message += `🌊 *جدول رحلتنا في جدة عبر منصة جداول* 🌊\n`;
    message += `📌 *${title}*\n`;
    message += `🗓️ المدة: ${daysCount} ${daysCount > 1 ? 'أيام' : 'يوم'} | 💰 التكلفة المقدرة: ~${totalCost} ر.س / شخص\n\n`;
    message += `📍 *تفاصيل المسار والمحطات:*\n`;

    let currentDay = 0;
    itinerary.stops.forEach((stop) => {
      const dayNum = stop.dayNumber || 1;
      if (dayNum !== currentDay) {
        currentDay = dayNum;
        if (daysCount > 1) {
          message += `\n*─── اليوم ${currentDay} ───*\n`;
        }
      }

      message += `▫️ *${stop.timeSlot}* \n`;
      message += `   📍 *${stop.place.nameAr}* (${stop.place.districtNameAr})\n`;
      message += `   🏷️ ${stop.place.averageCostSAR > 0 ? `${stop.place.averageCostSAR} ر.س` : 'دخول مجاني'}\n`;
      if (stop.transitFromPrevious) {
        message += `   🚗 تنقل: ~${stop.transitFromPrevious.drivingMinutes} دقيقة (${stop.transitFromPrevious.distanceKm} كم)\n`;
      }
      message += `\n`;
    });

    message += `\n✨ صُمم عبر *جداول* - المخطط الذكي لرحلات جدة 🇸🇦\n`;
    message += `🌐 افتح الخطة التفاعلية: https://jadawel.app/p/${itinerary.id.slice(-8)}`;
  } else {
    message += `🌊 *Our Jeddah Itinerary via Jadawel* 🌊\n`;
    message += `📌 *${title}*\n`;
    message += `🗓️ Duration: ${daysCount} ${daysCount > 1 ? 'Days' : 'Day'} | 💰 Est. Cost: ~${totalCost} SAR / person\n\n`;
    message += `📍 *Stops & Timeline:*\n`;

    let currentDay = 0;
    itinerary.stops.forEach((stop) => {
      const dayNum = stop.dayNumber || 1;
      if (dayNum !== currentDay) {
        currentDay = dayNum;
        if (daysCount > 1) {
          message += `\n*─── Day ${currentDay} ───*\n`;
        }
      }

      message += `▫️ *${stop.timeSlot}* \n`;
      message += `   📍 *${stop.place.nameEn}* (${stop.place.districtNameEn})\n`;
      message += `   🏷️ ${stop.place.averageCostSAR > 0 ? `${stop.place.averageCostSAR} SAR` : 'Free Entry'}\n`;
      if (stop.transitFromPrevious) {
        message += `   🚗 Transit: ~${stop.transitFromPrevious.drivingMinutes} mins (${stop.transitFromPrevious.distanceKm} km)\n`;
      }
      message += `\n`;
    });

    message += `\n✨ Generated with *Jadawel* - Smart Jeddah Itinerary Planner 🇸🇦\n`;
    message += `🌐 View interactive plan: https://jadawel.app/p/${itinerary.id.slice(-8)}`;
  }

  const encoded = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?text=${encoded}`;
}
