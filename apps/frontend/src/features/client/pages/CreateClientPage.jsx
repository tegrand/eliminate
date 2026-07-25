import ClientForm from "../components/ClientForm";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateClient } from "../hooks/useCreateClient";

export default function CreateClientPage() {
  const navigate = useNavigate();
  const { createClient, isLoading } = useCreateClient();

  const handleSubmit = async (data) => {
    try {
      await createClient(data);
      toast.success("Client created successfully");
      navigate("/clients");
    } catch (error) {
      toast.error("Failed to create client");
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Add New Client</h1>
        <p className="mt-2 text-sm text-gray-500">
          Enter the client's comprehensive details to register them in the system.
        </p>
      </div>

      <ClientForm 
        mode="create"
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
