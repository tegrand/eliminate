import { useState } from "react";
import { Users, Star, History, Award, Building2, MapPin, Mail, Phone, Calendar, ArrowRight, Activity, TrendingUp, Search, Filter, MoreVertical } from "lucide-react";
import clsx from "clsx";

const MOCK_CLIENTS = [
  { id: 1, name: "Nexus Tech Solutions", contact: "Sarah Jenkins", role: "HR Director", email: "sarah@nexustech.com", phone: "+1 (555) 123-4567", status: "Active", joined: "Jan 12, 2026", rating: 4.8, jobsPosted: 42, location: "New York, NY", isFavourite: true },
  { id: 2, name: "Global Logistics Corp", contact: "Mike Torres", role: "Operations Manager", email: "mtorres@globallogistics.com", phone: "+1 (555) 987-6543", status: "Active", joined: "Mar 05, 2026", rating: 4.5, jobsPosted: 15, location: "Chicago, IL", isFavourite: false },
  { id: 3, name: "Starlight Hospitality", contact: "Elena Rodriguez", role: "General Manager", email: "elena@starlight.com", phone: "+1 (555) 456-7890", status: "Inactive", joined: "Nov 22, 2025", rating: 4.9, jobsPosted: 89, location: "Miami, FL", isFavourite: true },
  { id: 4, name: "BuildRight Construction", contact: "David Chen", role: "Site Supervisor", email: "david.c@buildright.com", phone: "+1 (555) 789-0123", status: "Active", joined: "Feb 18, 2026", rating: 4.2, jobsPosted: 27, location: "Austin, TX", isFavourite: false },
  { id: 5, name: "Healthcare Partners", contact: "Dr. Emily Wong", role: "Chief of Staff", email: "ewong@hcpartners.org", phone: "+1 (555) 234-5678", status: "Active", joined: "Jun 30, 2025", rating: 4.7, jobsPosted: 104, location: "Boston, MA", isFavourite: true },
];

