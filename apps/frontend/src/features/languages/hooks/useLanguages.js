import { useQuery } from "@tanstack/react-query";
import { languageApi } from "../api/language.api";
import { languageKeys } from "../constants/languageQueryKeys";

export const useLanguages = (params) => {
  return useQuery({
    queryKey: languageKeys.list(params),
    queryFn: () => languageApi.getLanguages(params),
    placeholderData: (prev) => prev,
  });
};
