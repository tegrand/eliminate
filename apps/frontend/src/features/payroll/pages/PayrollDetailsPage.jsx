import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileCheck } from "lucide-react";
import { Button } from "../../../components/ui/button";
import PayrollSummaryCard from "../components/PayrollSummaryCard";
import WorkerSalaryTable from "../components/WorkerSalaryTable";
import AttendanceSummaryCard from "../components/AttendanceSummaryCard";
import OvertimeSummaryCard from "../components/OvertimeSummaryCard";
import DeductionCard from "../components/DeductionCard";
import ApprovalTimeline from "../components/ApprovalTimeline";

const MOCK_PAYROLL = null;
const MOCK_SALARIES = [];

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
        <AttendanceSummaryCard stats={null} />
        <OvertimeSummaryCard stats={null} />
        <DeductionCard stats={null} />
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
