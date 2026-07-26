import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { categoryKeys } from "../constants/categoryQueryKeys";

export const useCategories = (params) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryApi.getCategories(params),
    placeholderData: (prev) => prev,
  });
};
