import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../constants/clientQueryKeys";

export const useClient = (id) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => clientApi.getClientById(id),
    enabled: !!id,
  });
};
