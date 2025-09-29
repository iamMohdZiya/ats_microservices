const axios = require('axios');
const Applicant = require('../models/Applicant');

// Create applicant
exports.createApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.create(req.body);
    res.status(201).json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applicants
exports.getAllApplicants = async (req, res) => {
  try {
    const applicants = await Applicant.find().populate('appliedFor');
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get applicant by ID
exports.getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate('appliedFor');
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update applicant
exports.updateApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.json(applicant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete applicant
exports.deleteApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findByIdAndDelete(req.params.id);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }
    res.json({ message: 'Applicant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Shortlist applicants (calls Job Service via Axios)
exports.shortlistApplicants = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Fetch job description from Job Service
    const { data: jd } = await axios.get(`http://job_service:4002/api/job/${jobId}`);

    if (!jd) {
      return res.status(404).json({ message: 'Job Description not found' });
    }

    const applicants = await Applicant.find({ appliedFor: jobId });

    for (let applicant of applicants) {
      const hasSkills = jd.skillsRequired.every(skill =>
        applicant.skills.map(s => s.toLowerCase().trim()).includes(skill.toLowerCase().trim())
      );
      const hasExperience = applicant.experience >= jd.minExperience;

      applicant.status = hasSkills && hasExperience ? 'Shortlisted' : 'Rejected';
      await applicant.save();
    }

    res.json({ message: 'Applicants processed successfully' });
  } catch (error) {
    console.error('Error shortlisting applicants:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get applicants by status
exports.getApplicantsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { jobId } = req.query;

    const filter = { status };
    if (jobId) filter.appliedFor = jobId;

    const applicants = await Applicant.find(filter).populate('appliedFor');
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
