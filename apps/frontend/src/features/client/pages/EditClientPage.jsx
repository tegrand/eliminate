import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ClientForm from "../components/ClientForm";
import { useUpdateClient } from "../hooks/useUpdateClient";
import { useClient } from "../hooks/useClient";
import { Skeleton } from "../../../components/ui/skeleton";
import { Button } from "../../../components/ui/button";

export default function EditClientPage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { updateClient, isLoading: isUpdating } = useUpdateClient();
  const { data: client, isLoading: isFetching, isError } = useClient(clientId);

  const handleSubmit = async (data) => {
    try {
      await updateClient(clientId, data);
      toast.success("Client updated successfully");
      navigate("/clients");
    } catch (error) {
      toast.error("Failed to update client");
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

  if (isError || !client) {
    return (
      <div className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-red-600">Failed to load client</h2>
        <p className="text-gray-500 mt-2">The client data could not be found or loaded.</p>
        <Button className="mt-6" onClick={() => navigate("/clients")}>Back to Clients</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-6">
        <Link 
          to="/clients" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Client</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the client's details and configuration.
        </p>
      </div>

      <ClientForm 
        mode="edit"
        initialValues={client}
        onSubmit={handleSubmit}
        isLoading={isUpdating}
      />
    </div>
  );
}
