import { BrowserRouter, Routes, Route } from "react-router-dom";
import TerapiCare from "./pages/HomePage";
import LoginForm from "./components/LoginForm.jsx";
import RegisterPasien from "./components/RegisterPasien.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPasien from "./pages/DashboardPasien.jsx";
import DashboardTerapis from "./pages/DashboardTerapis.jsx";
import DashboardAdmin from "./pages/DashboardAdmin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<TerapiCare />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterPasien />} />
          <Route
            path="/dashboard-admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <DashboardAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-terapis"
            element={
              <ProtectedRoute allowedRoles={["terapis"]}>
                <DashboardTerapis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-pasien"
            element={
              <ProtectedRoute allowedRoles={["pasien"]}>
                <DashboardPasien />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}