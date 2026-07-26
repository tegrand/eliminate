import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../api/worker.api";

export const useWorkers = (params) => {
  return useQuery({
    queryKey: ["workers", params],
    queryFn: () => workerApi.getWorkers(params),
    placeholderData: (previousData) => previousData,
  });
};
