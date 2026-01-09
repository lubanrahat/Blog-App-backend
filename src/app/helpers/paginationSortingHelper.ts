import type { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import type {
  IOptions,
  IOptionsResult,
} from "../types/paginationSortingHelper.type";

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy ?? "createdAt";

  const sortOrder: SortOrder =
    options.sortOrder === "asc" || options.sortOrder === "desc"
      ? options.sortOrder
      : "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
