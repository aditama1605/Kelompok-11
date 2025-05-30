import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function RegisterPasien() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const showToast = (type, title, message) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nama || !email || !password) {
      showToast("warning", "Warning", "Nama, email, dan password harus diisi!");
      return;
    }

    if (!email.toLowerCase().endsWith("@gmail.com")) {
      showToast("warning", "Warning", "Email harus menggunakan domain @gmail.com!");
      return;
    }

    try {
      const result = await register(nama, email, password, "pasien");
      if (result.success) {
        showToast("success", "Success", "Registrasi pasien berhasil! Anda akan diarahkan ke halaman login...");
        setNama("");
        setEmail("");
        setPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        showToast("danger", "Error", result.message || "Registrasi gagal. Email mungkin sudah digunakan.");
      }
    } catch (err) {
      showToast("danger", "Error", "Terjadi kesalahan saat registrasi. Silakan coba lagi.");
      console.error("Registration error:", err);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="bg-white py-7 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Toast Container */}
          <div
            className="fixed top-4 right-4 z-50 space-y-3 w-80"
            style={{
              animation: "slideIn 0.5s forwards, fadeOut 0.5s forwards 3s",
              "@keyframes slideIn": {
                from: { transform: "translateX(100%)", opacity: 0 },
                to: { transform: "translateX(0)", opacity: 1 },
              },
              "@keyframes fadeOut": {
                to: { opacity: 0 },
              },
            }}
          >
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

          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Register Pasien
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
              Daftar sebagai pasien untuk mendapatkan akses ke layanan fisioterapi kami.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex items-center justify-center">
              <img
                src="/img/image.png"
                alt="Therapist Consultation"
                className="max-w-full h-auto"
              />
            </div>
            <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Email (harus @gmail.com)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}