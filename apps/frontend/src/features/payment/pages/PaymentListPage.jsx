import { useState } from "react";
import PaymentToolbar from "../components/PaymentToolbar";
import PaymentTable from "../components/PaymentTable";

const MOCK_PAYMENTS = [];

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
