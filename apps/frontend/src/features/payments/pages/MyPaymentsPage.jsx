import { useState, useEffect } from "react";
import { CreditCard, Download, Loader2, DollarSign, Clock, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import api from "../../../api/axios";
import Button from "../../../components/ui/button/Button";
import { format, parseISO } from "date-fns";

export default function MyPaymentsPage() {
  const [activeTab, setActiveTab] = useState("history");
  const [loading, setLoading] = useState(true);
  
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [summaryRes, paymentsRes] = await Promise.all([
        api.get("/my-payments/summary"),
        api.get("/my-payments", { params: { status: activeTab === 'history' ? 'COMPLETED' : 'PENDING' } })
      ]);
      
      setSummary(summaryRes.data.data);
      setPayments(paymentsRes.data.data);
      
    } catch (error) {
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleDownloadPayslip = async (paymentId) => {
    try {
      toast.loading("Generating payslip...", { id: "payslip" });
      const res = await api.get(`/my-payments/${paymentId}`);
      const paymentData = res.data.data;
      
      // We will open a new window and render a simple print view
      const printWindow = window.open('', '_blank');
      
      const html = `
        <html>
          <head>
            <title>Payslip - ${paymentData.id}</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; }
              .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
              .title { font-size: 20px; font-weight: bold; margin-top: 10px; }
              .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .box { border: 1px solid #ddd; padding: 15px; border-radius: 8px; width: 45%; }
              .box h3 { margin-top: 0; color: #666; font-size: 14px; text-transform: uppercase; }
              .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
              .row:last-child { border-bottom: none; }
              .total { font-size: 18px; font-weight: bold; color: #4f46e5; border-top: 2px solid #ddd; padding-top: 15px; margin-top: 15px; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Eliminate</div>
              <div class="title">Payslip</div>
            </div>
            
            <div class="details">
              <div class="box">
                <h3>Worker Details</h3>
                <p><strong>Name:</strong> ${paymentData.worker.user.firstName} ${paymentData.worker.user.lastName}</p>
                <p><strong>Email:</strong> ${paymentData.worker.user.email}</p>
                <p><strong>Worker ID:</strong> ${paymentData.workerId}</p>
              </div>
              <div class="box">
                <h3>Payment Details</h3>
                <p><strong>Payment Date:</strong> ${format(parseISO(paymentData.paymentDate), 'MMM dd, yyyy')}</p>
                <p><strong>Period:</strong> ${format(parseISO(paymentData.periodStart), 'MMM dd')} - ${format(parseISO(paymentData.periodEnd), 'MMM dd, yyyy')}</p>
                <p><strong>Status:</strong> ${paymentData.status}</p>
                <p><strong>Reference No:</strong> ${paymentData.referenceNo || 'N/A'}</p>
              </div>
            </div>
            
            <div class="box" style="width: 100%;">
              <h3>Earnings</h3>
              <div class="row">
                <span>Basic Pay / Wages</span>
                <span>$${paymentData.amount.toFixed(2)}</span>
              </div>
              <div class="row total">
                <span>Net Pay</span>
                <span>$${paymentData.amount.toFixed(2)}</span>
              </div>
            </div>
            
            <div style="margin-top: 40px; text-align: center;">
              <button onclick="window.print()" style="padding: 10px 20px; background: #4f46e5; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Payslip</button>
            </div>
          </body>
        </html>
      `;
      
      printWindow.document.write(html);
      printWindow.document.close();
      toast.success("Payslip generated", { id: "payslip" });
      
    } catch (error) {
      toast.error("Failed to generate payslip", { id: "payslip" });
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Payments</h1>
          <p className="text-sm text-slate-500 mt-1">Track your salary, view payment history and download payslips</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-200 p-4 shrink-0">
          <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("history")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                ${activeTab === "history" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              <CreditCard className={`w-5 h-5 ${activeTab === "history" ? "text-indigo-600" : "text-slate-400"}`} />
              Salary History
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap md:whitespace-normal
                ${activeTab === "pending" 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100" 
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                }`}
            >
              <Clock className={`w-5 h-5 ${activeTab === "pending" ? "text-indigo-600" : "text-slate-400"}`} />
              Pending Payments
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                  <DollarSign className="w-24 h-24 absolute -right-4 -bottom-4 text-white/10" />
                  <p className="text-indigo-100 font-medium text-sm">Total Earned</p>
                  <h3 className="text-3xl font-bold mt-2">${summary?.totalEarned?.toFixed(2) || '0.00'}</h3>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-500 font-medium text-sm">Pending Amount</p>
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">${summary?.totalPending?.toFixed(2) || '0.00'}</h3>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-slate-500 font-medium text-sm">Last Payment</p>
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">${summary?.lastPaymentAmount?.toFixed(2) || '0.00'}</h3>
                  {summary?.lastPaymentDate && (
                    <p className="text-xs text-slate-400 mt-1">on {format(parseISO(summary.lastPaymentDate), 'MMM dd, yyyy')}</p>
                  )}
                </div>
              </div>

              {/* Payments List */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-4">
                  {activeTab === 'history' ? 'Payment History' : 'Pending Payments'}
                </h3>
                
                <div className="space-y-3">
                  {payments.length === 0 ? (
                    <div className="text-center py-12 border border-slate-200 border-dashed rounded-xl">
                      <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <h3 className="font-semibold text-slate-800">No payments found</h3>
                      <p className="text-sm text-slate-500 mt-1">You don't have any {activeTab} payments yet.</p>
                    </div>
                  ) : (
                    payments.map(payment => (
                      <div key={payment.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-full ${activeTab === 'history' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                            <DollarSign className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">${payment.amount.toFixed(2)}</h4>
                            <p className="text-sm text-slate-600">Period: {format(parseISO(payment.periodStart), 'MMM dd')} - {format(parseISO(payment.periodEnd), 'MMM dd, yyyy')}</p>
                            {payment.paymentDate && (
                              <p className="text-xs text-slate-400 mt-1">Paid on {format(parseISO(payment.paymentDate), 'MMM dd, yyyy')}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 w-full md:w-auto">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                            ${payment.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                              payment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                              payment.status === 'PROCESSING' ? 'bg-blue-100 text-blue-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                            {payment.status}
                          </span>
                          
                          {payment.status === 'COMPLETED' && (
                            <Button variant="outline" size="sm" onClick={() => handleDownloadPayslip(payment.id)}>
                              <Download className="w-4 h-4 mr-2" /> Payslip
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
