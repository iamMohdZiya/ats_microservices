import { useState } from 'react';
import JobList from './components/JobList.jsx';
import JobForm from './components/JobForm.jsx';
import ApplicantList from './components/ApplicantList.jsx';
import ApplicantForm from './components/ApplicantForm.jsx';

function App() {
  const [currentView, setCurrentView] = useState('jobs');
  const [showJobForm, setShowJobForm] = useState(false);
  const [showApplicantForm, setShowApplicantForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleJobFormSubmit = () => {
    setShowJobForm(false);
    setEditingJob(null);
    handleRefresh();
  };

  const handleApplicantFormSubmit = () => {
    setShowApplicantForm(false);
    setEditingApplicant(null);
    handleRefresh();
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleEditApplicant = (applicant) => {
    setEditingApplicant(applicant);
    setShowApplicantForm(true);
  };

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setCurrentView('applicants');
  };

  const renderContent = () => {
    if (showJobForm) {
      return (
        <JobForm
          job={editingJob}
          onSubmit={handleJobFormSubmit}
          onCancel={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
        />
      );
    }

    if (showApplicantForm) {
      return (
        <ApplicantForm
          applicant={editingApplicant}
          onSubmit={handleApplicantFormSubmit}
          onCancel={() => {
            setShowApplicantForm(false);
            setEditingApplicant(null);
          }}
        />
      );
    }

    switch (currentView) {
      case 'jobs':
        return (
          <JobList
            key={refreshTrigger}
            onEditJob={handleEditJob}
            onSelectJob={handleSelectJob}
            onDeleteJob={handleRefresh}
          />
        );
      case 'applicants':
        return (
          <ApplicantList
            key={refreshTrigger}
            selectedJob={selectedJob}
            onEditApplicant={handleEditApplicant}
            onDeleteApplicant={handleRefresh}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">ATS Dashboard</h1>
              {selectedJob && currentView === 'applicants' && (
                <span className="text-sm text-gray-500">→ {selectedJob.title}</span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              {!showJobForm && !showApplicantForm && (
                <>
                  {currentView === 'jobs' && (
                    <button
                      onClick={() => setShowJobForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Create Job
                    </button>
                  )}
                  {currentView === 'applicants' && (
                    <button
                      onClick={() => setShowApplicantForm(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Add Applicant
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      {!showJobForm && !showApplicantForm && (
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8">
              <button
                onClick={() => {
                  setCurrentView('jobs');
                  setSelectedJob(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'jobs'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Job Descriptions
              </button>
              <button
                onClick={() => {
                  setCurrentView('applicants');
                  setSelectedJob(null);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  currentView === 'applicants'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applicants
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;
