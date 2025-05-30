import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // Belum login, redirect ke halaman utama/login
    return <Navigate to="/" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Role tidak sesuai, redirect ke halaman utama/login
    return <Navigate to="/" replace />;
  }

  // Sudah login dan role sesuai
  return children;
}