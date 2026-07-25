import api from "../../../api/axios";

export const authApi = {
  login: async (credentials) => {
    console.log("authApi.login called with:", credentials);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email === "javid.prsnl.act@gmail.com" && credentials.password === "Pass123@") {
          resolve({
            data: {
              user: { id: "super_admin_1", role: "SUPER_ADMIN", name: "Super Admin", email: credentials.email, status: "ACTIVE" },
              accessToken: "mock_super_admin_token"
            },
          });
        } else if (credentials.email.includes("agency")) {
          // Simulate agency pending approval
          reject({
            response: {
              data: { message: "Your account is awaiting administrator approval." }
            }
          });
        } else if (credentials.email.includes("worker")) {
           // Simulate worker pending approval
           reject({
            response: {
              data: { message: "Your account is awaiting administrator approval." }
            }
          });
        } else {
          // Default client or active user
          resolve({
            data: {
              user: { id: "user_1", role: "CLIENT", name: "Client User", email: credentials.email, status: "ACTIVE" },
              accessToken: "mock_client_token"
            },
          });
        }
      }, 1000);
    });
  },

  registerClient: async (data) => {
    console.log("authApi.registerClient called with:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: { id: "client_new", role: "CLIENT", status: "ACTIVE", email: data.email },
            message: "Account created successfully"
          }
        });
      }, 1000);
    });
  },

  registerAgency: async (data) => {
    console.log("authApi.registerAgency called with:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: { id: "agency_new", role: "AGENCY", status: "PENDING", email: data.email },
            message: "Registration submitted. Pending approval."
          }
        });
      }, 1000);
    });
  },

  registerWorker: async (data) => {
    console.log("authApi.registerWorker called with:", data);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            user: { id: "worker_new", role: "WORKER", status: "PENDING", email: data.email },
            message: "Registration submitted. Pending approval."
          }
        });
      }, 1000);
    });
  },
  
  logout: async () => {
    console.log("authApi.logout called");
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  
  refreshSession: async () => {
    console.log("authApi.refreshSession called");
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  
  forgotPassword: async (data) => {
    console.log("authApi.forgotPassword called with:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  },
  
  resetPassword: async (data) => {
    console.log("authApi.resetPassword called with:", data);
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
};
