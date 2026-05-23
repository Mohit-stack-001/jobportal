import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Bookmark, BriefcaseBusiness, Building2, Clock3, IndianRupee, MapPin, Search, SlidersHorizontal } from "lucide-react";
import API from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Jobs() {
  const [params] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(params.get("q") || "");
  const [location, setLocation] = useState(params.get("loc") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    API.get("/jobs", { signal: controller.signal })
      .then((res) => {
        setJobs(res.data.jobs || []);
        setError("");
      })
      .catch((err) => {
        if (err.name !== "CanceledError") {
          setError("Jobs are taking longer than expected. Please refresh once.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const filteredJobs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const normalizedLocation = location.trim().toLowerCase();

    return jobs.filter((job) => {
      const titleMatch = `${job.title} ${job.company} ${job.type}`.toLowerCase().includes(normalizedSearch);
      const locationMatch = job.location.toLowerCase().includes(normalizedLocation);
      return titleMatch && locationMatch;
    });
  }, [jobs, search, location]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-blue-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950">
              <Search className="text-blue-700 dark:text-blue-300" size={21} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search jobs by title, company or skill"
                className="w-full bg-transparent text-slate-950 outline-none dark:text-white"
              />
            </label>
            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-950">
              <MapPin className="text-blue-700 dark:text-blue-300" size={21} />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="w-full bg-transparent text-slate-950 outline-none dark:text-white"
              />
            </label>
            <button className="rounded-2xl bg-blue-700 px-7 py-4 font-black text-white transition hover:bg-blue-800">
              Search
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="text-blue-700 dark:text-blue-300" size={20} />
              <h2 className="font-black text-slate-950 dark:text-white">Filters</h2>
            </div>
            {["Full Time", "Remote", "Hybrid", "Internship"].map((item) => (
              <button
                key={item}
                onClick={() => setSearch(item)}
                className="mb-2 block w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300"
              >
                {item}
              </button>
            ))}
          </aside>

          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-3xl font-black text-slate-950 dark:text-white">Recommended Jobs</h1>
                <p className="text-slate-500 dark:text-slate-300">{filteredJobs.length} jobs available</p>
              </div>
            </div>

            {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
            {loading && <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 dark:border-slate-800 dark:bg-slate-900">Loading jobs...</div>}

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <article key={job._id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                    <div className="flex gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        <Building2 size={26} />
                      </span>
                      <div>
                        <h2 className="text-2xl font-black text-slate-950 dark:text-white">{job.title}</h2>
                        <p className="mt-1 text-slate-500 dark:text-slate-300">{job.company}</p>
                        <p className="mt-3 line-clamp-2 max-w-3xl text-slate-600 dark:text-slate-300">{job.description}</p>
                      </div>
                    </div>
                    <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-700 dark:text-slate-300">
                      <Bookmark size={19} />
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <MapPin size={16} /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <IndianRupee size={16} /> {job.salary}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <BriefcaseBusiness size={16} /> {job.type || "Full Time"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      <Clock3 size={16} /> Recently posted
                    </span>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      to={`/apply/${job._id}`}
                      className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white transition hover:bg-blue-800"
                    >
                      Apply Now
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
