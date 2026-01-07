import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { env } from "../config/env";
import { emailVerificationMailgenContent, sendEmail } from "../utils/mail";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      if (!user?.email) {
        throw new Error("User email is required for email verification");
      }
      const verificationUrl = `${env.BASE_URL}${url}?token=${token}`;
      await sendEmail({
        email: user.email,
        subject: "Verify your email",
        mailgenContent: emailVerificationMailgenContent(
          user.name,
          verificationUrl
        ),
      })
    },
  },
  baseURL: env?.BASE_URL,
  trustedOrigins: [env?.CLIENT_URL],
  secret: env?.BETTER_AUTH_SECRET,
});
