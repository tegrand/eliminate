import { Card, CardContent } from "../../../components/ui/card";
import { DataTable } from "../../../components/ui/data-table";
import { Badge } from "../../../components/ui/badge";

export default function UpcomingRequirements() {
  const columns = [
    { key: "role", title: "Role", render: (row) => <span className="font-medium">{row.role}</span> },
    { key: "client", title: "Client", render: (row) => row.client },
    { key: "workers", title: "Workers Needed", render: (row) => row.workers },
    { 
      key: "status", 
      title: "Status", 
      render: (row) => (
        <Badge variant={row.status === "URGENT" ? "error" : "warning"}>
          {row.status}
        </Badge>
      ) 
    },
  ];

  const data = [
    { id: 1, role: "Forklift Operator", client: "Amazon Hub", workers: 15, status: "URGENT" },
    { id: 2, role: "Picker/Packer", client: "Walmart Fulfillment", workers: 40, status: "PENDING" },
    { id: 3, role: "Security Guard", client: "Tech Park", workers: 5, status: "PENDING" },
  ];

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Job Requirements</h3>
        </div>
        <DataTable 
          columns={columns} 
          data={data} 
          rowKey="id" 
          hover 
        />
      </CardContent>
    </Card>
  );
}
