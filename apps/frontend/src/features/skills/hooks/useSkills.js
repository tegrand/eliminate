import { useQuery } from "@tanstack/react-query";
import { skillApi } from "../api/skill.api";
import { skillKeys } from "../constants/skillQueryKeys";

export const useSkills = (params) => {
  return useQuery({
    queryKey: skillKeys.list(params),
    queryFn: () => skillApi.getSkills(params),
    placeholderData: (prev) => prev,
  });
};
