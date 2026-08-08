import api from "./axios";

export const workerPaymentsApi = {
  // Worker Endpoints
  getMyPayments: (params) => api.get("/my-payments", { params }),
  getPaymentSummary: () => api.get("/my-payments/summary"),
  getPaymentById: (id) => api.get(`/my-payments/${id}`),

  // Super Admin Endpoints
  getAllWorkerPayouts: (params) => api.get("/my-payments/admin/all", { params }),
  markPayoutAsPaid: (id, data) => api.patch(`/my-payments/admin/${id}/pay`, data),
};
