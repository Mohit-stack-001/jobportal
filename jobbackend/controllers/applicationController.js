const mongoose = require("mongoose");
const Application = require("../models/Application");
const Job = require("../models/Job");
const { fallbackApplications, fallbackJobs } = require("../utils/dataStore");

const isDbConnected = () => mongoose.connection.readyState === 1;
const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const findFallbackJob = (id) => fallbackJobs.find((job) => job._id === id);

const applyForJob = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const { name, email, phone, resume, coverLetter } = req.body;

    if (!name || !email || !phone || !resume) {
      return res.status(400).json({
        success: false,
        message: "Name, email, phone and resume are required",
      });
    }

    if (!isDbConnected() || !isObjectId(req.params.id) || !isObjectId(userId)) {
      const job = findFallbackJob(req.params.id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      const existing = fallbackApplications.find(
        (item) => String(item.user?._id) === String(userId) && item.job?._id === req.params.id
      );

      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Already applied for this job",
        });
      }

      const application = {
        _id: `app-${Date.now()}`,
        user: {
          _id: userId,
          name: req.user.name || name,
          email: req.user.email || email,
        },
        job,
        name,
        email,
        phone,
        resume,
        coverLetter,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      fallbackApplications.unshift(application);

      return res.status(201).json({
        success: true,
        message: "Application submitted. Status is pending.",
        application,
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const existing = await Application.findOne({
      user: userId,
      job: req.params.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    const application = await Application.create({
      user: userId,
      job: req.params.id,
      name,
      email,
      phone,
      resume,
      coverLetter,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted. Status is pending.",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    const localApplications = fallbackApplications.filter(
      (item) => String(item.user?._id) === String(userId)
    );

    if (!isDbConnected() || !isObjectId(userId)) {
      return res.json({
        success: true,
        applications: localApplications,
      });
    }

    const applications = await Application.find({ user: userId })
      .populate("job")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications: [...localApplications, ...applications],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        success: true,
        applications: fallbackApplications,
      });
    }

    const applications = await Application.find()
      .populate("job")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      applications: [...fallbackApplications, ...applications],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    if (!isDbConnected() || !isObjectId(req.params.id)) {
      const application = fallbackApplications.find((item) => item._id === req.params.id);

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "Application not found",
        });
      }

      application.status = status;

      return res.json({
        success: true,
        message: `Application ${status}`,
        application,
      });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("job")
      .populate("user", "name email");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      message: `Application ${status}`,
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE APPLICATION
const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  applyForJob,
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
};
