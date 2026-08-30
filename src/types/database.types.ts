export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      places: {
        Row: {
          id: string;
          slug: string;
          name_ar: string;
          name_en: string;
          category: string;
          district: string;
          lat: number;
          lng: number;
          avg_cost_sar: number;
          duration_mins: number;
          rating: number;
          review_count: number;
          indoor_outdoor: 'indoor' | 'outdoor' | 'hybrid' | null;
          opening_time: string;
          closing_time: string;
          photos: string[];
          ai_reasoning_ar: string | null;
          ai_reasoning_en: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_ar: string;
          name_en: string;
          category: string;
          district: string;
          lat: number;
          lng: number;
          avg_cost_sar?: number;
          duration_mins?: number;
          rating?: number;
          review_count?: number;
          indoor_outdoor?: 'indoor' | 'outdoor' | 'hybrid' | null;
          opening_time?: string;
          closing_time?: string;
          photos?: string[];
          ai_reasoning_ar?: string | null;
          ai_reasoning_en?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_ar?: string;
          name_en?: string;
          category?: string;
          district?: string;
          lat?: number;
          lng?: number;
          avg_cost_sar?: number;
          duration_mins?: number;
          rating?: number;
          review_count?: number;
          indoor_outdoor?: 'indoor' | 'outdoor' | 'hybrid' | null;
          opening_time?: string;
          closing_time?: string;
          photos?: string[];
          ai_reasoning_ar?: string | null;
          ai_reasoning_en?: string | null;
          created_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          user_id: string | null;
          title_ar: string;
          title_en: string;
          archetype: string;
          total_cost_sar: number;
          total_distance_km: number;
          companion: string;
          is_public: boolean;
          share_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title_ar: string;
          title_en: string;
          archetype: string;
          total_cost_sar: number;
          total_distance_km: number;
          companion?: string;
          is_public?: boolean;
          share_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title_ar?: string;
          title_en?: string;
          archetype?: string;
          total_cost_sar?: number;
          total_distance_km?: number;
          companion?: string;
          is_public?: boolean;
          share_slug?: string;
          created_at?: string;
        };
      };
      plan_stops: {
        Row: {
          id: string;
          plan_id: string;
          place_id: string | null;
          stop_order: number;
          time_slot: string;
          estimated_cost_sar: number;
          transit_time_minutes: number | null;
          transit_distance_km: number | null;
        };
        Insert: {
          id?: string;
          plan_id: string;
          place_id?: string | null;
          stop_order: number;
          time_slot: string;
          estimated_cost_sar: number;
          transit_time_minutes?: number | null;
          transit_distance_km?: number | null;
        };
        Update: {
          id?: string;
          plan_id?: string;
          place_id?: string | null;
          stop_order?: number;
          time_slot?: string;
          estimated_cost_sar?: number;
          transit_time_minutes?: number | null;
          transit_distance_km?: number | null;
        };
      };
    };
  };
}
