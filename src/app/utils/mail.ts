import Mailgen from "mailgen";
import nodemailer, { type Transporter } from "nodemailer";
import type { MailgenContent, SendEmailOptions } from "../types/mail.types";
import { env } from "../config/env";

const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Prisma Blog App",
      link: "https://blog.app",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter: Transporter = nodemailer.createTransport({
    host: env.MAILTRAP_HOST,
    port: Number(env.MAILTRAP_PORT) ,
    secure: false,
    auth: {
      user: env.MAILTRAP_USER,
      pass: env.MAILTRAP_PASS,
    },
  });

  const mail = {
    from: "mail.blog.app@example.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure you have provided your MAILTRAP credentials in the .env file"
    );
    console.error("Error:", error);
  }
};

//Mailgen Contents

const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string
): MailgenContent => {
  return {
    body: {
      name: username,
      intro:
        "Welcome to Prisma Blog! Your account has been created successfully.",

      action: {
        instructions:
          "To activate your account and start publishing posts, please verify your email address by clicking the button below:",
        button: {
          color: "#4F46E5", 
          text: "Verify Email Address",
          link: verificationUrl,
        },
      },

      outro:
        "If you didn’t create this account, you can safely ignore this email. Need help? Just reply and our team will assist you.",
    },
  };
};

export { sendEmail, emailVerificationMailgenContent };
