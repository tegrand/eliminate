import api from "../../../api/axios";

export const companyApi = {
  // Projects
  getProjects: () => api.get("/clients/company/projects"),
  createProject: (data) => api.post("/clients/company/projects", data),
  updateProject: (id, data) => api.patch(`/clients/company/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/clients/company/projects/${id}`),

  // Sites
  getSites: (projectId) => api.get("/clients/company/sites", { params: { projectId } }),
  createSite: (data) => api.post("/clients/company/sites", data),
  updateSite: (id, data) => api.patch(`/clients/company/sites/${id}`, data),
  deleteSite: (id) => api.delete(`/clients/company/sites/${id}`),

  // Departments
  getDepartments: () => api.get("/clients/company/departments"),
  createDepartment: (data) => api.post("/clients/company/departments", data),
  updateDepartment: (id, data) => api.patch(`/clients/company/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/clients/company/departments/${id}`),

  // Teams
  getTeams: () => api.get("/clients/company/teams"),
  createTeam: (data) => api.post("/clients/company/teams", data),
  updateTeam: (id, data) => api.patch(`/clients/company/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/clients/company/teams/${id}`),
  addTeamMember: (teamId, workerId) => api.post(`/clients/company/teams/${teamId}/members`, { workerId }),
  removeTeamMember: (teamId, workerId) => api.delete(`/clients/company/teams/${teamId}/members/${workerId}`),
};
