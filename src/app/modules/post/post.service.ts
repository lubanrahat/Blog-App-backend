import { prisma } from "../../lib/prisma";

interface CreatePostInput {
  title: string;
  content: string;
  tags: string[];
  authorId: string;
}

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
