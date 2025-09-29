import { useState, useEffect } from 'react';
import { applicantService } from '../services/applicantService.js';
import { jobService } from '../services/jobService.js';

const ApplicantForm = ({ applicant = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: applicant?.name || '',
    email: applicant?.email || '',
    skills: applicant?.skills?.join(', ') || '',
    experience: applicant?.experience || 0,
    appliedFor: applicant?.appliedFor || '',
    status: applicant?.status || 'Applied'
  });
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobData = await jobService.getAllJobs();
      setJobs(jobData.filter(job => job.isActive)); // Only show active jobs
    } catch (err) {
      setError('Failed to fetch jobs: ' + err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const applicantData = {
        ...formData,
        skills: formData.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0),
        experience: Number(formData.experience)
      };

      if (applicant) {
        await applicantService.updateApplicant(applicant._id, applicantData);
      } else {
        await applicantService.createApplicant(applicantData);
      }

      onSubmit && onSubmit();
    } catch (err) {
      setError('Failed to save applicant: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {applicant ? 'Edit Applicant' : 'Add New Applicant'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. john@example.com"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-2">
            Skills *
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. JavaScript, React, Node.js, Python (comma-separated)"
          />
          <p className="text-sm text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            min="0"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="appliedFor" className="block text-sm font-medium text-gray-700 mb-2">
            Applied for Position *
          </label>
          <select
            id="appliedFor"
            name="appliedFor"
            value={formData.appliedFor}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a job position...</option>
            {jobs.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} (Min: {job.minExperience} years exp.)
              </option>
            ))}
          </select>
        </div>

        {applicant && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Application Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Applied">Applied</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (applicant ? 'Update Applicant' : 'Add Applicant')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </form>

      {jobs.length === 0 && (
        <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          <p className="font-medium">No active job positions available</p>
          <p className="text-sm mt-1">Please create and activate job descriptions before adding applicants.</p>
        </div>
      )}
    </div>
  );
};

export default ApplicantForm;