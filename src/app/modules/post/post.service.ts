interface Post {
  title: string;
  content: string;
  tags: string[];
  userId: number;
}
class PostService {
  public createPost(post: Post) {
    const {title, content, tags, userId} = post;
    if(!title || !content || !tags || !userId) {
      throw new Error("Missing required fields");
    }

    const newPost = {
      title,
      content,
      tags,
      userId,
    }
  }
}
