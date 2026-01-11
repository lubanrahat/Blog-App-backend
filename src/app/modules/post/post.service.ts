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
      const post = await tx.post.findUnique({
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
          }
        },
      });

      return post;
    });
  }

  public async getMyPosts(authorId: string) {
    const author = await prisma.user.findUnique({
      where: {
        id: authorId
      },
    });
    if (!author) {
      throw new Error("Author not found");
    }
    if(author.status !== "ACTIVE") {
      throw new Error("User must be Active")
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
            comments: true
          }
        }
      }
    });

  }
}

export const postService = new PostService();
