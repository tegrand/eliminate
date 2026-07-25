import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  ACTIVE: { variant: "success", label: "Active" },
  SUSPENDED: { variant: "secondary", label: "Suspended" },
  INACTIVE: { variant: "default", label: "Inactive" },
};

export default function ClientStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
