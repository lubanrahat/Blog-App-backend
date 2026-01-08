import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  CLIENT_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  BASE_URL: z.string().url(),
  MAILTRAP_HOST: z.string(),
  MAILTRAP_PORT: z.string(),
  MAILTRAP_USER: z.string(),
  MAILTRAP_PASS: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z.string(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }
  return validationResult.data;
}

export const env = createEnv(process.env);
