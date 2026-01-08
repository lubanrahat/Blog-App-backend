import type { Request, Response } from "express";
import { postService } from "./post.service";
import { createPostSchema } from "../../validation/post.validation";

class PostController {
  public async createPost(req: Request, res: Response): Promise<Response> {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = createPostSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const post = await postService.createPost(req.body, req.user.id);

      return res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: post,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create post",
      });
    }
  }
}

export const postController = new PostController();
