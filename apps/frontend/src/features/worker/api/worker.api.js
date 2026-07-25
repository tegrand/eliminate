import api from "../../../api/axios";

export const workerApi = {
  getWorkers: async (params) => {
    // Placeholder API call ready for backend integration
    // return await api.get("/workers", { params });
    console.log("workerApi.getWorkers called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            workers: [
              { id: "W-1001", name: "John Doe", phone: "+1 234-567-8901", agency: "Alpha Staffing", primarySkill: "Forklift Operator", status: "ACTIVE" },
              { id: "W-1002", name: "Jane Smith", phone: "+1 234-567-8902", agency: "Beta Temp", primarySkill: "Warehouse Associate", status: "ON_LEAVE" },
              { id: "W-1003", name: "Mike Johnson", phone: "+1 234-567-8903", agency: "Direct Hire", primarySkill: "Security Guard", status: "INACTIVE" },
            ],
            total: 3,
            page: params?.page || 1,
            totalPages: 1
          }
        });
      }, 800);
    });
  }
};
