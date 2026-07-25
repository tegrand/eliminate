export const languageApi = {
  getLanguages: async (params) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            languages: [
              { id: "1", code: "Language Code 1", name: "Language Name 1", status: "Status 1" },
              { id: "2", code: "Language Code 2", name: "Language Name 2", status: "Status 2" },
            ],
            total: 2,
            page: 1,
            totalPages: 1
          }
        });
      }, 500);
    });
  },
  createLanguage: async (data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  updateLanguage: async (id, data) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
  deleteLanguage: async (id) => new Promise(res => setTimeout(() => res({ success: true }), 500)),
};
