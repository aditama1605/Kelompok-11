import React from "react";

const Section = () => {
  return (
    <section className="relative flex flex-col lg:flex-row items-center justify-center mx-auto px-4 sm:px-6 py-7 sm:py-14 lg:py-16 max-w-7xl gap-8 lg:gap-12 bg-white">
      {/* Text Content */}
      <div className="lg:w-1/2 z-10">
        <div className="max-w-md ">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            <span className="block text-gray-900 mb-4 sm:mb-5">Dapatkan Layanan Terapi Bersama Terapis Yang Siap Membantu Anda Kembali Aktif dan Bebas Nyeri</span>
          </h2>
          
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-7 leading-relaxed">
            Booking cepat, jadwal fleksibel, dan terapis berkualitas hanya dalam beberapa klik.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-3 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-md transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 font-medium text-sm">
              Pesan Sekarang
            </button>
            <button className="px-3 py-2 border border-red-600 text-red-600 hover:bg-red-50 rounded-md transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-30 font-medium text-sm">
              Konsultasi Dulu
            </button>
          </div>
        </div>
      </div>
      
      {/* Image Content */}
      <div className="lg:w-1/2 relative z-10 lg:-mt-10">
          <img 
            src="/img/imghomepage.png" 
            alt=""
            className="w-full h-auto" 
            loading="lazy"
          />    
      </div>
    </section>
  );
};

export default Section;