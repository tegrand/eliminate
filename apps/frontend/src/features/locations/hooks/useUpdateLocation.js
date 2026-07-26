import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationApi } from "../api/location.api";
import { locationKeys } from "../constants/locationQueryKeys";

export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => locationApi.updateLocation(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: locationKeys.lists() }),
  });
};
