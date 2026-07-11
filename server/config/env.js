import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// In production JWT_SECRET MUST be set via environment variable — no default allowed.
// In development a fallback is permitted but logged as a warning.
const DEV_JWT_FALLBACK = 'cidedec-dev-only-insecure-jwt-secret-do-not-use-in-production';
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET environment variable is not set. Refusing to start in production.');
  process.exit(1);
}
if (process.env.NODE_ENV !== 'production' && !process.env.JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET not set — using insecure dev fallback. Never deploy without a real secret.');
}

const envSchema = z.object({
  PORT: z.coerce.number().default(3001),
  JWT_SECRET: z.string().default(DEV_JWT_FALLBACK),
  DATABASE_FILE: z.string().default('database.sqlite'),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default('gemini-1.5-flash'),
  AI_PROVIDER: z.enum(['gemini', 'openai', 'anthropic', 'deepseek']).default('gemini'),
  ENABLE_GEMINI: z.coerce.string().transform(val => val === 'true').default('true'),
  ENABLE_JOB_API: z.coerce.string().transform(val => val === 'true').default('true'),
  ENABLE_ANALYTICS: z.coerce.string().transform(val => val === 'true').default('true'),
  ENABLE_GAMIFICATION: z.coerce.string().transform(val => val === 'true').default('true'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Environment validation failed:', JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
export default env;
