import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

export default function PaymentToolbar({ totalPayments = 0 }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Payment Receipts</h2>
        <p className="text-sm text-slate-500 mt-1">
          Track incoming client payments and reconcile invoices. Total {totalPayments} records found.
        </p>
      </div>
      <Input 
        placeholder="Search payments..." 
        aria-label="Search payments"
        leftIcon={<Search className="h-4 w-4 text-slate-400" />}
        className="w-full sm:w-72 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
      />
    </div>
  );
}
