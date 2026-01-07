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
  baseURL: env?.BASE_URL,
  trustedOrigins: [env?.BASE_URL, env?.CLIENT_URL],
  secret: env?.BETTER_AUTH_SECRET,
  advanced: {
    generateId: false,
    cookiePrefix: "blog-app",
    disableOriginCheck: true,
  },
  account: {
    accountLinking: {
      enabled: false,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
});
