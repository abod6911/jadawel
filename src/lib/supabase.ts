/**
 * High-Concurrency Supabase Connection Architecture
 * Enforces transaction pooling via PgBouncer/Supavisor (Port 6543)
 * Protects against Connection Starvation and backend saturation under heavy traffic spikes.
 */

// Helper to sanitize and enforce transaction pooler port (6543)
export function enforceTransactionPoolerUrl(connectionUrl: string): string {
  if (!connectionUrl) return '';

  // If a developer accidentally provides direct port 5432, enforce PgBouncer transaction port 6543
  if (connectionUrl.includes(':5432')) {
    console.warn(
      '[Supabase Architecture Alert]: Direct session port 5432 detected. Rerouting to Transaction Pooler (Port 6543) to prevent connection starvation.'
    );
    return connectionUrl.replace(':5432', ':6543');
  }

  return connectionUrl;
}

/**
 * Supabase High-Concurrency Architecture Guidelines & Edge Client Factory
 */
export const SUPABASE_ARCHITECTURE_CONFIG = {
  poolerPort: 6543,
  poolMode: 'transaction' as const,
  statementTimeoutMs: 3000,
  maxConnectionsPerWorker: 5,
  defaultSelectLimit: 50,
  indexedColumns: [
    'plans.share_slug',
    'plans.user_id',
    'plans.created_at',
    'plan_stops.plan_id',
    'plan_stops.place_id',
    'places.district',
    'places.category',
    'places.slug',
  ],
};
