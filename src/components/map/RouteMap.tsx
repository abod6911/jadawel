'use client';

import React, { useState, useEffect, Component, ErrorInfo } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Navigation, RefreshCw, AlertTriangle, Compass } from 'lucide-react';
import { Place } from '@/types';

interface MapStop {
  place: Place;
  order?: number;
  timeSlot?: string;
}

export interface RouteMapProps {
  stops: MapStop[];
  className?: string;
  showPolyline?: boolean;
}

// 1. Sleek Skeleton Loader during Lazy Dynamic Import
const MapSkeleton: React.FC<{ stops: MapStop[] }> = ({ stops }) => {
  const validStops = stops.filter((s) => s.place?.coordinates?.lat && s.place?.coordinates?.lng);

  return (
    <div className="w-full h-full min-h-[420px] sm:min-h-[480px] bg-[#0A0D14] rounded-[2rem] sm:rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center space-y-5 border border-[#E5C378]/25 relative overflow-hidden select-none">
      {/* Background Animated Radar Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5C378_1px,transparent_1px)] [background-size:24px_24px] opacity-10 animate-pulse pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[#E5C378]/5 blur-3xl pointer-events-none" />

      {/* Pulsing Icon */}
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-[#E5C378]/15 text-[#E5C378] border border-[#E5C378]/40 flex items-center justify-center shadow-[0_0_25px_rgba(229,195,120,0.3)] animate-pulse">
          <Compass className="w-8 h-8 animate-[spin_8s_linear_infinite]" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E5C378] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E5C378]" />
        </span>
      </div>

      <div className="space-y-1.5 relative z-10 max-w-sm">
        <h4 className="text-base font-black text-white">خريطة مسارات جدة التفاعلية</h4>
        <p className="text-xs text-slate-400 font-medium">جاري تجهيز محطات المسار المرقّمة والتوجيه الملاحي المباشر...</p>
      </div>

      {/* Skeleton Station Nodes */}
      {validStops.length > 0 ? (
        <div className="flex items-center gap-2 pt-2 relative z-10 flex-wrap justify-center">
          {validStops.map((s, idx) => (
            <React.Fragment key={s.place.id || idx}>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#131722]/80 border border-[#E5C378]/30 shadow-md">
                <span className="w-5 h-5 rounded-full bg-[#E5C378] text-[#0A0D14] font-black text-[11px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-white truncate max-w-[100px]">
                  {s.place.nameAr}
                </span>
              </div>
              {idx < validStops.length - 1 && (
                <div className="w-4 h-0.5 bg-[#E5C378]/40 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3 pt-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="w-8 h-8 rounded-full bg-white/10 animate-pulse border border-white/10 flex items-center justify-center text-xs font-black text-white/50">
              {num}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 2. Resilient Error Boundary with Retry and Direct Maps Action
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallbackUrl: string;
  onRetry: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class MapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Leaflet Map rendering error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[420px] sm:min-h-[480px] bg-[#0A0D14] rounded-[2rem] sm:rounded-[2.5rem] p-6 flex flex-col items-center justify-center text-center space-y-4 border border-rose-500/30 relative">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-lg">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-base font-black text-white">تعذر تحميل الخريطة التفاعلية</h4>
            <p className="text-xs text-slate-400 font-medium max-w-sm">
              حدث خطأ أثناء الاتصال ببلاطات الخرائط أو تهيئة طبقات العرض. يمكنك المحاولة مجدداً أو تصفح المسار مباشرة في خرائط جوجل.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                this.props.onRetry();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#E5C378] text-[#0A0D14] font-black text-xs hover:bg-[#F5E2B3] transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة المحاولة</span>
            </button>

            <a
              href={this.props.fallbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>فتح المسار في Google Maps</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// 3. Lazy dynamic import with ssr: false
const LeafletMap = dynamic(() => import('./LeafletMapContent'), {
  ssr: false,
  loading: () => <MapSkeleton stops={[]} />,
});

export const RouteMap: React.FC<RouteMapProps> = ({
  stops,
  className = 'h-full min-h-[480px] w-full',
  showPolyline = true,
}) => {
  const [isClient, setIsClient] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const validStops = stops.filter((s) => s.place?.coordinates?.lat && s.place?.coordinates?.lng);
  const googleMapsUrl = validStops.length >= 2
    ? `https://www.google.com/maps/dir/?api=1&origin=${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}&destination=${validStops[validStops.length - 1].place.coordinates.lat},${validStops[validStops.length - 1].place.coordinates.lng}&waypoints=${validStops.slice(1, -1).map((s) => `${s.place.coordinates.lat},${s.place.coordinates.lng}`).join('|')}`
    : validStops.length === 1
    ? `https://www.google.com/maps/search/?api=1&query=${validStops[0].place.coordinates.lat},${validStops[0].place.coordinates.lng}`
    : 'https://www.google.com/maps';

  if (!isClient) {
    return <MapSkeleton stops={stops} />;
  }

  return (
    <div className={`w-full h-full min-h-[420px] sm:min-h-[480px] lg:min-h-[580px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-cinematic border border-gold-500/30 ${className}`}>
      <MapErrorBoundary
        key={`map-boundary-${retryKey}`}
        fallbackUrl={googleMapsUrl}
        onRetry={() => setRetryKey((k) => k + 1)}
      >
        <LeafletMap stops={stops} showPolyline={showPolyline} />
      </MapErrorBoundary>
    </div>
  );
};

export const InteractiveMap = RouteMap;
export default RouteMap;
