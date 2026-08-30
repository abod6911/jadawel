-- ==============================================================================
-- JADAWEL (جداول) - SUPABASE POSTGRESQL DATABASE SCHEMA & RLS POLICIES
-- ==============================================================================

-- 1. PLACES TABLE (دليل وجهات ومعالم جدة)
CREATE TABLE IF NOT EXISTS public.places (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  avg_cost_sar NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_mins INT NOT NULL DEFAULT 60,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  review_count INT NOT NULL DEFAULT 0,
  indoor_outdoor TEXT CHECK (indoor_outdoor IN ('indoor', 'outdoor', 'hybrid')),
  opening_time TIME NOT NULL DEFAULT '00:00:00',
  closing_time TIME NOT NULL DEFAULT '23:59:59',
  photos TEXT[] DEFAULT '{}',
  ai_reasoning_ar TEXT,
  ai_reasoning_en TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PLANS TABLE (جداول وخطط الرحلات)
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  archetype TEXT NOT NULL,
  total_cost_sar NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_distance_km NUMERIC(5,2) NOT NULL DEFAULT 0,
  companion TEXT NOT NULL DEFAULT 'friends',
  is_public BOOLEAN DEFAULT true,
  share_slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PLAN STOPS TABLE (محطات خط السير)
CREATE TABLE IF NOT EXISTS public.plan_stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  place_id UUID REFERENCES public.places(id) ON DELETE RESTRICT,
  stop_order INT NOT NULL,
  time_slot TEXT NOT NULL,
  estimated_cost_sar NUMERIC(10,2) NOT NULL DEFAULT 0,
  transit_time_minutes INT DEFAULT 0,
  transit_distance_km NUMERIC(5,2) DEFAULT 0
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_places_district ON public.places(district);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);
CREATE INDEX IF NOT EXISTS idx_places_slug ON public.places(slug);

CREATE INDEX IF NOT EXISTS idx_plans_share_slug ON public.plans(share_slug);
CREATE INDEX IF NOT EXISTS idx_plans_user_id ON public.plans(user_id);
CREATE INDEX IF NOT EXISTS idx_plans_is_public ON public.plans(is_public);

CREATE INDEX IF NOT EXISTS idx_plan_stops_plan_id ON public.plan_stops(plan_id);
CREATE INDEX IF NOT EXISTS idx_plan_stops_place_id ON public.plan_stops(place_id);
CREATE INDEX IF NOT EXISTS idx_plan_stops_order ON public.plan_stops(plan_id, stop_order);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_stops ENABLE ROW LEVEL SECURITY;

-- PLACES POLICIES (Public read-only)
CREATE POLICY "Public places viewable by all" 
ON public.places 
FOR SELECT 
USING (true);

-- PLANS POLICIES
CREATE POLICY "Public plans viewable by slug" 
ON public.plans 
FOR SELECT 
USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Anyone can create plans" 
ON public.plans 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own plans" 
ON public.plans 
FOR UPDATE 
USING (auth.uid() = user_id);

-- PLAN STOPS POLICIES
CREATE POLICY "Plan stops viewable if plan is viewable" 
ON public.plan_stops 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.plans 
    WHERE public.plans.id = public.plan_stops.plan_id 
    AND (public.plans.is_public = true OR auth.uid() = public.plans.user_id)
  )
);

CREATE POLICY "Anyone can insert plan stops with plan" 
ON public.plan_stops 
FOR INSERT 
WITH CHECK (true);
