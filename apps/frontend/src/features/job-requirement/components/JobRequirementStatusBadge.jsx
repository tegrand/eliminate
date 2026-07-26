import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  OPEN: { variant: "success", label: "Open" },
  PENDING: { variant: "warning", label: "Pending" },
  FULFILLED: { variant: "default", label: "Fulfilled" },
  CANCELLED: { variant: "error", label: "Cancelled" },
};

export default function JobRequirementStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
