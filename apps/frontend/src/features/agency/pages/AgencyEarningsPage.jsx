import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { agencyPaymentsApi } from "../../../api/agency-payments.api";
import { format } from "date-fns";
import clsx from "clsx";

export default function AgencyEarningsPage() {
  const [filter, setFilter] = useState("ALL");

  const { data: summaryRes, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["workerPaymentSummary"],
    queryFn: agencyPaymentsApi.getPaymentSummary
  });

  const { data: paymentsRes, isLoading: isLoadingPayments } = useQuery({
    queryKey: ["workerPayments", filter],
    queryFn: () => agencyPaymentsApi.getMyPayments(filter !== "ALL" ? { status: filter } : {})
  });

  const summary = summaryRes?.data?.data;
  const payments = paymentsRes?.data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Earnings</h1>
          <p className="text-sm text-gray-500">Track your payouts and payment history</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <CheckCircle2 className="w-24 h-24 text-green-600" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Total Received</h3>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{summary?.totalEarned?.toLocaleString() || 0}
            </p>
            {summary?.lastPaymentDate && (
              <p className="text-xs text-gray-500 mt-2">
                Last payment of ₹{summary.lastPaymentAmount} on {format(new Date(summary.lastPaymentDate), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Clock className="w-24 h-24 text-amber-600" />
          </div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
              <IndianRupee className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{summary?.totalPending?.toLocaleString() || 0}
            </p>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Processing by Admin
            </p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
          <div className="flex gap-2">
            {["ALL", "PENDING", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  filter === status
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {status === "ALL" ? "All" : status === "PENDING" ? "Pending" : "Completed"}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Job / Assignment</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference No.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoadingPayments ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 flex flex-col items-center gap-2">
                    <IndianRupee className="w-8 h-8 text-gray-300" />
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {format(new Date(payment.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {payment.assignment?.title || "Unknown Assignment"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{payment.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={clsx(
                        "px-2.5 py-1 text-xs font-medium rounded-full",
                        payment.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                        payment.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                        "bg-gray-100 text-gray-700"
                      )}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.referenceNo || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
