import api from './api';

// Simple cache with timestamp
const cache = {
  tasks: null,
  timestamp: null
};

// Cache expiry in ms (5 minutes)
const CACHE_EXPIRY = 5 * 60 * 1000;

export const getTasks = async (forceRefresh = false) => {
  // Check if we have a valid cached response
  if (
    !forceRefresh &&
    cache.tasks && 
    cache.timestamp && 
    (Date.now() - cache.timestamp < CACHE_EXPIRY)
  ) {
    return cache.tasks;
  }
  
  try {
    // If not in cache or expired, make the API call
    const response = await api.get('/tasks');
    
    // Update the cache
    cache.tasks = response.data;
    cache.timestamp = Date.now();
    
    return response.data;
  } catch (error) {
    // If request fails but we have cached data (even if expired), use it as fallback
    if (cache.tasks) {
      console.warn('Request failed, using expired cache data');
      return cache.tasks;
    }
    throw error; // Re-throw if no fallback available
  }
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  
  // Invalidate the cache when data changes
  cache.tasks = null;
  cache.timestamp = null;
  
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  
  // Invalidate the cache when data changes
  cache.tasks = null;
  cache.timestamp = null;
  
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  
  // Invalidate the cache when data changes
  cache.tasks = null;
  cache.timestamp = null;
  
  return response.data;
};

// Clear cache manually (e.g., on logout)
export const clearTaskCache = () => {
  cache.tasks = null;
  cache.timestamp = null;
};