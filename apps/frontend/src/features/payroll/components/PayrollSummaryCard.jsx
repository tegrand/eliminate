import { Card, CardContent } from "../../../components/ui/card";
import { FileText, Calendar, Users, DollarSign } from "lucide-react";
import PayrollStatusBadge from "./PayrollStatusBadge";

export default function PayrollSummaryCard({ payroll }) {
  if (!payroll) return null;

  return (
    <Card className="mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Payroll Summary</h3>
        <PayrollStatusBadge status={payroll.status} />
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-50 p-2 rounded-lg text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Payroll ID</p>
              <p className="font-semibold text-gray-900">{payroll.id}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-purple-50 p-2 rounded-lg text-purple-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Period</p>
              <p className="font-semibold text-gray-900">{payroll.period}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-green-50 p-2 rounded-lg text-green-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Workers</p>
              <p className="font-semibold text-gray-900">{payroll.workers}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-amber-50 p-2 rounded-lg text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="font-semibold text-gray-900">{payroll.amount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
