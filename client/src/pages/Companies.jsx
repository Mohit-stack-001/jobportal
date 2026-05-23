import { Building2, MapPin, Users } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const companies = [
  ["Google", "Remote", "18 open roles"],
  ["Microsoft", "Bangalore", "12 open roles"],
  ["Amazon", "Hyderabad", "24 open roles"],
  ["Adobe", "Delhi", "7 open roles"],
  ["Infosys", "Pune", "16 open roles"],
  ["Meta", "Remote", "9 open roles"],
];

export default function Companies() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Top companies</p>
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">Companies Hiring Now</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {companies.map(([name, location, roles]) => (
            <article key={name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                <Building2 size={25} />
              </span>
              <h2 className="mt-5 text-2xl font-black text-slate-950 dark:text-white">{name}</h2>
              <p className="mt-3 flex items-center gap-2 text-slate-500 dark:text-slate-300">
                <MapPin size={17} /> {location}
              </p>
              <p className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-300">
                <Users size={17} /> {roles}
              </p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
