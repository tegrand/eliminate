import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  ACTIVE: { variant: "success", label: "Active" },
  PENDING: { variant: "warning", label: "Pending" },
  COMPLETED: { variant: "default", label: "Completed" },
  CANCELLED: { variant: "error", label: "Cancelled" },
};

export default function AssignmentStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
