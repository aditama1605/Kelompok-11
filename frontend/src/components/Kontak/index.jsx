import React from "react";

const Kontak = () => {
  return (
    <section id="kontak" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Kontak Kami
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
            Hubungi kami untuk informasi lebih lanjut atau jadwalkan sesi terapi Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                  placeholder="Nama Lengkap"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pesan
                </label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
                  placeholder="Pesan"
                  rows={5}
                  required
                />
              </div>
              <button
                type="button"
                className="w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
              >
                Kirim Pesan
              </button>
            </div>
          </div>

          {/* Map & Info */}
          <div className="space-y-8">
            <div className="rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <iframe
                title="map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=106.816666%2C-6.2%2C106.85%2C-6.15&layer=mapnik"
                className="w-full h-64"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-4">
                Informasi Kontak
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-rose-100 p-2 rounded-md mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Alamat</h4>
                    <p className="text-base leading-7 text-gray-600">
                      Jl. Kesehatan No. 123, Jakarta Pusat, Indonesia
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-rose-100 p-2 rounded-md mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Telepon</h4>
                    <p className="text-base leading-7 text-gray-600">(021) 1234-5678</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-rose-100 p-2 rounded-md mr-4">
                    <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Email</h4>
                    <p className="text-base leading-7 text-gray-600">info@terapycare.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Kontak;