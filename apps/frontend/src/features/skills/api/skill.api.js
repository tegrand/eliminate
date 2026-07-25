export const skillApi = {
  getSkills: async (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            skills: [
              { id: "1", code: "Skill Code 1", name: "Skill Name 1", category: "Category 1", description: "Description 1", status: "Status 1" },
              { id: "2", code: "Skill Code 2", name: "Skill Name 2", category: "Category 2", description: "Description 2", status: "Status 2" },
            ],
            total: 2,
            page: 1,
            totalPages: 1
          }
        });
      }, 500);
    });
  },
  createSkill: async (data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  updateSkill: async (id, data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  deleteSkill: async (id) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
};
