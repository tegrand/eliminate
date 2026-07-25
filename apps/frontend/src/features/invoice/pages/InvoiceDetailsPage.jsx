import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Send } from "lucide-react";
import { Button } from "../../../components/ui/button";
import InvoiceSummaryCard from "../components/InvoiceSummaryCard";

const MOCK_INVOICE = {
  id: "INV-1002", 
  invoiceNumber: "INV-2026-002", 
  client: "Global Logistics", 
  clientId: "C-1002",
  assignments: 1, 
  subtotal: "$12,000.00", 
  taxes: "$1,200.00", 
  grandTotal: "$13,200.00", 
  status: "UNPAID", 
  date: "2026-07-15"
};

export default function InvoiceDetailsPage() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Link 
            to="/invoices" 
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Invoice Details</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
          <Button className="w-full sm:w-auto">
            <Send className="mr-2 h-4 w-4" /> Send to Client
          </Button>
        </div>
      </div>

      <InvoiceSummaryCard invoice={MOCK_INVOICE} />
      
      {/* Placeholder for line items table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm p-8 text-center text-gray-500">
        Line items breakdown table will be rendered here.
      </div>
    </div>
  );
}
