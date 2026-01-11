import type { CommentStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import type { CreateCommentInput } from "../../validation/comment.validation";

class CommentService {
  public async createComment(payload: CreateCommentInput) {
    const postId = prisma.post.findUnique({
      where: {
        id: payload.postId,
      },
    });
    if (!postId) {
      throw new Error("Post not found");
    }
    if (payload.parentId) {
      const parentComment = prisma.comment.findUnique({
        where: {
          id: payload.parentId,
        },
      });
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
    }
    return prisma.comment.create({
      data: {
        content: payload.content,
        authorId: payload.authorId,
        postId: payload.postId,
        parentId: payload.parentId,
      },
    });
  }

  public async getSingleComment(commentId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return comment;
  }

  public async getCommentByAuthor(authorId: string) {

    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    if (!author) {
      throw new Error("Author not found");
    }
    
    const comments = await prisma.comment.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        }
      }
    });

    return comments;
  }

  public async deleteComment(commentId: string, authorId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.authorId !== authorId) {
      throw new Error("You are not authorized to delete this comment");
    }
    return prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  public async updateComment(commentId: string, payload: { content: string,status: CommentStatus }, authorId: string) {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new Error("Comment not found");
    }
    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content: payload.content,
        status: payload.status
      },
    });
  }
}

export const commentService = new CommentService();
