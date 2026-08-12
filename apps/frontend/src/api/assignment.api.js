import api from "./axios";

export const assignmentApi = {
  getAssignment: (id) => api.get(`/assignments/${id}`),
  getAgencyWorkers: (id) => api.get(`/assignments/${id}/agency-workers`),
  assignWorker: (id, workerId) => api.post(`/assignments/${id}/workers`, { workerId }),
  removeWorker: (id, workerId) => api.delete(`/assignments/${id}/workers/${workerId}`)
};
