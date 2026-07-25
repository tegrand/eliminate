import { Card, CardContent } from "../../../components/ui/card";
import { ArrowRight } from "lucide-react";

export default function AttendanceDifferenceCard({ systemLog, manualLog }) {
  return (
    <Card className="mb-6">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Discrepancy Check</h3>
        <p className="text-sm text-gray-500 mt-1">Review the differences between system biometrics and manual entry.</p>
      </div>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3">Metric</th>
                <th className="px-6 py-3">System Log (Biometrics)</th>
                <th className="px-6 py-3">Manual Entry</th>
                <th className="px-6 py-3">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Check-In</td>
                <td className="px-6 py-4 text-gray-600">{systemLog.checkIn}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{manualLog.checkIn}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-amber-600 font-medium bg-amber-50 w-fit px-2 py-1 rounded">
                    <span>{systemLog.checkIn}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{manualLog.checkIn}</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Check-Out</td>
                <td className="px-6 py-4 text-gray-600">{systemLog.checkOut}</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{manualLog.checkOut}</td>
                <td className="px-6 py-4 text-gray-500">Matches</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Total Hours</td>
                <td className="px-6 py-4 text-gray-600">{systemLog.totalHours} hrs</td>
                <td className="px-6 py-4 font-semibold text-gray-900">{manualLog.totalHours} hrs</td>
                <td className="px-6 py-4 text-red-600 font-medium">+{manualLog.totalHours - systemLog.totalHours} hrs</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">Remarks</td>
                <td className="px-6 py-4 text-gray-500 italic">None</td>
                <td className="px-6 py-4 text-gray-900">{manualLog.remarks}</td>
                <td className="px-6 py-4 text-gray-500">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
