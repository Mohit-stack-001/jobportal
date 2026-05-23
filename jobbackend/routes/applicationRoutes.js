const express = require("express");

const {
  getAllApplications,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");

const adminOnly = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getMyApplications);

router.get(
  "/",
  protect,
  adminOnly,
  getAllApplications
);

router.patch(
  "/:id/status",
  protect,
  adminOnly,
  updateApplicationStatus
);

// DELETE APPLICATION
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteApplication
);

module.exports = router;