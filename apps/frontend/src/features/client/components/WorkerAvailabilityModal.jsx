import { X, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { workerApi } from "../../worker/api/worker.api";

export default function WorkerAvailabilityModal({ isOpen, onClose, workerId, workerName }) {
  const { data: availabilityResponse, isLoading, error } = useQuery({
    queryKey: ["workerAvailability", workerId],
    queryFn: () => workerApi.getWorkerAvailability(workerId),
    enabled: isOpen,
  });

  const bookedDates = availabilityResponse?.data || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex flex-col bg-gray-50 border-b border-gray-100 p-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Worker Availability</h2>
              <p className="text-xs text-gray-500 font-medium">Checking slots for {workerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-sm text-gray-500">Checking schedule...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">Failed to load availability. Please try again.</p>
            </div>
          ) : bookedDates.length === 0 ? (
            <div className="p-6 bg-emerald-50 rounded-xl text-center border border-emerald-100">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-emerald-900 mb-1">Completely Available!</h3>
              <p className="text-xs text-emerald-700">This worker has no upcoming conflicting assignments.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-gray-900 mb-3">Currently Booked Dates:</p>
              {bookedDates.map((slot, index) => {
                const start = new Date(slot.startDate).toLocaleDateString();
                const end = new Date(slot.endDate).toLocaleDateString();
                const isSingleDay = start === end;
                return (
                  <div key={index} className="flex flex-col p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-bold text-gray-900">{isSingleDay ? start : `${start} to ${end}`}</span>
                    </div>
                    <span className="text-xs text-gray-500 ml-6 truncate">{slot.title}</span>
                  </div>
                );
              })}
              <div className="mt-4 p-3 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                Please select dates outside of these slots when sending a hiring request.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-bold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
