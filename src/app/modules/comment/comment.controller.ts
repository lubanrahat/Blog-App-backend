import type { Request, Response } from "express";
import { createCommentSchema } from "../../validation/comment.validation";
import { commentService } from "./comment.service";

class CommentController {
  public async createComment(req: Request, res: Response): Promise<Response> {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.body.authorId = user?.id;

    const result = createCommentSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    try {
      const comment = await commentService.createComment(result.data);

      return res.status(201).json({
        success: true,
        message: "Comment created successfully",
        data: comment,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create comment",
      });
    }
  }

  public async getSingleComment(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment id is required",
      });
    }
    try {
      const comment = await commentService.getSingleComment(id as string);

      return res.status(200).json({
        success: true,
        message: "Comment fetched successfully",
        data: comment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch comment",
      });
    }
  }

  public async getCommentByAuthor(req: Request, res: Response): Promise<Response> {
    const { authorId } = req.params;
    if (!authorId) {
      return res.status(400).json({
        success: false,
        message: "Author id is required",
      });
    }
    try {
      const comments = await commentService.getCommentByAuthor(authorId);

      return res.status(200).json({
        success: true,
        message: "Comments fetched successfully",
        data: comments,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to fetch comments",
      });
    }
  }

  public async deleteComment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = req.user?.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment id is required",
      });
    }
    try {
      const comment = await commentService.deleteComment(id as string,userId as string);

      return res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
        data: comment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to delete comment",
      });
    }
  }

  public async updateComment(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Comment id is required",
      });
    }
    try {
      const comment = await commentService.updateComment(id as string, req.body, req.user?.id as string);

      return res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: comment,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update comment",
      });
    }
  }
}

export const commentController = new CommentController();
