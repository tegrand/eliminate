import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { workerApi } from "../api/worker.api";
import { 
  ArrowLeft, Mail, Phone, MapPin, Briefcase, 
  User, CheckCircle2, XCircle, AlertTriangle, 
  Calendar, Star, FileText, Download, Eye 
} from "lucide-react";
import WorkerStatusBadge from "../components/WorkerStatusBadge";
import ApproveDialog from "../../../components/ui/action-dialogs/ApproveDialog";
import RejectDialog from "../../../components/ui/action-dialogs/RejectDialog";
import SuspendDialog from "../../../components/ui/action-dialogs/SuspendDialog";
import ReactivateDialog from "../../../components/ui/action-dialogs/ReactivateDialog";
import toast from "react-hot-toast";
import { Button } from "../../../components/ui/button";

export default function WorkerDetailsPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState(null);

  const { data: workerData, isLoading, error } = useQuery({
    queryKey: ["worker", id],
    queryFn: () => workerApi.getWorkerById(id),
  });

  const worker = workerData?.data;

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  }

  if (error || !worker) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Worker Not Found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested worker could not be found.</p>
          <Link to="/workers" className="mt-4 text-indigo-600 hover:text-indigo-800 text-sm font-medium inline-block">
            ← Back to workers
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
      await workerApi.updateWorkerStatus(id, status);
      toast.success(`Worker ${actionType.toLowerCase()}d successfully.`);
      queryClient.invalidateQueries({ queryKey: ["worker", id] });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update status");
    } finally {
      closeDialog();
    }
  };

  const getFullName = () => `${worker.firstName || ""} ${worker.lastName || ""}`.trim() || "N/A";
  
  // Extract documents or map URLs if documents array is not used
  const allDocs = [
    { type: "Aadhaar", url: worker.aadhaarUrl },
    { type: "PAN Card", url: worker.panUrl },
    { type: "Bank Passbook", url: worker.bankPassbookUrl },
    { type: "Resume", url: worker.resumeUrl },
  ];

  if (worker.documents && worker.documents.length > 0) {
    worker.documents.forEach(doc => {
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
            <Link to="/workers" className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{getFullName()}</h1>
                <WorkerStatusBadge status={worker.profileStatus || 'PENDING'} />
              </div>
              <p className="text-sm text-gray-500 font-medium">Worker ID: {worker.workerCode || worker.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {worker.profileStatus === 'PENDING' && (
              <>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => handleAction('REJECT')}>
                  <XCircle className="w-4 h-4 mr-2" /> Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleAction('APPROVE')}>
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                </Button>
              </>
            )}
            {worker.profileStatus === 'APPROVED' && (
              <Button variant="outline" className="border-orange-200 text-orange-600 hover:bg-orange-50" onClick={() => handleAction('SUSPEND')}>
                <AlertTriangle className="w-4 h-4 mr-2" /> Suspend
              </Button>
            )}
            {worker.profileStatus === 'SUSPENDED' && (
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => handleAction('REACTIVATE')}>
                <CheckCircle2 className="w-4 h-4 mr-2" /> Reactivate
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-500" /> Personal Information
              </h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-2xl overflow-hidden shadow-sm">
                  {worker.profilePhoto ? (
                    <img src={worker.profilePhoto} alt={getFullName()} className="w-full h-full object-cover" />
                  ) : (
                    worker.firstName ? worker.firstName[0] : "W"
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{getFullName()}</h3>
                  <p className="text-sm text-gray-500 capitalize">{worker.gender || "Not specified"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Email</p>
                    <p className="text-sm font-medium text-gray-900">{worker.user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{worker.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900">
                      {worker.dateOfBirth ? new Date(worker.dateOfBirth).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Address</p>
                    <p className="text-sm font-medium text-gray-900">
                      {[worker.addressLine1, worker.city, worker.state, worker.country].filter(Boolean).join(", ") || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-500" /> Emergency Contact
              </h2>
              {worker.emergencyContactName ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Name</p>
                    <p className="text-sm font-medium text-gray-900">{worker.emergencyContactName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{worker.emergencyContactPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium uppercase">Relation</p>
                    <p className="text-sm font-medium text-gray-900">{worker.emergencyContactRelation || "N/A"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No emergency contact provided.</p>
              )}
            </div>
          </div>

          {/* Right Column - Professional & Docs */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Documents Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" /> Uploaded Documents
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

            {/* Professional Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-500" /> Professional Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Employment Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                    {worker.employmentStatus?.toLowerCase() || "Active"}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Experience</p>
                  <p className="text-sm font-semibold text-gray-900">{worker.experienceYears ? `${worker.experienceYears} Years` : "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Expected Salary</p>
                  <p className="text-sm font-semibold text-gray-900">{worker.expectedSalary || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase mb-1">Joining Date</p>
                  <p className="text-sm font-semibold text-gray-900">{worker.joiningDate ? new Date(worker.joiningDate).toLocaleDateString() : "N/A"}</p>
                </div>
              </div>

              {worker.notes && (
                <div className="mt-6 pt-6 border-t border-gray-50">
                  <p className="text-xs text-gray-500 font-medium uppercase mb-2">Notes</p>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                    {worker.notes}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>

      {actionType === 'APPROVE' && <ApproveDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getFullName()} />}
      {actionType === 'REJECT' && <RejectDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getFullName()} />}
      {actionType === 'SUSPEND' && <SuspendDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getFullName()} />}
      {actionType === 'REACTIVATE' && <ReactivateDialog isOpen={true} onClose={closeDialog} onConfirm={handleConfirmAction} entityName={getFullName()} />}
    </div>
  );
}
