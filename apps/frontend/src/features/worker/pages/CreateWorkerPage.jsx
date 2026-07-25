import WorkerForm from "../components/WorkerForm";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CreateWorkerPage() {
  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/workers" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workers
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New Worker</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the worker's comprehensive details to register them in the system.
        </p>
      </div>

      <WorkerForm />
    </div>
  );
}
