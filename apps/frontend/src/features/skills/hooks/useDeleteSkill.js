import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skillApi } from "../api/skill.api";
import { skillKeys } from "../constants/skillQueryKeys";

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => skillApi.deleteSkill(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillKeys.lists() }),
  });
};
