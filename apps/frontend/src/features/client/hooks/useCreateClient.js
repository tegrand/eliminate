import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../constants/clientQueryKeys";

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => clientApi.createClient(data),
    onSuccess: () => {
      // Invalidate all client lists to reflect the new client
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });

  return {
    createClient: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
  };
};
