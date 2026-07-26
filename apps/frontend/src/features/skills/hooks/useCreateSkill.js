import { useMutation, useQueryClient } from "@tanstack/react-query";
import { skillApi } from "../api/skill.api";
import { skillKeys } from "../constants/skillQueryKeys";

export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => skillApi.createSkill(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillKeys.lists() }),
  });
};
