import { Itinerary, Language } from '@/types';
import { calculateTransitTotals } from '@/utils/plannerEngine';

/**
 * Renders an ultra-sharp, high-resolution VIP 9:16 vertical Story Pass (1080x1920)
 * specifically optimized for Instagram Stories, Snapchat, and WhatsApp Status.
 */
export async function renderStoryPassCanvas(
  itinerary: Itinerary,
  language: Language = 'ar'
): Promise<HTMLCanvasElement | null> {
  if (typeof document === 'undefined') return null;

  // 1. Wait for Arabic Google Fonts to be fully loaded and rasterized
  if (document.fonts) {
    try {
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font readiness check bypassed:', e);
    }
  }

  const isAr = language === 'ar';
  const baseWidth = 1080;
  const baseHeight = 1920;

  // HiDPI / Retina Device Pixel Ratio Scaling
  const dpr = typeof window !== 'undefined' ? Math.max(1, Math.min(2, window.devicePixelRatio || 1)) : 1;

  const canvas = document.createElement('canvas');
  canvas.width = baseWidth * dpr;
  canvas.height = baseHeight * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(dpr, dpr);

  // Modern typography stack prioritizing native Arabic fonts
  const fontHeading = `'IBM Plex Sans Arabic', 'Readex Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
  const fontBody = `'Readex Pro', 'IBM Plex Sans Arabic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  // 2. Deep Obsidian Luxury Navy Gradient Background
  const bgGrad = ctx.createLinearGradient(0, 0, baseWidth, baseHeight);
  bgGrad.addColorStop(0, '#06090F');
  bgGrad.addColorStop(0.3, '#0C121E');
  bgGrad.addColorStop(0.7, '#0E1626');
  bgGrad.addColorStop(1, '#05070C');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, baseWidth, baseHeight);

  // 3. Ambient Metallic Gold & Red Sea Teal Radial Orbs
  const goldOrb = ctx.createRadialGradient(baseWidth * 0.85, 180, 20, baseWidth * 0.85, 180, 500);
  goldOrb.addColorStop(0, 'rgba(229, 195, 120, 0.16)');
  goldOrb.addColorStop(1, 'transparent');
  ctx.fillStyle = goldOrb;
  ctx.fillRect(0, 0, baseWidth, 700);

  const tealOrb = ctx.createRadialGradient(baseWidth * 0.15, baseHeight * 0.55, 30, baseWidth * 0.15, baseHeight * 0.55, 450);
  tealOrb.addColorStop(0, 'rgba(45, 212, 191, 0.12)');
  tealOrb.addColorStop(1, 'transparent');
  ctx.fillStyle = tealOrb;
  ctx.fillRect(0, baseHeight * 0.3, baseWidth, 700);

  const amberOrb = ctx.createRadialGradient(baseWidth * 0.75, baseHeight * 0.88, 20, baseWidth * 0.75, baseHeight * 0.88, 480);
  amberOrb.addColorStop(0, 'rgba(223, 159, 61, 0.14)');
  amberOrb.addColorStop(1, 'transparent');
  ctx.fillStyle = amberOrb;
  ctx.fillRect(0, baseHeight * 0.6, baseWidth, 800);

  // 4. Outer Border Frame with Elegant Champagne Corners
  ctx.strokeStyle = 'rgba(229, 195, 120, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(50, 50, baseWidth - 100, baseHeight - 100);

  // Inner Subtle Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.lineWidth = 1;
  ctx.strokeRect(62, 62, baseWidth - 124, baseHeight - 124);

  // Corner Accent Brackets
  const bracketLen = 32;
  const bracketInset = 42;
  ctx.strokeStyle = '#E5C378';
  ctx.lineWidth = 3.5;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(bracketInset, bracketInset + bracketLen);
  ctx.lineTo(bracketInset, bracketInset);
  ctx.lineTo(bracketInset + bracketLen, bracketInset);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(baseWidth - bracketInset - bracketLen, bracketInset);
  ctx.lineTo(baseWidth - bracketInset, bracketInset);
  ctx.lineTo(baseWidth - bracketInset, bracketInset + bracketLen);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(bracketInset, baseHeight - bracketInset - bracketLen);
  ctx.lineTo(bracketInset, baseHeight - bracketInset);
  ctx.lineTo(bracketInset + bracketLen, baseHeight - bracketInset);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(baseWidth - bracketInset - bracketLen, baseHeight - bracketInset);
  ctx.lineTo(baseWidth - bracketInset, baseHeight - bracketInset);
  ctx.lineTo(baseWidth - bracketInset, baseHeight - bracketInset - bracketLen);
  ctx.stroke();

  // 5. Header Brand & Boarding Pass Strip
  ctx.textAlign = 'center';

  // Badge Pill
  ctx.fillStyle = 'rgba(229, 195, 120, 0.12)';
  ctx.beginPath();
  ctx.roundRect(baseWidth / 2 - 180, 100, 360, 44, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(229, 195, 120, 0.35)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#E5C378';
  ctx.font = `bold 18px ${fontHeading}`;
  ctx.fillText(
    isAr ? 'تذكرة صعود VIP  •  FIRST CLASS PASS' : 'VIP BOARDING PASS  •  FIRST CLASS',
    baseWidth / 2,
    128
  );

  // Brand Name
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `900 48px ${fontHeading}`;
  ctx.fillText(isAr ? 'جـــداول  |  JADAWEL' : 'JADAWEL  |  جـــداول', baseWidth / 2, 205);

  ctx.fillStyle = '#94A3B8';
  ctx.font = `500 22px ${fontBody}`;
  ctx.fillText(
    isAr ? 'المخطط الذكي لطلعات ورحلات عروس البحر الأحمر' : 'Intelligent Outing & Itinerary Planner for Jeddah',
    baseWidth / 2,
    245
  );

  // Golden Divider Line
  ctx.strokeStyle = 'rgba(229, 195, 120, 0.3)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(140, 280);
  ctx.lineTo(baseWidth - 140, 280);
  ctx.stroke();

  // 6. Itinerary Title & Metadata Banner
  ctx.fillStyle = '#F5E2B3';
  ctx.font = `bold 42px ${fontHeading}`;
  const planTitle = isAr ? itinerary.titleAr : itinerary.titleEn;
  ctx.fillText(planTitle, baseWidth / 2, 345);

  // Metadata Capsule
  const stops = itinerary.stops || [];
  const transitTotals = calculateTransitTotals(stops);
  const costPerPerson = itinerary.financials?.totalPerPersonSAR || 0;
  const metaText = isAr
    ? `${stops.length} محطات  •  ~${costPerPerson} ر.س للشخص  •  ~${transitTotals.minutes} دقيقة مشاوير`
    : `${stops.length} Stops  •  ~${costPerPerson} SAR/person  •  ~${transitTotals.minutes} min transit`;

  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(140, 380, baseWidth - 280, 56, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.stroke();

  ctx.fillStyle = '#38BDF8';
  ctx.font = `600 20px ${fontBody}`;
  ctx.fillText(metaText, baseWidth / 2, 416);

  // 7. Sequential Station Cards (Up to 4 stops rendered with high elegance)
  const stopsToRender = stops.slice(0, 4);
  const startY = 475;
  const cardHeight = 220;
  const gap = 32;

  // Background connector vertical guide line
  const connectorX = isAr ? baseWidth - 180 : 180;
  ctx.strokeStyle = 'rgba(229, 195, 120, 0.25)';
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(connectorX, startY + 60);
  ctx.lineTo(connectorX, startY + (stopsToRender.length - 1) * (cardHeight + gap) + 60);
  ctx.stroke();
  ctx.setLineDash([]); // Reset line dash

  stopsToRender.forEach((stop, idx) => {
    const y = startY + idx * (cardHeight + gap);

    // Card Glass Container
    ctx.fillStyle = '#0D1321';
    ctx.beginPath();
    ctx.roundRect(100, y, baseWidth - 200, cardHeight, 28);
    ctx.fill();

    ctx.strokeStyle = idx === 0 ? 'rgba(229, 195, 120, 0.5)' : 'rgba(255, 255, 255, 0.09)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Medallion Badge Circle
    ctx.fillStyle = '#E5C378';
    ctx.beginPath();
    ctx.arc(connectorX, y + cardHeight / 2, 34, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#06090F';
    ctx.font = `900 28px ${fontHeading}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${idx + 1}`, connectorX, y + cardHeight / 2 + 10);

    // Text Content Area
    ctx.textAlign = isAr ? 'right' : 'left';
    const textX = isAr ? baseWidth - 245 : 245;

    // Time Slot Pill
    ctx.fillStyle = '#2DD4BF';
    ctx.font = `bold 20px ${fontBody}`;
    ctx.fillText(stop.timeSlot, textX, y + 54);

    // Place Name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 32px ${fontHeading}`;
    const placeName = isAr ? stop.place.nameAr : stop.place.nameEn;
    ctx.fillText(placeName, textX, y + 102);

    // District & Est Cost
    ctx.fillStyle = '#94A3B8';
    ctx.font = `500 22px ${fontBody}`;
    const districtName = isAr ? stop.place.districtNameAr : stop.place.districtNameEn;
    const costLabel = stop.place.averageCostSAR > 0
      ? `~${stop.place.averageCostSAR} ${isAr ? 'ر.س' : 'SAR'}`
      : (isAr ? 'دخول مجاني' : 'Free Entry');
    const dwell = `~${stop.place.dwellTimeMinutes || 60} ${isAr ? 'دقيقة' : 'min'}`;

    ctx.fillText(`${districtName}   •   ${costLabel}   •   ${dwell}`, textX, y + 148);

    // Bottom Notice / Tag
    ctx.fillStyle = '#E5C378';
    ctx.font = `bold 17px ${fontBody}`;
    const roleTag = stop.weatherNotice
      ? (isAr ? stop.weatherNotice.textAr.replace(/[🌅☀️❄️🌙]/g, '').trim() : stop.weatherNotice.textEn)
      : (isAr ? 'محطة موصى بها في المسار' : 'Curated Stop in Sequence');
    ctx.fillText(`✨ ${roleTag.slice(0, 48)}`, textX, y + 186);
  });

  // 8. Bottom Footer & Verified Barcode Section
  const footerY = baseHeight - 320;

  ctx.fillStyle = '#090E18';
  ctx.beginPath();
  ctx.roundRect(100, footerY, baseWidth - 200, 190, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(229, 195, 120, 0.3)';
  ctx.stroke();

  // Top Bar of Footer Box
  ctx.fillStyle = '#E5C378';
  ctx.font = `bold 22px ${fontHeading}`;
  ctx.textAlign = 'center';
  ctx.fillText(
    isAr ? 'مسار جغرافي ذكي متصل  •  عروس البحر الأحمر' : 'Connected Smart Route  •  Bride of the Red Sea',
    baseWidth / 2,
    footerY + 48
  );

  // Decorative Barcode Simulation Lines
  const barcodeY = footerY + 75;
  const barcodeStartX = baseWidth / 2 - 200;
  ctx.fillStyle = '#E5C378';
  for (let b = 0; b < 40; b++) {
    const barW = (b % 3 === 0 || b % 5 === 0) ? 5 : 2;
    const barX = barcodeStartX + b * 10;
    ctx.fillRect(barX, barcodeY, barW, 36);
  }

  // Serial & URL
  ctx.fillStyle = '#94A3B8';
  ctx.font = `bold 18px ${fontBody}`;
  ctx.fillText('JDW-VIP-PASS  •  https://abod6911.github.io/jadawel/', baseWidth / 2, footerY + 150);

  return canvas;
}

/**
 * High-level function that exports the 9:16 Story Pass and triggers either:
 * A) Native OS Share sheet (navigator.share with File) on iOS/Android
 * B) Direct PNG download fallback on desktop browsers
 */
export async function exportAndShareStoryPass(
  itinerary: Itinerary,
  language: Language = 'ar'
): Promise<{ shared: boolean; downloaded: boolean }> {
  const canvas = await renderStoryPassCanvas(itinerary, language);
  if (!canvas) return { shared: false, downloaded: false };

  const isAr = language === 'ar';
  const fileName = `jadawel-outing-${Date.now()}.png`;

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve({ shared: false, downloaded: false });
        return;
      }

      // Check if Native Web Share API with File support is available
      if (typeof navigator !== 'undefined' && navigator.canShare) {
        try {
          const file = new File([blob], fileName, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: isAr ? 'بطاقة طلعتنا في جدة عبر جداول (Jadawel)' : 'Our Jeddah Outing Pass via Jadawel',
              text: isAr
                ? 'شوف خطة طلعتنا في جدة 🌊☕ احفظ الصورة للستوري أو افتح الرابط'
                : 'Check out our Jeddah outing plan 🌊☕ Save image for Story or open link',
            });
            resolve({ shared: true, downloaded: false });
            return;
          }
        } catch (shareErr) {
          // If user cancelled share sheet, resolve cleanly without forced double download
          if ((shareErr as any)?.name === 'AbortError') {
            resolve({ shared: false, downloaded: false });
            return;
          }
          console.warn('Native Web Share failed, falling back to direct download:', shareErr);
        }
      }

      // Fallback: Direct Download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      resolve({ shared: false, downloaded: true });
    }, 'image/png', 0.96);
  });
}

/**
 * Backward-compatible alias for existing export hubs
 */
export async function downloadItineraryPoster(
  itinerary: Itinerary,
  language: Language = 'ar'
): Promise<void> {
  await exportAndShareStoryPass(itinerary, language);
}
