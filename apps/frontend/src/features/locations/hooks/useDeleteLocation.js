import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationApi } from "../api/location.api";
import { locationKeys } from "../constants/locationQueryKeys";

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => locationApi.deleteLocation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: locationKeys.lists() }),
  });
};
