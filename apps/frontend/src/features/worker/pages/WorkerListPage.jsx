import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import clsx from "clsx";
import WorkerToolbar from "../components/WorkerToolbar";
import WorkerFilters from "../components/WorkerFilters";
import WorkerTable from "../components/WorkerTable";
import WorkerStats from "../components/WorkerStats";
import { useWorkers } from "../hooks/useWorkers";
import { useAuth } from "../../../hooks/useAuth";

export default function WorkerListPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  // Default to table view for SUPER_ADMIN (just like AgencyListPage), and grid view for other roles
  const [viewMode, setViewMode] = useState(user?.profileType === "SUPER_ADMIN" ? "table" : "grid");
  const [searchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const { data, isLoading } = useWorkers({ page, status: currentStatus !== "ALL" ? currentStatus : undefined });

  const agencyFilter = searchParams.get("agency") || "";
  const skillFilter = searchParams.get("skill") || "";

  // Normalize backend shape: { items, pagination } → flat worker list with UI-friendly fields
  const rawWorkers = data?.data?.items || data?.data?.workers || [];
  const pagination = data?.data?.pagination || {};

  const normalizedWorkers = rawWorkers.map((w) => {
    const firstName = w.user?.firstName || w.firstName || "";
    const lastName = w.user?.lastName || w.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || w.user?.name || w.name;
    
    return {
      ...w,
      id: w.id,
      employeeId: w.workerCode || w.id,
      name: fullName || "—",
      gender: w.user?.gender || w.gender || "—",
      phone: w.user?.phone || w.phone || "-",
      agency: w.agency?.name || w.agencyProfile?.name || (typeof w.agency === 'string' ? w.agency : "—"),
      primarySkill: w.primarySkill?.name || (typeof w.primarySkill === 'string' ? w.primarySkill : "—") || w.skills?.[0]?.name || "—",
      status: w.profileStatus || w.status || "PENDING",
      availability: w.availability || "Available",
      performance: w.performance || {
        attendance: 92,
        completedJobs: 14,
        rating: 4.8,
        complaints: 0,
        experience: w.totalExperienceYears || 3,
      }
    };
  });

  let displayedWorkers = normalizedWorkers;
  
  if (agencyFilter) {
    displayedWorkers = displayedWorkers.filter(w => w.agency === agencyFilter);
  }
  if (skillFilter) {
    displayedWorkers = displayedWorkers.filter(w => w.primarySkill === skillFilter);
  }
  
  const statsWorkers = displayedWorkers;

  if (currentStatus !== "ALL") {
    displayedWorkers = displayedWorkers.filter(w => w.status === currentStatus);
  }

  const getTabPath = (statusVal) => {
    const params = new URLSearchParams(searchParams);
    if (statusVal === "ALL") {
      params.delete("status");
    } else {
      params.set("status", statusVal);
    }
    const str = params.toString();
    return str ? `/workers?${str}` : "/workers";
  };

  const tabs = [
    { name: "All Workers", value: "ALL", path: getTabPath("ALL") },
    { name: "Pending", value: "PENDING", path: getTabPath("PENDING") },
    { name: "Approved", value: "APPROVED", path: getTabPath("APPROVED") },
    { name: "Rejected", value: "REJECTED", path: getTabPath("REJECTED") },
    { name: "Suspended", value: "SUSPENDED", path: getTabPath("SUSPENDED") }
  ];

  const availableStatuses = [...new Set(rawWorkers.map(w => w.profileStatus || w.status || "PENDING"))];
  const availableAgencies = [...new Set(rawWorkers.map(w => w.agency?.name || w.agencyProfile?.name || (typeof w.agency === 'string' ? w.agency : null)).filter(Boolean))];
  const availableSkills = [...new Set(rawWorkers.map(w => w.primarySkill?.name || (typeof w.primarySkill === 'string' ? w.primarySkill : null) || w.skills?.[0]?.name).filter(Boolean))];

  return (
    <div className="w-full min-h-screen pb-20 pt-2 flex flex-col animate-fade-in bg-transparent overflow-y-auto">
      <WorkerToolbar 
        totalWorkers={displayedWorkers.length} 
        availableStatuses={availableStatuses}
        availableAgencies={availableAgencies}
        availableSkills={availableSkills}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      {user?.profileType !== "AGENCY" && (
        <WorkerStats workers={statsWorkers} />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
        {user?.profileType !== "AGENCY" && (
          <div className="border-b border-gray-100 px-6 pt-1 flex-shrink-0">
            <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={clsx(
                    currentStatus === tab.value
                      ? "border-indigo-600 text-indigo-700 font-bold"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-semibold",
                    "whitespace-nowrap border-b-2 py-3 px-1 text-[13px] transition-colors"
                  )}
                >
                  {tab.name}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div className="px-6 pb-4 flex flex-col flex-1 overflow-hidden">
          <div className="mt-3 flex-1 overflow-hidden flex flex-col">
            <WorkerTable 
              workers={displayedWorkers} 
              loading={isLoading} 
              page={pagination.page || 1}
              totalPages={pagination.totalPages || 1}
              onPageChange={setPage}
              viewMode={viewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
