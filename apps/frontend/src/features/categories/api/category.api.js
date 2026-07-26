export const categoryApi = {
  getCategories: async (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            categories: [
              { id: "1", code: "Category Code 1", name: "Category Name 1", description: "Description 1", status: "Status 1" },
              { id: "2", code: "Category Code 2", name: "Category Name 2", description: "Description 2", status: "Status 2" },
            ],
            total: 2,
            page: 1,
            totalPages: 1
          }
        });
      }, 500);
    });
  },
  createCategory: async (data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  updateCategory: async (id, data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  deleteCategory: async (id) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
};
