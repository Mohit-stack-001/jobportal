const now = () => new Date().toISOString();

const fallbackUsers = [];

const fallbackJobs = [
  {
    _id: "seed-1",
    title: "Frontend Developer",
    company: "Google",
    location: "Remote",
    salary: "12 LPA",
    type: "Full Time",
    description: "Build polished React interfaces for a fast-moving product team.",
    requirements: ["React", "JavaScript", "Tailwind CSS"],
    createdAt: now(),
  },
  {
    _id: "seed-2",
    title: "Backend Engineer",
    company: "Microsoft",
    location: "Bangalore",
    salary: "18 LPA",
    type: "Full Time",
    description: "Create reliable APIs, data models, and backend services.",
    requirements: ["Node.js", "Express", "MongoDB"],
    createdAt: now(),
  },
  {
    _id: "seed-3",
    title: "MERN Stack Developer",
    company: "Amazon",
    location: "Hyderabad",
    salary: "20 LPA",
    type: "Hybrid",
    description: "Work across frontend and backend features for hiring workflows.",
    requirements: ["MongoDB", "Express", "React", "Node.js"],
    createdAt: now(),
  },
];

const fallbackApplications = [];

module.exports = {
  fallbackApplications,
  fallbackJobs,
  fallbackUsers,
};
