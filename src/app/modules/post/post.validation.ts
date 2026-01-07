import { z } from "zod";

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(500, "Title must be less than 500 characters"),

  content: z
    .string()
    .min(1, "Content is required"),

  tags: z
    .array(z.string().min(1))
    .min(1, "At least one tag is required"),

  authorId: z
    .string()
    .min(1, "Author ID is required"),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
