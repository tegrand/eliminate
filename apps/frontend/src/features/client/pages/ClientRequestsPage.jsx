import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, Building2, 
  UserCircle, Calendar, IndianRupee, Briefcase, FileText,
  MoreVertical, Search, ChevronRight, User
} from "lucide-react";
import api from "../../../api/axios";
import { toast } from "sonner";
import { ROUTES } from "../../../routes/routePaths";

export default function ClientRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === "ALL" || req.status === filter;
    const matchesSearch = req.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.worker?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          req.agency?.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
      case 'ACCEPTED':
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Accepted</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-semibold flex items-center gap-1.5"><XCircle className="w-3.5 h-3.5" /> Declined</span>;
      default:
        return <span className="px-3 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase() || 'W';
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-[#f4f7f9] overflow-y-auto scrollbar-hide py-8 px-4 sm:px-8 lg:px-12 animate-fade-in">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <Link to={ROUTES.DASHBOARD} className="mt-1 p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Hiring Requests</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and track your recruitment requests to workers and agencies.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="mt-8 border-b border-gray-100">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-[-1px]">
              {['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`pb-4 text-sm font-semibold whitespace-nowrap transition-all border-b-2 ${
                    filter === f 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {f === 'ALL' ? 'All Requests' : f.charAt(0) + f.slice(1).toLowerCase()}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${filter === f ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {f === 'ALL' ? requests.length : requests.filter(r => r.status === f).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse w-full"></div>
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-gray-100 shadow-sm">
              <Briefcase className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No requests found</h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              {searchQuery 
                ? "We couldn't find any requests matching your search." 
                : `You don't have any ${filter !== 'ALL' ? filter.toLowerCase() : ''} hiring requests at the moment.`}
            </p>
            {(searchQuery || filter !== 'ALL') && (
              <button 
                onClick={() => {setFilter('ALL'); setSearchQuery('');}}
                className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRequests.map((req) => {
              const targetName = req.worker 
                ? `${req.worker.user?.firstName} ${req.worker.user?.lastName}` 
                : req.agency 
                  ? `${req.agency.user?.firstName} ${req.agency.user?.lastName}`
                  : 'Unknown';
              
              const isAgency = !!req.agency;

              return (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all group">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Left: Info */}
                    <div className="flex items-start gap-4 sm:gap-5 w-full sm:w-auto">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm ${isAgency ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {getInitials(req.worker?.user?.firstName || req.agency?.user?.firstName, req.worker?.user?.lastName || req.agency?.user?.lastName)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${isAgency ? 'bg-purple-500' : 'bg-blue-500'}`}>
                          {isAgency ? <Building2 className="w-2.5 h-2.5 text-white" /> : <User className="w-2.5 h-2.5 text-white" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">{req.title}</h3>
                          <span className="hidden sm:inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span className="hidden sm:inline-block text-sm font-medium text-gray-500 truncate">{targetName}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          
                          {req.proposedRate && (
                            <div className="flex items-center gap-1.5">
                              <IndianRupee className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold text-gray-700">₹{req.proposedRate}</span>/day
                            </div>
                          )}
                          
                          {req.startDate && (
                            <div className="flex items-center gap-1.5 hidden md:flex">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Starts: {new Date(req.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Status & Action */}
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-6 border-t border-gray-100 sm:border-0 pt-4 sm:pt-0 mt-2 sm:mt-0">
                      {getStatusBadge(req.status)}
                      
                      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
