import { useState, useEffect } from 'react';
import { applicantService } from '../services/applicantService.js';
import { jobService } from '../services/jobService.js';

const ApplicantList = ({ selectedJob = null, onEditApplicant, onDeleteApplicant }) => {
  const [applicants, setApplicants] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [applicantData, jobData] = await Promise.all([
        applicantService.getAllApplicants(),
        jobService.getAllJobs()
      ]);
      setApplicants(applicantData);
      setJobs(jobData);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      const applicant = applicants.find(a => a._id === applicantId);
      await applicantService.updateApplicant(applicantId, {
        ...applicant,
        status: newStatus
      });
      
      setApplicants(applicants.map(a => 
        a._id === applicantId ? { ...a, status: newStatus } : a
      ));
    } catch (err) {
      setError('Failed to update status: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this applicant?')) {
      try {
        await applicantService.deleteApplicant(id);
        setApplicants(applicants.filter(applicant => applicant._id !== id));
        onDeleteApplicant && onDeleteApplicant(id);
      } catch (err) {
        setError('Failed to delete applicant: ' + err.message);
      }
    }
  };

  const getJobTitle = (jobId) => {
    const job = jobs.find(j => j._id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const filteredApplicants = applicants.filter(applicant => {
    if (selectedJob && applicant.appliedFor !== selectedJob._id) return false;
    if (selectedStatus !== 'All' && applicant.status !== selectedStatus) return false;
    return true;
  });

  const statusOptions = ['All', 'Applied', 'Shortlisted', 'Rejected'];

  if (loading) return <div className="p-4">Loading applicants...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {selectedJob ? `Applicants for ${selectedJob.title}` : 'All Applicants'}
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredApplicants.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {selectedStatus === 'All' ? 'No applicants found.' : `No applicants with status "${selectedStatus}".`}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredApplicants.map((applicant) => (
              <li key={applicant._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">{applicant.name}</h3>
                      <div className="flex items-center gap-2">
                        <select
                          value={applicant.status}
                          onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                          className={`px-2 py-1 rounded text-sm border-0 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                            applicant.status === 'Applied' ? 'bg-yellow-100 text-yellow-800 focus:ring-yellow-500' :
                            applicant.status === 'Shortlisted' ? 'bg-green-100 text-green-800 focus:ring-green-500' :
                            'bg-red-100 text-red-800 focus:ring-red-500'
                          }`}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <span>{applicant.email}</span>
                      <span className="mx-2">•</span>
                      <span>{applicant.experience} years experience</span>
                      {!selectedJob && (
                        <>
                          <span className="mx-2">•</span>
                          <span className="text-blue-600 font-medium">
                            {getJobTitle(applicant.appliedFor)}
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2">
                        {applicant.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-400">
                      Applied: {new Date(applicant.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex items-center gap-2">
                    <button
                      onClick={() => onEditApplicant && onEditApplicant(applicant)}
                      className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(applicant._id)}
                      className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {filteredApplicants.filter(a => a.status === 'Applied').length}
            </div>
            <div className="text-sm text-gray-500">Applied</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {filteredApplicants.filter(a => a.status === 'Shortlisted').length}
            </div>
            <div className="text-sm text-gray-500">Shortlisted</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {filteredApplicants.filter(a => a.status === 'Rejected').length}
            </div>
            <div className="text-sm text-gray-500">Rejected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantList;