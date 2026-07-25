import api from "../../../api/axios";

export const clientApi = {
  getClients: async (params) => {
    // const response = await api.get("/clients", { params });
    // return response.data;
    console.log("clientApi.getClients called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            clients: [
              { id: "C-2001", companyName: "Amazon Hub", contactPerson: "Sarah Connor", phone: "+1 555-0101", location: "North District", status: "ACTIVE" },
              { id: "C-2002", companyName: "Walmart Fulfillment", contactPerson: "Bruce Wayne", phone: "+1 555-0102", location: "South District", status: "ONBOARDING" },
              { id: "C-2003", companyName: "Tech Park", contactPerson: "Tony Stark", phone: "+1 555-0103", location: "Central", status: "INACTIVE" },
            ],
            total: 3,
            page: params?.page || 1,
            totalPages: 1
          }
        });
      }, 800);
    });
  },
  
  getClientById: async (id) => {
    // const response = await api.get(`/clients/${id}`);
    // return response.data;
    console.log(`clientApi.getClientById called with id:`, id);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          companyName: "Amazon Hub",
          industry: "Logistics",
          registrationNumber: "REG123456",
          taxId: "TAX987654",
          contactPerson: "Sarah Connor",
          phone: "+1 555-0101",
          email: "sarah@amazon.com",
          address: "123 Hub St",
          city: "Metropolis",
          district: "North District",
          state: "State",
          pinCode: "123456",
          billingCycle: "MONTHLY",
          paymentTerms: "NET_30",
          billingAddress: "Same as above",
          status: "ACTIVE",
          notes: "Priority client",
        });
      }, 1000);
    });
  },
  
  createClient: async (data) => {
    // const response = await api.post("/clients", data);
    // return response.data;
    console.log("clientApi.createClient called with:", data);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: "C-new" }), 1000));
  },
  
  updateClient: async (id, data) => {
    // const response = await api.put(`/clients/${id}`, data);
    // return response.data;
    console.log(`clientApi.updateClient called for id ${id} with:`, data);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, id }), 1000));
  },
  
  deleteClient: async (id) => {
    // const response = await api.delete(`/clients/${id}`);
    // return response.data;
    console.log(`clientApi.deleteClient called for id:`, id);
    return new Promise((resolve) => setTimeout(() => resolve({ success: true }), 1000));
  }
};
