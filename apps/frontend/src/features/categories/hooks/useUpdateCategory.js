import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { categoryKeys } from "../constants/categoryQueryKeys";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => categoryApi.updateCategory(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
};
