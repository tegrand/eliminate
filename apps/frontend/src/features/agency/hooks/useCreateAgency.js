import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";
import { agencyKeys } from "../constants/agencyQueryKeys";

export const useCreateAgency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => agencyApi.createAgency(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists() });
    },
  });

  return {
    createAgency: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
