import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationApi } from "../api/location.api";
import { locationKeys } from "../constants/locationQueryKeys";

export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => locationApi.createLocation(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: locationKeys.lists() }),
  });
};
