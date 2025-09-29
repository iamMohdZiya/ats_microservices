import { API_BASE_URL, apiRequest } from './api.js';

// Job Description Service
export const jobService = {
  // Get all job descriptions
  getAllJobs: async () => {
    return await apiRequest(API_BASE_URL.JOB);
  },

  // Get job description by ID
  getJobById: async (id) => {
    return await apiRequest(`${API_BASE_URL.JOB}/${id}`);
  },

  // Create new job description
  createJob: async (jobData) => {
    return await apiRequest(API_BASE_URL.JOB, {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  },

  // Update job description
  updateJob: async (id, jobData) => {
    return await apiRequest(`${API_BASE_URL.JOB}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData)
    });
  },

  // Delete job description
  deleteJob: async (id) => {
    return await apiRequest(`${API_BASE_URL.JOB}/${id}`, {
      method: 'DELETE'
    });
  }
};