import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";

export default function MissingAttendancePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Missing attendance reported successfully.");
      navigate("/attendance");
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <Link to="/attendance" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Attendance
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-11 w-11 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Report Missing Attendance</h1>
            <p className="mt-1 text-sm text-gray-500">
              Record <span className="font-semibold text-gray-700">{id}</span> was not marked as expected.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 mb-6">
          <p className="text-sm text-gray-700">
            Use this screen to flag an attendance record that is missing, delayed, or not captured properly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Reason</p>
            <p className="mt-2 text-sm text-gray-900">Worker did not check in on time</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</p>
            <p className="mt-2 text-sm text-gray-900">Pending review</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-700 text-white">
            {isSubmitting ? "Submitting..." : "Submit Missing Report"}
          </Button>
        </div>
      </div>
    </div>
  );
}
