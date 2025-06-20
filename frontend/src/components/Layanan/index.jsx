import React from "react";

const Layanan = () => {
  return (
   <section id="layanan" className="bg-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="mx-auto max-w-2xl text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Jenis Layanan Fisioterapi
              </h2>
              <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
                Pilih layanan fisioterapi sesuai kebutuhan, lokasi, dan kenyamanan. TerapyCare hadir dengan berbagai pilihan perawatan yang profesional, fleksibel, dan terpercaya.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="space-y-8">
              {/* First Pricing Card */}
              <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 shadow-sm overflow-hidden lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-6 sm:p-8 lg:flex-auto">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">
                    Fisioterapi Visit
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    Layanan fisioterapi langsung di rumah pasien
                  </p>
                  <div className="mt-6 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-rose-600">
                      What's included
                    </h4>
                    <div className="h-px flex-auto bg-gray-200"></div>
                  </div>
                  <ul className="mt-6 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    {[
                      "Durasi ± 45 – 60 menit",
                      "1x pertemuan",
                      "Notifications and Reminders",
                      "Area layanan: Jakarta dan sekitarnya",
                    ].map((item) => (
                      <li key={item} className="flex gap-x-3">
                        <svg
                          className="h-5 w-5 flex-none text-rose-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-8 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-10">
                    <div className="mx-auto max-w-xs px-6">
                      <p className="text-base font-semibold text-gray-600">
                        One-time payment
                      </p>
                      <p className="mt-4 flex items-baseline justify-center gap-x-2">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                          0
                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          Rupiah
                        </span>
                      </p>
                      <a
                        href="#"
                        className="mt-6 block w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                      >
                        Pesan Sekarang
                      </a>
                      <p className="mt-4 text-xs leading-5 text-gray-600">
                        Invoice available for reimbursement
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Pricing Card */}
              <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 shadow-sm overflow-hidden lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-6 sm:p-8 lg:flex-auto">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900">
                    Konsultasi Online
                  </h3>
                  <p className="mt-4 text-base leading-7 text-gray-600">
                    Fasilitas untuk konsultasi jarak jauh dengan terapis profesional.
                  </p>
                  <div className="mt-6 flex items-center gap-x-4">
                    <h4 className="flex-none text-sm font-semibold leading-6 text-rose-600">
                      What's included
                    </h4>
                    <div className="h-px flex-auto bg-gray-200"></div>
                  </div>
                  <ul className="mt-6 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                    {[
                      "Durasi ± 30 menit",
                      "1x pertemuan",
                      "Notifications and Reminders",
                      "Area layanan: Seluruh Indonesia",
                    ].map((item) => (
                      <li key={item} className="flex gap-x-3">
                        <svg
                          className="h-5 w-5 flex-none text-rose-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-2 lg:w-full lg:max-w-md lg:flex-shrink-0">
                  <div className="rounded-2xl bg-gray-50 py-8 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-10">
                    <div className="mx-auto max-w-xs px-6">
                      <p className="text-base font-semibold text-gray-600">
                        One-time payment
                      </p>
                      <p className="mt-4 flex items-baseline justify-center gap-x-2">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                          0
                        </span>
                        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                          Rupiah
                        </span>
                      </p>
                      <a
                        href="#"
                        className="mt-6 block w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                      >
                        Pesan Sekarang
                      </a>
                      <p className="mt-4 text-xs leading-5 text-gray-600">
                        Invoice available for reimbursement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  );
};

export default Layanan;