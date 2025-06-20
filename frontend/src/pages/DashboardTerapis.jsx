import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import Loading from "../components/Loading"; // Import the Loading component

const API_URL = "http://localhost:8000/api";
const STORAGE_URL = "http://localhost:8000/storage/";
const STORAGE_URL_PDF = "http://localhost:8000";

const DashboardTerapis = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("iduser");
  const userRole = localStorage.getItem("role");
  const [nama, setNama] = useState(localStorage.getItem("nama") || "Terapis");
  const [terapisData, setTerapisData] = useState(null);
  const [jadwalList, setJadwalList] = useState([]);
  const [panduanList, setPanduanList] = useState([]);
  const [laporanPerkembanganList, setLaporanPerkembanganList] = useState([]);
  const [laporanPasienList, setLaporanPasienList] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState("jadwal");
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedChatPartner, setSelectedChatPartner] = useState(null);
  const [chatPartners, setChatPartners] = useState([]);
  const [availablePatientsForChat, setAvailablePatientsForChat] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [newName, setNewName] = useState(nama);
  const [newSpesialisasi, setNewSpesialisasi] = useState("");
  const [newFoto, setNewFoto] = useState(null);
  const [isKeluhanModalOpen, setIsKeluhanModalOpen] = useState(false);
  const [isPanduanFormOpen, setIsPanduanFormOpen] = useState(false);
  const [selectedJadwalId, setSelectedJadwalId] = useState(null);
  const [keluhan, setKeluhan] = useState("");
  const [selectedPanduanId, setSelectedPanduanId] = useState("");
  const [namaLatihan, setNamaLatihan] = useState("");
  const [deskripsiLatihan, setDeskripsiLatihan] = useState("");
  const [fileLatihan, setFileLatihan] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [isTabLoading, setIsTabLoading] = useState(false); // New state for tab loading

  const showToast = (type, title, message) => {
    const id = Date.now();
    setToasts((prev) => [{ id, type, title, message }, ...prev]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    localStorage.removeItem("iduser");
    showToast("success", "Logout", "Anda telah keluar dari akun.");
    setTimeout(() => navigate("/login"), 1000);
  };

  const ImageModal = ({ isOpen, onClose, imageUrl, description }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
        <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-4 shadow-lg flex flex-col items-center">
          <button
            onClick={onClose}
            className="self-end text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Tutup modal"
          >
            ×
          </button>
          <img
            src={imageUrl}
            alt="Laporan Perkembangan"
            className="max-w-full h-auto mb-4 rounded shadow"
            onError={(e) => {
              e.target.src = "https://picsum.photos/150";
            }}
          />
          <p className="text-sm text-gray-700 text-center">{description}</p>
        </div>
      </div>
    );
  };

  const handleOpenImageModal = (fileName, ringkasan) => {
    setSelectedImageUrl(`${STORAGE_URL}laporan_perkembangan/${fileName}`);
    setSelectedDescription(ringkasan);
    setIsImageModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImageUrl("");
    setSelectedDescription("");
  };

  // Refactored fetchData to fetch tab-specific data
  const fetchData = async (tab) => {
    setIsTabLoading(true); // Show loading animation
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let promises = [];

      // Fetch terapis data for all tabs to ensure profile info is available
      promises.push(axios.get(`${API_URL}/terapis`, { headers }));

      if (tab === "jadwal") {
        promises.push(axios.get(`${API_URL}/jadwal-terapi`, { headers }));
        promises.push(axios.get(`${API_URL}/laporan-pasien`, { headers }));
        promises.push(axios.get(`${API_URL}/laporan-perkembangan`, { headers }));
      } else if (tab === "panduan") {
        promises.push(axios.get(`${API_URL}/panduan-latihan`, { headers }));
      } else if (tab === "pesan") {
        promises.push(axios.get(`${API_URL}/chat/partners`, { headers }));
        promises.push(axios.get(`${API_URL}/chat/patients`, { headers }));
      }

      const responses = await Promise.all(promises);

      // Process terapis data (always the first response)
      const terapis = responses[0].data.data.find((t) => t.iduser == userId);
      if (terapis) {
        setTerapisData(terapis);
        setNewName(terapis.user?.nama || terapis.nama || "Terapis");
        setNewSpesialisasi(terapis.spesialisasi || "");
      } else {
        showToast("danger", "Error", "Data terapis tidak ditemukan");
      }

      // Process tab-specific data
      let responseIndex = 1;
      if (tab === "jadwal") {
        setJadwalList(responses[1].data.data.filter((jadwal) => jadwal.terapis_id == terapis?.id_terapis));
        setLaporanPasienList(responses[2].data.data || []);
        setLaporanPerkembanganList(responses[3].data.data || []);
        responseIndex = 4;
      } else if (tab === "panduan") {
        setPanduanList(responses[1].data.data || []);
        responseIndex = 2;
      } else if (tab === "pesan") {
        setChatPartners(responses[1].data.partners || []);
        setAvailablePatientsForChat(responses[2].data.patients || []);
        responseIndex = 3;
      }
    } catch (error) {
      console.error("Fetch Data Error:", error);
      showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message));
    } finally {
      setTimeout(() => setIsTabLoading(false), 300); // Delay for smooth animation
    }
  };

  // Initial data fetch and authentication check
  useEffect(() => {
    if (token && userId) {
      fetchData(activeTab);
    } else {
      showToast("danger", "Error", "Token atau ID pengguna tidak ditemukan. Silakan login kembali.");
      navigate("/login");
    }
  }, [token, userId, navigate]);

  // Fetch data when activeTab changes
  useEffect(() => {
    if (token && userId) {
      fetchData(activeTab);
    }
  }, [activeTab]);

  const updateJadwalStatus = async (jadwalId, newStatus, user) => {
    try {
      await axios.put(
        `${API_URL}/jadwal-terapi/${jadwalId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("success", "Sukses", `Status jadwal berhasil diubah ke ${newStatus}`);
      if (newStatus === "Diterima" && user) {
        setSelectedChatPartner({
          id: user.iduser,
          name: user.nama,
          role: user.role,
          email: user.email,
        });
        setIsChatModalOpen(true);
      }
      fetchData(activeTab); // Refresh data instead of reloading page
    } catch (error) {
      showToast("danger", "Error", "Gagal mengubah status jadwal: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitKeluhan = async (e) => {
    e.preventDefault();
    if (!keluhan.trim() || !selectedPanduanId) {
      showToast("warning", "Peringatan", "Keluhan dan panduan tidak boleh kosong!");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/laporan-pasien`,
        {
          jadwal_terapi_id_jadwal_terapi: selectedJadwalId,
          keluhan_pasien: keluhan,
          panduan_latihan_id_panduan_latihan: selectedPanduanId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showToast("success", "Sukses", "Keluhan berhasil diajukan!");
      setIsKeluhanModalOpen(false);
      setKeluhan("");
      setSelectedPanduanId("");
      setSelectedJadwalId(null);
      fetchData(activeTab); // Refresh data
    } catch (error) {
      showToast("danger", "Error", "Gagal mengajukan keluhan: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitPanduanForm = async (e) => {
    e.preventDefault();
    if (!namaLatihan.trim() || !deskripsiLatihan.trim()) {
      showToast("warning", "Peringatan", "Nama latihan dan deskripsi tidak boleh kosong!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nama_latihan", namaLatihan);
      formData.append("deskripsi_latihan", deskripsiLatihan);
      formData.append("terapis_id_terapis", terapisData?.id_terapis);
      if (fileLatihan) formData.append("file_latihan", fileLatihan);

      await axios.post(`${API_URL}/panduan-latihan`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      showToast("success", "Sukses", "Panduan berhasil dibuat!");
      setIsPanduanFormOpen(false);
      setNamaLatihan("");
      setDeskripsiLatihan("");
      setFileLatihan(null);
      fetchData(activeTab); // Refresh data
    } catch (error) {
      showToast("danger", "Error", "Gagal membuat panduan: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      showToast("warning", "Peringatan", "Nama tidak boleh kosong!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nama", newName);
      formData.append("spesialisasi", newSpesialisasi);
      if (newFoto) formData.append("foto", newFoto);

      await axios.put(`${API_URL}/terapis/${terapisData?.id_terapis}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      setNama(newName);
      localStorage.setItem("nama", newName);
      setTerapisData((prev) => ({
        ...prev,
        user: { ...prev.user, nama: newName },
        spesialisasi: newSpesialisasi,
        foto: newFoto ? URL.createObjectURL(newFoto) : prev?.foto,
      }));
      showToast("success", "Sukses", "Profil berhasil diperbarui!");
      setIsEditProfileOpen(false);
      setNewFoto(null);
    } catch (error) {
      showToast("danger", "Error", "Gagal memperbarui profil: " + (error.response?.data?.message || error.message));
    }
  };

  const openChat = (partner) => {
    if (!partner || !partner.id) return;
    setSelectedChatPartner({
      id: partner.id,
      name: partner.name || partner.nama,
      role: partner.role,
      email: partner.email,
    });
    setIsChatModalOpen(true);
  };

  const closeChat = () => {
    setIsChatModalOpen(false);
    setSelectedChatPartner(null);
  };

  const getPhotoUrl = (foto) => (foto ? `${STORAGE_URL}${foto}` : "https://picsum.photos/150");
  const getBuktiPembayaranUrl = (path) => (path ? `${STORAGE_URL}${path}` : "#");

  // Handle tab change with animation
  const handleTabChange = (tab) => {
    setIsTabLoading(true);
    setActiveTab(tab);
  };

  if (!token || !userId) {
    navigate("/login");
    return null;
  }

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
            {["jadwal", "panduan", "pesan"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
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
                  {tab === "jadwal" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
                    />
                  )}
                  {tab === "panduan" && (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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
                </svg>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent"
              aria-label="Logout"
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
              src={terapisData?.foto ? getPhotoUrl(terapisData.foto) : "https://picsum.photos/150"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              onError={(e) => {
                e.target.src = "https://picsum.photos/150";
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
              {activeTab === "jadwal" && (
                <div>
                  {/* Statistics Cards for Jadwal */}
                  <div className="flex flex-wrap -mx-6 mb-8">
                    {/* Total Pasien Card */}
                    <div className="w-full px-6 sm:w-1/2 xl:w-1/4">
                      <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                        <div className="p-3 rounded-full bg-blue-600 bg-opacity-75">
                          <svg
                            className="h-8 w-8 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="mx-5">
                          <h4 className="text-2xl font-semibold text-gray-700">{jadwalList.length}</h4>
                          <div className="text-gray-500">Total Pasien</div>
                        </div>
                      </div>
                    </div>
                    {/* Pasien Hari Ini Card */}
                    <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/4 sm:mt-0">
                      <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                        <div className="p-3 rounded-full bg-green-600 bg-opacity-75">
                          <svg
                            className="h-8 w-8 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="mx-5">
                          <h4 className="text-2xl font-semibold text-gray-700">
                            {jadwalList.filter((jadwal) => new Date(jadwal.jadwal_terapi).toDateString() === new Date().toDateString()).length}
                          </h4>
                          <div className="text-gray-500">Pasien Hari Ini</div>
                        </div>
                      </div>
                    </div>
                    {/* Pasien Selesai Card */}
                    <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/4 xl:mt-0">
                      <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                        <div className="p-3 rounded-full bg-purple-600 bg-opacity-75">
                          <svg
                            className="h-8 w-8 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="mx-5">
                          <h4 className="text-2xl font-semibold text-gray-700">
                            {jadwalList.filter((jadwal) => jadwal.status === "Selesai").length}
                          </h4>
                          <div className="text-gray-500">Pasien Selesai</div>
                        </div>
                      </div>
                    </div>
                    {/* Pasien Mendatang Card */}
                    <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/4 xl:mt-0">
                      <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                        <div className="p-3 rounded-full bg-orange-600 bg-opacity-75">
                          <svg
                            className="h-8 w-8 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="mx-5">
                          <h4 className="text-2xl font-semibold text-gray-700">
                            {
                              jadwalList.filter(
                                (jadwal) => new Date(jadwal.jadwal_terapi) > new Date() && jadwal.status !== "Selesai"
                              ).length
                            }
                          </h4>
                          <div className="text-gray-500">Mendatang</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {jadwalList?.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Jadwal Terapi Pasien</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola jadwal terapi pasien Anda di sini.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Pasien
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Jadwal
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Jenis Layanan
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Alamat
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Nominal
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Bukti
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Aksi
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Keluhan
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                                Laporan Perkembangan
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {jadwalList.map((jadwal) => {
                              const keluhanExists = laporanPasienList?.some(
                                (lp) => lp.jadwal_terapi_id_jadwal_terapi === jadwal.id_jadwal_terapi
                              );
                              return (
                                <tr key={jadwal.id_jadwal_terapi} className="hover:bg-gray-50 transition-colors duration-150">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{jadwal.user?.nama || "Tidak Diketahui"}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {new Date(jadwal.jadwal_terapi).toLocaleString("id-ID", {
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      })}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{jadwal.jenis_layanan}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {jadwal.jenis_layanan === "Home Visit" ? jadwal.alamat || "-" : "-"}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      Rp {parseFloat(jadwal.nominal_payment).toLocaleString("id-ID")}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {jadwal.bukti_pembayaran ? (
                                      <a
                                        href={getBuktiPembayaranUrl(jadwal.bukti_pembayaran)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-rose-600 hover:text-rose-700 text-sm"
                                        aria-label="Lihat bukti pembayaran"
                                      >
                                        Lihat
                                      </a>
                                    ) : (
                                      <span className="text-sm text-gray-400 italic">Tidak Ada</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                        jadwal.status === "Diterima"
                                          ? "bg-green-100 text-green-800"
                                          : jadwal.status === "Ditolak"
                                          ? "bg-red-100 text-red-800"
                                          : jadwal.status === "Selesai"
                                          ? "bg-blue-100 text-blue-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {jadwal.status || "Menunggu Konfirmasi"}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative inline-block text-left">
                                      <select
                                        onChange={(e) => updateJadwalStatus(jadwal.id_jadwal_terapi, e.target.value, jadwal.user)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-opacity-50"
                                        disabled={jadwal.status === "Selesai"}
                                        aria-label="Ubah status jadwal"
                                      >
                                        <option value="">Pilih Aksi</option>
                                        <option value="Diterima">Terima</option>
                                        <option value="Selesai">Selesai</option>
                                      </select>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => {
                                        setSelectedJadwalId(jadwal.id_jadwal_terapi);
                                        setIsKeluhanModalOpen(true);
                                      }}
                                      className={`px-3 py-1.5 text-sm font-medium text-white rounded-md transition ${
                                        keluhanExists ? "bg-green-600 cursor-default" : "bg-rose-600 hover:bg-rose-700"
                                      }`}
                                      disabled={keluhanExists}
                                      aria-label={keluhanExists ? "Keluhan sudah dikirim" : "Buat keluhan"}
                                    >
                                      {keluhanExists ? "Terkirim" : "Buat Keluhan"}
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {laporanPerkembanganList?.filter(
                                      (laporan) => laporan.laporan_pasien?.jadwal_terapi_id_jadwal_terapi === jadwal.id_jadwal_terapi
                                    ).length > 0 ? (
                                      <div className="flex flex-col space-y-2">
                                        {laporanPerkembanganList
                                          .filter(
                                            (laporan) => laporan.laporan_pasien?.jadwal_terapi_id_jadwal_terapi === jadwal.id_jadwal_terapi
                                          )
                                          .map((laporan) => (
                                            <button
                                              key={laporan.id_laporan_perkembangan}
                                              onClick={() => {
                                                setSelectedReport(laporan);
                                                setIsReportModalOpen(true);
                                              }}
                                              className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                                              aria-label="Lihat laporan perkembangan"
                                            >
                                              Lihat
                                            </button>
                                          ))}
                                      </div>
                                    ) : (
                                      <span className="text-sm text-gray-400 italic">Belum ada laporan</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-white px-6 py-2 border-t border-gray-200">
                        <div className="flex items-center justify-between flex-col sm:flex-row py-2">
                          <div className="mb-2 sm:mb-0">
                            <p className="text-sm text-gray-700">
                              Menampilkan <span className="font-medium">1</span> sampai{" "}
                              <span className="font-medium">{jadwalList.length}</span> dari{" "}
                              <span className="font-medium">{jadwalList.length}</span> hasil
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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

              {activeTab === "panduan" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Panduan Latihan</h2>
                    <button
                      onClick={() => setIsPanduanFormOpen(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition flex items-center gap-2"
                      aria-label="Buat panduan latihan"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Buat Panduan
                    </button>
                  </div>

                  {panduanList?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {panduanList.map((panduan) => (
                        <div
                          key={panduan.id_panduan_latihan}
                          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                        >
                          <div className="h-40 bg-gray-100 relative overflow-hidden">
                            <img
                              src={
                                panduan.file_latihan && panduan.file_latihan.endsWith(".jpg") || panduan.file_latihan.endsWith(".png")
                                  ? `${STORAGE_URL}panduan_latihan/${panduan.file_latihan}`
                                  : "https://blog-edutore-partner.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/03/01104322/Jurusan-Fisioterapi-02-1-626x430-1.png"
                              }
                              alt={panduan.nama_latihan}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  "https://blog-edutore-partner.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2021/03/01104322/Jurusan-Fisioterapi-02-1-626x430-1.png";
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                              <h3 className="text-white font-medium text-lg">{panduan.nama_latihan}</h3>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                {panduan.terapis?.user?.foto ? (
                                  <img
                                    src={`${STORAGE_URL}profile/${panduan.terapis.user.foto}`}
                                    alt={panduan.terapis.user.nama}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "https://picsum.photos/150";
                                    }}
                                  />
                                ) : (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                )}
                              </div>
                              <div>
                                <p className="text-xs text-gray-600">Dibuat oleh</p>
                                <p className="text-sm font-medium">{panduan.terapis?.user?.nama || "Tidak Diketahui"}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{panduan.deskripsi_latihan}</p>
                            <div className="flex justify-between items-center">
                              {panduan.file_latihan && (
                                <a
                                  href={`${STORAGE_URL}panduan_latihan/${panduan.file_latihan}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-rose-600 hover:text-rose-700 text-sm flex items-center gap-1"
                                  aria-label={`Lihat panduan ${panduan.nama_latihan}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    />
                                  </svg>
                                  Lihat Panduan
                                </a>
                              )}
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {panduan.kategori || "Umum"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 mx-auto text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada panduan latihan</h3>
                      <p className="mt-1 text-sm text-gray-500">Buat panduan latihan pertama Anda dengan mengklik tombol di atas.</p>
                      <button
                        onClick={() => setIsPanduanFormOpen(true)}
                        className="mt-4 px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                        aria-label="Buat panduan latihan pertama"
                      >
                        Buat Panduan Pertama
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "pesan" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesan</h2>
                  <div className="space-y-4" role="list" aria-label="Daftar kontak untuk chat">
                    {[...availablePatientsForChat, ...chatPartners]?.length > 0 ? (
                      [...availablePatientsForChat, ...chatPartners]
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
                            aria-label={`Buka chat dengan ${partner.nama || partner.name || "Pengguna"}`}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                <span className="text-rose-600 font-medium">
                                  {(partner.nama || partner.name)?.charAt(0) || "?"}
                                </span>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-base font-medium text-gray-900">{partner.nama || partner.name || "Tidak diketahui"}</h4>
                                <p className="text-sm text-gray-500">{partner.role || "Pasien"}</p>
                              </div>
                            </div>
                            <div className="ml-4 px-3 py-1 text-sm text-rose-500 font-medium">
                              {chatPartners.some((p) => p.id === partner.id) ? "Buka Chat →" : "Mulai Chat →"}
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-sm text-gray-500">Belum ada pasien yang dapat dihubungi.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="fixed top-4 right-4 z-50 space-y-2 w-72" aria-live="polite" aria-atomic="true">
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
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {toast.type === "danger" && (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {toast.type === "warning" && (
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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
                        toast.type === "success" ? "text-green-800" : toast.type === "danger" ? "text-red-800" : "text-yellow-800"
                      }`}
                    >
                      {toast.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        toast.type === "success" ? "text-green-600" : toast.type === "danger" ? "text-red-600" : "text-yellow-600"
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

        {isKeluhanModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Buat Keluhan</h3>
              <form onSubmit={handleSubmitKeluhan} className="space-y-6">
                <div>
                  <label htmlFor="panduan" className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Panduan
                  </label>
                  <select
                    id="panduan"
                    value={selectedPanduanId}
                    onChange={(e) => setSelectedPanduanId(e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                    required
                    aria-label="Pilih panduan latihan"
                  >
                    <option value="">Pilih Panduan</option>
                    {panduanList?.map((panduan) => (
                      <option key={panduan.id_panduan_latihan} value={panduan.id_panduan_latihan}>
                        {panduan.nama_latihan}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="keluhan" className="block text-sm font-medium text-gray-700 mb-2">
                    Keluhan
                  </label>
                  <textarea
                    id="keluhan"
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    placeholder="Masukkan keluhan untuk pasien"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24"
                    required
                    aria-label="Keluhan pasien"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsKeluhanModalOpen(false);
                      setKeluhan("");
                      setSelectedPanduanId("");
                      setSelectedJadwalId(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    aria-label="Batal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                    aria-label="Kirim keluhan"
                  >
                    Kirim Keluhan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isPanduanFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Buat Panduan Latihan</h3>
              <form onSubmit={handleSubmitPanduanForm} className="space-y-6" encType="multipart/form-data">
                <div>
                  <label htmlFor="namaLatihan" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Latihan
                  </label>
                  <input
                    id="namaLatihan"
                    type="text"
                    value={namaLatihan}
                    onChange={(e) => setNamaLatihan(e.target.value)}
                    placeholder="Masukkan nama latihan"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                    required
                    aria-label="Nama latihan"
                  />
                </div>
                <div>
                  <label htmlFor="deskripsiLatihan" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Latihan
                  </label>
                  <textarea
                    id="deskripsiLatihan"
                    value={deskripsiLatihan}
                    onChange={(e) => setDeskripsiLatihan(e.target.value)}
                    placeholder="Masukkan deskripsi latihan"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24"
                    required
                    aria-label="Deskripsi latihan"
                  />
                </div>
                <div>
                  <label htmlFor="fileLatihan" className="block text-sm font-medium text-gray-700 mb-2">
                    File Latihan (PDF/JPG/PNG)
                  </label>
                  <input
                    id="fileLatihan"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={(e) => setFileLatihan(e.target.files[0])}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                    aria-label="File latihan"
                  />
                  {fileLatihan && fileLatihan.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(fileLatihan)}
                      alt="Preview File Latihan"
                      className="mt-2 w-full h-32 object-contain rounded-md border border-gray-200"
                    />
                  )}
                  {fileLatihan && fileLatihan.type === "application/pdf" && (
                    <p className="mt-2 text-sm text-gray-500">File: {fileLatihan.name}</p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPanduanFormOpen(false);
                      setNamaLatihan("");
                      setDeskripsiLatihan("");
                      setFileLatihan(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    aria-label="Batal"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                    aria-label="Simpan panduan"
                  >
                    Simpan Panduan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isEditProfileOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profil</h3>
              <form onSubmit={handleEditProfile} className="space-y-4" encType="multipart/form-data">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
                  <input
                    type="text"
                    value={newSpesialisasi}
                    onChange={(e) => setNewSpesialisasi(e.target.value)}
                    placeholder="Masukkan spesialisasi"
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                    aria-label="Spesialisasi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => setNewFoto(e.target.files[0])}
                    className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                    aria-label="Foto Profil"
                  />
                  {newFoto && (
                    <img
                      src={URL.createObjectURL(newFoto)}
                      alt="Preview Foto Profil"
                      className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-gray-200"
                    />
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditProfileOpen(false);
                      setNewName(nama);
                      setNewSpesialisasi(terapisData?.spesialisasi || "");
                      setNewFoto(null);
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

        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-md p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Laporan Perkembangan</h3>
              <p className="text-sm text-gray-600 mb-6 whitespace-pre-wrap">
                {selectedReport?.ringkasan_perkembangan || "Tidak ada deskripsi tersedia"}
              </p>
              {selectedReport?.file_perkembangan && (
                <button
                  onClick={() => handleOpenImageModal(selectedReport.file_perkembangan, selectedReport.ringkasan_perkembangan)}
                  className="mb-4 px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  aria-label="Lihat file perkembangan"
                >
                  Lihat File
                </button>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setIsReportModalOpen(false);
                    setSelectedReport(null);
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                  aria-label="Tutup modal"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <ImageModal
          isOpen={isImageModalOpen}
          onClose={handleCloseImageModal}
          imageUrl={selectedImageUrl}
          description={selectedDescription}
        />

        <ChatModal
          isOpen={isChatModalOpen}
          onClose={closeChat}
          currentUserId={parseInt(userId)}
          currentUserRole={userRole}
          chatPartner={selectedChatPartner}
          token={token}
          showToast={showToast}
        />
      </div>
    </div>
  );
};

export default DashboardTerapis;