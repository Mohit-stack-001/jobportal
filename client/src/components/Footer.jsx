import { Link } from "react-router-dom";
import { BriefcaseBusiness, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-700 text-white">
              <BriefcaseBusiness size={22} />
            </span>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">JobDekho</h2>
          </div>
          <p className="text-sm leading-6 text-slate-500 dark:text-slate-300">
            Curated opportunities, quick applications, and transparent hiring updates.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="/companies">Companies</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">Support</h3>
          <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-300">
            <Link to="/about">About</Link>
            <span>Privacy Policy</span>
            <span>Terms & Conditions</span>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold text-slate-950 dark:text-white">For Candidates</h3>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
          >
            Explore Jobs
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200 py-4 text-center text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        © 2026 JobDekho. All rights reserved.
      </div>
    </footer>
  );
}
