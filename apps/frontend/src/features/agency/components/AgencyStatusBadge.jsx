import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  PENDING: { variant: "warning", label: "Pending" },
  APPROVED: { variant: "success", label: "Approved" },
  REJECTED: { variant: "danger", label: "Rejected" },
  SUSPENDED: { variant: "secondary", label: "Suspended" },
  INACTIVE: { variant: "default", label: "Inactive" },
};

export default function AgencyStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
