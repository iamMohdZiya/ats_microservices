// API base URLs for microservices
const API_BASE_URL = {
  APPLICANT: 'http://localhost:4001/api/applicants',
  JOB: 'http://localhost:4002/api/jds'
};

// Generic API request function
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export { API_BASE_URL, apiRequest };