import { Card, CardContent } from "../../../components/ui/card";
import { DataTable } from "../../../components/ui/data-table";
import { Badge } from "../../../components/ui/badge";
import { List, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function UpcomingRequirements() {
  const columns = [
    { key: "role", title: "ROLE", render: (row) => <span className="font-semibold text-gray-900">{row.role}</span> },
    { key: "client", title: "CLIENT", render: (row) => <span className="text-gray-600">{row.client}</span> },
    { key: "workers", title: "WORKERS NEEDED", render: (row) => <span className="text-gray-600">{row.workers}</span> },
    { 
      key: "status", 
      title: "STATUS", 
      render: (row) => (
        <Badge variant="outline" className={`font-semibold border-0 ${row.status === "URGENT" ? "bg-red-100 text-red-700" : "bg-orange-100 text-orange-700"}`}>
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
    <Card className="h-full border border-gray-100 shadow-sm flex flex-col">
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Upcoming Job Requirements</h3>
          <button className="p-1.5 border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 transition-colors">
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="[&_td]:px-4 [&_th]:px-4 [&_td]:py-2.5 [&_th]:py-2">
            <DataTable 
              columns={columns} 
              data={data} 
              rowKey="id" 
              hover 
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-50 mt-auto">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold text-[13px] flex items-center gap-1">
            View all requirements <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
