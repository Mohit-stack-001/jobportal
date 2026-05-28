const express = require("express");
const {
  createJob,
  deleteJob,
  getJobs,
  getSingleJob,
  updateJob,
} = require("../controllers/jobcontroller");
const { applyForJob } = require("../controllers/applicationController");
const adminOnly = require("../middleware/adminmiddleware");
const protect = require("../middleware/authmiddleware");
const upload = require("../middleware/uploadmiddleware");

const router = express.Router();

router.get("/", getJobs);
router.get("/:id", getSingleJob);

router.post("/", protect, adminOnly, createJob);
router.post("/create", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);
router.post("/:id/apply", protect, upload.single("resume"), applyForJob);

module.exports = router;
