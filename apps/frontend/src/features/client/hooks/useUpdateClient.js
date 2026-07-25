import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../constants/clientQueryKeys";

export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => clientApi.updateClient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
    },
  });

  return {
    updateClient: (id, data) => mutation.mutateAsync({ id, data }),
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
