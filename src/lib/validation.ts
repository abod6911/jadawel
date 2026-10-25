import { z } from 'zod';

/**
 * Sanitizes generic user or URL text against XSS and control character injection
 */
export function sanitizeInput(text: string): string {
  if (!text) return '';
  return text
    .replace(/[<>'"`;()]/g, '') // Strip script injection punctuation
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Strip control characters
    .trim();
}

/**
 * Strict schema for decoding shareable URL query parameters
 */
export const SharedPlanParamsSchema = z.object({
  share: z.string().optional(),
  d: z
    .string()
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid district format')
    .optional(),
  c: z
    .string()
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid companion format')
    .optional(),
  b: z
    .string()
    .max(30)
    .regex(/^[a-zA-Z0-9_$-]+$/, 'Invalid budget format')
    .optional(),
  t: z
    .string()
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid duration format')
    .optional(),
  v: z
    .string()
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid vibe format')
    .optional(),
  stops: z
    .string()
    .min(1)
    .max(400)
    .regex(/^[a-zA-Z0-9_,-]+$/, 'Stops parameter must only contain alphanumeric slugs and commas'),
});

export type ValidatedSharedParams = z.infer<typeof SharedPlanParamsSchema>;

/**
 * Validates and safely parses URLSearchParams into validated parameters
 */
export function validateSharedPlanParams(
  params: URLSearchParams
): ValidatedSharedParams | null {
  try {
    const raw = {
      share: params.get('share') || undefined,
      d: params.get('d') || undefined,
      c: params.get('c') || undefined,
      b: params.get('b') || undefined,
      t: params.get('t') || undefined,
      v: params.get('v') || undefined,
      stops: params.get('stops') || undefined,
    };

    const parsed = SharedPlanParamsSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn('Security: Rejected malicious or malformed share parameters:', parsed.error.issues);
      return null;
    }

    return parsed.data;
  } catch (err) {
    console.error('Security validation exception:', err);
    return null;
  }
}
