import React from "react";

const Testimoni = () => {
  return (
    <section id="testimoni" className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Testimoni
          </h2>
          <p className="mt-4 text-base sm:text-lg leading-8 text-gray-600">
            Cerita dari pelanggan kami yang telah bergabung dengan senang hati menggunakan layanan ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold mr-4">
                BS
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight text-gray-900">
                  Budi Setiawan
                </h4>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-base leading-7 text-gray-600 italic">
              "Layanan konsultasi online-nya sangat membantu, saya bisa berkonsultasi kapan saja tanpa harus keluar rumah."
            </p>
          </div>

          {/* Testimonial 2 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold mr-4">
                A
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight text-gray-900">
                  Ani
                </h4>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-base leading-7 text-gray-600 italic">
              "Terapis yang datang ke rumah sangat profesional, saya merasa jauh lebih baik setelah beberapa sesi."
            </p>
          </div>

          {/* Testimonial 3 */}
          <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold mr-4">
                C
              </div>
              <div>
                <h4 className="text-xl font-bold tracking-tight text-gray-900">
                  Citra
                </h4>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-base leading-7 text-gray-600 italic">
              "Panduan pemulihannya sangat jelas dan mudah diikuti, membantu saya pulih lebih cepat."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimoni;