import { Card, CardContent } from "../../../components/ui/card";
import { TrendingDown } from "lucide-react";

export default function DeductionCard({ stats }) {
  return (
    <Card className="mb-6 border-red-200">
      <div className="px-5 py-4 border-b border-red-100 bg-red-50/50 rounded-t-xl">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-red-500" /> Deductions Applied
        </h3>
      </div>
      <CardContent className="p-5">
        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Tax Withholding</span>
            <span className="text-sm font-bold text-red-600">{stats.taxes}</span>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Advance Deductions</span>
            <span className="text-sm font-bold text-red-600">{stats.advances}</span>
          </li>
          <li className="flex items-center justify-between pt-3 border-t border-red-100">
            <span className="text-sm font-bold text-gray-900">Total Deductions</span>
            <span className="text-sm font-bold text-red-700">{stats.total}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
