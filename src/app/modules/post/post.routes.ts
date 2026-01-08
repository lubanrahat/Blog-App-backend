import express, { type Router } from "express";
import { postController } from "./post.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import type { UserRole } from "../../types/userRole.types";

export default function registerPostRoutes(): Router {
  const router = express.Router();


  router.get("/", postController.getAllPosts.bind(postController));

  router.post(
    "/",
    authMiddleware("USER" as UserRole),
    postController.createPost.bind(postController)
  );

  return router;
}
