import React, { useState } from "react";

const PdfModal = ({ isOpen, onClose, pdfUrl, title }) => {
  const [loadError, setLoadError] = useState(null);

  if (!isOpen) return null;

  const handleError = () => {
    setLoadError("Gagal memuat PDF. Coba buka di tab baru atau unduh file.");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1000] transition-opacity duration-300">
      <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl h-[85vh] sm:h-[90vh] mx-2 shadow-2xl flex flex-col transform transition-transform duration-300 scale-100">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate" id="modal-title">
            {title || "Lihat Panduan"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl sm:text-3xl focus:outline-none focus:ring-2 focus:ring-rose-300 rounded-full w-8 h-8 flex items-center justify-center"
            aria-label="Tutup modal"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col items-center bg-gray-50 rounded-lg p-2 sm:p-4">
          {loadError ? (
            <div className="text-red-600 text-center p-4 text-sm sm:text-base">
              <p className="font-medium">{loadError}</p>
              <div className="mt-3 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-rose-100 text-rose-700 rounded-md hover:bg-rose-200 transition text-sm font-medium"
                  aria-label="Buka PDF di tab baru"
                >
                  Buka di Tab Baru
                </a>
                <a
                  href={pdfUrl}
                  download
                  className="px-4 py-2 bg-rose-100 text-rose-700 rounded-md hover:bg-rose-200 transition text-sm font-medium"
                  aria-label="Unduh file PDF"
                >
                  Unduh PDF
                </a>
              </div>
            </div>
          ) : (
            <>
              <iframe
                src={`${pdfUrl}#zoom=fit&toolbar=1&view=FitH`}
                title={title || "PDF Viewer"}
                className="w-full h-full min-h-[40vh] sm:min-h-[60vh] bg-white rounded-lg"
                style={{ border: "none", objectFit: "contain" }}
                onError={handleError}
                aria-describedby="pdf-fallback"
              />
              <p id="pdf-fallback" className="mt-3 text-xs sm:text-sm text-gray-600 text-center">
                Tidak dapat melihat PDF?{" "}
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-700 underline font-medium"
                >
                  Buka di tab baru
                </a>{" "}
                atau{" "}
                <a
                  href={pdfUrl}
                  download
                  className="text-rose-600 hover:text-rose-700 underline font-medium"
                >
                  Unduh PDF
                </a>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-3">
          <a
            href={pdfUrl}
            download
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-300"
            aria-label="Unduh file PDF"
          >
            Unduh PDF
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Tutup modal"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PdfModal;