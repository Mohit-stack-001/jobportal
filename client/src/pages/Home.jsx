import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Award, Building2, CheckCircle2, MapPin, Search, ShieldCheck, Sparkles } from "lucide-react";
import API from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const popularSearches = ["Remote", "MERN Stack", "Frontend", "Backend", "Internship"];

export default function Home() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(res.data.jobs || []))
      .catch(() => setJobs([]));
  }, []);

  const featuredJobs = jobs.slice(0, 3);

  const searchJobs = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("loc", location.trim());

    navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main>
        <section className="border-b border-blue-100 bg-gradient-to-b from-white to-blue-50/70 dark:border-slate-800 dark:from-slate-950 dark:to-slate-900">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-blue-700 shadow-sm dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
                <Sparkles size={17} />
                Jobs from trusted companies
              </div>
              <h1 className="text-4xl font-black leading-tight text-slate-950 sm:text-6xl dark:text-white">
                Find the right job faster.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Search roles, apply with your profile, and get clear updates as recruiters review your application.
              </p>
            </div>

            <form onSubmit={searchJobs} className="mx-auto mt-8 max-w-5xl rounded-2xl border border-blue-100 bg-white p-3 shadow-xl shadow-blue-100/60 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
              <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 text-slate-950 dark:bg-slate-950 dark:text-white">
                  <Search className="text-blue-700 dark:text-blue-300" size={22} />
                  <input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Search by role, company, or skill"
                    className="w-full bg-transparent outline-none"
                  />
                </label>
                <label className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-4 text-slate-950 dark:bg-slate-950 dark:text-white">
                  <MapPin className="text-blue-700 dark:text-blue-300" size={22} />
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City, remote, or hybrid"
                    className="w-full bg-transparent outline-none"
                  />
                </label>
                <button className="rounded-xl bg-blue-700 px-8 py-4 font-black text-white transition hover:bg-blue-800">
                  Search
                </button>
              </div>
            </form>

            <div className="mx-auto mt-5 flex max-w-5xl flex-wrap justify-center gap-2">
              {popularSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setKeyword(item);
                    navigate(`/jobs?q=${encodeURIComponent(item)}`);
                  }}
                  className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-blue-300 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ["Verified jobs", "Openings are reviewed before candidates apply.", ShieldCheck],
            ["Simple applications", "Submit the right details in a guided flow.", CheckCircle2],
            ["Clear decisions", "Track pending, accepted, or rejected updates.", Award],
          ].map(([title, text, Icon]) => (
            <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <Icon className="mb-4 text-blue-700 dark:text-blue-300" size={28} />
              <h3 className="text-xl font-black text-slate-950 dark:text-white">{title}</h3>
              <p className="mt-2 leading-7 text-slate-500 dark:text-slate-300">{text}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Featured openings</p>
              <h2 className="text-3xl font-black text-slate-950 dark:text-white">Recommended for you</h2>
            </div>
            <Link to="/jobs" className="inline-flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
              View all jobs
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <Link
                key={job._id}
                to={`/apply/${job._id}`}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                    <Building2 size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black text-slate-950 dark:text-white">{job.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{job.company}</p>
                  </div>
                </div>
                <p className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-300">
                  <MapPin size={15} />
                  {job.location} · {job.salary}
                </p>
              </Link>
            ))}
          </div>
        </section>
        {/* WHY CHOOSE US */}
