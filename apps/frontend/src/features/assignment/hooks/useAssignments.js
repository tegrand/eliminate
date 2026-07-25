import { useQuery } from "@tanstack/react-query";
import { assignmentApi } from "../api/assignment.api";
import { assignmentKeys } from "../constants/assignmentQueryKeys";

export const useAssignments = (params) => {
  return useQuery({
    queryKey: assignmentKeys.list(params),
    queryFn: () => assignmentApi.getAssignments(params),
    placeholderData: (previousData) => previousData,
  });
};
