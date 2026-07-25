import { useQuery } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";
import { agencyKeys } from "../constants/agencyQueryKeys";

export const useAgency = (id) => {
  return useQuery({
    queryKey: agencyKeys.detail(id),
    queryFn: () => agencyApi.getAgencyById(id),
    enabled: !!id,
  });
};
