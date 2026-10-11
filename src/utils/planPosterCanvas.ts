import { Itinerary, Language } from '@/types';

/**
 * Renders a high-resolution, VIP Obsidian & Champagne Gold itinerary poster
 * using native HTML5 Canvas without any heavy external libraries.
 */
export async function downloadItineraryPoster(itinerary: Itinerary, language: Language = 'ar'): Promise<void> {
  if (typeof document === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isAr = language === 'ar';

  // 1. Background Gradient (Deep Obsidian Navy)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  bgGrad.addColorStop(0, '#090C12');
  bgGrad.addColorStop(0.5, '#0E131E');
  bgGrad.addColorStop(1, '#080A0F');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Outer Border & Inner Accent Frame
  ctx.strokeStyle = '#E5C378';
  ctx.lineWidth = 3;
  ctx.strokeRect(36, 36, canvas.width - 72, canvas.height - 72);

  ctx.strokeStyle = 'rgba(229, 195, 120, 0.2)';
  ctx.lineWidth = 1;
  ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

  // 3. Top Decorative Glow
  const glow = ctx.createRadialGradient(canvas.width / 2, 80, 10, canvas.width / 2, 80, 300);
  glow.addColorStop(0, 'rgba(229, 195, 120, 0.15)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, canvas.width, 300);

  // 4. Header Brand & Title
  ctx.textAlign = 'center';
  ctx.fillStyle = '#E5C378';
  ctx.font = 'bold 34px system-ui, sans-serif';
  ctx.fillText(isAr ? 'جـــداول  |  JADAWEL' : 'JADAWEL  |  جـــداول', canvas.width / 2, 110);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px system-ui, sans-serif';
  ctx.fillText(
    isAr ? 'مخطط رحلات وطلعات عروس البحر الأحمر' : 'Smart Jeddah Outing Itinerary',
    canvas.width / 2,
    148
  );

  // Gold Divider Line
  ctx.strokeStyle = 'rgba(229, 195, 120, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(180, 175);
  ctx.lineTo(canvas.width - 180, 175);
  ctx.stroke();

  // 5. Itinerary Title & Subtitle Banner
  ctx.fillStyle = '#F5E2B3';
  ctx.font = 'bold 44px system-ui, sans-serif';
  const planTitle = isAr ? itinerary.titleAr : itinerary.titleEn;
  ctx.fillText(planTitle, canvas.width / 2, 235);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 20px system-ui, sans-serif';
  const durationText = isAr
    ? ((itinerary as any).totalDurationFormattedAr || `${itinerary.stops.length * 1.5} ساعات`)
    : ((itinerary as any).totalDurationFormattedEn || `${itinerary.stops.length * 1.5} Hours`);
  const costPerPerson = itinerary.financials?.totalPerPersonSAR ?? (itinerary as any).financialBreakdown?.totalPerPersonSAR ?? 0;
  const budgetText = `~${costPerPerson} ${isAr ? 'ر.س / شخص' : 'SAR / pers'}`;
  ctx.fillText(`${durationText}  •  ${budgetText}  •  ${itinerary.stops.length} ${isAr ? 'محطات' : 'Stops'}`, canvas.width / 2, 275);

  // 6. Sequential Station Cards (Up to 4 stops rendered cleanly)
  const stopsToRender = itinerary.stops.slice(0, 4);
  const startY = 325;
  const cardHeight = 175;
  const gap = 24;

  stopsToRender.forEach((stop, idx) => {
    const y = startY + idx * (cardHeight + gap);

    // Card Background Box
    ctx.fillStyle = '#131824';
    ctx.beginPath();
    ctx.roundRect(80, y, canvas.width - 160, cardHeight, 20);
    ctx.fill();

    ctx.strokeStyle = 'rgba(229, 195, 120, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Number Badge Circle
    ctx.fillStyle = '#E5C378';
    ctx.beginPath();
    const badgeX = isAr ? canvas.width - 145 : 145;
    ctx.arc(badgeX, y + cardHeight / 2, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#090C12';
    ctx.font = 'bold 26px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${idx + 1}`, badgeX, y + cardHeight / 2 + 9);

    // Content Text Alignment
    ctx.textAlign = isAr ? 'right' : 'left';
    const textX = isAr ? canvas.width - 200 : 200;

    // Time Slot
    ctx.fillStyle = '#38BDF8';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.fillText(stop.timeSlot, textX, y + 45);

    // Place Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px system-ui, sans-serif';
    const placeName = isAr ? stop.place.nameAr : stop.place.nameEn;
    ctx.fillText(placeName, textX, y + 85);

    // District & Cost
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 19px system-ui, sans-serif';
    const districtName = isAr ? stop.place.districtNameAr : stop.place.districtNameEn;
    const costText = stop.place.averageCostSAR > 0
      ? `${stop.place.averageCostSAR} ${isAr ? 'ر.س' : 'SAR'}`
      : (isAr ? 'دخول مجاني' : 'Free Entry');
    ctx.fillText(`${districtName}  •  ${costText}`, textX, y + 125);
  });

  // 7. Bottom Summary & Footer Watermark
  const footerY = canvas.height - 150;

  ctx.fillStyle = '#111520';
  ctx.beginPath();
  ctx.roundRect(80, footerY, canvas.width - 160, 85, 16);
  ctx.fill();

  ctx.strokeStyle = 'rgba(229, 195, 120, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#E5C378';
  ctx.font = 'bold 21px system-ui, sans-serif';
  ctx.fillText(
    isAr ? 'مسار جغرافي متصل بدون زحمة  •  رتب طلعتك في ثوانٍ' : 'Connected Traffic-Optimized Track  •  Plan in Seconds',
    canvas.width / 2,
    footerY + 38
  );

  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 16px system-ui, sans-serif';
  ctx.fillText('https://abod6911.github.io/jadawel/', canvas.width / 2, footerY + 66);

  // 8. Convert to Blob & Trigger Download
  return new Promise<void>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `jadawel-outing-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
