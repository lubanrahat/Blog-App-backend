import type { PostStatus } from "../../../../generated/prisma/enums";
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
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    return post;
  }
}

export const postService = new PostService();
