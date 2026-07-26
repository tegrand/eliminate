import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";

export default function InvoiceToolbar({ totalInvoices = 0 }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Client Invoices</h2>
        <p className="text-sm text-slate-500 mt-1">
          Manage and track billing invoices sent to clients. Total {totalInvoices} invoices found.
        </p>
      </div>
      <Input 
        placeholder="Search invoices..." 
        aria-label="Search invoices"
        leftIcon={<Search className="h-4 w-4 text-slate-400" />}
        className="w-full sm:w-72 bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm"
      />
    </div>
  );
}
