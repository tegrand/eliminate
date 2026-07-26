import { useState, useEffect } from "react";
import { Search, MapPin, Building, Briefcase, Bookmark, Clock, Loader2, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal/Modal";
import Input from "../../../components/ui/input/Input";
import { useAuth } from "../../../hooks/useAuth";

export default function FindWorkPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [applyModal, setApplyModal] = useState({ isOpen: false, jobId: null, jobTitle: "", notes: "" });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await api.get("/jobs", { params: { search } });
      setJobs(res.data.data.items);
    } catch (error) {
      if (error.response?.status === 403) {
        setErrorMsg("You are currently associated with an agency. Agency workers cannot browse or apply for public jobs.");
      } else {
        toast.error("Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const handleSaveJob = async (jobId) => {
    try {
      const res = await api.post(`/jobs/${jobId}/save`);
      const { saved } = res.data.data;
      toast.success(saved ? "Job saved successfully" : "Job removed from saved");
      // Optionally re-fetch or optimistically update
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save job");
    }
  };

  const handleApply = async () => {
    try {
      await api.post(`/jobs/${applyModal.jobId}/apply`, { notes: applyModal.notes });
      toast.success("Application submitted successfully");
      setApplyModal({ isOpen: false, jobId: null, jobTitle: "", notes: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply for job");
    }
  };

  if (errorMsg) {
    return (
      <div className="w-full max-w-7xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
          <Briefcase className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-900 mb-2">Access Restricted</h2>
          <p className="text-red-700">{errorMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Find Work</h1>
          <p className="text-sm text-slate-500 mt-1">Browse and apply for available job opportunities</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search jobs by title..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900">No jobs found</h3>
          <p className="text-slate-500 mt-1">Try adjusting your search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative">
              <button 
                onClick={() => handleSaveJob(job.id)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                title="Save Job"
              >
                <Bookmark className="w-5 h-5" />
              </button>
              
              <div className="mb-4 pr-10">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{job.title}</h3>
                <div className="flex items-center gap-1 mt-1 text-indigo-600 font-medium text-sm">
                  <Building className="w-3.5 h-3.5" />
                  <span className="line-clamp-1">{job.client?.companyName || "Private Client"}</span>
                </div>
              </div>
              
              <div className="space-y-2 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{job.location?.district ? `${job.location.district}, ${job.location.state || ''}` : "Location not specified"}</span>
                </div>
                {job.salaryAmount && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <IndianRupee className="w-4 h-4 text-slate-400" />
                    <span>₹{job.salaryAmount} {job.salaryType ? `/ ${job.salaryType.toLowerCase()}` : ""}</span>
                  </div>
                )}
                {job.shift && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="capitalize">{job.shift.toLowerCase()} Shift</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-100 mt-auto">
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setApplyModal({ isOpen: true, jobId: job.id, jobTitle: job.title, notes: "" })}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={applyModal.isOpen}
        onClose={() => setApplyModal({ ...applyModal, isOpen: false })}
        title="Apply for Job"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            You are applying for <span className="font-bold text-slate-900">{applyModal.jobTitle}</span>.
          </p>
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Cover Note (Optional)</label>
            <textarea
              className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Why are you a good fit for this job?"
              value={applyModal.notes}
              onChange={(e) => setApplyModal({ ...applyModal, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setApplyModal({ ...applyModal, isOpen: false })}>Cancel</Button>
            <Button variant="primary" onClick={handleApply}>Submit Application</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
