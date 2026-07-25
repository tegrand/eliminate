import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skillApi } from "../api/skill.api";
import { skillKeys } from "../constants/skillQueryKeys";

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => skillApi.updateSkill(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillKeys.lists() }),
  });
};
