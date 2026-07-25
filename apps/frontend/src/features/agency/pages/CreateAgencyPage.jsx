import AgencyForm from "../components/AgencyForm";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateAgency } from "../hooks/useCreateAgency";

export default function CreateAgencyPage() {
  const navigate = useNavigate();
  const { createAgency, isLoading } = useCreateAgency();

  const handleSubmit = async (data) => {
    try {
      await createAgency(data);
      toast.success("Agency created successfully");
      navigate("/agencies");
    } catch (error) {
      toast.error("Failed to create agency");
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Add New Agency</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the agency's comprehensive details to register them in the system.
        </p>
      </div>

      <AgencyForm 
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
