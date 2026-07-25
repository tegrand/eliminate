import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit } from "lucide-react";
import { useWorker } from "../hooks/useWorker";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

import WorkerProfileCard from "../components/WorkerProfileCard";
import WorkerInformationCard from "../components/WorkerInformationCard";
import WorkerSkillCard from "../components/WorkerSkillCard";
import WorkerEmergencyContactCard from "../components/WorkerEmergencyContactCard";
import WorkerTimelineCard from "../components/WorkerTimelineCard";

export default function WorkerDetailsPage() {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const { data: worker, isLoading, isError } = useWorker(workerId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-6 w-96" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <Skeleton className="h-96 w-full" />
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
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
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link 
            to="/workers" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Workers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Worker Details</h1>
        </div>
        <Button 
          onClick={() => navigate(`/workers/${workerId}/edit`)}
          className="w-full sm:w-auto"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit Worker
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <WorkerProfileCard worker={worker} />
          <WorkerSkillCard worker={worker} />
        </div>
        
        <div className="lg:col-span-2">
          <WorkerInformationCard worker={worker} />
          <WorkerEmergencyContactCard worker={worker} />
          <WorkerTimelineCard />
        </div>
      </div>
    </div>
  );
}
