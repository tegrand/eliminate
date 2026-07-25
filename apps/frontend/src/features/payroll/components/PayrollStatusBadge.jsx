import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  PAID: { variant: "success", label: "Paid" },
  APPROVED: { variant: "success", label: "Approved" },
  PENDING_APPROVAL: { variant: "warning", label: "Pending Approval" },
  DRAFT: { variant: "default", label: "Draft" },
  REJECTED: { variant: "error", label: "Rejected" },
};

export default function PayrollStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
