import { z } from "zod";

export const createCommentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Content is required")
    .max(100, "Comment is too long"),
  postId: z
    .string()
    .min(1, "Post ID is required"),  

  authorId: z
    .string()
    .min(1, "Author ID is required"),

  parentId: z
    .string()
    .optional(), 
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