const MOCK_HISTORY = [
  { id: 101, client: "Nexus Tech Solutions", action: "Contract Renewed", date: "Jul 28, 2026", description: "Annual workforce supply contract renewed for 2026-2027.", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
  { id: 102, client: "Global Logistics Corp", action: "Bulk Hiring Complete", date: "Jul 25, 2026", description: "Successfully supplied 50 warehouse workers for holiday season.", icon: Users, color: "text-green-600", bg: "bg-green-50" },
  { id: 103, client: "Healthcare Partners", action: "Payment Received", date: "Jul 20, 2026", description: "Invoice #INV-2026-089 settled ($45,200).", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50" },
  { id: 104, client: "Starlight Hospitality", action: "Service Paused", date: "Jul 15, 2026", description: "Client temporarily paused hiring requests.", icon: PauseCircle, color: "text-orange-600", bg: "bg-orange-50" },
];

const FileText = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>;
const DollarSign = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const PauseCircle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>;


export default function AgencyClientListPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tabs = [
    { id: "all", label: "View Clients", icon: Users },
    { id: "favourites", label: "Favourite Clients", icon: Star },
    { id: "history", label: "Client History", icon: History },
    { id: "ratings", label: "Client Ratings", icon: Award },
  ];

  const filteredClients = MOCK_CLIENTS.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.contact.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "favourites") return matchesSearch && client.isFavourite;
    return matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] p-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            Client Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage your agency's clients, view history, and track performance.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl mb-6 overflow-x-auto border border-gray-200/50 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                isActive 
                  ? "bg-white text-indigo-700 shadow-sm ring-1 ring-black/5" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )}
            >
              <Icon className={clsx("w-4 h-4", isActive ? "text-indigo-600" : "text-gray-400")} />
              {tab.label}
              {tab.id === "favourites" && (
                <span className={clsx(
                  "ml-1.5 px-2 py-0.5 rounded-full text-xs",
                  isActive ? "bg-indigo-100 text-indigo-700" : "bg-gray-200 text-gray-600"
                )}>
                  {MOCK_CLIENTS.filter(c => c.isFavourite).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Clients List (All & Favourites) */}
        {(activeTab === "all" || activeTab === "favourites") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_20px_-6px_rgba(6,81,237,0.15)] transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{client.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {client.location}
                      </div>
                    </div>
                  </div>
                  <button className="text-gray-300 hover:text-yellow-400 transition-colors">
                    <Star className={clsx("w-5 h-5", client.isFavourite && "fill-yellow-400 text-yellow-400")} />
                  </button>
                </div>
                
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <UserCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 leading-none">{client.contact}</p>
                      <p className="text-xs text-gray-500 mt-1">{client.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span>{client.phone}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Rating</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        {client.rating}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Jobs</p>
                      <p className="text-sm font-semibold text-gray-900">{client.jobsPosted}</p>
                    </div>
                  </div>
                  <span className={clsx(
                    "px-2.5 py-1 rounded-md text-xs font-medium",
                    client.status === "Active" ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10" : "bg-gray-100 text-gray-600 ring-1 ring-gray-500/10"
                  )}>
                    {client.status}
                  </span>
                </div>
              </div>
            ))}
            
            {filteredClients.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No clients found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search filters.</p>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                Recent Interactions
              </h2>
            </div>
            <div className="p-6">
              <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 pb-4">
                {MOCK_HISTORY.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="relative pl-8 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={clsx("absolute -left-4 top-1 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white", item.bg)}>
                        <Icon className={clsx("w-4 h-4", item.color)} />
                      </div>
                      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{item.action}</h4>
                            <p className="text-sm text-indigo-600 font-medium mt-0.5">{item.client}</p>
                          </div>
                          <span className="text-xs text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                            <Calendar className="w-3.5 h-3.5" />
                            {item.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-3">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === "ratings" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Award className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-indigo-100 font-medium mb-1">Average Client Rating</h3>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-bold">4.6</span>
                    <span className="text-indigo-200 mb-1">/ 5.0</span>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={clsx("w-5 h-5", star <= 4 ? "fill-yellow-400 text-yellow-400" : "fill-indigo-400/30 text-indigo-400/30")} />
                    ))}
                  </div>
                  <p className="text-sm text-indigo-100">Based on 124 reviews from your active clients in the last 12 months.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  Rating Distribution
                </h3>
                <div className="space-y-3">
                  {[
                    { stars: 5, pct: 65 },
                    { stars: 4, pct: 25 },
                    { stars: 3, pct: 7 },
                    { stars: 2, pct: 2 },
                    { stars: 1, pct: 1 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3 text-sm">
                      <div className="w-12 text-gray-600 font-medium flex items-center gap-1">
                        {row.stars} <Star className="w-3.5 h-3.5 fill-gray-400 text-gray-400" />
                      </div>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${row.pct}%` }}></div>
                      </div>
                      <div className="w-10 text-right text-gray-500 text-xs">{row.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Client Reviews</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[
                    { client: "Healthcare Partners", rating: 5, date: "Jul 28, 2026", text: "Exceptional service. The agency provided highly qualified nurses within a very tight deadline. Will definitely continue our partnership." },
                    { client: "Nexus Tech Solutions", rating: 4, date: "Jul 20, 2026", text: "Good quality IT staff provided. Communication was smooth, though onboarding took slightly longer than expected." },
                    { client: "Starlight Hospitality", rating: 5, date: "Jul 12, 2026", text: "The temporary staff for our summer season was perfectly trained and highly professional. Highly recommended!" },
                  ].map((review, idx) => (
                    <div key={idx} className="p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{review.client}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} className={clsx("w-3.5 h-3.5", star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200")} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">• {review.date}</span>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
                  <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center justify-center gap-1.5 w-full">
                    View All Reviews <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
