import api from './axios';

export const documentsApi = {
  uploadDocument: (data) => api.post('/my-documents', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
