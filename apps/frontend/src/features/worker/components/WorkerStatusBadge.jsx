import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  PENDING: { variant: "warning", label: "pending" },
  APPROVED: { variant: "success", label: "approved" },
  REJECTED: { variant: "danger", label: "rejected" },
  SUSPENDED: { variant: "secondary", label: "suspended" },
  INACTIVE: { variant: "default", label: "inactive" },
};

export default function WorkerStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status?.toLowerCase() || '' };
  return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>;
}
