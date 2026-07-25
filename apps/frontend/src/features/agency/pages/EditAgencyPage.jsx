import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AgencyForm from "../components/AgencyForm";
import { useUpdateAgency } from "../hooks/useUpdateAgency";
import { useAgency } from "../hooks/useAgency";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

export default function EditAgencyPage() {
  const { agencyId } = useParams();
  const navigate = useNavigate();
  const { updateAgency, isLoading: isUpdating } = useUpdateAgency();
  const { data: agency, isLoading: isFetching, isError } = useAgency(agencyId);

  const handleSubmit = async (data) => {
    try {
      await updateAgency(agencyId, data);
      toast.success("Agency updated successfully");
      navigate("/agencies");
    } catch (error) {
      toast.error("Failed to update agency");
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

  if (isError || !agency) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Failed to load agency</h2>
        <p className="text-gray-500 mt-2">The agency data could not be found or loaded.</p>
        <Button className="mt-6" onClick={() => navigate("/agencies")}>Back to Agencies</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/agencies" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agencies
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Agency</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the agency's details and configuration.
        </p>
      </div>

      <AgencyForm 
        mode="edit"
        initialValues={agency}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
