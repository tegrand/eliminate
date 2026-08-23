import api from './axios';

export const documentsApi = {
  getMyDocuments: () => api.get('/my-documents'),
  uploadDocument: (data) => api.post('/my-documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteDocument: (id) => api.delete(`/my-documents/${id}`),
};
