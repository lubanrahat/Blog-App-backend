import type { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import type { UserRole } from "../types/userRole.types";

export const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(401).json({
          success: false,
          message: "Email not verified. Please verify your email first.",
        });
      }

      const userRole = session.user.role as UserRole;

      if (roles.length > 0 && !roles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden! You are not allowed to access this resource",
        });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: userRole,
        emailVerified: session.user.emailVerified,
      };

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};
