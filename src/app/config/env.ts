import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().optional(),
  CLIENT_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string(),
  BASE_URL: z.string().url(),
});

function createEnv(env: NodeJS.ProcessEnv) {
  const validationResult = envSchema.safeParse(env);
  if (!validationResult.success) {
    throw new Error(validationResult.error.message);
  }
  return validationResult.data;
}

export const env = createEnv(process.env);
