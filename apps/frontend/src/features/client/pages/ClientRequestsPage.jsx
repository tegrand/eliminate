import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CheckCircle2, XCircle, Building2, UserCircle, Calendar, IndianRupee } from "lucide-react";
import api from "../../../api/axios";
import { toast } from "sonner";
import { ROUTES } from "../../../routes/routePaths";

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, PENDING, ACCEPTED, REJECTED

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hiring-requests');
      setRequests(res.data.data);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => filter === "ALL" || req.status === filter);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending</span>;
      case 'ACCEPTED':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Accepted</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f8f9fa] overflow-y-auto scrollbar-hide py-8 px-4 sm:px-8 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <Link to={ROUTES.DASHBOARD} className="text-gray-400 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Hiring Requests</h1>
            </div>
            <p className="text-sm text-gray-500 ml-8">Manage and track your hiring requests to workers and agencies.</p>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filter === f 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse w-full"></div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No requests found</h3>
            <p className="text-sm text-gray-500 mt-2">You don't have any {filter !== 'ALL' ? filter.toLowerCase() : ''} hiring requests.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{req.title}</h3>
                      {getStatusBadge(req.status)}
                    </div>
                    
                    {req.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{req.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      {req.worker && (
                        <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 font-semibold">
                          <UserCircle className="w-4 h-4" />
                          {req.worker.user?.firstName} {req.worker.user?.lastName}
                        </div>
                      )}
                      {req.agency && (
                        <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 font-semibold">
                          <Building2 className="w-4 h-4" />
                          {req.agency.user?.firstName} {req.agency.user?.lastName} (Agency)
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      {req.proposedRate && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <IndianRupee className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold text-gray-900">₹{req.proposedRate}</span>/day
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
