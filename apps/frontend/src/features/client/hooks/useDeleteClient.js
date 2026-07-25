import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../constants/clientQueryKeys";

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id) => clientApi.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });

  return {
    deleteClient: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
