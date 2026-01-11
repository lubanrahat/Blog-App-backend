import express, { Router } from "express";
import { commentController } from "./comment.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { UserRole } from "../../types/userRole.types";

export default function registerCommentRoutes(): Router {
  const router: Router = express.Router();

  router.get(
    "/:id",
    authMiddleware(UserRole.USER, UserRole.ADMIN),
    commentController.getSingleComment.bind(commentController)
  );

  router.get(
    "/author/:authorId",
    authMiddleware(UserRole.USER, UserRole.ADMIN),
    commentController.getCommentByAuthor.bind(commentController)
  );

  router.post(
    "/",
    authMiddleware(UserRole.USER, UserRole.ADMIN),
    commentController.createComment.bind(commentController)
  );

  router.delete(
    "/:id",
    authMiddleware(UserRole.USER, UserRole.ADMIN),
    commentController.deleteComment.bind(commentController)
  );

  router.put(
    "/:id",
    authMiddleware(UserRole.USER, UserRole.ADMIN),
    commentController.updateComment.bind(commentController)
  );

  return router;
}
