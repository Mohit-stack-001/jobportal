import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, BriefcaseBusiness, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { clearSession, getSession } from "../utils/auth";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Jobs" },
  { to: "/companies", label: "Companies" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [session, setSessionState] = useState(getSession());
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia?.("(prefers-color-scheme: dark)").matches || false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const sync = () => setSessionState(getSession());
    window.addEventListener("storage", sync);
    window.addEventListener("focus", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("focus", sync);
    };
  }, []);

  const logout = () => {
    clearSession();
    setSessionState(null);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${
      isActive ? "text-blue-700 dark:text-blue-300" : "text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-white"
    }`;

  const ThemeToggle = ({ compact = false }) => (
    <button
      type="button"
      role="switch"
      aria-checked={darkMode}
      aria-label="Toggle theme"
      onClick={() => setDarkMode((value) => !value)}
      className={`relative inline-flex items-center rounded-full border transition ${
        compact ? "h-11 w-full justify-between px-3" : "h-10 w-[86px] px-1"
      } ${
        darkMode
          ? "border-slate-700 bg-slate-900 text-slate-100 shadow-inner"
          : "border-blue-100 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
      }`}
    >
      {compact && <span className="text-sm font-bold">{darkMode ? "Dark mode" : "Light mode"}</span>}
      {!compact && (
        <>
          <Sun className="absolute left-3 text-amber-500" size={15} />
          <Moon className="absolute right-3 text-slate-400" size={15} />
        </>
      )}
      <span
        className={`relative z-10 grid h-8 w-8 place-items-center rounded-full shadow transition-transform duration-200 ${
          darkMode ? "bg-blue-600 text-white" : "bg-white text-amber-500"
        }`}
        style={{ transform: compact ? "translateX(0)" : darkMode ? "translateX(44px)" : "translateX(0)" }}
      >
        {darkMode ? <Moon size={15} /> : <Sun size={15} />}
      </span>
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none">
            <BriefcaseBusiness size={24} />
          </span>
          <span>
            <span className="block text-xl font-black text-slate-950 dark:text-white">JobDekho</span>
            <span className="block text-xs font-semibold text-blue-600 dark:text-blue-300">Careers that move</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {session?.user?.role === "user" && (
            <Link
              to="/notifications"
              className="relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:text-blue-700 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
            </Link>
          )}

          {session ? (
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 dark:bg-white dark:text-slate-950 dark:hover:bg-red-500 dark:hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setMenuOpen((value) => !value)}
          className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-900 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 lg:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {session?.user?.role === "user" && (
              <Link to="/notifications" onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Notifications
              </Link>
            )}
            <ThemeToggle compact />
            {session ? (
              <button onClick={logout} className="rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white">
                Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-xl bg-blue-700 px-4 py-3 text-center text-sm font-bold text-white">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
