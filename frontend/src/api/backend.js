import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Videos API
export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await api.post('/api/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAllVideos = async () => {
  const response = await api.get('/api/videos');
  return response.data;
};

export const getVideoById = async (id) => {
  const response = await api.get(`/api/videos/${id}`);
  return response.data;
};

export const deleteVideo = async (id) => {
  const response = await api.delete(`/api/videos/${id}`);
  return response.data;
};

// Tasks API
export const createTask = async (taskData) => {
  const response = await api.post('/api/tasks', taskData);
  return response.data;
};

export const getAllTasks = async (videoId = null) => {
  const params = videoId ? { videoId } : {};
  const response = await api.get('/api/tasks', { params });
  return response.data;
};

export const getTaskById = async (id) => {
  const response = await api.get(`/api/tasks/${id}`);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/api/tasks/${id}`);
  return response.data;
};

// Download output file
export const getDownloadUrl = (filename) => {
  return `${API_BASE_URL}/api/videos/download/${filename}`;
};

export default api;
