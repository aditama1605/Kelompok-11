import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginForm from "./components/LoginForm.jsx";
import RegisterPasien from "./components/RegisterPasien.jsx";
import RegisterTerapis from "./components/RegisterTerapis.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardPasien from "./pages/DashboardPasien.jsx";
import DashboardTerapis from "./pages/DashboardTerapis.jsx";
import DataPasien from "./pages/DataPasien.jsx";
import Layanan from "./components/Layanan/index.jsx";
import Testimoni from "./components/Testimoni/index.jsx";
import Fitur from "./components/Fitur/index.jsx";
import Kontak from "./components/Kontak/index.jsx";


   export default function App() {
     return (
       <BrowserRouter>
         <div className="app">
           <Routes>
             <Route path="/" element={<HomePage />} />
             <Route path="/layanan" element={<Layanan/>} />
             <Route path="/testimoni" element={<Testimoni/>} />
             <Route path="/fitur" element={<Fitur/>} />
             <Route path="/kontak" element={<Kontak/>} />
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
               path="/data-pasien"
               element={
                 <ProtectedRoute allowedRole="terapis">
                   <DataPasien />
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
           </Routes>
         </div>
       </BrowserRouter>
     );
   }