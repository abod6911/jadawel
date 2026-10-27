-- ==============================================================================
-- JADAWEL - HIGH-CONCURRENCY INDEX HARDENING & POOLING OPTIMIZATIONS
-- Designed for 20,000+ Concurrent Requests / Spikes
-- ==============================================================================

-- 1. Index on created_at for fast descending chronological feeds
CREATE INDEX IF NOT EXISTS idx_plans_created_at_desc ON public.plans(created_at DESC);

-- 2. Covering composite index for instantaneous plan retrieval by share_slug
CREATE INDEX IF NOT EXISTS idx_plans_lookup_composite 
ON public.plans (share_slug) 
INCLUDE (id, title_ar, title_en, archetype, total_cost_sar, total_distance_km, companion, is_public, created_at);

-- 3. Composite index on plan_stops for instant sorted itinerary retrieval
CREATE INDEX IF NOT EXISTS idx_plan_stops_retrieval 
ON public.plan_stops (plan_id, stop_order) 
INCLUDE (place_id, time_slot, estimated_cost_sar, transit_time_minutes, transit_distance_km);

-- 4. Set statement timeout to prevent query pileups from exhausting connection pool
ALTER DATABASE postgres SET statement_timeout = '3000ms';
