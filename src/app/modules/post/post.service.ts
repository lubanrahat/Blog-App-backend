import type { Post } from "../../../../generated/prisma/browser";
import {
  CommentStatus,
  type PostStatus,
} from "../../../../generated/prisma/enums";
import type { PostWhereInput } from "../../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import type { CreatePostInput } from "../../types/post.types";

class PostService {
  public async createPost(payload: CreatePostInput, authorId: string) {
    const { title, content, tags } = payload;

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        tags,
        authorId,
      },
    });

    return newPost;
  }

  public async getAllPosts(
    search?: string,
    tags?: string[],
    idFeatured?: boolean | undefined,
    status?: PostStatus | undefined,
    authorId?: string | undefined,
    page?: number,
    limit?: number,
    skip?: number,
    sortBy?: string | undefined,
    sortOrder?: "asc" | "desc"
  ) {
    const andConditions: PostWhereInput[] = [];

    if (search) {
      andConditions.push({
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: search,
            },
          },
        ],
      });
    }

    if (typeof idFeatured === "boolean") {
      andConditions.push({
        idFeatured: idFeatured,
      });
    }

    if (status) {
      andConditions.push({
        status: status,
      });
    }

    if (authorId) {
      andConditions.push({
        authorId: authorId,
      });
    }

    if (tags && tags.length > 0) {
      andConditions.push({
        tags: {
          hasEvery: tags,
        },
      });
    }

    const posts = await prisma.post.findMany({
      take: limit,
      skip: skip,
      where: andConditions.length > 0 ? { AND: andConditions } : {},
      orderBy: {
        [sortBy || "createdAt"]: sortOrder || "desc",
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    const count = await prisma.post.count({
      where: andConditions.length > 0 ? { AND: andConditions } : {},
    });

    return {
      data: posts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / (limit || 1)),
      },
    };
  }

  public async getSinglePost(postId: string) {
    return await prisma.$transaction(async (tx) => {
      const post = await tx.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (!post) {
        throw new Error("Post not found");
      }

      await tx.post.update({
        where: {
          id: postId,
        },
        data: {
          views: {
            increment: 1,
          },
        },
      });

      const updatedPost = await tx.post.findUnique({
        where: {
          id: postId,
        },
        include: {
          comments: {
            where: {
              parentId: null,
              status: CommentStatus.APPROVED,
            },
            orderBy: {
              createdAt: "desc",
            },
            include: {
              replies: {
                where: {
                  status: CommentStatus.APPROVED,
                },
                orderBy: {
                  createdAt: "desc",
                },
                include: {
                  replies: {
                    where: {
                      status: CommentStatus.APPROVED,
                    },
                    orderBy: {
                      createdAt: "desc",
                    },
                  },
                },
              },
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
      });

      return updatedPost;
    });
  }

  public async getMyPosts(authorId: string) {
    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    if (!author) {
      throw new Error("Author not found");
    }
    if (author.status !== "ACTIVE") {
      throw new Error("User must be Active");
    }
    return await prisma.post.findMany({
      where: {
        authorId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
  }

  public async updatePost(
    postId: string,
    payload: Partial<Post>,
    authorId: string,
    isAdmin: Boolean
  ) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    if (!isAdmin && post.authorId !== authorId) {
      throw new Error("You are not authorized to update this post");
    }
    if (!isAdmin) {
      delete payload.idFeatured;
    }
    return await prisma.post.update({
      where: {
        id: postId,
      },
      data: payload,
    });
  }

  public async deletePost(postId: string, authorId: string, isAdmin: Boolean) {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        id: true,
        authorId: true,
      },
    });
    if (!post) {
      throw new Error("Post not found");
    }
    if (!isAdmin && post.authorId !== authorId) {
      throw new Error("You are not authorized to delete this post");
    }
    return await prisma.post.delete({
      where: {
        id: postId,
      },
    });
  }

  public async getStaticPosts() {
    return await prisma.$transaction(async (tx) => {
      const [
        totalPosts,
        publishedPosts,
        archivedPosts,
        draftPosts,
        totalComments,
        totalUsers,
        totalAdmins,
        totalNormalUsers,
        totalViews,
      ] = await Promise.all([
        tx.post.count(),
        tx.post.count({
          where: { status: "PUBLISHED" },
        }),
        tx.post.count({
          where: { status: "ARCHIVED" },
        }),
        tx.post.count({
          where: { status: "DRAFT" },
        }),
        tx.comment.count(),
        tx.user.count(),
        tx.user.count({
          where: { role: "ADMIN" },
        }),
        tx.user.count({
          where: { role: "USER" },
        }),
        tx.post.aggregate({
          _sum: {
            views: true,
          },
        }),
      ]);

      return {
        totalPosts,
        publishedPosts,
        archivedPosts,
        draftPosts,
        totalComments,
        totalUsers,
        totalAdmins,
        totalNormalUsers,
        totalViews: totalViews._sum?.views || 0,
      };
    });
  }
}

export const postService = new PostService();
