import { useQuery } from "@tanstack/react-query";
import { jobRequirementApi } from "../api/jobRequirement.api";
import { jobRequirementKeys } from "../constants/jobRequirementQueryKeys";

export const useJobRequirements = (params) => {
  return useQuery({
    queryKey: jobRequirementKeys.list(params),
    queryFn: () => jobRequirementApi.getJobRequirements(params),
    placeholderData: (previousData) => previousData,
  });
};
