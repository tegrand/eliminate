import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { categoryKeys } from "../constants/categoryQueryKeys";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => categoryApi.createCategory(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.lists() }),
  });
};
