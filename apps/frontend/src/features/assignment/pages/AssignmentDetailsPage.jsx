import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Users, UserRound, Clock3, RefreshCcw } from "lucide-react";
import { Button } from "../../../components/ui/button";

const WORKERS = [
  {
    id: "W-1001",
    name: "Amit Kumar",
    role: "Site Worker",
    attendance: "Present",
    shift: "08:00 - 17:00",
    status: "Active",
  },
  {
    id: "W-1002",
    name: "Neha Singh",
    role: "Helper",
    attendance: "Absent",
    shift: "08:00 - 17:00",
    status: "Needs Review",
  },
];

export default function AssignmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/assignments"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assignments
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Assignment Details</h1>
          <p className="mt-2 text-sm text-gray-500">
            Assignment <span className="font-semibold text-gray-700">{id}</span>
          </p>
        </div>

        <Button onClick={() => navigate("/attendance/bulk")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Mark Attendance
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">View Assigned Workers</h2>
              <p className="text-sm text-gray-500">Workers currently attached to this assignment.</p>
            </div>
          </div>

          <div className="space-y-3">
            {WORKERS.map((worker) => (
              <div key={worker.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="font-semibold text-gray-900">{worker.name}</p>
                  <p className="text-sm text-gray-500">
                    {worker.id} · {worker.role}
                  </p>
                </div>
                <Link to={`/workers/${worker.id}`} className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">
                  Worker Details
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Worker Details</h2>
              <p className="text-sm text-gray-500">Quick summary of the selected worker assignment.</p>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Primary worker</span>
              <span className="font-semibold text-gray-900">{WORKERS[0].name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Role</span>
              <span className="font-semibold text-gray-900">{WORKERS[0].role}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Shift</span>
              <span className="font-semibold text-gray-900">{WORKERS[0].shift}</span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Attendance Status</h2>
              <p className="text-sm text-gray-500">Current attendance state for assigned workers.</p>
            </div>
          </div>

          <div className="space-y-3">
            {WORKERS.map((worker) => (
              <div key={worker.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
                <div>
                  <p className="font-semibold text-gray-900">{worker.name}</p>
                  <p className="text-sm text-gray-500">{worker.shift}</p>
                </div>
                <span className={`text-sm font-semibold ${worker.attendance === "Present" ? "text-emerald-600" : "text-red-600"}`}>
                  {worker.attendance}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <RefreshCcw className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Replace Worker Request</h2>
              <p className="text-sm text-gray-500">Raise a replacement request when a worker cannot continue.</p>
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-rose-200 bg-rose-50/60 p-4">
            <p className="text-sm text-gray-700">
              Replacement requests are ready to be routed from this assignment. If you need to swap a worker, open their details and submit a replacement request.
            </p>
            <Button className="mt-4 bg-rose-600 hover:bg-rose-700 text-white">
              Request Replacement
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
