import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGODB_URI: z.string().url(),
  JWT_SECRET: z.string().min(10),
  JWT_REFRESH_SECRET: z.string().min(10),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  CLOUDINARY_CLOUD_NAME: z.string().default('placeholder'),
  CLOUDINARY_API_KEY: z.string().default('placeholder'),
  CLOUDINARY_API_SECRET: z.string().default('placeholder'),
  GEMINI_API_KEY: z.string().min(1, "Gemini API key is required").default('mock_key'), // Default allowed since AI_PROVIDER can be mock
  GEMINI_MODEL: z.string().default('gemini-3.5-flash'),
  AI_PROVIDER: z.enum(['mock', 'gemini', 'openai', 'claude']).default('mock'),
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),
  RAZORPAY_PRO_PLAN_ID: z.string(),
  RAZORPAY_WEBHOOK_SECRET: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
