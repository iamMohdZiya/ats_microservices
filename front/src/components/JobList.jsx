import { useState, useEffect } from 'react';
import { jobService } from '../services/jobService.js';

const JobList = ({ onEditJob, onDeleteJob, onSelectJob }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getAllJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch jobs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await jobService.deleteJob(id);
        setJobs(jobs.filter(job => job._id !== id));
        onDeleteJob && onDeleteJob(id);
      } catch (err) {
        setError('Failed to delete job: ' + err.message);
      }
    }
  };

  if (loading) return <div className="p-4">Loading jobs...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Job Descriptions</h2>
      </div>
      
      {jobs.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No jobs found. Create your first job posting!
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-3 line-clamp-3">{job.description}</p>
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Required Skills:</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired.map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  Min Experience: {job.minExperience} years
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  job.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {job.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onSelectJob && onSelectJob(job)}
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  View Applicants
                </button>
                <button
                  onClick={() => onEditJob && onEditJob(job)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobList;