import { useState, useEffect } from "react";
import { Bookmark, FileText, Loader2, MapPin, Building, Trash2, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";
import Button from "../../../components/ui/button/Button";
import { useAuth } from "../../../hooks/useAuth";
import { Modal } from "../../../components/ui/modal/Modal";

export default function MyJobsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("applications");
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const [withdrawModal, setWithdrawModal] = useState({ isOpen: false, jobId: null, jobTitle: "" });

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const [appRes, savedRes] = await Promise.all([
        api.get("/jobs/applications"),
        api.get("/jobs/saved")
      ]);
      
      setApplications(appRes.data.data);
      setSavedJobs(savedRes.data.data);
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorMsg("You are currently associated with an agency. Agency workers cannot apply for public jobs.");
      } else {
        toast.error("Failed to load your jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdraw = async () => {
    try {
      await api.post(`/jobs/${withdrawModal.jobId}/withdraw`);
      toast.success("Application withdrawn");
      setWithdrawModal({ isOpen: false, jobId: null, jobTitle: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to withdraw application");
    }
  };

  const handleRemoveSaved = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/save`); // Toggles save
      toast.success("Job removed from saved list");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove saved job");
    }
  };

  if (errorMsg) {
    return (
      <div className="w-full max-w-7xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Restricted</h2>
          <p className="text-red-700">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your applications and saved jobs</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            <button
              onClick={() => setActiveTab("applications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                ${activeTab === "applications" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              <FileText className={`w-5 h-5 ${activeTab === "applications" ? "text-indigo-600" : "text-slate-400"}`} />
              Applications
              {applications.length > 0 && (
                <span className="ml-auto bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-xs">
                  {applications.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                ${activeTab === "saved" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              <Bookmark className={`w-5 h-5 ${activeTab === "saved" ? "text-indigo-600" : "text-slate-400"}`} />
              Saved Jobs
              {savedJobs.length > 0 && (
                <span className="ml-auto bg-slate-200 text-slate-700 py-0.5 px-2 rounded-full text-xs">
                  {savedJobs.length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <>
              {/* Applications Tab */}
              {activeTab === "applications" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Your Applications</h2>
                  {applications.length === 0 ? (
                    <div className="text-center py-12 border border-slate-200 border-dashed rounded-xl">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-semibold text-slate-800">No applications yet</h3>
                      <p className="text-sm text-slate-500 mt-1">Start applying for jobs to see them here.</p>
                    </div>
                  ) : (
                    applications.map(app => (
                      <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-slate-900">{app.jobRequirement?.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider
                              ${app.status === 'APPLIED' ? 'bg-blue-100 text-blue-700' :
                                app.status === 'UNDER_REVIEW' ? 'bg-amber-100 text-amber-700' :
                                app.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                app.status === 'WITHDRAWN' ? 'bg-slate-100 text-slate-600' :
                                'bg-red-100 text-red-700'
                              }`}>
                              {app.status.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {app.jobRequirement?.client?.companyName}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {app.jobRequirement?.location?.district || 'Location N/A'}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex items-center">
                          {app.status !== "WITHDRAWN" && app.status !== "REJECTED" && (
                            <Button 
                              variant="outline" 
                              className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 w-full md:w-auto"
                              onClick={() => setWithdrawModal({ isOpen: true, jobId: app.jobRequirementId, jobTitle: app.jobRequirement?.title })}
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Saved Jobs Tab */}
              {activeTab === "saved" && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Saved Jobs</h2>
                  {savedJobs.length === 0 ? (
                    <div className="text-center py-12 border border-slate-200 border-dashed rounded-xl">
                      <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-semibold text-slate-800">No saved jobs</h3>
                      <p className="text-sm text-slate-500 mt-1">Bookmark interesting jobs to review them later.</p>
                    </div>
                  ) : (
                    savedJobs.map(saved => (
                      <div key={saved.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-slate-900">{saved.jobRequirement?.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              <span className="truncate max-w-[200px]">{saved.jobRequirement?.client?.companyName}</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveSaved(saved.jobRequirementId)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-auto"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={withdrawModal.isOpen}
        onClose={() => setWithdrawModal({ ...withdrawModal, isOpen: false })}
        title="Withdraw Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to withdraw your application for <span className="font-bold text-slate-900">{withdrawModal.jobTitle}</span>? You can apply again later if the job is still open.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setWithdrawModal({ ...withdrawModal, isOpen: false })}>Cancel</Button>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleWithdraw}>
              Confirm Withdrawal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
