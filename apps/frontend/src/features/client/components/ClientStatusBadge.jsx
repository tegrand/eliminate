import { Badge } from "../../../components/ui/badge";

const statusConfig = {
  ACTIVE: { variant: "success", label: "Active" },
  ONBOARDING: { variant: "warning", label: "Onboarding" },
  INACTIVE: { variant: "error", label: "Inactive" },
};

export default function ClientStatusBadge({ status }) {
  const config = statusConfig[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
