import { Card, CardContent } from "../../../components/ui/card";
import { FileText, Building2, Briefcase, Calculator } from "lucide-react";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

export default function InvoiceSummaryCard({ invoice }) {
  if (!invoice) return null;

  return (
    <Card className="mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <h3 className="font-semibold text-gray-900">Invoice Details</h3>
        <InvoiceStatusBadge status={invoice.status} />
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-blue-50 p-2 rounded-lg text-blue-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Invoice Number</p>
              <p className="font-semibold text-gray-900">{invoice.invoiceNumber}</p>
              <p className="text-xs text-gray-400 mt-1">Generated: {invoice.date}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-purple-50 p-2 rounded-lg text-purple-600">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Client</p>
              <p className="font-semibold text-gray-900">{invoice.client}</p>
              <p className="text-xs text-gray-400 mt-1">{invoice.clientId}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-green-50 p-2 rounded-lg text-green-600">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Assignments Billed</p>
              <p className="font-semibold text-gray-900">{invoice.assignments}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-1 bg-amber-50 p-2 rounded-lg text-amber-600">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Grand Total</p>
              <p className="font-semibold text-gray-900">{invoice.grandTotal}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
