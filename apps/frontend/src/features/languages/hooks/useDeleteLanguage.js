import { useMutation, useQueryClient } from "@tanstack/react-query";
import { languageApi } from "../api/language.api";
import { languageKeys } from "../constants/languageQueryKeys";

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => languageApi.deleteLanguage(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: languageKeys.lists() }),
  });
};
