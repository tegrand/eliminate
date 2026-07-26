import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  ACTIVE: { variant: "success", label: "active" },
  SUSPENDED: { variant: "secondary", label: "suspended" },
  INACTIVE: { variant: "default", label: "inactive" },
  PENDING: { variant: "warning", label: "pending" },
  APPROVED: { variant: "success", label: "approved" },
  REJECTED: { variant: "danger", label: "rejected" },
};

export default function ClientStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status?.toLowerCase() || '' };
  return <Badge variant={config.variant} className="capitalize">{config.label}</Badge>;
}
