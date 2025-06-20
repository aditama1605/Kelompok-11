import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TerapiCare = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [activeBlog, setActiveBlog] = useState(null);
  const [activeService, setActiveService] = useState(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".observe").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const navbarHeight = document.querySelector('nav').offsetHeight;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - navbarHeight,
      behavior: 'smooth',
    });
  }
};

  const blogPosts = [
    {
      id: 1,
      title: "5 Latihan untuk Meredakan Nyeri Punggung Bawah",
      excerpt: "Pelajari latihan sederhana yang bisa dilakukan di rumah untuk meredakan nyeri punggung bawah kronis.",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content: "Nyeri punggung bawah adalah masalah umum yang mempengaruhi banyak orang. Artikel ini membahas 5 latihan efektif yang bisa Anda lakukan di rumah untuk meredakan ketidaknyamanan. Latihan termasuk knee-to-chest stretch, pelvic tilts, dan cat-cow stretch. Setiap latihan dijelaskan dengan detail dan dilengkapi dengan tips untuk memaksimalkan manfaatnya.",
      date: "15 Juni 2023"
    },
    {
      id: 2,
      title: "Manfaat Fisioterapi Pasca Operasi",
      excerpt: "Temukan bagaimana fisioterapi dapat mempercepat pemulihan setelah operasi besar.",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content: "Fisioterapi pasca operasi memainkan peran penting dalam pemulihan pasien. Artikel ini menjelaskan berbagai teknik fisioterapi yang digunakan setelah operasi ortopedi, termasuk terapi manual, latihan gerak, dan manajemen nyeri. Kami juga membahas timeline pemulihan yang umum dan tanda-tanda yang perlu diwaspadai.",
      date: "2 Juni 2023"
    },
    {
      id: 3,
      title: "Mencegah Cedera Saat Bekerja dari Rumah",
      excerpt: "Tips ergonomis untuk mencegah nyeri leher dan punggung saat bekerja jarak jauh.",
      image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      content: "Dengan semakin banyaknya orang yang bekerja dari rumah, keluhan muskuloskeletal juga meningkat. Artikel ini memberikan panduan lengkap tentang setup workstation yang ergonomis, postur duduk yang benar, dan latihan peregangan yang bisa dilakukan setiap jam. Kami juga menyertakan rekomendasi alat pendukung seperti standing desk dan kursi ergonomis.",
      date: "20 Mei 2023"
    },
  ];

  const services = [
    {
      id: 1,
      title: "Fisioterapi di Rumah",
      description: "Layanan fisioterapi langsung di rumah pasien dengan terapis profesional dan peralatan lengkap.",
      features: [
        "Terapy Ai",
        "Durasi per sesi",
        "Area layanan Jakarta",
        "Terapis berpengalaman dengan sertifikasi",
        "Peralatan portable lengkap",
        "Laporan perkembangan berkala",
      ],
      price: "Rp 200.000",
      image: "https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 870w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1170w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1470w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1740w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 1770w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2070w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2340w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2370w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2670w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2940w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 2970w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 3270w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 3540w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=3570&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 3570w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 3870w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=4140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 4140w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=4170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 4170w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=4470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 4470w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=4740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 4740w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=4770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 4770w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 5070w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=5340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 5340w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=5370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 5370w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=5670&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 5670w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=5940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 5940w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=5970&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 5970w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=6270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 6270w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=6540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 6540w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=6570&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 6570w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=6870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 6870w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=7140&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 7140w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=7170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 7170w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=7470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 7470w, https://plus.unsplash.com/premium_photo-1661720690160-75cf41eef18f?q=80&w=7633&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D 7633w",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Konsultasi Online",
      description: "Konsultasi jarak jauh dengan fisioterapis profesional untuk diagnosis dan rekomendasi perawatan.",
      features: [
        "Terapy Ai",
        "Durasi per sesi",
        "Area layanan Jakarta",
        "Terapis berpengalaman dengan sertifikasi",
        "Peralatan portable lengkap",
        "Laporan perkembangan berkala",
      ],
      price: "Rp 30.000",
      image: "https://images.unsplash.com/photo-1573496782646-e8d943a4bdd1?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Daftar Gratis",
      description: "Daftar sebagai pasien atau terapis untuk mendapatkan akses ke layanan kami. Tanpa biaya tambahan. ",
      features: [
        "Terapy Ai",
        "Durasi per sesi",
        "Area layanan Jakarta",
        "Terapis berpengalaman dengan sertifikasi",
        "Peralatan portable lengkap",
        "Laporan perkembangan berkala",
      ],
      price: "Rp 0",
      image: "https://images.unsplash.com/photo-1488998427799-e3362cec87c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="font-sans bg-gray-50 text-gray-800 min-h-screen smooth-scroll">
      {/* Custom Styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          .animate-fade { animation: fadeIn 0.8s ease-out forwards; }
          .animate-scale { animation: scaleIn 0.5s ease-out forwards; }
          .hover-scale { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .hover-scale:hover { transform: scale(1.03); }
          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
          }
          .text-gradient {
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          .nav-link {
            position: relative;
          }
          .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background: linear-gradient(90deg, #f43f5e, #8b5cf6);
            transition: width 0.3s ease;
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .active-nav-link::after {
            width: 100%;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(#f43f5e, #8b5cf6);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(#e11d48, #7c3aed);
          }
          .smooth-scroll {
            scroll-behavior: smooth;
          }
          .floating-shape {
            position: absolute;
            border-radius: 50%;
            filter: blur(60px);
            opacity: 0.2;
            z-index: 0;
          }
          .service-card:hover .service-icon {
            transform: rotateY(180deg);
          }
          .service-icon {
            transition: transform 0.6s ease;
          }
        `}
      </style>

      {/* Floating background shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-shape bg-purple-500 w-64 h-64 top-20 left-10"></div>
        <div className="floating-shape bg-rose-500 w-96 h-96 bottom-20 right-10"></div>
      </div>

      {/* Navigation Bar */}
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 z-10">
            <span className="text-3xl font-extrabold bg-rose-600 text-gradient">
            TerapyCare
            </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
            {[
            { name: "Beranda", id: "home" },
            { name: "Layanan", id: "services" },
            { name: "Keunggulan", id: "features" },
            { name: "Blog", id: "blog" },
            { name: "Testimoni", id: "testimonials" },
            { name: "Kontak", id: "contact" },
            ].map((item) => (
            <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
                }}
                className="nav-link text-gray-700 hover:text-gray-900 text-base font-medium px-1"
            >
                {item.name}
            </a>
            ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4 z-10">
            <Link
            to="/login"
            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors duration-300"
            >
            Masuk
            </Link>
            <Link
            to="/register"
            className="px-5 py-2.5 text-sm font-medium text-white bg-rose-600 rounded-xl transition-all duration-300 shadow-md hover-scale"
            >
            Daftar
            </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
            className="md:hidden p-2 text-gray-700 hover:text-rose-600 focus:outline-none z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
        >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
            </svg>
        </button>
        </div>
    </div>

    {/* Mobile Menu */}
    {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white py-4 px-6 shadow-lg animate-scale z-40">
        <div className="flex flex-col space-y-4">
            {[
            { name: "Beranda", id: "home" },
            { name: "Layanan", id: "services" },
            { name: "Keunggulan", id: "features" },
            { name: "Blog", id: "blog" },
            { name: "Testimoni", id: "testimonials" },
            { name: "Kontak", id: "contact" },
            ].map((item) => (
            <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
                setIsMenuOpen(false);
                }}
                className="text-gray-700 hover:text-rose-600 text-lg font-medium py-2 transition-colors duration-300"
            >
                {item.name}
            </a>
            ))}
            <div className="pt-2 flex space-x-4">
            <Link
                to="/login"
                className="flex-1 text-center px-5 py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300 hover-scale"
                onClick={() => setIsMenuOpen(false)}
            >
                Masuk
            </Link>
            <Link
                to="/register"
                className="flex-1 text-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 rounded-xl transition-colors duration-300 shadow-md hover-scale"
                onClick={() => setIsMenuOpen(false)}
            >
                Daftar
            </Link>
            </div>
        </div>
        </div>
    )}
    </nav>

        {/* Premium Modern Hero Section - Improved */}
        <section id="home" className="relative pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-32 overflow-hidden bg-gradient-to-br from-white to-purple-50">
        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden z-0">
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-100 rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-rose-100 rounded-full opacity-10 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-7 lg:space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Solusi Terbaik untuk Pemulihan Anda
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Fisioterapi <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-600">Premium</span><br />
                di Rumah Anda
                </h1>
                
                {/* Description */}
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Tim ahli kami memberikan perawatan personal dengan teknik terkini untuk mempercepat pemulihan Anda dalam kenyamanan rumah sendiri.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-1 max-w-md">
                {[
                    { 
                    label: "500+", 
                    description: "Pasien", 
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )
                    },
                    { 
                    label: "98%", 
                    description: "Kepuasan", 
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )
                    },
                    { 
                    label: "50+", 
                    description: "Terapis", 
                    icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    )
                    },
                ].map((stat, index) => (
                    <div
                    key={index}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col items-center text-center"
                    >
                    <div className="mb-2 p-2 bg-purple-50 rounded-full">
                        {stat.icon}
                    </div>
                    <p className="font-bold text-gray-900 text-xl">{stat.label}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                    </div>
                ))}
                </div>
            </div>

            {/* Image */}
            <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-[4/3] transform hover:scale-[1.01] transition-transform duration-500">
                <img
                    src="https://plus.unsplash.com/premium_photo-1663011088646-a32c7d125a67?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Fisioterapi di rumah"
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 border border-gray-100">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-gray-900">Terapis Bersertifikat</p>
                    <p className="text-xs text-gray-500">Bersertifikasi Nasional</p>
                </div>
                </div>
            </div>
            </div>
        </div>
        </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 observe">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-100 rounded-full mb-4">
              Keunggulan Kami
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Pengalaman Terapi yang Berbeda
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Kami memberikan pendekatan personal dan layanan profesional untuk hasil yang optimal.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Konsultasi Online",
                description: "Konsultasi nyaman dengan terapis profesional tanpa perlu keluar rumah.",
                color: "from-purple-100 to-purple-50"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: "Panduan Latihan",
                description: "Dapatkan program latihan personal dan video panduan untuk pemulihan optimal.",
                color: "from-rose-100 to-rose-50"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: "Kunjungan ke Rumah",
                description: "Terapis datang ke lokasi Anda dengan peralatan lengkap untuk kenyamanan maksimal.",
                color: "from-blue-100 to-blue-50"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Harga Terjangkau",
                description: "Layanan berkualitas dengan harga yang kompetitif dan transparan.",
                color: "from-amber-100 to-amber-50"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: "Terapis Bersertifikat",
                description: "Tenaga profesional dengan sertifikasi dan pengalaman luas di bidangnya.",
                color: "from-emerald-100 to-emerald-50"
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Fleksibel Waktu",
                description: "Jadwal sesi yang dapat disesuaikan dengan kebutuhan Anda.",
                color: "from-indigo-100 to-indigo-50"
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${feature.color} rounded-2xl border border-gray-100 p-8 shadow-sm hover-scale transition-all duration-300 observe`}
              >
                <div className={`bg-white w-16 h-16 rounded-xl flex items-center justify-center mb-6 shadow-md`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 observe">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-100 rounded-full mb-4">
              Layanan Kami
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Solusi Terapi untuk Kebutuhan Anda
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pilih layanan yang sesuai dengan kondisi Anda untuk hasil pemulihan yang optimal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div 
                key={service.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover-scale transition-all duration-300 observe cursor-pointer"
                onClick={() => setActiveService(service)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-block px-4 py-2 text-sm font-semibold text-white bg-rose-600 bg-opacity-50 rounded-full">
                      {service.price} / sesi
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-r from-rose-100 to-purple-100 p-3 rounded-lg text-rose-600 mr-4">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-rose-600 mb-3">Yang termasuk:</h4>
                    <ul className="space-y-3">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <svg className="w-5 h-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button className="w-full py-3 px-4 bg-rose-500 text-white font-medium rounded-xl shadow-sm hover-scale transition-all duration-300">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Modal */}
      {activeService && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setActiveService(null)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <button
                  onClick={() => setActiveService(null)}
                  className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center mb-4">
                  <div className="bg-gradient-to-r from-rose-100 to-purple-100 p-3 rounded-lg text-rose-600 mr-4">
                    {activeService.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{activeService.title}</h3>
                    <p className="text-rose-600 font-medium">{activeService.price} / sesi</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">{activeService.description}</p>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-rose-600 mb-3">Yang termasuk:</h4>
                  <ul className="space-y-3">
                    {activeService.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-5 h-5 text-rose-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setActiveService(null)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                  >
                    Tutup
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-sm hover-scale transition-all duration-300">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 observe">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-100 rounded-full mb-4">
              Proses Mudah
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Cara Kerja TerapiCare</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hanya dalam 4 langkah sederhana, Anda bisa mendapatkan layanan fisioterapi profesional.
            </p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-purple-600 transform -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Pesan Layanan",
                  description: "Pilih jenis layanan dan jadwal yang sesuai melalui website atau aplikasi kami.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  ),
                },
                {
                  step: "2",
                  title: "Konfirmasi Booking",
                  description: "Tim kami akan menghubungi Anda untuk mengkonfirmasi detail pemesanan.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ),
                },
                {
                  step: "3",
                  title: "Sesi Terapi",
                  description: "Terapis akan datang ke lokasi Anda atau melakukan konsultasi online sesuai jadwal.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  ),
                },
                {
                  step: "4",
                  title: "Evaluasi & Tindak Lanjut",
                  description: "Dapatkan laporan perkembangan dan rekomendasi untuk sesi berikutnya.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover-scale transition-all duration-300 observe relative z-10"
                >
                  <div className="w-16 h-16 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                    {step.step}
                  </div>
                  <div className="bg-gradient-to-r from-rose-100 to-purple-100 p-4 rounded-xl text-rose-600 mb-6 w-16 h-16 mx-auto flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-center">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 observe">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-100 rounded-full mb-4">
              Artikel Terbaru
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Blog & Tips Kesehatan</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Temukan artikel bermanfaat tentang kesehatan, fisioterapi, dan tips hidup sehat.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover-scale transition-all duration-300 observe cursor-pointer"
                onClick={() => setActiveBlog(post)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 text-rose-600 text-xs font-semibold px-3 py-1 rounded-full">
                    {post.date}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>
                  <button className="text-rose-600 font-medium flex items-center group">
                    Baca Selengkapnya
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Modal */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto animate-fade">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setActiveBlog(null)}>
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="relative h-64 w-full overflow-hidden">
                <img
                  src={activeBlog.image}
                  alt={activeBlog.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveBlog(null)}
                  className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors duration-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="px-6 pt-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{activeBlog.title}</h3>
                    <p className="text-gray-500 text-sm">{activeBlog.date}</p>
                  </div>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="leading-relaxed">{activeBlog.content}</p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setActiveBlog(null)}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-lg hover:from-rose-600 hover:to-purple-700 transition-colors duration-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 observe">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-100 rounded-full mb-4">
              Testimoni
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Apa Kata Pasien Kami?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dengarkan pengalaman langsung dari mereka yang telah menggunakan layanan TerapiCare.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Budi Santoso",
                role: "Pegawai Kantoran",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 5,
                comment: "Setelah 3 sesi terapi di rumah, nyeri punggung saya berkurang drastis. Terapisnya sangat profesional dan ramah.",
              },
              {
                name: "Ani Wijaya",
                role: "Ibu Rumah Tangga",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                rating: 5,
                comment: "Konsultasi online sangat membantu saat saya tidak bisa keluar rumah. Panduan latihannya mudah diikuti.",
              },
              {
                name: "Citra Dewi",
                role: "Atlet Bulutangkis",
                avatar: "https://randomuser.me/api/portraits/women/68.jpg",
                rating: 5,
                comment: "Pemulihan cedera lutut saya lebih cepat berkat program latihan dari TerapiCare. Sangat direkomendasikan!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover-scale transition-all duration-300 observe"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic leading-relaxed">"{testimonial.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 observe">
            <span className="inline-block px-4 py-2 text-sm font-semibold text-rose-400 bg-rose-900/30 rounded-full mb-4">
              Hubungi Kami
            </span>
            <h2 className="text-4xl font-extrabold text-white mb-4">Kami Siap Membantu Anda</h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Punya pertanyaan atau ingin tahu lebih banyak tentang layanan kami? Kirim pesan atau hubungi kami langsung.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 shadow-sm hover-scale transition-all duration-300 observe glass-effect">
              <h3 className="text-2xl font-bold text-white mb-6">Kirim Pesan</h3>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white focus:border-rose-500 focus:ring-2 focus:ring-rose-900 transition-all duration-300"
                    placeholder="Nama Anda"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white focus:border-rose-500 focus:ring-2 focus:ring-rose-900 transition-all duration-300"
                    placeholder="email@contoh.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700/50 text-white focus:border-rose-500 focus:ring-2 focus:ring-rose-900 transition-all duration-300"
                    placeholder="Tulis pesan Anda..."
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-sm hover-scale transition-all duration-300"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
            <div className="space-y-8">
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 overflow-hidden shadow-sm hover-scale transition-all duration-300 observe glass-effect">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613506864!3d-6.194741395493371!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f5390917b759%3A0x6b45e67356080477!2sMonumen%20Nasional!5e0!3m2!1sen!2sid!4v1623393087706!5m2!1sen!2sid"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                  title="Peta Lokasi TerapiCare"
                ></iframe>
              </div>
              <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 shadow-sm hover-scale transition-all duration-300 observe glass-effect">
                <h3 className="text-xl font-bold text-white mb-6">Informasi Kontak</h3>
                <div className="space-y-6">
                  {[
                    {
                      icon: (
                        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      ),
                      title: "Alamat",
                      content: "Jl. Kesehatan No. 123, Jakarta Pusat, DKI Jakarta 10110",
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      ),
                      title: "Telepon",
                      content: "(021) 1234-5678",
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      ),
                      title: "Email",
                      content: "info@terapicare.com",
                    },
                    {
                      icon: (
                        <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      title: "Jam Operasional",
                      content: "Senin-Minggu, 08:00 - 20:00 WIB",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 mr-4 mt-1">{item.icon}</div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{item.title}</h4>
                        <p className="text-gray-300 leading-relaxed">{item.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="observe">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-rose-400 to-purple-400 text-gradient">
                  TerapiCare
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Solusi fisioterapi profesional untuk membantu Anda kembali aktif dan bebas nyeri, di rumah atau online.
              </p>
            </div>
            <div className="observe">
              <h3 className="text-lg font-semibold text-white mb-4">Layanan</h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      to="#services"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                      onClick={() => setActiveService(service)}
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="observe">
              <h3 className="text-lg font-semibold text-white mb-4">Perusahaan</h3>
              <ul className="space-y-3">
                {["Tentang Kami", "Tim Terapis", "Blog", "Karir"].map((item, index) => (
                  <li key={index}>
                    <Link
                      to="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="observe">
              <h3 className="text-lg font-semibold text-white mb-4">Hubungi Kami</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (021) 1234-5678
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  info@terapicare.com
                </li>
              </ul>
              <div className="flex space-x-4 mt-6">
                {[
                  {
                    href: "#",
                    icon: (
                      <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    ),
                  },
                  {
                    href: "#",
                    icon: (
                      <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.708.87 3.215 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />
                      </svg>
                    ),
                  },
                  {
                    href: "#",
                    icon: (
                      <svg className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.982-6.98.058-1.281.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.948-.2-4.354-2.618-6.782-6.983-6.982-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                ].map((social, index) => (
                  <Link
                    key={index}
                    to={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 observe">
            <p>© {new Date().getFullYear()} TerapiCare. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
              <Link to="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Kebijakan Privasi
              </Link>
              <Link to="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TerapiCare;