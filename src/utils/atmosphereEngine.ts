export type AtmospherePhase = 'daytime' | 'golden_hour' | 'nightlife';

export interface JeddahAtmosphere {
  phase: AtmospherePhase;
  phaseNameAr: string;
  phaseNameEn: string;
  gradientClass: string;
  radialGlowStyle: string;
  temperatureC: number;
  temperatureTextAr: string;
  temperatureTextEn: string;
  weatherConditionAr: string;
  weatherConditionEn: string;
  sunsetCountdownTextAr: string;
  sunsetCountdownTextEn: string;
  trafficStatusAr: string;
  trafficStatusEn: string;
}

/**
 * Calculates dynamic atmosphere, realistic Jeddah weather, and sunset countdown.
 */
export function getJeddahAtmosphere(): JeddahAtmosphere {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMinutesNow = hours * 60 + minutes;

  // Approximate sunset in Jeddah (18:30 / 6:30 PM = 1110 minutes)
  const sunsetMinutes = 18 * 60 + 30;

  let sunsetCountdownTextAr = 'انقضى وقت الغروب اليوم 🌙';
  let sunsetCountdownTextEn = 'Sunset completed for today 🌙';

  if (totalMinutesNow < sunsetMinutes) {
    const diff = sunsetMinutes - totalMinutesNow;
    const diffHours = Math.floor(diff / 60);
    const diffMins = diff % 60;

    if (diffHours > 0) {
      sunsetCountdownTextAr = `باقي على الغروب: ${diffHours} س و ${diffMins} د 🌅`;
      sunsetCountdownTextEn = `${diffHours}h ${diffMins}m to Sunset 🌅`;
    } else {
      sunsetCountdownTextAr = `باقي على الغروب: ${diffMins} دقيقة 🌅`;
      sunsetCountdownTextEn = `${diffMins} mins to Sunset 🌅`;
    }
  }

  // Realistic Jeddah Temperature by Hour:
  // Night (00:00 - 06:00): 28°C
  // Morning (06:00 - 11:00): 30°C
  // Midday / Afternoon (11:00 - 16:30): 33°C
  // Sunset (16:30 - 18:45): 31°C
  // Evening (18:45 - 23:59): 29°C

  if (totalMinutesNow >= 360 && totalMinutesNow < 990) {
    // Daytime (06:00 - 16:30)
    const temp = totalMinutesNow >= 660 ? 33 : 30;
    return {
      phase: 'daytime',
      phaseNameAr: 'أجواء نهارية بحرية',
      phaseNameEn: 'Coastal Daytime',
      gradientClass: 'from-[#0B0F19] via-[#10192B] to-[#0B0F19]',
      radialGlowStyle: 'radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.15), transparent 60%)',
      temperatureC: temp,
      temperatureTextAr: `${temp}°C`,
      temperatureTextEn: `${temp}°C`,
      weatherConditionAr: 'نسيم بحري معتدل ورطب',
      weatherConditionEn: 'Coastal breeze & pleasant humidity',
      sunsetCountdownTextAr,
      sunsetCountdownTextEn,
      trafficStatusAr: 'الكورنيش وأبحر: حركة انسيابية 🟢',
      trafficStatusEn: 'Corniche & Obhur: Smooth Flow 🟢',
    };
  } else if (totalMinutesNow >= 990 && totalMinutesNow < 1125) {
    // Golden Hour (16:30 - 18:45)
    return {
      phase: 'golden_hour',
      phaseNameAr: 'روقان الغروب الذهبي',
      phaseNameEn: 'Golden Hour Sunset',
      gradientClass: 'from-[#0B0F19] via-[#1A1828] to-[#0B0F19]',
      radialGlowStyle: 'radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.2), rgba(255, 90, 95, 0.15), transparent 70%)',
      temperatureC: 31,
      temperatureTextAr: '31°C',
      temperatureTextEn: '31°C',
      weatherConditionAr: 'أجواء غروب عليلة ورايقة',
      weatherConditionEn: 'Pleasant sunset breeze',
      sunsetCountdownTextAr,
      sunsetCountdownTextEn,
      trafficStatusAr: 'طريق الملك والكورنيش: نشط بانسيابية 🟡',
      trafficStatusEn: 'King Road & Waterfront: Active 🟡',
    };
  } else {
    // Nightlife (18:45 - 05:59)
    const temp = totalMinutesNow >= 1380 || totalMinutesNow < 360 ? 28 : 29;
    return {
      phase: 'nightlife',
      phaseNameAr: 'سهرة ليالي جدة',
      phaseNameEn: 'Jeddah Nightlife',
      gradientClass: 'from-[#0B0F19] via-[#0E1524] to-[#0B0F19]',
      radialGlowStyle: 'radial-gradient(circle at 70% 30%, rgba(245, 158, 11, 0.12), rgba(59, 130, 246, 0.1), transparent 70%)',
      temperatureC: temp,
      temperatureTextAr: `${temp}°C`,
      temperatureTextEn: `${temp}°C`,
      weatherConditionAr: 'سهرات بحرية منعشة',
      weatherConditionEn: 'Refreshing evening air',
      sunsetCountdownTextAr,
      sunsetCountdownTextEn,
      trafficStatusAr: 'البلد والروضة: سهرات رايقة 🟢',
      trafficStatusEn: 'Al-Balad & Al-Rawdah: Clear 🟢',
    };
  }
}
