import express, { type Router } from "express";
import { postController } from "./post.controller";

export default function registerPostRoutes(): Router {
  const router = express.Router();

  router.post("/create-post", postController.createPost.bind(postController));

  return router;
}
