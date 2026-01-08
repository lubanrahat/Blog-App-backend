import type { Request, Response } from "express";
import { postService } from "./post.service";
import { createPostSchema } from "../../validation/post.validation";
import { PostStatus } from "../../../../generated/prisma/enums";

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

  public async getAllPosts(req: Request, res: Response): Promise<Response> {
    try {
      const search = req.query.search as string | undefined;

      const tags =
        typeof req.query.tags === "string" ? req.query.tags.split(",") : [];

      const isFeatured =
        req.query.idFeatured === "true"
          ? true
          : req.query.idFeatured === "false"
          ? false
          : undefined;

      const statusParam = req.query.status;
      const status: PostStatus | undefined =
        typeof statusParam === "string" &&
        Object.values(PostStatus).includes(statusParam as PostStatus)
          ? (statusParam as PostStatus)
          : undefined;

      const authorId = req.query.authorId as string | undefined;    

      const posts = await postService.getAllPosts(
        search,
        tags,
        isFeatured,
        status,
        authorId
      );

      return res.status(200).json({
        success: true,
        message: "Posts fetched successfully",
        data: posts,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch posts",
      });
    }
  }
}

export const postController = new PostController();
