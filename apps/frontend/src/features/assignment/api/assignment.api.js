import api from "../../../api/axios";

export const assignmentApi = {
  getAssignments: async (params) => {
    console.log("assignmentApi.getAssignments called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            assignments: [
              { 
                id: "ASM-1001", 
                jobRequirement: "JR-1001 (Senior Electrician)",
                client: "TechCorp Inc", 
                assignedWorkers: 2,
                agency: "Alpha Staffing",
                startDate: "2026-08-01",
                endDate: "2027-08-01",
                status: "ACTIVE" 
              },
              { 
                id: "ASM-1002", 
                jobRequirement: "JR-1002 (Plumber)",
                client: "Global Logistics", 
                assignedWorkers: 1,
                agency: "Beta Temp",
                startDate: "2026-07-15",
                endDate: "2026-12-31",
                status: "COMPLETED" 
              },
              { 
                id: "ASM-1003", 
                jobRequirement: "JR-1003 (Construction)",
                client: "FinServe LLC", 
                assignedWorkers: 5,
                agency: "Direct Hire",
                startDate: "2026-09-01",
                endDate: "2027-02-28",
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
