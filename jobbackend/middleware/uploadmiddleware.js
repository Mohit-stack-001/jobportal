const fs = require("fs");
const path = require("path");
const multer = require("multer");

const resumeDir = path.join(__dirname, "..", "uploads", "resumes");

const ensureResumeDir = () => {
  if (fs.existsSync(resumeDir) && !fs.statSync(resumeDir).isDirectory()) {
    fs.unlinkSync(resumeDir);
  }

  if (!fs.existsSync(resumeDir)) {
    fs.mkdirSync(resumeDir, { recursive: true });
  }
};

ensureResumeDir();

if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureResumeDir();
    cb(null, resumeDir);
  },

  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowedMimeTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExt = [".pdf", ".doc", ".docx"].includes(ext);

  if (allowedMimeTypes.includes(file.mimetype) && allowedExt) {
    cb(null, true);
    return;
  }

  cb(new Error("Only PDF, DOC, or DOCX resumes are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
