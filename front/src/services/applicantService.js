import { API_BASE_URL, apiRequest } from './api.js';

// Applicant Service
export const applicantService = {
  // Get all applicants
  getAllApplicants: async () => {
    return await apiRequest(API_BASE_URL.APPLICANT);
  },

  // Get applicant by ID
  getApplicantById: async (id) => {
    return await apiRequest(`${API_BASE_URL.APPLICANT}/${id}`);
  },

  // Create new applicant
  createApplicant: async (applicantData) => {
    return await apiRequest(API_BASE_URL.APPLICANT, {
      method: 'POST',
      body: JSON.stringify(applicantData)
    });
  },

  // Update applicant
  updateApplicant: async (id, applicantData) => {
    return await apiRequest(`${API_BASE_URL.APPLICANT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(applicantData)
    });
  },

  // Delete applicant
  deleteApplicant: async (id) => {
    return await apiRequest(`${API_BASE_URL.APPLICANT}/${id}`, {
      method: 'DELETE'
    });
  },

  // Get applicants by status
  getApplicantsByStatus: async (status) => {
    return await apiRequest(`${API_BASE_URL.APPLICANT}/status/${status}`);
  },

  // Shortlist applicants for a specific job
  shortlistApplicants: async (jobId) => {
    return await apiRequest(`${API_BASE_URL.APPLICANT}/shortlist/${jobId}`, {
      method: 'POST'
    });
  }
};