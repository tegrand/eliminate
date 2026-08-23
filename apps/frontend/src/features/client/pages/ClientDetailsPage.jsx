import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Ban, PlayCircle, AlertTriangle, Building, User, Mail, Phone, MapPin, FileText, CreditCard } from "lucide-react";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { clientApi } from "../api/client.api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import ClientStatusBadge from "../components/ClientStatusBadge";

import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";

export default function ClientDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState(null);

  const { data: clientData, isLoading, error } = useQuery({
    queryKey: ["client", id],
    queryFn: () => clientApi.getClientById(id),
  });

  const client = clientData?.data;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (error || !client) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Client Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested client could not be found.</p>
          <Link to="/clients" className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-block">
            ← Back to clients
          </Link>
        </div>
      </div>
    );
  }

  const handleAction = (type) => setActionType(type);
  const closeDialog = () => setActionType(null);

  const handleConfirmAction = async (reasonOrNote) => {
    try {
      let status = actionType;
      if (actionType === 'REACTIVATE') status = 'ACTIVE';
      await clientApi.updateClientStatus(id, status);
      toast.success(`Client ${actionType.toLowerCase()}d successfully.`);
      queryClient.invalidateQueries({ queryKey: ["client", id] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      closeDialog();
    }
  };

  const getClientName = () => client.companyName || "N/A";
  const clientStatus = client.profileStatus || 'ACTIVE';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/clients" className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{getClientName()}</h1>
                <ClientStatusBadge status={clientStatus} />
              </div>
              <p className="text-sm text-gray-500 font-medium">Client Code: {client.clientCode || client.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {clientStatus === 'ACTIVE' && (
              <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50" onClick={() => handleAction('SUSPEND')}>
                <Ban className="mr-2 h-4 w-4" /> Suspend
              </Button>
            )}
            {clientStatus === 'SUSPENDED' && (
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => handleAction('REACTIVATE')}>
                <PlayCircle className="mr-2 h-4 w-4" /> Reactivate
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Client Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" /> Client Information
              </h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl overflow-hidden shadow-sm">
                  {getClientName()[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getClientName()}</h3>
                  <p className="text-sm text-gray-500">Joined {new Date(client.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{client.contactPerson || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                    <p className="text-sm font-medium text-gray-900">{client.email || client.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{client.phone || "N/A"}</p>
                    {client.alternatePhone && (
                      <p className="text-sm font-medium text-gray-600 mt-1">{client.alternatePhone} (Alt)</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {[client.addressLine1, client.addressLine2, client.city, client.state, client.country, client.postalCode].filter(Boolean).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Legal & Notes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Legal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" /> Legal & Registration
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">GST Number</p>
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{client.gstNumber || "N/A"}</p>
                </div>
              </div>
            </div>

            {client.notes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" /> Admin Notes
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  {client.notes}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {actionType === 'SUSPEND' && <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getClientName()} />}
      {actionType === 'REACTIVATE' && <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getClientName()} />}
    </div>
  );
}
