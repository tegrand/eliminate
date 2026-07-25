import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";
import { agencyKeys } from "../constants/agencyQueryKeys";

export const useUpdateAgency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => agencyApi.updateAgency(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: agencyKeys.detail(variables.id) });
    },
  });

  return {
    updateAgency: (id, data) => mutation.mutateAsync({ id, data }),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
