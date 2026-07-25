import { Card, CardContent } from "../../../components/ui/card";
import { AlertCircle } from "lucide-react";

export default function OvertimeSummaryCard({ stats }) {
  return (
    <Card className="mb-6 border-amber-200">
      <div className="px-5 py-4 border-b border-amber-100 bg-amber-50/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500" /> Overtime Summary
        </h3>
      </div>
      <CardContent className="p-5">
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total OT Hours</span>
            <span className="text-sm font-bold text-gray-900">{stats.otHours} hrs</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Total OT Payout</span>
            <span className="text-sm font-bold text-amber-700">{stats.otPayout}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Workers with OT</span>
            <span className="text-sm font-bold text-gray-900">{stats.workersWithOt}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
