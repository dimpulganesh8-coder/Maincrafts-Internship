import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Retrieve all saved tasks from MongoDB
 * Endpoint: GET /tasks
 */
export const fetchTasks = async () => {
  const response = await apiClient.get('/tasks');
  return response.data;
};

/**
 * Create a new task in MongoDB
 * Endpoint: POST /add
 * @param {Object} taskData - { text: string, priority?: string, category?: string }
 */
export const addTask = async (taskData) => {
  const payload = typeof taskData === 'string' ? { text: taskData } : taskData;
  const response = await apiClient.post('/add', payload);
  return response.data;
};

/**
 * Toggle task completion status
 * Endpoint: PATCH /tasks/:id/toggle
 */
export const toggleTaskStatus = async (taskId) => {
  const response = await apiClient.patch(`/tasks/${taskId}/toggle`);
  return response.data;
};

/**
 * Update task text or metadata
 * Endpoint: PUT /tasks/:id
 */
export const updateTask = async (taskId, updates) => {
  const response = await apiClient.put(`/tasks/${taskId}`, updates);
  return response.data;
};

/**
 * Delete a task by ID
 * Endpoint: DELETE /tasks/:id
 */
export const deleteTask = async (taskId) => {
  const response = await apiClient.delete(`/tasks/${taskId}`);
  return response.data;
};

/**
 * Delete all completed tasks
 * Endpoint: DELETE /tasks/completed
 */
export const clearCompletedTasks = async () => {
  const response = await apiClient.delete('/tasks/completed');
  return response.data;
};

/**
 * Check backend & MongoDB connection health
 * Endpoint: GET /health
 */
export const checkServerHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;

