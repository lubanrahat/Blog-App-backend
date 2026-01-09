import type { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";

export type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
};

export type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: SortOrder;
};
