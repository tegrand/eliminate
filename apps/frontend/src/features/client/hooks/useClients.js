import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { clientKeys } from "../constants/clientQueryKeys";

export const useClients = (params) => {
  return useQuery({
    queryKey: clientKeys.list(params),
    queryFn: () => clientApi.getClients(params),
    placeholderData: (previousData) => previousData,
  });
};
