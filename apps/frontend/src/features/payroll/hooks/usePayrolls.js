import { useQuery } from "@tanstack/react-query";
import { payrollApi } from "../api/payroll.api";
import { payrollKeys } from "../constants/payrollQueryKeys";

export const usePayrolls = (params) => {
  return useQuery({
    queryKey: payrollKeys.list(params),
    queryFn: () => payrollApi.getPayrolls(params),
    placeholderData: (previousData) => previousData,
  });
};
