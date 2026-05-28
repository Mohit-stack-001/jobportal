const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();


// ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const jobRoutes = require("./routes/jobRoutes");
const companyRoutes = require("./routes/companyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const applicationRoutes = require("./routes/applicationRoutes");


// MIDDLEWARE
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// HOME ROUTE
app.get("/", (req, res) => {
  res.send("Backend Running");
});


// ROUTES
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/jobs", jobRoutes);

app.use("/api/companies", companyRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/applications", applicationRoutes);

app.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Resume must be smaller than 5MB"
          : error.message,
    });
  }

  next();
});


// PORT
const PORT = process.env.PORT || 5000;


// SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
