import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { categoryKeys } from "../constants/categoryQueryKeys";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => categoryApi.deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
};
