import { prisma } from "../../lib/prisma";
import type { CreatePostInput } from "../../types/post.types";

class PostService {
  public async createPost(payload: CreatePostInput) {

    const { title, content, tags, authorId } = payload;

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
}

export const postService = new PostService();
