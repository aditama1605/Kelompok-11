import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DashboardTerapis() {
  const navigate = useNavigate();
  const nama = localStorage.getItem("nama") || "Terapis";
  const token = localStorage.getItem("token");
  const [toasts, setToasts] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [userList, setUserList] = useState([]);

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
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8000/api/users", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setTerapisList(response.data.data);
  //     } catch (error) {
  //       console.error("Gagal ambil data terapis:", error);
  //       showToast("danger", "Error", "Gagal memuat data terapis");
  //     }
  //   };
  //   fetchUser();
  // }, [token]);

  useEffect(() => {
  const fetchJadwal = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/jadwal-terapi", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Jadwal response:", response.data);
      setJadwalList(response.data.data);
    } catch (error) {
      console.error("Gagal ambil data jadwal:", error);
      showToast("danger", "Error", "Gagal memuat data jadwal");
    }
  };
  fetchJadwal();
}, [token]);

// Ambil semua user (untuk total pasien)
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList(response.data.data);
    } catch (error) {
      console.error("Gagal ambil data user:", error);
    }
  };
  fetchUsers();
}, [token]);

// Hitung total pasien hari ini (unik berdasarkan user)
const today = new Date().toISOString().slice(0, 10);
const pasienHariIni = [
  ...new Set(
    jadwalList
      .filter((j) => (j.jadwal_terapi || '').slice(0, 10) === today)
      .map((j) => j.user?.id)
  ),
].length;

// Hitung total semua pasien (role === 'pasien')
const totalPasien = userList.filter((u) => u.role === "pasien").length;


  return (
    <div>
      <Navbar role="terapis" />
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
                Selamat datang, <span className="font-semibold text-rose-600">{nama}</span>
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-md transition"
            >
              Logout
            </button>
          </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Ringkasan Pasien */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center p-6 bg-light-50 rounded-lg shadow">
                <div className="text-4xl mr-4"></div>
                <div>
                  <div className="text-4xl mr-4">{pasienHariIni}</div>
                  <div className="text-gray-600 text-sm">Pasien Hari Ini</div>
                </div>
              </div>
              <div className="flex items-center p-6 bg-light-50 rounded-lg shadow">
                <div className="text-4xl mr-4"></div>
                <div>
                  <div className="text-4xl mr-4">{totalPasien}</div>
                  <div className="text-gray-600 text-sm">Total Semua Pasien</div>
                </div>
              </div>
            </div>

            {/* Tabel Jadwal Hari Ini */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">Jadwal Hari Ini</h3>
                <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
                  </svg>
                  Filter
                </button>
              </div>
              <table className="min-w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 text-gray-700 font-semibold">
                  <tr>
                    <th className="py-3 px-6">No.</th>
                    <th className="py-3 px-6">Tanggal Terapi</th>
                    <th className="py-3 px-6">Nama</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Jam Terapi</th>
                    <th className="py-3 px-6">Pembayaran</th>
                    <th className="py-3 px-6">Live Chat</th>
                    <th className="py-3 px-6">Diagnosa</th>
                  </tr>
                </thead>
                <tbody>
                  {jadwalList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-4">Tidak ada jadwal terapi</td>
                    </tr>
                  ) : (
                    jadwalList.map((row, index) => (
                      <tr key={row.id || index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-6">{index + 1}</td>
                        <td className="py-3 px-6">{row.jadwal_terapi}</td>
                        <td className="py-3 px-6">{row.user ? row.user.nama : '-'}</td>
                        <td className="py-3 px-6">{row.user ? row.user.email : '-'}</td>
                        <td className="py-3 px-6 font-bold">{row.jenis_layanan}</td>
                        <td className="py-3 px-6">{row.pembayaran}</td>
                        <td className="py-3 px-6">
                          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm">
                            Chat
                          </button>
                        </td>
                        <td className="py-3 px-6">
                          <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 text-sm">
                            Buat
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

      </section>
      <Footer />
    </div>
  );
}