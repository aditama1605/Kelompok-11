import React from "react";

const Loading = () => (
  <div 
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-200/60"
    aria-live="polite"
  >
    {/* Spinner kecil tapi jelas */}
    <div className="relative w-10 h-10 mb-4">
      <div className="absolute inset-0 border-4 border-gray-300 rounded-full"></div>
      <div 
        className="absolute inset-0 border-4 border-transparent border-t-rose-700 border-r-rose-700 rounded-full animate-spin"
        style={{ animationDuration: "1s" }}
      ></div>
    </div>

    {/* Teks sederhana */}
    <div className="text-center">
      <p className="text-gray-800 font-medium text-sm">Memuat...</p>
      <p className="text-gray-500 text-xs mt-1">Tunggu sebentar</p>
    </div>
  </div>
);

export default Loading;