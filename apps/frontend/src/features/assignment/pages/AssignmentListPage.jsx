import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserCheck, Loader2, Clock, MapPin, Building2, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../../api/axios";
import { ROUTES } from "../../../routes/routePaths";

export default function AssignmentListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const res = await api.get("/assignments");
      return res.data?.data || res.data || [];
    }
  });

  const assignments = data || [];

  return (
    <div className="w-full flex flex-col animate-fade-in h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide py-6 px-4 sm:px-8 lg:px-12 bg-[#f8f9fa]">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-emerald-600" />
            Assignments
          </h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-2xl">
            Track active jobs, contracts, and assigned workforce.
          </p>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-100">
            Failed to load assignments.
          </div>
        ) : assignments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No active assignments</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              You don't have any assignments yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map(assignment => (
              <div key={assignment.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{assignment.title}</h3>
                    <p className="text-xs font-mono text-gray-400 mt-0.5">{assignment.assignmentCode}</p>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                    assignment.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    assignment.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {assignment.status}
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  {assignment.client && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      Client: <span className="font-semibold text-gray-900">{assignment.client.companyName || assignment.client.user?.firstName}</span>
                    </div>
                  )}
                  {assignment.agency && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      Agency: <span className="font-semibold text-gray-900">{assignment.agency.agencyName || assignment.agency.user?.firstName}</span>
                    </div>
                  )}
                  {assignment.startDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Start: <span className="font-semibold text-gray-900">{new Date(assignment.startDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 text-gray-400" />
                    Workers Assigned: <span className="font-semibold text-emerald-600">{assignment.assignedWorkers?.filter(w => w.status === 'ACTIVE').length || 0}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <span className="font-bold text-gray-900 text-lg">
                    {assignment.agreedRate ? `₹${assignment.agreedRate}` : "Rate TBD"}
                  </span>
                  <Link 
                    to={ROUTES.ASSIGNMENT_DETAILS.replace(":id", assignment.id)}
                    className="px-5 py-2 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 hover:text-indigo-600 transition-colors shadow-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
