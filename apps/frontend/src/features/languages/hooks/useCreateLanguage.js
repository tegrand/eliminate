import { useMutation, useQueryClient } from "@tanstack/react-query";
import { languageApi } from "../api/language.api";
import { languageKeys } from "../constants/languageQueryKeys";

export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => languageApi.createLanguage(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: languageKeys.lists() }),
  });
};
