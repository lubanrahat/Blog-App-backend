import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { UserRole } from "../types/userRole.types";

async function seedAdmin() {
  try {
    console.log("***** Admin Seeding Started *****");

    const adminData = {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      role: UserRole.ADMIN,
      password: env.ADMIN_PASSWORD,
    };

    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (existingUser) {
      console.log("Admin already exists. Skipping seed.");
      return;
    }

    const res = await fetch("http://localhost:8080/api/auth/sign-up/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(adminData),
    });

    if (!res.ok) {
      const error = await res.text();
      throw new Error(`Signup failed: ${error}`);
    }

    await prisma.user.updateMany({
      where: { email: adminData.email },
      data: { emailVerified: true },
    });

    console.log("✅ Admin created & email verified");
    console.log("***** SUCCESS *****");
  } catch (error) {
    console.error("❌ Admin seeding failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
