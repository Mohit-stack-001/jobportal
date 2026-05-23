import { CheckCircle2 } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f5f7fb] dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">About JobDekho</p>
        <h1 className="mt-2 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl dark:text-white">
          We help candidates move faster and teams hire with more clarity.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          JobDekho keeps the hiring journey simple: discover relevant openings, apply with the right details, and track every decision from one place.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {["Verified openings", "Status notifications", "Admin-reviewed applications"].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CheckCircle2 className="mb-3 text-blue-700 dark:text-blue-300" size={26} />
              <h2 className="font-black text-slate-950 dark:text-white">{item}</h2>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