<section className="border-y border-blue-100 bg-white py-16 dark:border-slate-800 dark:bg-slate-900">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
        Why JobDekho
      </p>

      <h2 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
        Everything you need to land your next opportunity
      </h2>

      <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
        Built for students, professionals, and recruiters with a clean and
        modern experience.
      </p>
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[
        [
          "Easy Applications",
          "Apply to jobs in just a few clicks with a smooth process.",
        ],
        [
          "Trusted Companies",
          "Explore verified companies actively hiring candidates.",
        ],
        [
          "Fast Hiring",
          "Recruiters can quickly review and respond to applications.",
        ],
        [
          "Real Updates",
          "Track your application status anytime from your dashboard.",
        ],
      ].map(([title, text]) => (
        <div
          key={title}
          className="rounded-3xl border border-slate-200 bg-[#f8fbff] p-6 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          <h3 className="text-xl font-black text-slate-950 dark:text-white">
            {title}
          </h3>

          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            {text}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* STATS */}
<section className="bg-gradient-to-r from-blue-700 to-blue-600 py-16 text-white">
  <div className="mx-auto grid max-w-7xl gap-6 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
    {[
      ["10K+", "Active Candidates"],
      ["850+", "Hiring Companies"],
      ["5K+", "Jobs Posted"],
      ["98%", "Success Rate"],
    ].map(([value, label]) => (
      <div
        key={label}
        className="rounded-3xl bg-white/10 p-8 backdrop-blur"
      >
        <h3 className="text-5xl font-black">{value}</h3>

        <p className="mt-3 text-blue-100">{label}</p>
      </div>
    ))}
  </div>
</section>

{/* HOW IT WORKS */}
<section className="bg-[#f5f7fb] py-16 dark:bg-slate-950">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
        Process
      </p>

      <h2 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
        How it works
      </h2>
    </div>

    <div className="mt-14 grid gap-6 md:grid-cols-3">
      {[
        [
          "01",
          "Search Jobs",
          "Find jobs based on your skills, location, or interests.",
        ],
        [
          "02",
          "Apply Easily",
          "Submit your application with resume and details quickly.",
        ],
        [
          "03",
          "Get Hired",
          "Track updates and receive responses from recruiters.",
        ],
      ].map(([number, title, text]) => (
        <div
          key={title}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
        >
          <span className="text-6xl font-black text-blue-100 dark:text-blue-900">
            {number}
          </span>

          <h3 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">
            {title}
          </h3>

          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            {text}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* TESTIMONIALS */}
<section className="bg-white py-16 dark:bg-slate-900">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
        Testimonials
      </p>

      <h2 className="mt-3 text-4xl font-black text-slate-950 dark:text-white">
        What users say
      </h2>
    </div>

    <div className="mt-14 grid gap-6 lg:grid-cols-3">
      {[
        [
          "Aman Sharma",
          "Frontend Developer",
          "The platform is super clean and applying for jobs feels very easy.",
        ],
        [
          "Priya Verma",
          "UI/UX Designer",
          "I got interview updates quickly and tracked every application easily.",
        ],
        [
          "Rohit Singh",
          "MERN Developer",
          "Best job portal project UI I have used recently. Very smooth experience.",
        ],
      ].map(([name, role, review]) => (
        <div
          key={name}
          className="rounded-3xl border border-slate-200 bg-[#f8fbff] p-8 transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950"
        >
          <div className="mb-5 flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-blue-700 text-lg font-black text-white">
              {name.charAt(0)}
            </div>

            <div>
              <h3 className="font-black text-slate-950 dark:text-white">
                {name}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-300">
                {role}
              </p>
            </div>
          </div>

          <p className="leading-7 text-slate-600 dark:text-slate-300">
            "{review}"
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

{/* CTA */}
<section className="pb-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="overflow-hidden rounded-[40px] bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-16 text-center text-white shadow-2xl">
      <h2 className="text-4xl font-black">
        Ready to start your career journey?
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-blue-100">
        Explore thousands of jobs, apply instantly, and get hired faster with
        JobDekho.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/jobs"
          className="rounded-2xl bg-white px-8 py-4 font-black text-blue-700 transition hover:bg-blue-50"
        >
          Explore Jobs
        </Link>

        <Link
          to="/login"
          className="rounded-2xl border border-white/30 bg-white/10 px-8 py-4 font-black text-white backdrop-blur transition hover:bg-white/20"
        >
          Get Started
        </Link>
      </div>
    </div>
  </div>
</section>
      </main>

      <Footer />
    </div>
  );
}
