import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import WorkerForm from "../components/WorkerForm";
import { useUpdateWorker } from "../hooks/useUpdateWorker";
import { useWorker } from "../hooks/useWorker";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

export default function EditWorkerPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { updateWorker, isLoading: isUpdating } = useUpdateWorker();
  const { data: worker, isLoading: isFetching, isError } = useWorker(workerId);

  const handleSubmit = async (data) => {
    try {
      await updateWorker(workerId, data);
      toast.success("Worker updated successfully");
      navigate("/workers");
    } catch (error) {
      toast.error("Failed to update worker");
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-96" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !worker) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Failed to load worker</h2>
        <p className="text-gray-500 mt-2">The worker data could not be found or loaded.</p>
        <Button className="mt-6" onClick={() => navigate("/workers")}>Back to Workers</Button>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Edit Worker</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the worker's details and configuration.
        </p>
      </div>

      <WorkerForm 
        mode="edit"
        initialValues={worker}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
