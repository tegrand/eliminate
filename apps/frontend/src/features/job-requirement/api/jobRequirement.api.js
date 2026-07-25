import api from "../../../api/axios";

export const jobRequirementApi = {
  getJobRequirements: async (params) => {
    console.log("jobRequirementApi.getJobRequirements called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            requirements: [
              { 
                id: "JR-1001", 
                client: "TechCorp Inc", 
                jobTitle: "Senior Frontend Developer", 
                requiredWorkers: 5, 
                assignedWorkers: 2, 
                startDate: "2026-08-01",
                endDate: "2027-08-01",
                priority: "HIGH",
                status: "OPEN" 
              },
              { 
                id: "JR-1002", 
                client: "Global Logistics", 
                jobTitle: "Warehouse Manager", 
                requiredWorkers: 2, 
                assignedWorkers: 2, 
                startDate: "2026-07-15",
                endDate: "2026-12-31",
                priority: "MEDIUM",
                status: "FULFILLED" 
              },
              { 
                id: "JR-1003", 
                client: "FinServe LLC", 
                jobTitle: "Data Analyst", 
                requiredWorkers: 1, 
                assignedWorkers: 0, 
                startDate: "2026-09-01",
                endDate: "2027-02-28",
                priority: "CRITICAL",
                status: "PENDING" 
              },
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
