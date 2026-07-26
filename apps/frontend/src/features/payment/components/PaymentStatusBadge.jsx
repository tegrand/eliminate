import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  COMPLETED: { variant: "success", label: "Completed" },
  PROCESSING: { variant: "warning", label: "Processing" },
  FAILED: { variant: "error", label: "Failed" },
  PENDING: { variant: "default", label: "Pending" },
};

export default function PaymentStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
