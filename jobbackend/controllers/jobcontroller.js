const mongoose = require("mongoose");

const Application = require("../models/Application");
const Job = require("../models/Job");

const {
  fallbackApplications,
  fallbackJobs,
} = require("../utils/dataStore");

const isDbConnected = () =>
  mongoose.connection.readyState === 1;

const isObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

// Parse requirements
const parseRequirements = (requirements) =>
  Array.isArray(requirements)
    ? requirements
    : String(requirements || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

// Find local fallback job
const findFallbackJob = (id) =>
  fallbackJobs.find((job) => job._id === id);

/* =========================================================
   CREATE JOB
========================================================= */

const createJob = async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      company: req.body.company,
      salary: req.body.salary,
      location: req.body.location,
      type: req.body.type || "Full Time",
      description: req.body.description,
      requirements: parseRequirements(
        req.body.requirements
      ),
    };

    // Local fallback mode
    if (!isDbConnected()) {
      const job = {
        _id: `local-${Date.now()}`,
        ...payload,
        createdAt: new Date().toISOString(),
      };

      fallbackJobs.unshift(job);

      return res.status(201).json({
        success: true,
        message: "Job created locally",
        job,
      });
    }

    // MongoDB mode
    const job = await Job.create(payload);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET ALL JOBS
========================================================= */

const getJobs = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.status(200).json({
        success: true,
        count: fallbackJobs.length,
        jobs: fallbackJobs,
      });
    }

    const jobs = await Job.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   GET SINGLE JOB
========================================================= */

const getSingleJob = async (req, res) => {
  try {
    // Local fallback mode
    if (
      !isDbConnected() ||
      !isObjectId(req.params.id)
    ) {
      const job = findFallbackJob(
        req.params.id
      );

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      return res.status(200).json({
        success: true,
        job,
      });
    }

    // MongoDB mode
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   UPDATE JOB
========================================================= */

const updateJob = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      requirements: parseRequirements(
        req.body.requirements
      ),
    };

    // Local fallback mode
    if (
      !isDbConnected() ||
      !isObjectId(req.params.id)
    ) {
      const index = fallbackJobs.findIndex(
        (job) => job._id === req.params.id
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      fallbackJobs[index] = {
        ...fallbackJobs[index],
        ...payload,
      };

      return res.status(200).json({
        success: true,
        message: "Job updated locally",
        updatedJob: fallbackJobs[index],
      });
    }

    // MongoDB mode
    const updatedJob =
      await Job.findByIdAndUpdate(
        req.params.id,
        payload,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      updatedJob,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   DELETE JOB
========================================================= */

const deleteJob = async (req, res) => {
  try {
    // Local fallback mode
    if (
      !isDbConnected() ||
      !isObjectId(req.params.id)
    ) {
      const index = fallbackJobs.findIndex(
        (job) => job._id === req.params.id
      );

      if (index === -1) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // Delete local job
      fallbackJobs.splice(index, 1);

      // Delete related applications
      for (
        let i = fallbackApplications.length - 1;
        i >= 0;
        i -= 1
      ) {
        if (
          fallbackApplications[i].job?._id ===
          req.params.id
        ) {
          fallbackApplications.splice(i, 1);
        }
      }

      return res.status(200).json({
        success: true,
        message: "Job deleted locally",
      });
    }

    // MongoDB mode
    const job = await Job.findById(
      req.params.id
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Delete applications
    await Application.deleteMany({
      job: req.params.id,
    });

    // Delete job
    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   APPLY JOB WITH RESUME UPLOAD
========================================================= */

const applyJob = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      coverLetter,
    } = req.body;

    // Check job exists
    let job = null;

    if (
      isDbConnected() &&
      isObjectId(req.params.id)
    ) {
      job = await Job.findById(req.params.id);
    } else {
      job = findFallbackJob(req.params.id);
    }

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Resume upload
    const resume = req.file
      ? req.file.path
      : "";

    // Local fallback mode
    if (!isDbConnected()) {
      const application = {
        _id: `local-app-${Date.now()}`,
        name,
        email,
        phone,
        coverLetter,
        resume,
        status: "Pending",
        job,
        createdAt: new Date().toISOString(),
      };

      fallbackApplications.unshift(
        application
      );

      return res.status(201).json({
        success: true,
        message:
          "Application submitted locally",
        application,
      });
    }

    // MongoDB mode
    const application =
      await Application.create({
        name,
        email,
        phone,
        coverLetter,
        resume,
        status: "Pending",
        job: req.params.id,
      });

    res.status(201).json({
      success: true,
      message:
        "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================================
   EXPORTS
========================================================= */

module.exports = {
  createJob,
  getJobs,
  getSingleJob,
  updateJob,
  deleteJob,
  applyJob,
};