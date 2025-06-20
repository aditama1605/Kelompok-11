import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import Loading from "../components/Loading";
import PdfModal from "./PdfModal";
import TherapyAI from "./ai";

const API_URL = "http://localhost:8000/api";
const STORAGE_URL = "http://localhost:8000/storage/";

// Progress Update Modal Component (unchanged)
const ProgressModal = ({ isOpen, onClose, onSubmit, laporanPasienId, showToast }) => {
  const [ringkasanPerkembangan, setRingkasanPerkembangan] = useState("");
  const [filePerkembangan, setFilePerkembangan] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const token = localStorage.getItem("token");

  if (!isOpen) return null;

  const validateProgressForm = () => {
    const errors = {};
    if (!ringkasanPerkembangan.trim()) errors.ringkasanPerkembangan = "Ringkasan perkembangan tidak boleh kosong!";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProgressForm()) {
      showToast("warning", "Peringatan", "Harap lengkapi semua field yang diperlukan!");
      return;
    }

    const formData = new FormData();
    formData.append("laporan_pasiens_id_laporan_pasiens", laporanPasienId);
    formData.append("ringkasan_perkembangan", ringkasanPerkembangan);
    formData.append("tanggal_laporan", new Date().toISOString().split('T')[0]);

    try {
      await axios.post(`${API_URL}/laporan-perkembangan`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showToast("success", "Sukses", "Laporan perkembangan berhasil dikirim!");
      onSubmit();
      handleClose();
    } catch (error) {
      showToast("danger", "Error", "Gagal mengirim laporan perkembangan: " + (error.response?.data?.message || error.message));
    }
  };

  const handleClose = () => {
    setRingkasanPerkembangan("");
    setFilePerkembangan(null);
    setFormErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Update Perkembangan</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="ringkasanPerkembangan" className="block text-sm font-medium text-gray-700 mb-2">
              Ringkasan Perkembangan
            </label>
            <textarea
              id="ringkasanPerkembangan"
              value={ringkasanPerkembangan}
              onChange={(e) => setRingkasanPerkembangan(e.target.value)}
              placeholder="Jelaskan perkembangan Anda..."
              className={`w-full px-4 py-2 rounded-md border ${
                formErrors.ringkasanPerkembangan ? "border-red-500" : "border-gray-200"
              } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24`}
              aria-invalid={!!formErrors.ringkasanPerkembangan}
              aria-describedby="ringkasan-error"
            />
            {formErrors.ringkasanPerkembangan && (
              <p id="ringkasan-error" className="mt-1 text-sm text-red-500">
                {formErrors.ringkasanPerkembangan}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
              aria-label="Batal"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
              aria-label="Kirim Update"
            >
              Kirim Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DashboardPasien = () => {
  const navigate = useNavigate();
  const [nama, setNama] = useState(localStorage.getItem("nama") || "Pasien");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("iduser");
  const userRole = localStorage.getItem("role");
  const [activeTab, setActiveTab] = useState("terapis");
  const [terapisList, setTerapisList] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTerapis, setSelectedTerapis] = useState("");
  const [jadwal, setJadwal] = useState("");
  const [alamat, setAlamat] = useState("");
  const [jenisLayanan, setJenisLayanan] = useState("Home Visit");
  const [buktiPembayaran, setBuktiPembayaran] = useState(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatPartner, setSelectedChatPartner] = useState(null);
  const [chatPartners, setChatPartners] = useState([]);
  const [availableTerapisForChat, setAvailableTerapisForChat] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newName, setNewName] = useState(nama);
  const [formErrors, setFormErrors] = useState({});
  const [laporanPasienList, setLaporanPasienList] = useState([]);
  const [laporanPerkembanganList, setLaporanPerkembanganList] = useState([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfTitle, setPdfTitle] = useState("");
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedLaporanPasienIdForProgress, setSelectedLaporanPasienIdForProgress] = useState(null);
  const [isTabLoading, setIsTabLoading] = useState(false); // New state for tab loading

  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [{ id, type, title, message }, ...prev]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    localStorage.removeItem("iduser");
    showToast("success", "Logout", "Anda telah keluar dari akun.");
    setTimeout(() => navigate("/login"), 1000);
  };

  // Refactored fetchData to fetch tab-specific data
  const fetchData = async (tab) => {
    setIsTabLoading(true); // Show loading animation
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let promises = [];

      if (tab === "terapis") {
        promises.push(axios.get(`${API_URL}/terapis`, { headers }));
      } else if (tab === "jadwal") {
        promises.push(axios.get(`${API_URL}/jadwal-terapi`, { headers }));
        promises.push(axios.get(`${API_URL}/laporan-pasien`, { headers }));
        promises.push(axios.get(`${API_URL}/laporan-perkembangan`, { headers }));
        promises.push(axios.get(`${API_URL}/terapis`, { headers })); // Needed for terapis names
      } else if (tab === "pesan") {
        promises.push(axios.get(`${API_URL}/chat/partners`, { headers }));
        promises.push(axios.get(`${API_URL}/chat/terapis`, { headers }));
      } else if (tab === "terapy-ai") {
        // No API calls needed for TherapyAI tab (static component)
      }

      // Always fetch user profile for consistency
      promises.push(axios.get(`${API_URL}/users/${userId}`, { headers }));

      const responses = await Promise.all(promises);

      // Process responses based on tab
      let responseIndex = 0;
      if (tab === "terapis") {
        setTerapisList(responses[0].data.data);
        responseIndex = 1;
      } else if (tab === "jadwal") {
        setJadwalList(responses[0].data.data.filter((jwl) => jwl.user_id == userId));
        setLaporanPasienList(responses[1].data.data || []);
        const userLaporanPerkembangan = (responses[2].data.data || []).filter(
          (lp) => lp.laporan_pasien && lp.laporan_pasien.jadwal_terapi && lp.laporan_pasien.jadwal_terapi.user_id == userId
        );
        setLaporanPerkembanganList(userLaporanPerkembangan);
        setTerapisList(responses[3].data.data);
        responseIndex = 4;
      } else if (tab === "pesan") {
        setChatPartners(responses[0].data.partners);
        setAvailableTerapisForChat(responses[1].data.terapis);
        responseIndex = 2;
      }

      // Set user profile (always the last response)
      setUserProfile(responses[responseIndex].data.data);
      setNewName(responses[responseIndex].data.data.nama);
    } catch (error) {
      showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message));
    } finally {
      setTimeout(() => setIsTabLoading(false), 300); // Delay to ensure smooth animation
    }
  };

  // Initial data fetch and authentication check
  useEffect(() => {
    if (token && userId) {
      fetchData(activeTab);
    } else {
      navigate("/login");
    }
  }, [token, userId, navigate]);

  // Fetch data when activeTab changes
  useEffect(() => {
    if (token && userId) {
      fetchData(activeTab);
    }
  }, [activeTab]);

  const validateForm = () => {
    const errors = {};
    if (!selectedTerapis) errors.selectedTerapis = "Silakan pilih terapis!";
    if (!jadwal) errors.jadwal = "Silakan pilih jadwal terapi!";
    if (jenisLayanan === "Home Visit" && !alamat.trim()) errors.alamat = "Silakan masukkan alamat!";
    if (!buktiPembayaran) errors.buktiPembayaran = "Silakan unggah bukti pembayaran!";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitJadwal = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("warning", "Peringatan", "Harap lengkapi semua field yang diperlukan!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("terapis_id", selectedTerapis);
      formData.append("user_id", userId);
      formData.append("jadwal_terapi", jadwal);
      formData.append("jenis_layanan", jenisLayanan);
      if (jenisLayanan === "Home Visit") formData.append("alamat", alamat);
      formData.append("bukti_pembayaran", buktiPembayaran);

      await axios.post(`${API_URL}/jadwal-terapi`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Sukses", "Jadwal terapi berhasil diajukan!");
      setSelectedTerapis("");
      setJadwal("");
      setAlamat("");
      setJenisLayanan("Home Visit");
      setBuktiPembayaran(null);
      setFormErrors({});
      setIsModalOpen(false);
      fetchData(activeTab); // Refresh data instead of reloading page
    } catch (error) {
      showToast("danger", "Error", "Gagal mengajukan jadwal terapi: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast("warning", "Peringatan", "Nama tidak boleh kosong!");
      return;
    }

    try {
      await axios.put(
        `${API_URL}/users/${userId}`,
        { nama: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNama(newName);
      localStorage.setItem("nama", newName);
      setUserProfile((prev) => ({ ...prev, nama: newName }));
      showToast("success", "Sukses", "Nama berhasil diperbarui!");
      setIsEditProfileOpen(false);
    } catch (error) {
      showToast("danger", "Error", "Gagal memperbarui nama: " + (error.response?.data?.message || error.message));
    }
  };

  const openChat = (partner) => {
    setSelectedChatPartner({ id: partner.id, name: partner.name, role: partner.role, email: partner.email });
    setIsChatModalOpen(true);
  };

  const closeChat = () => {
    setIsChatModalOpen(false);
    setSelectedChatPartner(null);
  };

  const openModal = (terapisId) => {
    setSelectedTerapis(terapisId || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTerapis("");
    setJadwal("");
    setAlamat("");
    setJenisLayanan("Home Visit");
    setBuktiPembayaran(null);
    setFormErrors({});
  };

  const getPhotoUrl = (foto) => (foto ? `${STORAGE_URL}${foto}` : "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg");
  const getBuktiPembayaranUrl = (path) => (path ? `${STORAGE_URL}${path}` : "#");

  const handleOpenPdfModal = (fileIdentifier, title) => {
    const encodedFileIdentifier = encodeURIComponent(fileIdentifier);
    setPdfUrl(`${STORAGE_URL}panduan_latihan/${encodedFileIdentifier}`);
    setPdfTitle(title);
    setIsPdfModalOpen(true);
  };

  const handleClosePdfModal = () => {
    setIsPdfModalOpen(false);
    setPdfUrl("");
    setPdfTitle("");
  };

  const handleOpenProgressModal = (laporanPasienId) => {
    setSelectedLaporanPasienIdForProgress(laporanPasienId);
    setIsProgressModalOpen(true);
  };

  const handleCloseProgressModal = () => {
    setIsProgressModalOpen(false);
    setSelectedLaporanPasienIdForProgress(null);
  };

  const handleProgressSubmitted = () => {
    fetchData(activeTab); // Refresh data after progress submission
  };

  // Handle tab change with animation
  const handleTabChange = (tab) => {
    setIsTabLoading(true);
    setActiveTab(tab);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      {/* Sidebar */}
      <input type="checkbox" id="menu-toggle" className="hidden peer" />
      <div className="hidden peer-checked:flex md:flex flex-col w-64 bg-white border-r border-gray-300 transition-all duration-300 ease-in-out shadow-sm">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-300 px-4">
          <span className="text-gray-900 text-xl font-bold">
            Terapy<span className="text-rose-600">Care</span>
          </span>
          <label htmlFor="menu-toggle" className="text-gray-600 cursor-pointer md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </label>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-3 py-4">
            {["terapis", "jadwal", "pesan", "terapy-ai"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)} // Use handleTabChange
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium ${
                  activeTab === tab ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600" : "border-l-4 border-transparent"
                }`}
                aria-current={activeTab === tab ? "page" : undefined}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  {tab === "terapis" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                  )}
                  {tab === "jadwal" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
                    />
                  )}
                  {tab === "pesan" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.582 9 8z"
                    />
                  )}
                  {tab === "terapy-ai" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  )}
                </svg>
                {tab === "terapy-ai" ? "Terapy AI" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
          <div className="flex items-center">
            <label
              htmlFor="menu-toggle"
              className="md:hidden mr-4 bg-rose-600 text-white p-2 rounded focus:outline-none cursor-pointer"
              aria-label="Toggle sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 mr-2 text-gray-600"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <input
              className="mx-2 w-full max-w-xs border rounded-md px-4 py-2 text-sm focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
              type="text"
              placeholder="Cari..."
              aria-label="Search"
            />
          </div>
          <div className="relative">
            <img
              src={userProfile?.foto ? getPhotoUrl(userProfile.foto) : "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onError={(e) => {
                e.target.src = "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg";
              }}
              aria-label="Toggle profile dropdown"
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <p className="px-4 py-2 text-sm text-gray-700 font-medium">{nama}</p>
                  <button
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition"
                    aria-label="Edit profile"
                  >
                    Edit Profil
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Loading Overlay */}
            {isTabLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <Loading />
              </div>
            )}
            {/* Content with Animation */}
            <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
              {activeTab === "terapy-ai" && <TherapyAI />}
              {activeTab === "terapis" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Daftar Terapis</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {terapisList.map((terapis) => (
                      <div
                        key={terapis.id_terapis}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col"
                      >
                        <div className="relative">
                          <img
                            src={getPhotoUrl(terapis.foto)}
                            alt={terapis.user?.nama || terapis.nama || "Terapis"}
                            className="w-full h-72 object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80";
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                            <div className="flex justify-between items-end">
                              <div>
                                <h3 className="text-white font-bold text-xl">
                                  {terapis.user?.nama || terapis.nama || "Tidak Diketahui"}
                                </h3>
                                <p className="text-rose-300 font-medium">
                                  {terapis.spesialisasi || "Terapis Umum"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 flex-grow">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex-1 border-t border-gray-200"></div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5 text-rose-500"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                              <path
                                d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"
                              />
                            </svg>
                            <div className="flex-1 border-t border-gray-200"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">Jakarta</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span className="text-sm text-gray-600">Tersedia</span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm mb-5 line-clamp-3">
                            {terapis.bio || "Terapis profesional dengan pengalaman luas dalam menangani berbagai kondisi kesehatan."}
                          </p>
                        </div>
                        <div className="px-5 pb-5">
                          <button
                            onClick={() => openModal(terapis.id_terapis)}
                            className="w-full bg-gradient-to-r from-rose-600 to-rose-500 text-white font-medium py-3 rounded-lg hover:from-rose-700 hover:to-rose-600 transition-all flex items-center justify-center gap-2"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Buat Janji
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "jadwal" && (
                <div>
                  {jadwalList.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Jadwal Terapi</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola jadwal terapi Anda di sini.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terapis</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Layanan</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keluhan Terapis</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Panduan</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Perkembangan</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {jadwalList.map((jadwalItem) => {
                              const terapis = terapisList.find((t) => t.id_terapis == jadwalItem.terapis_id);
                              const laporanPasien = laporanPasienList.find(
                                (lp) => lp.jadwal_terapi_id_jadwal_terapi === jadwalItem.id_jadwal_terapi
                              );
                              const perkembanganSubmitted = laporanPasien ? laporanPerkembanganList.find(
                                (l_perk) => l_perk.laporan_pasiens_id_laporan_pasiens === laporanPasien.id_laporan_pasien
                              ) : null;

                              return (
                                <tr key={jadwalItem.id_jadwal_terapi} className="hover:bg-gray-50 transition-colors duration-150">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{terapis?.user?.nama || terapis?.nama || "Tidak Diketahui"}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {new Date(jadwalItem.jadwal_terapi).toLocaleString("id-ID", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{jadwalItem.jenis_layanan}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {jadwalItem.jenis_layanan === "Home Visit" ? jadwalItem.alamat || "-" : "-"}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      Rp {parseFloat(jadwalItem.nominal_payment).toLocaleString("id-ID")}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {jadwalItem.bukti_pembayaran ? (
                                      <a
                                        href={getBuktiPembayaranUrl(jadwalItem.bukti_pembayaran)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-rose-600 hover:text-rose-700 text-sm"
                                        aria-label="Lihat bukti pembayaran"
                                      >
                                        Lihat
                                      </a>
                                    ) : (
                                      <span className="text-sm text-gray-500">Tidak Ada</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                        jadwalItem.status === "Diterima"
                                          ? "bg-green-100 text-green-800"
                                          : jadwalItem.status === "Ditolak"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {jadwalItem.status || "Menunggu Konfirmasi"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">
                                      {laporanPasien ? (
                                        laporanPasien.keluhan_pasien || <span className="text-gray-400 italic">Tidak ada keluhan</span>
                                      ) : (
                                        <span className="text-gray-400 italic">Belum ada catatan</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {laporanPasien && laporanPasien.panduan_latihan && laporanPasien.panduan_latihan.file_latihan ? (
                                      <button
                                        onClick={() => handleOpenPdfModal(laporanPasien.panduan_latihan.file_latihan, `Panduan: ${laporanPasien.panduan_latihan.nama_latihan}`)}
                                        className="px-3 py-1.5 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 transition"
                                        aria-label={`Lihat panduan ${laporanPasien.panduan_latihan.nama_latihan}`}
                                      >
                                        Lihat Panduan
                                      </button>
                                    ) : (
                                      <span className="text-sm text-gray-400 italic">Tidak ada</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {laporanPasien ? (
                                      perkembanganSubmitted ? (
                                        <button
                                          className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md transition cursor-default"
                                          disabled
                                          aria-label="Perkembangan sudah dikirim"
                                        >
                                          Terkirim
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleOpenProgressModal(laporanPasien.id_laporan_pasien)}
                                          className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                                          aria-label="Update perkembangan"
                                        >
                                          Update
                                        </button>
                                      )
                                    ) : (
                                      <span className="text-sm text-gray-400 italic">-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-white px-6 py-4 border-t border-gray-200">
                        <div className="flex items-center justify-between flex-col sm:flex-row">
                          <div className="mb-2 sm:mb-0">
                            <p className="text-sm text-gray-700">
                              Menampilkan <span className="font-medium">1</span> sampai{" "}
                              <span className="font-medium">{jadwalList.length}</span> dari{" "}
                              <span className="font-medium">{jadwalList.length}</span> hasil
                            </p>
                          </div>
                          <div>
                            <nav
                              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                              aria-label="Pagination"
                            >
                              <a
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                aria-label="Previous page"
                              >
                                <span className="sr-only">Previous</span>
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-rose-50 text-sm font-medium text-rose-600 hover:bg-rose-100"
                                aria-current="page"
                              >
                                1
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                aria-label="Next page"
                              >
                                <span className="sr-only">Next</span>
                                <svg
                                  className="h-5 w-5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p>
                  )}
                </div>
              )}
              {activeTab === "pesan" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesan</h2>
                  <div className="space-y-4" role="list" aria-label="Daftar kontak untuk chat">
                    {[...availableTerapisForChat, ...chatPartners].length > 0 ? (
                      [...availableTerapisForChat, ...chatPartners]
                        .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
                        .map((partner) => (
                          <div
                            key={partner.id}
                            className="flex items-center justify-between border-b border-gray-100 py-3 cursor-pointer hover:bg-gray-50 p-4 rounded-md transition"
                            onClick={() => openChat(partner)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                openChat(partner);
                              }
                            }}
                            aria-label={`Buka chat dengan ${partner.name || "Pengguna"}`}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                <span className="text-rose-600 font-medium text-lg">
                                  {partner.name?.charAt(0) || "?"}
                                </span>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-base font-medium text-gray-900">{partner.name || "Tidak diketahui"}</h4>
                                <p className="text-sm text-gray-500">{partner.specialization || "Tidak ada spesialisasi"}</p>
                              </div>
                            </div>
                            <div className="ml-4 px-3 py-1 text-sm text-rose-500 font-medium">
                              {chatPartners.some((p) => p.id === partner.id) ? "Buka Chat →" : "Mulai Chat →"}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">Belum ada terapis yang dapat dihubungi.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Toast Notifications */}
            <div
              className="fixed top-4 right-4 z-50 space-y-2 w-72"
              aria-live="polite"
              aria-atomic="true"
            >
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`flex items-start p-3 rounded-lg border shadow-sm animate-fade-in ${
                    toast.type === "success"
                      ? "bg-green-50 border-green-100"
                      : toast.type === "danger"
                      ? "bg-red-50 border-red-100"
                      : "bg-yellow-50 border-yellow-100"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {toast.type === "success" && (
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {toast.type === "danger" && (
                      <svg
                        className="w-4 h-4 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {toast.type === "warning" && (
                      <svg
                        className="w-4 h-4 text-yellow-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="ml-2">
                    <h3
                      className={`text-sm font-medium ${
                        toast.type === "success"
                          ? "text-green-800"
                          : toast.type === "danger"
                          ? "text-red-800"
                          : "text-yellow-800"
                      }`}
                    >
                      {toast.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        toast.type === "success"
                          ? "text-green-600"
                          : toast.type === "danger"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {toast.message}
                    </p>
                  </div>
                  <button
                    className={`ml-auto ${
                      toast.type === "success"
                        ? "text-green-400 hover:text-green-500"
                        : toast.type === "danger"
                        ? "text-red-400 hover:text-red-500"
                        : "text-yellow-400 hover:text-yellow-500"
                    }`}
                    onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                    aria-label="Tutup notifikasi"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden" style={{ maxHeight: '95vh' }}>
              <div className="bg-gradient-to-b from-rose-600 to-rose-500 p-6 text-white md:w-2/5 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold">Ajukan Jadwal Terapi</h3>
                    <p className="text-rose-100 mt-1 text-sm">Lengkapi formulir untuk membuat janji terapi</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-white hover:text-rose-200 transition p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="bg-white/10 p-5 rounded-lg backdrop-blur-sm border border-white/20 mt-6">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <h4 className="font-medium">Total Pembayaran</h4>
                    <span className="font-bold text-xl">
                      {jenisLayanan === "Home Visit" ? "Rp 200.000" : "Rp 30.000"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h5 className="text-sm font-medium mb-3">Transfer ke rekening:</h5>
                    <div className="space-y-3">
                      <div className="bg-white/10 p-3 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold">BCA</span>
                          </div>
                          <p className="font-medium">Bank Central Asia</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-rose-100 text-xs mb-1">No. Rekening</p>
                            <p className="font-mono tracking-wider">123 456 7890</p>
                          </div>
                          <div>
                            <p className="text-rose-100 text-xs mb-1">Atas Nama</p>
                            <p className="font-medium">Klinik Sehat Terapi</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 p-3 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-xs font-bold">BRI</span>
                          </div>
                          <p className="font-medium">Bank Rakyat Indonesia</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-rose-100 text-xs mb-1">No. Rekening</p>
                            <p className="font-mono tracking-wider">987 654 3210</p>
                          </div>
                          <div>
                            <p className="text-rose-100 text-xs mb-1">Atas Nama</p>
                            <p className="font-medium">Klinik Sehat Terapi</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 md:w-3/5 overflow-y-auto">
                <form onSubmit={handleSubmitJadwal} className="space-y-5" encType="multipart/form-data">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Terapis</label>
                    <select
                      value={selectedTerapis}
                      onChange={(e) => setSelectedTerapis(e.target.value)}
                      className={`block w-full px-4 py-2.5 rounded-lg border ${formErrors.selectedTerapis ? "border-red-500" : "border-gray-300"} bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm`}
                    >
                      <option value="">Pilih Terapis</option>
                      {terapisList.map((terapis) => (
                        <option key={terapis.id_terapis} value={terapis.id_terapis}>
                          {terapis.user?.nama || terapis.nama || "Tidak Diketahui"} ({terapis.spesialisasi || "Dokter Umum"})
                        </option>
                      ))}
                    </select>
                    {formErrors.selectedTerapis && (
                      <p className="mt-1.5 text-sm text-red-600">{formErrors.selectedTerapis}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jadwal Terapi</label>
                      <input
                        type="datetime-local"
                        value={jadwal}
                        onChange={(e) => {
                          const selectedDateTime = new Date(e.target.value);
                          const hours = selectedDateTime.getHours();
                          if (hours >= 8 && hours < 15) {
                            setJadwal(e.target.value);
                            setFormErrors({ ...formErrors, jadwal: "" });
                          } else {
                            setFormErrors({
                              ...formErrors,
                              jadwal: "Jadwal harus antara pukul 08:00 dan 15:00",
                            });
                          }
                        }}
                        min={new Date().toISOString().slice(0, 16)}
                        className={`block w-full px-4 py-2.5 rounded-lg border ${formErrors.jadwal ? "border-red-500" : "border-gray-300"} bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm`}
                        required
                      />
                      {formErrors.jadwal && (
                        <p className="mt-1.5 text-sm text-red-600">{formErrors.jadwal}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Jenis Layanan</label>
                      <select
                        value={jenisLayanan}
                        onChange={(e) => setJenisLayanan(e.target.value)}
                        className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm"
                      >
                        <option value="Home Visit">Home Visit (Rp 200.000)</option>
                        <option value="Online">Online (Rp 30.000)</option>
                      </select>
                    </div>
                  </div>
                  {jenisLayanan === "Home Visit" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Kunjungan</label>
                      <textarea
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        placeholder="Masukkan alamat lengkap"
                        className={`block w-full px-4 py-2.5 rounded-lg border ${formErrors.alamat ? "border-red-500" : "border-gray-300"} bg-white shadow-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm min-h-[100px]`}
                        required
                      />
                      {formErrors.alamat && (
                        <p className="mt-1.5 text-sm text-red-600">{formErrors.alamat}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bukti Pembayaran</label>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <label className="flex-1 cursor-pointer">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-rose-300 transition-all duration-200">
                          <div className="flex flex-col items-center justify-center">
                            <svg className="h-10 w-10 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium text-rose-600">Klik untuk upload</span> atau drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (maks. 2MB)</p>
                          </div>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*,.pdf"
                            onChange={(e) => setBuktiPembayaran(e.target.files[0])}
                          />
                        </div>
                      </label>
                      {buktiPembayaran && (
                        <div className="flex-1">
                          <div className="border border-gray-200 rounded-lg p-4 h-full">
                            <p className="text-sm font-medium text-gray-700 mb-3">File terpilih:</p>
                            <div className="flex items-center gap-4">
                              {buktiPembayaran.type.startsWith("image/") ? (
                                <img
                                  src={URL.createObjectURL(buktiPembayaran)}
                                  alt="Preview bukti pembayaran"
                                  className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                                />
                              ) : (
                                <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate">{buktiPembayaran.name}</p>
                                <p className="text-xs text-gray-500 mt-1">{Math.round(buktiPembayaran.size / 1024)} KB</p>
                                <button
                                  type="button"
                                  onClick={() => setBuktiPembayaran(null)}
                                  className="text-xs text-rose-600 hover:text-rose-800 mt-2"
                                >
                                  Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    {formErrors.buktiPembayaran && (
                      <p className="mt-1.5 text-sm text-red-600">{formErrors.buktiPembayaran}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition-colors"
                    >
                      Ajukan Jadwal
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        {isEditProfileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profil</h3>
              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Masukkan nama baru"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                    required
                    aria-label="Nama"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProfileOpen(false);
                      setNewName(nama);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    aria-label="Batal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                    aria-label="Simpan profil"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={closeChat}
          currentUserId={parseInt(userId)}
          currentUserRole={userRole}
          chatPartner={selectedChatPartner}
          token={token}
          showToast={showToast}
        />
        <PdfModal
          isOpen={isPdfModalOpen}
          onClose={handleClosePdfModal}
          pdfUrl={pdfUrl}
          title={pdfTitle}
        />
        <ProgressModal
          isOpen={isProgressModalOpen}
          onClose={handleCloseProgressModal}
          onSubmit={handleProgressSubmitted}
          laporanPasienId={selectedLaporanPasienIdForProgress}
          showToast={showToast}
        />
      </div>
    </div>
  );
};

export default DashboardPasien;