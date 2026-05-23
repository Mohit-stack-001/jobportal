import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, Clock3, XCircle } from "lucide-react";
import API from "../api/api";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getSession } from "../utils/auth";

const statusStyle = {
  pending: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-200",
  accepted: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-200",
  rejected: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-200",
};

const statusIcon = {
  pending: Clock3,
  accepted: CheckCircle2,
  rejected: XCircle,
};

export default function Notifications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const session = getSession();

    if (session?.user?.role !== "user") {
      navigate("/login");
      return;
    }

    API.get("/applications/me").then((res) => setApplications(res.data.applications || []));
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-700 text-white">
            <Bell size={24} />
          </span>
          <div>
            <p className="text-sm font-bold text-blue-700 dark:text-blue-300">Notifications</p>
            <h1 className="text-4xl font-black text-slate-950 dark:text-white">Application Status</h1>
          </div>
        </div>

        <div className="space-y-4">
          {applications.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <p className="text-slate-600 dark:text-slate-300">No applications yet.</p>
              <Link to="/jobs" className="mt-4 inline-block rounded-xl bg-blue-700 px-5 py-3 font-bold text-white">
                Apply for jobs
              </Link>
            </div>
          )}

          {applications.map((app) => {
            const Icon = statusIcon[app.status] || Clock3;

            return (
              <article key={app._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="text-xl font-black text-slate-950 dark:text-white">{app.job?.title || "Job application"}</h2>
                    <p className="text-slate-500 dark:text-slate-300">{app.job?.company || "Company"} · Applied as {app.name}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black capitalize ${statusStyle[app.status]}`}>
                    <Icon size={18} />
                    {app.status}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
