import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import PaymentTable from "../components/PaymentTable";

const MOCK_PAYMENTS = [
  { id: "PAY-1", paymentId: "TXN-00921", invoiceNumber: "INV-2026-001", client: "TechCorp Inc", amount: "$49,500.00", method: "Bank Transfer", date: "2026-07-10", status: "COMPLETED" },
  { id: "PAY-2", paymentId: "TXN-00945", invoiceNumber: "INV-2026-002", client: "Global Logistics", amount: "$13,200.00", method: "Credit Card", date: "2026-07-18", status: "PROCESSING" },
];

export default function PaymentListPage() {
  const [payments] = useState(MOCK_PAYMENTS);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Receipts</h2>
          <p className="text-sm text-gray-500 mt-1">Track incoming client payments and reconcile invoices.</p>
        </div>
        <div className="w-full sm:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-6">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input 
            placeholder="Search payments..." 
            aria-label="Search payments"
            className="pl-9"
          />
        </div>
      </div>

      <PaymentTable payments={payments} />
    </div>
  );
}
