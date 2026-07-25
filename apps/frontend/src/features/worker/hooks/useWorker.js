import { useQuery } from "@tanstack/react-query";

export const useWorker = (id) => {
  return useQuery({
    queryKey: ["worker", id],
    queryFn: async () => {
      // Mock API delay
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            employeeId: "W-1001",
            firstName: "John",
            lastName: "Doe",
            gender: "MALE",
            dateOfBirth: "1990-01-01",
            phone: "+1 234 567 8901",
            alternatePhone: "",
            email: "john@example.com",
            address: "123 Main St",
            city: "Metropolis",
            district: "Central",
            state: "State",
            pinCode: "123456",
            agency: "Alpha Staffing",
            primarySkill: "Forklift Operator",
            secondarySkill: "",
            joiningDate: "2023-01-15",
            status: "ACTIVE",
            salary: "500 / day",
            emergencyContactName: "Jane Doe",
            emergencyRelationship: "Spouse",
            emergencyContactNumber: "+1 987 654 3210",
          });
        }, 1000);
      });
    },
    enabled: !!id,
  });
};
