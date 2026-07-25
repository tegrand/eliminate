import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  PAID: { variant: "success", label: "Paid" },
  PARTIAL: { variant: "warning", label: "Partially Paid" },
  UNPAID: { variant: "error", label: "Unpaid" },
  DRAFT: { variant: "default", label: "Draft" },
  OVERDUE: { variant: "error", label: "Overdue" },
};

export default function InvoiceStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
