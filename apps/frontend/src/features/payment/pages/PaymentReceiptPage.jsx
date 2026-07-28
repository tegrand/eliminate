import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileText, ReceiptText } from "lucide-react";
import { Button } from "../../../components/ui/button";

const RECEIPT = {
  id: "PAY-1024",
  invoiceNumber: "INV-2048",
  client: "Acme Industries",
  amount: "18,500.00",
  method: "Bank Transfer",
  date: "2026-07-18",
  status: "COMPLETED",
};

export default function PaymentReceiptPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <Link to="/payments" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Payment Receipts
      </Link>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-11 w-11 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <ReceiptText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payment Receipt</h1>
            <p className="mt-1 text-sm text-gray-500">
              Receipt details for <span className="font-semibold text-gray-700">{id || RECEIPT.id}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Invoice</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{RECEIPT.invoiceNumber}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Client</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{RECEIPT.client}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">₹{RECEIPT.amount}</p>
          </div>
          <div className="rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Method</p>
            <p className="mt-2 text-sm font-semibold text-gray-900">{RECEIPT.method}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">Download Invoice</p>
            <p className="text-sm text-gray-500">Generate a printable invoice copy for this payment.</p>
          </div>
          <Button onClick={() => navigate("/invoices")} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>

        <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-4 flex items-center gap-3 text-sm text-gray-600">
          <FileText className="h-4 w-4 text-gray-400" />
          Payment receipts are available here for quick verification and invoice download.
        </div>
      </div>
    </div>
  );
}
