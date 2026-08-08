import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workerPaymentsApi } from "../../../api/worker-payments.api";
import { IndianRupee, Search, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import clsx from "clsx";

export default function WorkerPayoutsPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [referenceNo, setReferenceNo] = useState("");
  const queryClient = useQueryClient();

  const { data: payoutsRes, isLoading } = useQuery({
    queryKey: ["adminWorkerPayouts", filter, search],
    queryFn: () => workerPaymentsApi.getAllWorkerPayouts({ status: filter, search })
  });

  const payouts = payoutsRes?.data?.data?.payouts || [];

  const payMutation = useMutation({
    mutationFn: ({ id, data }) => workerPaymentsApi.markPayoutAsPaid(id, data),
    onSuccess: () => {
      toast.success("Payout marked as paid successfully");
      queryClient.invalidateQueries(["adminWorkerPayouts"]);
      setSelectedPayout(null);
      setReferenceNo("");
    },
    onError: (e) => {
      toast.error(e.response?.data?.message || "Failed to mark payout as paid");
    }
  });

  const handlePay = (e) => {
    e.preventDefault();
    if (!selectedPayout) return;
    payMutation.mutate({
      id: selectedPayout.id,
      data: { referenceNo }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Worker Payouts</h1>
          <p className="text-sm text-gray-500">Manage and track payments owed to workers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search worker by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "PENDING", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  filter === status
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {status === "ALL" ? "All Payouts" : status === "PENDING" ? "Pending" : "Completed"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Worker</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Assignment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">Loading payouts...</td>
                </tr>
              ) : payouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">No payouts found matching your criteria.</td>
                </tr>
              ) : (
                payouts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {p.worker?.user?.firstName?.[0] || "W"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {p.worker?.user?.firstName} {p.worker?.user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{p.worker?.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.assignment?.title || "Unknown"}
                      <div className="text-xs text-gray-400 mt-0.5">{p.assignment?.assignmentCode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{p.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2.5 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 w-max",
                        p.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {p.status === "COMPLETED" ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.status === "PENDING" ? (
                        <button
                          onClick={() => setSelectedPayout(p)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <span className="text-sm text-gray-500">{p.referenceNo || "-"}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Process Payout</h3>
              <button onClick={() => setSelectedPayout(null)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handlePay} className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Amount to Pay</p>
                  <p className="text-2xl font-bold text-gray-900">₹{selectedPayout.amount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {selectedPayout.worker?.user?.firstName} {selectedPayout.worker?.user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{selectedPayout.worker?.user?.phone}</p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Transaction Reference No.</label>
                <input
                  type="text"
                  required
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="e.g. UTR Number, Txn ID"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 outline-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payMutation.isPending || !referenceNo}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black disabled:opacity-50"
                >
                  {payMutation.isPending ? "Processing..." : "Confirm Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
