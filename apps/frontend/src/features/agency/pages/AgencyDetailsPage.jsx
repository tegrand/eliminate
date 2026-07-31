import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { agencyApi } from "../api/agency.api";
import { 
  ArrowLeft, Mail, Phone, MapPin, Building, 
  User, CheckCircle2, XCircle, AlertTriangle, 
  Calendar, FileText, Download, Eye, CreditCard
} from "lucide-react";
import AgencyStatusBadge from "../components/AgencyStatusBadge";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";

export default function AgencyDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState(null);

  const { data: agencyData, isLoading, error } = useQuery({
    queryKey: ["agency", id],
    queryFn: () => agencyApi.getAgencyById(id),
  });

  const agency = agencyData?.data;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (error || !agency) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Agency Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested agency could not be found.</p>
          <Link to="/agencies" className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-block">
            ← Back to agencies
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
      if (actionType === 'REACTIVATE') status = 'APPROVED';
      if (actionType === 'APPROVE') status = 'APPROVED';
      if (actionType === 'REJECT') status = 'REJECTED';
      if (actionType === 'SUSPEND') status = 'SUSPENDED';
      
      await agencyApi.updateAgencyStatus(id, status);
      
      // For toast message formatting
      const actionPastTense = actionType === 'REACTIVATE' ? 'reactivated' : 
                              actionType === 'APPROVE' ? 'approved' : 
                              actionType === 'REJECT' ? 'rejected' : 'suspended';
                              
      toast.success(`Agency ${actionPastTense} successfully.`);
      queryClient.invalidateQueries({ queryKey: ["agency", id] });
      queryClient.invalidateQueries({ queryKey: ["agencies"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      closeDialog();
    }
  };

  const getAgencyName = () => agency.agencyName || "N/A";
  
  // Extract documents or map URLs if documents array is not used
  const allDocs = [
    { type: "Trade License", url: agency.licenseUrl },
    { type: "GST Certificate", url: agency.gstCertificateUrl },
    { type: "PAN Card", url: agency.panUrl },
  ];

  if (agency.documents && agency.documents.length > 0) {
    agency.documents.forEach(doc => {
      const existing = allDocs.find(d => d.type.toUpperCase() === doc.documentType);
      if (existing) {
        existing.url = doc.documentUrl;
        existing.status = doc.status;
      } else {
        allDocs.push({ type: doc.documentType, url: doc.documentUrl, status: doc.status });
      }
    });
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/agencies" className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{getAgencyName()}</h1>
                <AgencyStatusBadge status={agency.profileStatus || 'PENDING'} />
              </div>
              <p className="text-sm text-gray-500 font-medium">Agency Code: {agency.agencyCode || agency.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {agency.profileStatus === 'PENDING' && (
              <>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleAction('REJECT')}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('APPROVE')}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
              </>
            )}
            {agency.profileStatus === 'APPROVED' && (
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => handleAction('SUSPEND')}>
                <AlertTriangle className="w-4 h-4 mr-2" /> Suspend
              </Button>
            )}
            {agency.profileStatus === 'SUSPENDED' && (
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleAction('REACTIVATE')}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Reactivate
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Agency Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-500" /> Agency Information
              </h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl overflow-hidden shadow-sm">
                  {getAgencyName()[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getAgencyName()}</h3>
                  <p className="text-sm text-gray-500">Joined {new Date(agency.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Contact Person</p>
                    <p className="text-sm font-medium text-gray-900">{agency.contactPerson || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                    <p className="text-sm font-medium text-gray-900">{agency.email || agency.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{agency.phone || "N/A"}</p>
                    {agency.alternatePhone && (
                      <p className="text-sm font-medium text-gray-600 mt-1">{agency.alternatePhone} (Alt)</p>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {[agency.addressLine1, agency.addressLine2, agency.city, agency.state, agency.country, agency.postalCode].filter(Boolean).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {agency.notes && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-500" /> Admin Notes
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                  {agency.notes}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Legal & Docs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Documents Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Agency Verification Documents
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allDocs.map((doc, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-lg p-4 flex flex-col justify-between hover:border-blue-100 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-500">
                          <FileText className="w-4 h-4" />
                        </div>
                        <p className="font-semibold text-sm text-gray-900">{doc.type}</p>
                      </div>
                      
                      {doc.url ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Uploaded
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                          Pending
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      {doc.url ? (
                        <>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-2 py-1.5 rounded transition-colors">
                            <Eye className="w-3 h-3" /> View
                          </a>
                          <a href={doc.url} download className="text-xs font-medium text-gray-600 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded transition-colors">
                            <Download className="w-3 h-3" /> Download
                          </a>
                        </>
                      ) : (
                        <p className="text-xs text-gray-400 italic">Document not provided yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-500" /> Legal & Registration
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">GST Number</p>
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{agency.gstNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">License Number</p>
                  <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">{agency.licenseNumber || "N/A"}</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {actionType === 'APPROVE' && <ApproveDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getAgencyName()} />}
      {actionType === 'REJECT' && <RejectDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getAgencyName()} />}
      {actionType === 'SUSPEND' && <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getAgencyName()} />}
      {actionType === 'REACTIVATE' && <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getAgencyName()} />}
    </div>
  );
}
