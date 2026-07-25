import { useMutation, useQueryClient } from "@tanstack/react-query";
import { languageApi } from "../api/language.api";
import { languageKeys } from "../constants/languageQueryKeys";

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => languageApi.updateLanguage(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: languageKeys.lists() }),
  });
};
