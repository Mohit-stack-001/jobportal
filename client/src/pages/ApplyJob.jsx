import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  IndianRupee,
  MapPin,
  Upload,
} from "lucide-react";

import API from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getSession } from "../utils/auth";

export default function ApplyJob() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const session = getSession();

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    coverLetter: "",
  });

  // Resume file state
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    API.get(`/jobs/${id}`).then((res) => setJob(res.data.job));
  }, [id]);

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Resume Upload
  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (!allowedTypes.includes(file.type) || !allowedExtensions.includes(fileExtension)) {
      setResumeFile(null);
      setError("Please upload only PDF, DOC, or DOCX resume files.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeFile(null);
      setError("Resume must be smaller than 5MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setResumeFile(file);
  };

  const apply = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!session?.token || session.user.role !== "user") {
      navigate("/login");
      return;
    }

    try {
      // FormData for file upload
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("coverLetter", form.coverLetter);

      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const res = await API.post(`/jobs/${id}/apply`, formData);

      setMessage(
        res.data.message || "Application submitted successfully."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to apply");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <Navbar />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        {!job ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            Loading job...
          </div>
        ) : (
          <>
            {/* LEFT SIDE */}
            <article className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                <Building2 size={28} />
              </span>

              <h1 className="mt-5 text-4xl font-black text-slate-950 dark:text-white">
                {job.title}
              </h1>

              <p className="mt-2 text-lg text-slate-500 dark:text-slate-300">
                {job.company}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <MapPin size={16} /> {job.location}
                </span>

                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  <IndianRupee size={16} /> {job.salary}
                </span>
              </div>

              <p className="mt-6 leading-8 text-slate-600 dark:text-slate-300">
                {job.description}
              </p>

              {job.requirements?.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {job.requirements.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <Link
                to="/jobs"
                className="mt-8 inline-block rounded-xl border border-slate-200 px-6 py-4 font-black text-slate-800 dark:border-slate-700 dark:text-slate-200"
              >
                Back to Jobs
              </Link>
            </article>

            {/* RIGHT SIDE FORM */}
            <form
              onSubmit={apply}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                Application Details
              </p>

              <h2 className="text-3xl font-black text-slate-950 dark:text-white">
                Apply for this job
              </h2>

              {!session && (
                <p className="mt-3 rounded-xl bg-yellow-50 p-3 text-sm font-bold text-yellow-700">
                  Please login/signup as user before applying.
                </p>
              )}

              <div className="mt-6 grid gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  required
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />

                {/* FILE UPLOAD */}
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 px-4 py-6 text-blue-700 transition hover:bg-blue-100 dark:border-blue-500/30 dark:bg-slate-950 dark:text-blue-300">
                  <Upload size={22} />

                  <div className="text-center">
                    <p className="font-bold">
                      {resumeFile
                        ? resumeFile.name
                        : "Upload Resume"}
                    </p>

                    <p className="text-sm opacity-70">
                      PDF, DOC, DOCX
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    hidden
                    required
                  />
                </label>

                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  placeholder="Cover letter / message"
                  rows="5"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none focus:border-blue-500 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                />
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
                  {error}
                </p>
              )}

              {message && (
                <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 font-bold text-green-700">
                  <CheckCircle2 size={20} /> {message}
                </p>
              )}

              <button className="mt-5 w-full rounded-xl bg-blue-700 px-6 py-4 font-black text-white transition hover:bg-blue-800">
                Submit Application
              </button>
            </form>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
