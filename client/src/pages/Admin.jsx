import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  Check,
  LogOut,
  Plus,
  Trash2,
  X,
  Pencil,
  Eye,
} from "lucide-react";

import API from "../api/api";
import { clearSession, getSession } from "../utils/auth";

const emptyForm = {
  title: "",
  company: "",
  location: "",
  salary: "",
  type: "Full Time",
  description: "",
  requirements: "",
};

const getResumeUrl = (resume) => {
  if (!resume) {
    return "";
  }

  if (resume.startsWith("http")) {
    return resume;
  }

  return `http://localhost:5000${resume.startsWith("/") ? resume : `/${resume}`}`;
};

export default function Admin() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const stats = useMemo(
    () => ({
      jobs: jobs.length,
      applications: applications.length,
      pending: applications.filter(
        (app) => app.status === "pending"
      ).length,
      accepted: applications.filter(
        (app) => app.status === "accepted"
      ).length,
    }),
    [applications, jobs]
  );

  const loadData = async () => {
    try {
      const [jobsRes, appsRes] = await Promise.all([
        API.get("/jobs"),
        API.get("/applications"),
      ]);

      setJobs(jobsRes.data.jobs || []);
      setApplications(appsRes.data.applications || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const session = getSession();

    if (session?.user?.role !== "admin") {
      navigate("/login");
      return;
    }

    loadData();
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const createJob = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...form,
        requirements:
          typeof form.requirements === "string"
            ? form.requirements
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean)
            : [],
      };

      if (editId) {
        await API.put(`/jobs/${editId}`, payload);

        setMessage("Job updated successfully.");
        setEditId(null);
      } else {
        await API.post("/jobs", payload);

        setMessage("Job posted successfully.");
      }

      setForm(emptyForm);

      loadData();
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    }
  };

  const deleteJob = async (id) => {
    try {
      await API.delete(`/jobs/${id}`);

      setMessage("Job deleted successfully.");

      loadData();
    } catch (error) {
      console.log(error);
    }
  };

  const editJob = (job) => {
    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || "Full Time",
      description: job.description || "",
      requirements: Array.isArray(job.requirements)
        ? job.requirements.join(", ")
        : job.requirements || "",
    });

    setEditId(job._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const logoutHandler = () => {
    clearSession();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-bold text-blue-300">
              Admin Dashboard
            </p>

            <h1 className="text-3xl font-black">
              Jobs and Applications
            </h1>
          </div>

          <button
            type="button"
            onClick={logoutHandler}
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-3 font-bold text-white transition hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* STATS */}
        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Total Jobs", stats.jobs, BriefcaseBusiness],
            ["Applications", stats.applications, Bell],
            ["Pending", stats.pending, Building2],
            ["Accepted", stats.accepted, Check],
          ].map(([label, value, Icon]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <Icon className="mb-4 text-blue-300" size={26} />

              <p className="text-sm text-slate-400">
                {label}
              </p>

              <h2 className="text-3xl font-black">
                {value}
              </h2>
            </div>
          ))}
        </section>

        {/* MESSAGE */}
        {message && (
          <p className="mt-6 rounded-xl bg-green-500/10 p-3 text-sm font-bold text-green-300">
            {message}
          </p>
        )}

        {/* FORM + APPLICATIONS */}
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* FORM */}
          <form
            onSubmit={createJob}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600">
                {editId ? (
                  <Pencil size={22} />
                ) : (
                  <Plus size={22} />
                )}
              </span>

              <div>
                <h2 className="text-2xl font-black">
                  {editId ? "Edit Job" : "Post Job"}
                </h2>

                <p className="text-sm text-slate-400">
                  Only admin can manage jobs.
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {[
                ["title", "Job title"],
                ["company", "Company"],
                ["location", "Location"],
                ["salary", "Salary"],
                [
                  "requirements",
                  "Requirements comma separated",
                ],
              ].map(([name, label]) => (
                <input
                  key={name}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={label}
                  required={name !== "requirements"}
                  className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-400"
                />
              ))}

              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none focus:border-blue-400"
              >
                <option value="Full Time">
                  Full Time
                </option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">
                  Internship
                </option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                required
                rows="4"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 outline-none transition focus:border-blue-400"
              />

              <div className="flex gap-3">
                <button className="flex-1 rounded-xl bg-blue-600 px-5 py-4 font-black text-white transition hover:bg-blue-700">
                  {editId
                    ? "Update Job"
                    : "Save Job"}
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-xl bg-slate-700 px-5 py-4 font-black text-white transition hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* APPLICATIONS */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-5">
              <h2 className="text-2xl font-black">
                Applications
              </h2>

              <p className="text-sm text-slate-400">
                Accept or reject applications.
              </p>
            </div>

            <div className="max-h-[660px] space-y-3 overflow-auto pr-1">
              {applications.length === 0 ? (
                <p className="rounded-xl border border-white/10 bg-black/20 p-4 text-slate-400">
                  No applications yet.
                </p>
              ) : (
                applications.map((app) => (
                  <article
                    key={app._id}
                    className="rounded-xl border border-white/10 bg-black/25 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 sm:flex-row">
                      <div>
                        <h3 className="text-lg font-black">
                          {app.name}
                        </h3>

                        <p className="text-sm text-slate-400">
                          {app.email} · {app.phone}
                        </p>

                        <p className="mt-2 text-sm text-blue-200">
                          {app.job?.title || "Job"} at{" "}
                          {app.job?.company ||
                            "Company"}
                        </p>
                      </div>

                      <span
                        className={`h-fit rounded-full px-3 py-1 text-xs font-black capitalize ${
                          app.status === "accepted"
                            ? "bg-green-500/15 text-green-300"
                            : app.status === "rejected"
                              ? "bg-red-500/15 text-red-300"
                              : "bg-yellow-500/15 text-yellow-200"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    {app.resume && (
                      <p className="mt-3 text-sm text-slate-300">
                        Resume:{" "}
                        <a
                          href={getResumeUrl(app.resume)}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-blue-300 underline-offset-4 hover:underline"
                        >
                          View resume
                        </a>
                      </p>
                    )}

                    {app.coverLetter && (
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {app.coverLetter}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await API.patch(
                              `/applications/${app._id}/status`,
                              {
                                status:
                                  "accepted",
                              }
                            );

                            loadData();

                            setMessage(
                              "Application accepted."
                            );
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-500/10 px-4 py-2 text-sm font-bold text-green-300 transition hover:bg-green-500 hover:text-white"
                      >
                        <Check size={17} />
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await API.patch(
                              `/applications/${app._id}/status`,
                              {
                                status:
                                  "rejected",
                              }
                            );

                            loadData();

                            setMessage(
                              "Application rejected."
                            );
                          } catch (error) {
                            console.log(error);
                          }
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
                      >
                        <X size={17} />
                        Reject
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>

        {/* JOBS */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5">
            <h2 className="text-2xl font-black">
              All Jobs
            </h2>

            <p className="text-sm text-slate-400">
              View, edit or delete jobs.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-white/10 bg-black/25 p-4"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-black">
                      {job.title}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {job.company} ·{" "}
                      {job.location} ·{" "}
                      {job.salary}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedJob(job)
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-500/10 px-4 py-3 font-bold text-blue-300 transition hover:bg-blue-500 hover:text-white"
                    >
                      <Eye size={18} />
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        editJob(job)
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-yellow-500/10 px-4 py-3 font-bold text-yellow-300 transition hover:bg-yellow-500 hover:text-white"
                    >
                      <Pencil size={18} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteJob(job._id)
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-3 font-bold text-red-300 transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-black">
                  {selectedJob.title}
                </h2>

                <p className="mt-2 text-slate-400">
                  {selectedJob.company} ·{" "}
                  {selectedJob.location}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedJob(null)
                }
                className="rounded-xl bg-red-500/10 p-3 text-red-300 transition hover:bg-red-500 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">
                  Salary
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {selectedJob.salary}
                </h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">
                  Job Type
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {selectedJob.type}
                </h3>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-2 text-sm text-slate-400">
                  Description
                </p>

                <p className="leading-7 text-slate-200">
                  {selectedJob.description}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="mb-2 text-sm text-slate-400">
                  Requirements
                </p>

                <div className="flex flex-wrap gap-2">
                  {Array.isArray(
                    selectedJob.requirements
                  ) ? (
                    selectedJob.requirements.map(
                      (req, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-300"
                        >
                          {req}
                        </span>
                      )
                    )
                  ) : (
                    <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
                      {
                        selectedJob.requirements
                      }
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
