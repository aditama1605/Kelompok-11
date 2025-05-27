import React from "react";

export default function DashboardTerapis() {
  const nama = localStorage.getItem("nama") || "Terapis";
  return (
    <div>
      <h2>Dashboard Terapis</h2>
      <p>Selamat datang, {nama}!</p>
    </div>
  );
}