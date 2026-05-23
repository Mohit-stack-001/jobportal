import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  Building2,
  TrendingUp,
} from "lucide-react";

import API from "../api/api";
import { setSession } from "../utils/auth";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("user");
  const [isSignup, setIsSignup] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const endpoint =
        mode === "admin"
          ? "/auth/admin-login"
          : isSignup
          ? "/auth/register"
          : "/auth/login";

      const payload =
        mode === "admin" || !isSignup
          ? {
              email: form.email,
              password: form.password,
            }
          : form;

      const res = await API.post(endpoint, payload);

      setSession(res.data);

      window.dispatchEvent(new Event("storage"));

      navigate(res.data.user.role === "admin" ? "/admin" : "/jobs");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT SIDE */}
        <section className="relative hidden overflow-hidden border-r border-blue-100 lg:flex lg:flex-col lg:justify-between">
          {/* BACKGROUND */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-blue-200" />

          <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-cyan-400/20 blur-3xl" />

          {/* TOP */}
          <div className="relative z-10 px-12 py-10">
            <Link to="/" className="inline-flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
                <BriefcaseBusiness size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  JobDekho
                </h1>

                <p className="text-sm font-semibold text-blue-600">
                  Smart Hiring Platform
                </p>
              </div>
            </Link>
          </div>

          {/* CENTER */}
          <div className="relative z-10 px-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm font-bold text-blue-600 backdrop-blur-xl">
              <Sparkles size={16} />
              Next Generation Hiring Experience
            </div>

            <h2 className="max-w-xl text-6xl font-black leading-[1.1] tracking-tight">
              Hire Faster.
              <br />
              Track Better.
              <br />
              Grow Smarter.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              A modern recruitment dashboard where companies manage jobs,
              applications, approvals, and hiring workflows in one beautiful
              experience.
            </p>

            {/* FEATURES */}
            <div className="mt-10 grid gap-4">
              {[
                {
                  icon: CheckCircle2,
                  title: "Verified Job Listings",
                  text: "Every job post is managed and reviewed securely.",
                },
                {
                  icon: Users,
                  title: "Application Tracking",
                  text: "Track every applicant with live status updates.",
                },
                {
                  icon: TrendingUp,
                  title: "Smart Dashboard",
                  text: "Manage hiring performance with clean analytics.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group rounded-3xl border border-blue-100 bg-white/5 p-5 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/80"
                >
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 text-blue-600">
                      <item.icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-black">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM */}
          <div className="relative z-10 grid grid-cols-3 gap-4 px-12 py-10">
            {[
              ["12K+", "Candidates"],
              ["1.2K+", "Companies"],
              ["98%", "Success Rate"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-3xl border border-blue-100 bg-white/5 p-5 text-center backdrop-blur-xl"
              >
                <h3 className="text-3xl font-black text-blue-600">
                  {value}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* RIGHT SIDE */}
        <main className="relative flex items-start justify-center overflow-hidden px-4 py-6 sm:px-6 lg:px-12">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-md mt-6 rounded-[32px] border border-blue-100 bg-white/80 p-8 shadow-2xl backdrop-blur-2xl"
          >
            {/* MOBILE LOGO */}
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500">
                  <BriefcaseBusiness size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-black">JobDekho</h2>
                  <p className="text-sm text-blue-600">
                    Smart Hiring Platform
                  </p>
                </div>
              </Link>
            </div>

            {/* TOGGLE */}
            <div className="mb-8 grid grid-cols-2 rounded-2xl border border-blue-100 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("user");
                  setIsSignup(false);
                }}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  mode === "user"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-slate-900 shadow-lg"
                    : "text-slate-600"
                }`}
              >
                User
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("admin");
                  setIsSignup(false);
                }}
                className={`rounded-xl px-4 py-3 text-sm font-black transition ${
                  mode === "admin"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-slate-900 shadow-lg"
                    : "text-slate-600"
                }`}
              >
                Admin
              </button>
            </div>

            {/* TITLE */}
            <div className="mb-8 flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-blue-500/30 to-cyan-400/30 text-blue-600">
                {mode === "admin" ? (
                  <ShieldCheck size={30} />
                ) : (
                  <UserPlus size={30} />
                )}
              </div>

              <div>
                <h2 className="text-4xl font-black tracking-tight">
                  {mode === "admin"
                    ? "Admin Login"
                    : isSignup
                    ? "Create Account"
                    : "Welcome Back"}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {mode === "admin"
                    ? "Manage jobs and applications"
                    : "Continue your hiring journey"}
                </p>
              </div>
            </div>

            {/* INPUTS */}
            <div className="grid gap-5">
              {mode === "user" && isSignup && (
                <div className="rounded-2xl border border-blue-100 bg-white/5 px-5 py-4 backdrop-blur-xl">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Full Name
                  </p>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500"
                  />
                </div>
              )}

              <div className="rounded-2xl border border-blue-100 bg-white/5 px-5 py-4 backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Mail size={15} />
                  Email Address
                </div>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500"
                />
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white/5 px-5 py-4 backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <Lock size={15} />
                  Password
                </div>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-bold text-red-300">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-lg font-black text-slate-900 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.02]">
              {mode === "admin"
                ? "Enter Dashboard"
                : isSignup
                ? "Create Account"
                : "Login Now"}

              <ArrowRight size={20} />
            </button>

            {/* SIGNUP */}
            {mode === "user" && (
              <button
                type="button"
                onClick={() => setIsSignup((value) => !value)}
                className="mt-5 w-full text-sm font-bold text-cyan-300 transition hover:text-blue-600"
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "New user? Create account"}
              </button>
            )}

            {/* FOOTER */}
            <div className="mt-8 flex items-center justify-center gap-2 rounded-2xl border border-blue-100 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-400">
              <Building2 size={14} />
              Secure Recruitment Management System
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
