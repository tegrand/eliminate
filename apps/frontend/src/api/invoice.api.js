import axiosInstance from "./axios";

export const invoiceApi = {
  getInvoices: async (params = {}) => {
    const response = await axiosInstance.get("/invoices", { params });
    return response.data;
  },

  getInvoiceById: async (id) => {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data;
  }
};
