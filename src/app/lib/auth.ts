import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  baseURL: env?.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: env?.BETTER_AUTH_SECRET,
  trustedOrigins: [env?.CLIENT_URL],
});
