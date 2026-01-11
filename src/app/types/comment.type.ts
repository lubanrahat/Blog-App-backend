export interface CreateCommentInput {
  content: string;
  authorId: string;
  parentId?: string;
}
