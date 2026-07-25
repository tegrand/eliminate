import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "../api/attendance.api";
import { attendanceKeys } from "../constants/attendanceQueryKeys";

export const useAttendance = (params) => {
  return useQuery({
    queryKey: attendanceKeys.list(params),
    queryFn: () => attendanceApi.getAttendance(params),
    placeholderData: (previousData) => previousData,
  });
};
