import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/LoginForm.jsx";
import RegisterPasien from "./components/RegisterPasien.jsx";
import RegisterTerapis from "./components/RegisterTerapis.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPasien from "./pages/DashboardPasien.jsx";
import DashboardTerapis from "./pages/DashboardTerapis.jsx";
import EditProfil from "./pages/EditProfil.jsx"; // ✅ Tambahkan ini

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register-pasien" element={<RegisterPasien />} />
          <Route path="/register-terapis" element={<RegisterTerapis />} />

          <Route
            path="/dashboard-terapis"
            element={
              <ProtectedRoute allowedRole="terapis">
                <DashboardTerapis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard-pasien"
            element={
              <ProtectedRoute allowedRole="pasien">
                <DashboardPasien />
              </ProtectedRoute>
            }
          />

          {/* ✅ Tambahkan route untuk edit profil */}
          <Route
            path="/edit-profil"
            element={
              <ProtectedRoute allowedRole="pasien">
                <EditProfil />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
