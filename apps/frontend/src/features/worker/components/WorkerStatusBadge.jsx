import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  ACTIVE: { variant: "success", label: "Active" },
  ON_LEAVE: { variant: "warning", label: "On Leave" },
  INACTIVE: { variant: "error", label: "Inactive" },
};

export default function WorkerStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
