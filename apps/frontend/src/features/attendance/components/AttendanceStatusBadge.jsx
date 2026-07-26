import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  VERIFIED: { variant: "success", label: "Verified" },
  PRESENT: { variant: "success", label: "Present" },
  LATE: { variant: "warning", label: "Late" },
  PENDING: { variant: "warning", label: "Pending Verification" },
  ABSENT: { variant: "error", label: "Absent" },
  EXCUSED: { variant: "default", label: "Excused" },
};

export default function AttendanceStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
