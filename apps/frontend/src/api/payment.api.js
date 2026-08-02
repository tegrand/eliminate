import api from "./axios";

export const paymentApi = {
  createOrder: (hiringRequestId) => api.post("/payments/create-order", { hiringRequestId }),
  verifyPayment: (data) => api.post("/payments/verify", data),
};
