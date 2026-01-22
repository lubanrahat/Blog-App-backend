import type { Request, Response } from "express";
import { postService } from "./post.service";
import { createPostSchema } from "../../validation/post.validation";
import { PostStatus } from "../../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelper";
import { UserRole } from "../../types/userRole.types";

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

      const paginationOptions = paginationSortingHelper({
        page: req.query.page != null ? Number(req.query.page) : undefined,
        limit: req.query.limit != null ? Number(req.query.limit) : undefined,
        sortBy: req.query.sortBy != null ? String(req.query.sortBy) : undefined,
        sortOrder:
          req.query.sortOrder != null
            ? (req.query.sortOrder as "asc" | "desc")
            : undefined,
      });

      console.log("Limit: ", req.query);

      const posts = await postService.getAllPosts(
        search,
        tags,
        isFeatured,
        status,
        authorId,
        paginationOptions.page,
        paginationOptions.limit,
        paginationOptions.skip,
        paginationOptions.sortBy,
        paginationOptions.sortOrder,
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

  public async getSinglePost(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Post id is required",
        });
      }
      const post = await postService.getSinglePost(id as string);

      return res.status(200).json({
        success: true,
        message: "Post fetched successfully",
        data: post,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch post",
      });
    }
  }

  public async getMyPosts(req: Request, res: Response): Promise<Response> {
    try {
      const { authorId } = req.params;
      if (!authorId) {
        return res.status(400).json({
          success: false,
          message: "Author id is required",
        });
      }
      const posts = await postService.getMyPosts(authorId as string);

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

  public async updatePost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId } = req.params;
      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post id is required",
        });
      }

      const isAdmin = req.user?.role === UserRole.ADMIN;

      if (!isAdmin) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const posts = await postService.updatePost(
        postId,
        req.body,
        req.user?.id as string,
        isAdmin,
      );

      return res.status(200).json({
        success: true,
        message: "Posts updated successfully",
        data: posts,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to updated posts",
      });
    }
  }

  public async deletePost(req: Request, res: Response): Promise<Response> {
    try {
      const { postId } = req.params;
      if (!postId) {
        return res.status(400).json({
          success: false,
          message: "Post id is required",
        });
      }

      const isAdmin = req.user?.role === UserRole.ADMIN;

      if (!isAdmin) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const posts = await postService.deletePost(
        postId,
        req.user?.id as string,
        isAdmin,
      );

      return res.status(200).json({
        success: true,
        message: "Posts deleted successfully",
        data: posts,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete posts",
      });
    }
  }

  public async getStaticPosts(req: Request, res: Response): Promise<Response> {
    try {
      const posts = await postService.getStaticPosts();

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
