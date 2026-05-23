// src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Companies from "./pages/Companies";
import About from "./pages/About";
import ApplyJob from "./pages/ApplyJob";
import Notifications from "./pages/Notifications";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/companies"
          element={<Companies />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/apply/:id"
          element={<ApplyJob />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>

    </BrowserRouter>
  );
}
