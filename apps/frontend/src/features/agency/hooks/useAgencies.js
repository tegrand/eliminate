import { useQuery } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";

export const useAgencies = (params) => {
  return useQuery({
    queryKey: ["agencies", params],
    queryFn: () => agencyApi.getAgencies(params),
    placeholderData: (previousData) => previousData,
  });
};
