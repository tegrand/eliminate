export const locationApi = {
  getLocations: async (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            locations: [
              { id: "1", code: "Location Code 1", name: "Location Name 1", district: "District 1", state: "State 1", status: "Status 1" },
              { id: "2", code: "Location Code 2", name: "Location Name 2", district: "District 2", state: "State 2", status: "Status 2" },
            ],
            total: 2,
            page: 1,
            totalPages: 1
          }
        });
      }, 500);
    });
  },
  createLocation: async (data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  updateLocation: async (id, data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  deleteLocation: async (id) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
};
