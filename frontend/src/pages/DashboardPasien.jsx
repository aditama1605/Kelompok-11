import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function DashboardPasien() {
  const navigate = useNavigate();
  const nama = localStorage.getItem("nama") || "Pasien";
  const [terapisList, setTerapisList] = useState([]);
  const [selectedTerapis, setSelectedTerapis] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jenisLayanan, setJenisLayanan] = useState("Home Visit");
  const token = localStorage.getItem("token");
  const [toasts, setToasts] = useState([]);

  // Toast notification system
  const showToast = (type, title, message) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    localStorage.removeItem("iduser");
    navigate("/login");
  };

  // Ambil daftar terapis dari API
  useEffect(() => {
    const fetchTerapis = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/terapis", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTerapisList(response.data.data);
      } catch (error) {
        console.error("Gagal ambil data terapis:", error);
        showToast("danger", "Error", "Gagal memuat data terapis");
      }
    };
    fetchTerapis();
  }, [token]);

  // Submit Jadwal Terapi
  const handleSubmitJadwal = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/jadwal-terapi",
        {
          terapis_id: selectedTerapis,
          user_id: localStorage.getItem("iduser"),
          jadwal_terapi: jadwal,
          jenis_layanan: jenisLayanan,
          alamat: jenisLayanan === "Home Visit" ? alamat : null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      showToast("success", "Success", "Jadwal terapi berhasil diajukan!");
      // Reset form
      setSelectedTerapis("");
      setJadwal("");
      setAlamat("");
    } catch (error) {
      console.error("Gagal submit jadwal:", error.response?.data || error.message);
      showToast("danger", "Error", "Gagal mengajukan jadwal terapi");
    }
  };

  return (
    <div>
      <Navbar />
      <section className="bg-white py-7 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Toast Container - sama dengan di login form */}
          <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`toast flex items-start p-4 rounded-lg border shadow-lg ${
                  toast.type === "success"
                    ? "bg-green-50 border-green-100"
                    : toast.type === "danger"
                    ? "bg-red-50 border-red-100"
                    : "bg-yellow-50 border-yellow-100"
                }`}
              >
                <div className="flex-shrink-0">
                  {toast.type === "success" && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {toast.type === "danger" && (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {toast.type === "warning" && (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <h3
                    className={`text-sm font-medium ${
                      toast.type === "success"
                        ? "text-green-800"
                        : toast.type === "danger"
                        ? "text-red-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {toast.title}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      toast.type === "success"
                        ? "text-green-600"
                        : toast.type === "danger"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {toast.message}
                  </p>
                </div>
                <button
                  className={`ml-auto ${
                    toast.type === "success"
                      ? "text-green-400 hover:text-green-500"
                      : toast.type === "danger"
                      ? "text-red-400 hover:text-red-500"
                      : "text-yellow-400 hover:text-yellow-500"
                  }`}
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Dashboard Pasien
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Selamat datang, <span className="font-semibold text-rose-600">{nama}</span>!
              </p>
            </div>


            
            <Link
              to="/edit-profil"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded"
            >
              Edit Profil
            </Link>

          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Ajukan Jadwal Terapi</h3>
                <form onSubmit={handleSubmitJadwal} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pilih Terapis
                    </label>
                    <select
                      value={selectedTerapis}
                      onChange={(e) => setSelectedTerapis(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                      required
                    >
                      <option value="">-- Pilih Terapis --</option>
                      {terapisList.map((t) => (
                        <option key={t.id_terapis} value={t.id_terapis}>
                          {t.nama} - {t.spesialisasi}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jadwal Terapi
                    </label>
                    <input
                      type="datetime-local"
                      value={jadwal}
                      onChange={(e) => setJadwal(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Jenis Layanan
                    </label>
                    <select
                      value={jenisLayanan}
                      onChange={(e) => setJenisLayanan(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                    >
                      <option value="Home Visit">Home Visit</option>
                      <option value="OnWeb">Online</option>
                    </select>
                  </div>

                  {jenisLayanan === "Home Visit" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Alamat Kunjungan
                      </label>
                      <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                        className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                  >
                    Ajukan Jadwal
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Section */}
            <div className="space-y-6">
              {/* Info Box */}
              <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-rose-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Penting</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Pastikan jadwal yang dipilih sesuai dengan kesepakatan terapis</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Untuk layanan home visit, pastikan alamat sudah benar</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Konfirmasi jadwal akan dikirim via email setelah terapis menyetujui</span>
                  </li>
                </ul>
              </div>

              {/* Terapis List */}
              <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Terapis Tersedia</h3>
                <div className="space-y-4">
                  {terapisList.slice(0, 3).map((terapis) => (
                    <div key={terapis.id_terapis} className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                        <span className="text-rose-600 font-medium">
                          {terapis.nama.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{terapis.nama}</h4>
                        <p className="text-sm text-gray-500">{terapis.spesialisasi}</p>
                      </div>
                    </div>
                  ))}
                  {terapisList.length > 3 && (
                    <p className="text-sm text-rose-600 font-medium">+ {terapisList.length - 3} terapis lainnya</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}