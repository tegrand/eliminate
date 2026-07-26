import { useMutation, useQueryClient } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";
import { agencyKeys } from "../constants/agencyQueryKeys";

export const useDeleteAgency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => agencyApi.deleteAgency(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agencyKeys.lists() });
    },
  });

  return {
    deleteAgency: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
