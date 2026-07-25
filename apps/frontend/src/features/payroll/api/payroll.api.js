import api from "../../../api/axios";

export const payrollApi = {
  getPayrolls: async (params) => {
    console.log("payrollApi.getPayrolls called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            payrolls: [
              { 
                id: "PR-2026-07-A",
                period: "Jul 01 - Jul 15, 2026",
                workers: 145,
                amount: "$124,500.00",
                generatedDate: "2026-07-16",
                status: "PAID" 
              },
              { 
                id: "PR-2026-07-B",
                period: "Jul 16 - Jul 31, 2026",
                workers: 152,
                amount: "$138,200.00",
                generatedDate: "2026-08-01",
                status: "PENDING_APPROVAL" 
              },
              { 
                id: "PR-2026-08-A",
                period: "Aug 01 - Aug 15, 2026",
                workers: 148,
                amount: "$130,000.00",
                generatedDate: "2026-08-16",
                status: "DRAFT" 
              }
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
