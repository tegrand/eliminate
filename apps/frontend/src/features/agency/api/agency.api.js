import api from "../../../api/axios";

export const agencyApi = {
  getAgencies: async (params) => {
    // const response = await api.get("/agencies", { params });
    // return response.data;
    console.log("agencyApi.getAgencies called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            agencies: [
              { id: "A-3001", agencyName: "Alpha Staffing", contactPerson: "John Smith", phone: "+1 555-1001", district: "North District", totalWorkers: 145, status: "ACTIVE" },
              { id: "A-3002", agencyName: "Beta Temp", contactPerson: "Jane Doe", phone: "+1 555-1002", district: "South District", totalWorkers: 89, status: "ONBOARDING" },
              { id: "A-3003", agencyName: "Direct Hire", contactPerson: "Mike Johnson", phone: "+1 555-1003", district: "Central", totalWorkers: 0, status: "INACTIVE" },
            ],
            total: 3,
            page: params?.page || 1,
            totalPages: 1
          }
        });
      }, 800);
    });
  },
  
  getAgencyById: async (id) => {
    // const response = await api.get(`/agencies/${id}`);
    // return response.data;
    console.log(`agencyApi.getAgencyById called with id:`, id);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          agencyName: "Alpha Staffing",
          registrationNumber: "REG123456",
          taxId: "TAX987654",
          contactPerson: "John Smith",
          phone: "+1 555-1001",
          email: "john@alphastaffing.com",
          address: "123 Alpha St",
          city: "Metropolis",
          district: "North District",
          state: "State",
          pinCode: "123456",
          bankName: "Chase Bank",
          accountNumber: "XXXX-XXXX-XXXX",
          ifscCode: "ABCD0123456",
          status: "ACTIVE",
        });
      }, 1000);
    });
  },
  
  createAgency: async (data) => {
    // const response = await api.post("/agencies", data);
    // return response.data;
    console.log("agencyApi.createAgency called with:", data);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: "A-new" }), 1000));
  },
  
  updateAgency: async (id, data) => {
    // const response = await api.put(`/agencies/${id}`, data);
    // return response.data;
    console.log(`agencyApi.updateAgency called for id ${id} with:`, data);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, id }), 1000));
  },
  
  deleteAgency: async (id) => {
    // const response = await api.delete(`/agencies/${id}`);
    // return response.data;
    console.log(`agencyApi.deleteAgency called for id:`, id);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  }
};
