import { useQuery } from "@tanstack/react-query";
import { locationApi } from "../api/location.api";
import { locationKeys } from "../constants/locationQueryKeys";

export const useLocations = (params) => {
  return useQuery({
    queryKey: locationKeys.list(params),
    queryFn: () => locationApi.getLocations(params),
    placeholderData: (prev) => prev,
  });
};
