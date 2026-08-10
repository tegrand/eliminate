import api from "./axios";

export const agencyPaymentsApi = {
  // Agency Endpoints
  getMyPayments: (params) => api.get("/agency-payments", { params }),
  getPaymentSummary: () => api.get("/agency-payments/summary"),
  getPaymentById: (id) => api.get(`/agency-payments/${id}`),

  // Super Admin Endpoints
  getAllAgencyPayouts: (params) => api.get("/agency-payments/admin/all", { params }),
  markPayoutAsPaid: (id, data) => api.patch(`/agency-payments/admin/${id}/pay`, data),
};
