import { useState } from 'react';
import { jobService } from '../services/jobService.js';

const JobForm = ({ job = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: job?.title || '',
    description: job?.description || '',
    skillsRequired: job?.skillsRequired?.join(', ') || '',
    minExperience: job?.minExperience || 0,
    isActive: job?.isActive !== undefined ? job.isActive : true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const jobData = {
        ...formData,
        skillsRequired: formData.skillsRequired
          .split(',')
          .map(skill => skill.trim())
          .filter(skill => skill.length > 0),
        minExperience: Number(formData.minExperience)
      };

      if (job) {
        await jobService.updateJob(job._id, jobData);
      } else {
        await jobService.createJob(jobData);
      }

      onSubmit && onSubmit();
    } catch (err) {
      setError('Failed to save job: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {job ? 'Edit Job Description' : 'Create New Job Description'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. Senior Frontend Developer"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the job role, responsibilities, and requirements..."
          />
        </div>

        <div>
          <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700 mb-2">
            Required Skills *
          </label>
          <input
            type="text"
            id="skillsRequired"
            name="skillsRequired"
            value={formData.skillsRequired}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. React, JavaScript, Node.js, MongoDB (comma-separated)"
          />
          <p className="text-sm text-gray-500 mt-1">Separate multiple skills with commas</p>
        </div>

        <div>
          <label htmlFor="minExperience" className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Experience (years)
          </label>
          <input
            type="number"
            id="minExperience"
            name="minExperience"
            value={formData.minExperience}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
            Job is active and accepting applications
          </label>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (job ? 'Update Job' : 'Create Job')}
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
    </div>
  );
};

export default JobForm;