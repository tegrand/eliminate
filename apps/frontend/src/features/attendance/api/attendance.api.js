import api from "../../../api/axios";

export const attendanceApi = {
  getAttendance: async (params) => {
    console.log("attendanceApi.getAttendance called with:", params);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            attendance: [
              { 
                id: "ATT-1001",
                date: "2026-07-25",
                assignment: "ASM-1001",
                worker: "John Smith",
                client: "TechCorp Inc", 
                agency: "Alpha Staffing",
                checkIn: "08:00 AM",
                checkOut: "05:00 PM",
                hoursWorked: "9",
                status: "VERIFIED" 
              },
              { 
                id: "ATT-1002",
                date: "2026-07-25",
                assignment: "ASM-1001",
                worker: "Jane Doe",
                client: "TechCorp Inc", 
                agency: "Alpha Staffing",
                checkIn: "08:15 AM",
                checkOut: "05:00 PM",
                hoursWorked: "8.75",
                status: "LATE" 
              },
              { 
                id: "ATT-1003",
                date: "2026-07-25",
                assignment: "ASM-1003",
                worker: "Michael Scott",
                client: "FinServe LLC", 
                agency: "Direct Hire",
                checkIn: "09:00 AM",
                checkOut: "-",
                hoursWorked: "-",
                status: "PENDING" 
              },
              { 
                id: "ATT-1004",
                date: "2026-07-25",
                assignment: "ASM-1002",
                worker: "Dwight Schrute",
                client: "Global Logistics", 
                agency: "Beta Temp",
                checkIn: "-",
                checkOut: "-",
                hoursWorked: "0",
                status: "ABSENT" 
              },
            ],
            total: 4,
            page: params?.page || 1,
            totalPages: 1
          }
        });
      }, 800);
    });
  }
};
