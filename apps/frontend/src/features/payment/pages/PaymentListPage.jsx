import { useState } from "react";
import PaymentToolbar from "../components/PaymentToolbar";
import PaymentTable from "../components/PaymentTable";

const MOCK_PAYMENTS = [
  { id: "PAY-1", paymentId: "TXN-00921", invoiceNumber: "INV-2026-001", client: "TechCorp Inc", amount: "$49,500.00", method: "Bank Transfer", date: "2026-07-10", status: "COMPLETED" },
  { id: "PAY-2", paymentId: "TXN-00945", invoiceNumber: "INV-2026-002", client: "Global Logistics", amount: "$13,200.00", method: "Credit Card", date: "2026-07-18", status: "PROCESSING" },
];

export default function PaymentListPage() {
  const [payments] = useState(MOCK_PAYMENTS);

  return (
    <div className="w-full h-[calc(100vh-4rem)] px-4 pb-4 pt-8 flex flex-col animate-fade-in bg-[#f8f9fa] overflow-hidden">
      <PaymentToolbar totalPayments={payments.length} />
      
      <div className="flex-1 overflow-hidden mt-3">
        <PaymentTable 
          payments={payments} 
          loading={false}
          page={1}
          totalPages={1}
        />
      </div>
    </div>
  );
}
