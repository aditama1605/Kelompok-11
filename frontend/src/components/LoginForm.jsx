import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    if (!email || !password) {
      showToast("warning", "Peringatan", "Email dan password harus diisi");
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result.success && result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("nama", result.user.nama || result.user.name || "");
        localStorage.setItem("iduser", result.user.iduser);
        
        showToast("success", "Berhasil", "Login berhasil, mengarahkan...");
        
        setTimeout(() => {
          if (result.user.role === "admin") navigate("/dashboard-admin");
          else if (result.user.role === "terapis") navigate("/dashboard-terapis");
          else if (result.user.role === "pasien") navigate("/dashboard-pasien");
        }, 1000);
      } else {
        showToast("danger", "Gagal", result.message || "Email atau password salah");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("danger", "Error", "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} />
        ))}
      </div>

      {/* Left Panel - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-rose-500 to-rose-400">
        <div className="h-full flex flex-col items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <h2 className="text-2xl font-light mb-4">Sistem Fisioterapi Modern</h2>
            <p className="opacity-90 mb-6">
              Akses penuh ke semua layanan dan fitur profesional kami
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-rose-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Konsultasi dengan ahli fisioterapi</span>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2 text-rose-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Pantau perkembangan kesehatan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-rose-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
            <h1 className="mt-4 text-3xl font-light text-gray-900">Selamat Datang</h1>
            <p className="mt-2 text-gray-500">Masuk ke akun fisioterapi Anda</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="contoh@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 transition text-sm placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs text-rose-500 hover:text-rose-600">
                    Lupa password?
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-200 transition text-sm placeholder-gray-400"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-rose-500 focus:ring-rose-400 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-xs text-gray-600">
                    Ingat saya
                  </label>
                </div>

                <div className="text-xs text-gray-500">
                  Belum punya akun?{" "}
                  <a href="/register" className="text-rose-500 hover:text-rose-600 font-medium">
                    Daftar sekarang
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-rose-300 transition-colors ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white text-gray-500">
                    Atau lanjutkan dengan
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 rounded-lg border border-gray-200 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Google
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 rounded-lg border border-gray-200 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Toast({ toast, onClose }) {
  const iconMap = {
    success: (
      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    danger: (
      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  };

  const bgColorMap = {
    success: "bg-green-100",
    danger: "bg-red-100",
    warning: "bg-yellow-100"
  };

  const borderColorMap = {
    success: "border-green-100",
    danger: "border-red-100",
    warning: "border-yellow-100"
  };

  const textColorMap = {
    success: "text-green-800",
    danger: "text-red-800",
    warning: "text-yellow-800"
  };

  return (
    <div className={`toast flex items-start p-4 rounded-lg border shadow-lg backdrop-blur-sm bg-white/80 ${borderColorMap[toast.type]}`}>
      <div className={`flex-shrink-0 h-8 w-8 rounded-full ${bgColorMap[toast.type]} flex items-center justify-center`}>
        {iconMap[toast.type]}
      </div>
      <div className="ml-3 flex-1">
        <h3 className={`text-sm font-semibold ${textColorMap[toast.type]}`}>
          {toast.title}
        </h3>
        <p className={`mt-1 text-sm ${textColorMap[toast.type]}`}>
          {toast.message}
        </p>
      </div>
      <button
        className={`ml-4 ${textColorMap[toast.type].replace('800', '400')} hover:${textColorMap[toast.type].replace('800', '500')}`}
        onClick={onClose}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}