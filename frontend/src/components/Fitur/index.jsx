import React from "react";

const Fitur = () => {
  return (
    <section id="fitur" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Fitur Utama
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
            Konsultasikan masalah Anda dengan terapis kami melalui web, dapatkan panduan latihan, dan layanan kunjungan ke rumah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 text-center mb-3">
              Konsultasi Online
            </h3>
            <p className="text-base leading-7 text-gray-600 text-center">
              Konsultasi masalah Anda dengan terapis kami melalui web, kapan saja.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 text-center mb-3">
              Panduan Latihan
            </h3>
            <p className="text-base leading-7 text-gray-600 text-center">
              Dapatkan panduan lengkap dan terperinci untuk mendukung proses pemulihan Anda.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900 text-center mb-3">
              Kunjungan ke Rumah
            </h3>
            <p className="text-base leading-7 text-gray-600 text-center">
              Terapis kami datang ke rumah Anda untuk perawatan yang lebih nyaman.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Fitur;