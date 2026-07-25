import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import PayrollSummaryCard from "../components/PayrollSummaryCard";
import WorkerSalaryTable from "../components/WorkerSalaryTable";
import AttendanceSummaryCard from "../components/AttendanceSummaryCard";
import OvertimeSummaryCard from "../components/OvertimeSummaryCard";
import DeductionCard from "../components/DeductionCard";
import ApprovalTimeline from "../components/ApprovalTimeline";

const MOCK_PAYROLL = {
  id: "PR-2026-07-A",
  period: "Jul 01 - Jul 15, 2026",
  workers: 145,
  amount: "$124,500.00",
  status: "PENDING_APPROVAL"
};

const MOCK_SALARIES = [
  { id: "S-1", worker: "John Smith", assignment: "ASM-1001", regularHours: 80, overtimeHours: 5, grossPay: "$2,100.00", deductions: "$420.00", netPay: "$1,680.00" },
  { id: "S-2", worker: "Jane Doe", assignment: "ASM-1001", regularHours: 78, overtimeHours: 0, grossPay: "$1,950.00", deductions: "$390.00", netPay: "$1,560.00" },
  { id: "S-3", worker: "Michael Scott", assignment: "ASM-1003", regularHours: 80, overtimeHours: 12, grossPay: "$2,400.00", deductions: "$480.00", netPay: "$1,920.00" },
];

export default function PayrollDetailsPage() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link 
            to="/payrolls" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payrolls
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Details</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button className="w-full sm:w-auto">
            <FileCheck className="mr-2 h-4 w-4" /> Approve Payroll
          </Button>
        </div>
      </div>

      <PayrollSummaryCard payroll={MOCK_PAYROLL} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <AttendanceSummaryCard stats={{ regularHours: "11,200", totalShifts: "1,450", avgHours: "77.2" }} />
        <OvertimeSummaryCard stats={{ otHours: "450", otPayout: "$13,500.00", workersWithOt: "42" }} />
        <DeductionCard stats={{ taxes: "$24,900.00", advances: "$1,200.00", total: "$26,100.00" }} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <WorkerSalaryTable salaries={MOCK_SALARIES} />
        </div>
        <div className="xl:col-span-1">
          <ApprovalTimeline />
        </div>
      </div>
    </div>
  );
}
