import WorkerForm from "../components/WorkerForm";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateWorker } from "../hooks/useCreateWorker";

export default function CreateWorkerPage() {
  const navigate = useNavigate();
  const { createWorker, isLoading } = useCreateWorker();

  const handleSubmit = async (data) => {
    try {
      await createWorker(data);
      toast.success("Worker created successfully");
      navigate("/workers");
    } catch (error) {
      toast.error("Failed to create worker");
    }
  };

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

      <WorkerForm 
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
