// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const API_URL = "http://localhost:8000/api";

// export default function DashboardPasien() {
//   const navigate = useNavigate();
//   const nama = localStorage.getItem("nama") || "Pasien";
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("iduser");

//   // State untuk form pengajuan jadwal
//   const [terapisList, setTerapisList] = useState([]);
//   const [selectedTerapis, setSelectedTerapis] = useState("");
//   const [jadwal, setJadwal] = useState("");
//   const [alamat, setAlamat] = useState("");
//   const [jenisLayanan, setJenisLayanan] = useState("Home Visit");

//   // State untuk daftar jadwal yang sudah diajukan
//   const [jadwalList, setJadwalList] = useState([]);

//   // State untuk notifikasi toast
//   const [toasts, setToasts] = useState([]);

//   // Toast notification system
//   const showToast = (type, title, message) => {
//     const id = Date.now();
//     setToasts((prev) => [{ id, type, title, message }, ...prev]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 4000);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("nama");
//     localStorage.removeItem("iduser");
//     showToast("success", "Logout", "Anda telah keluar dari akun.");
//     setTimeout(() => navigate("/login"), 1000);
//   };

//   // Ambil daftar terapis dari API
//   useEffect(() => {
//     const fetchTerapis = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/terapis`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTerapisList(response.data.data);
//       } catch (error) {
//         showToast("danger", "Error", "Gagal memuat data terapis: " + (error.response?.data?.message || error.message));
//       }
//     };

//     // Ambil daftar jadwal yang sudah diajukan oleh pasien
//     const fetchJadwal = async () => {
//       try {
//         const response = await axios.get(`${API_URL}/jadwal-terapi`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         // Filter hanya jadwal milik pasien yang sedang login
//         const userJadwal = response.data.data.filter((jadwal) => jadwal.user_id == userId);
//         setJadwalList(userJadwal);
//       } catch (error) {
//         showToast("danger", "Error", "Gagal memuat daftar jadwal: " + (error.response?.data?.message || error.message));
//       }
//     };

//     fetchTerapis();
//     fetchJadwal();
//   }, [token, userId]);

//   // Submit Jadwal Terapi
//   const handleSubmitJadwal = async (e) => {
//     e.preventDefault();

//     // Validasi form
//     if (!selectedTerapis) {
//       showToast("warning", "Peringatan", "Silakan pilih terapis!");
//       return;
//     }
//     if (!jadwal) {
//       showToast("warning", "Peringatan", "Silakan pilih jadwal terapi!");
//       return;
//     }
//     if (jenisLayanan === "Home Visit" && !alamat.trim()) {
//       showToast("warning", "Peringatan", "Silakan masukkan alamat untuk layanan Home Visit!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/jadwal-terapi`,
//         {
//           terapis_id: selectedTerapis,
//           user_id: userId,
//           jadwal_terapi: jadwal,
//           jenis_layanan: jenisLayanan,
//           alamat: jenisLayanan === "Home Visit" ? alamat : null,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       showToast("success", "Sukses", "Jadwal terapi berhasil diajukan!");
      
//       // Reset form
//       setSelectedTerapis("");
//       setJadwal("");
//       setAlamat("");
//       setJenisLayanan("Home Visit");

//       // Refresh daftar jadwal
//       const jadwalResponse = await axios.get(`${API_URL}/jadwal-terapi`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const userJadwal = jadwalResponse.data.data.filter((jadwal) => jadwal.user_id == userId);
//       setJadwalList(userJadwal);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengajukan jadwal terapi: " + (error.response?.data?.message || error.message));
//     }
//   };

//   return (
//     <div>
//       <Navbar />
//       <section className="bg-white py-7 px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           {/* Toast Container */}
//           <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
//             {toasts.map((toast) => (
//               <div
//                 key={toast.id}
//                 className={`toast flex items-start p-4 rounded-lg border shadow-lg ${
//                   toast.type === "success"
//                     ? "bg-green-50 border-green-100"
//                     : toast.type === "danger"
//                     ? "bg-red-50 border-red-100"
//                     : "bg-yellow-50 border-yellow-100"
//                 }`}
//               >
//                 <div className="flex-shrink-0">
//                   {toast.type === "success" && (
//                     <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   {toast.type === "danger" && (
//                     <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   {toast.type === "warning" && (
//                     <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                 </div>
//                 <div className="ml-3">
//                   <h3
//                     className={`text-sm font-medium ${
//                       toast.type === "success"
//                         ? "text-green-800"
//                         : toast.type === "danger"
//                         ? "text-red-800"
//                         : "text-yellow-800"
//                     }`}
//                   >
//                     {toast.title}
//                   </h3>
//                   <p
//                     className={`mt-1 text-sm ${
//                       toast.type === "success"
//                         ? "text-green-600"
//                         : toast.type === "danger"
//                         ? "text-red-600"
//                         : "text-yellow-600"
//                     }`}
//                   >
//                     {toast.message}
//                   </p>
//                 </div>
//                 <button
//                   className={`ml-auto ${
//                     toast.type === "success"
//                       ? "text-green-400 hover:text-green-500"
//                       : toast.type === "danger"
//                       ? "text-red-400 hover:text-red-500"
//                       : "text-yellow-400 hover:text-yellow-500"
//                   }`}
//                   onClick={() =>
//                     setToasts((prev) => prev.filter((t) => t.id !== toast.id))
//                   }
//                 >
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
//                 Dashboard Pasien
//               </h2>
//               <p className="mt-2 text-lg text-gray-600">
//                 Selamat datang, <span className="font-semibold text-rose-600">{nama}</span>!
//               </p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-md transition"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Form Section */}
//             <div className="lg:col-span-2 space-y-8">
//               {/* Form Pengajuan Jadwal */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6">Ajukan Jadwal Terapi</h3>
//                 <form onSubmit={handleSubmitJadwal} className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Pilih Terapis
//                     </label>
//                     <select
//                       value={selectedTerapis}
//                       onChange={(e) => setSelectedTerapis(e.target.value)}
//                       className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                       required
//                     >
//                       <option value="">-- Pilih Terapis --</option>
//                       {terapisList.map((t) => (
//                         <option key={t.id_terapis} value={t.id_terapis}>
//                           {t.user?.nama || t.nama} - {t.spesialisasi || "Tidak ada spesialisasi"}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Jadwal Terapi
//                     </label>
//                     <input
//                       type="datetime-local"
//                       value={jadwal}
//                       onChange={(e) => setJadwal(e.target.value)}
//                       min={new Date().toISOString().slice(0, 16)} // Jadwal tidak bisa di masa lalu
//                       className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Jenis Layanan
//                     </label>
//                     <select
//                       value={jenisLayanan}
//                       onChange={(e) => setJenisLayanan(e.target.value)}
//                       className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                     >
//                       <option value="Home Visit">Home Visit</option>
//                       <option value="Online">Online</option>
//                     </select>
//                   </div>

//                   {jenisLayanan === "Home Visit" && (
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Alamat Kunjungan
//                       </label>
//                       <input
//                         type="text"
//                         value={alamat}
//                         onChange={(e) => setAlamat(e.target.value)}
//                         placeholder="Masukkan alamat lengkap"
//                         className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                         required
//                       />
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     className="w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
//                   >
//                     Ajukan Jadwal
//                   </button>
//                 </form>
//               </div>

//               {/* Daftar Jadwal yang Diajukan */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6">Riwayat Pengajuan Jadwal</h3>
//                 {jadwalList.length > 0 ? (
//                   <div className="space-y-4">
//                     {jadwalList.map((jadwal) => {
//                       const terapis = terapisList.find((t) => t.id_terapis == jadwal.terapis_id);
//                       return (
//                         <div key={jadwal.id} className="border-b pb-4">
//                           <h4 className="text-sm font-medium text-gray-900">
//                             Terapis: {terapis?.user?.nama || terapis?.nama || "Tidak diketahui"}
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             Jadwal: {new Date(jadwal.jadwal_terapi).toLocaleString()}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Jenis Layanan: {jadwal.jenis_layanan}
//                           </p>
//                           {jadwal.jenis_layanan === "Home Visit" && (
//                             <p className="text-sm text-gray-500">Alamat: {jadwal.alamat}</p>
//                           )}
//                           <p className="text-sm text-gray-500">
//                             Status: {jadwal.status || "Menunggu Konfirmasi"}
//                           </p>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p>
//                 )}
//               </div>
//             </div>

//             {/* Sidebar Section */}
//             <div className="space-y-6">
//               {/* Info Box */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-rose-50">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Penting</h3>
//                 <ul className="space-y-2 text-sm text-gray-700">
//                   <li className="flex items-start">
//                     <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Pastikan jadwal yang dipilih sesuai dengan kesepakatan terapis</span>
//                   </li>
//                   <li className="flex items-start">
//                     <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Untuk layanan home visit, pastikan alamat sudah benar</span>
//                   </li>
//                   <li className="flex items-start">
//                     <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Konfirmasi jadwal akan dikirim via email setelah terapis menyetujui</span>
//                   </li>
//                 </ul>
//               </div>

//               {/* Terapis List */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Daftar Terapis Tersedia</h3>
//                 <div className="space-y-4">
//                   {terapisList.slice(0, 3).map((terapis) => (
//                     <div key={terapis.id_terapis} className="flex items-start">
//                       <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
//                         <span className="text-rose-600 font-medium">
//                           {(terapis.user?.nama || terapis.nama)?.charAt(0) || "?"}
//                         </span>
//                       </div>
//                       <div className="ml-3">
//                         <h4 className="text-sm font-medium text-gray-900">
//                           {terapis.user?.nama || terapis.nama || "Tidak diketahui"}
//                         </h4>
//                         <p className="text-sm text-gray-500">
//                           {terapis.spesialisasi || "Tidak ada spesialisasi"}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   {terapisList.length > 3 && (
//                     <p className="text-sm text-rose-600 font-medium">
//                       + {terapisList.length - 3} terapis lainnya
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// }

// // =======================================================================================

// // src/pages/DashboardPasien.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import ChatModal from "../components/ChatModal"; // Import ChatModal

// const API_URL = "http://localhost:8000/api";

// const DashboardPasien = () => {
//   const navigate = useNavigate();
//   const nama = localStorage.getItem("nama") || "Pasien";
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("iduser"); // Pasien ID
//   const userRole = localStorage.getItem("role"); // Role user (pasien)

//   // State untuk form pengajuan jadwal
//   const [terapisList, setTerapisList] = useState([]);
//   const [selectedTerapis, setSelectedTerapis] = useState("");
//   const [jadwal, setJadwal] = useState("");
//   const [alamat, setAlamat] = useState("");
//   const [jenisLayanan, setJenisLayanan] = useState("Home Visit");

//   // State untuk daftar jadwal yang sudah diajukan
//   const [jadwalList, setJadwalList] = useState([]);

//   // State untuk notifikasi toast
//   const [toasts, setToasts] = useState([]);

//   // State for Chat
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [selectedChatPartner, setSelectedChatPartner] = useState(null);
//   const [chatPartners, setChatPartners] = useState([]); // List of people patient has chatted with
//   const [availableTerapisForChat, setAvailableTerapisForChat] = useState([]); // All therapists for initiating new chat

//   // Toast notification system
//   const showToast = (type, title, message) => {
//     const id = Date.now();
//     setToasts((prev) => [{ id, type, title, message }, ...prev]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 4000);
//   };

//   // Handle logout
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("nama");
//     localStorage.removeItem("iduser");
//     showToast("success", "Logout", "Anda telah keluar dari akun.");
//     setTimeout(() => navigate("/login"), 1000);
//   };

//   // Ambil daftar terapis dari API dan daftar jadwal
// useEffect(() => {
//     let intervalId;
//     const fetchData = async () => {
//       try {
//         // Fetch Terapis List for scheduling
//         const terapisResponse = await axios.get(`${API_URL}/terapis`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTerapisList(terapisResponse.data.data);

//         // Fetch Jadwal List
//         const jadwalResponse = await axios.get(`${API_URL}/jadwal-terapi`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const userJadwal = jadwalResponse.data.data.filter((jadwal) => jadwal.user_id == userId);
//         setJadwalList(userJadwal);

//         // Fetch Chat Partners (existing chats)
//         const chatPartnersResponse = await axios.get(`${API_URL}/chat/partners`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setChatPartners(chatPartnersResponse.data.partners);

//         // Fetch All Terapis for new chat initiation
//         const allTerapisResponse = await axios.get(`${API_URL}/chat/terapis`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         setAvailableTerapisForChat(allTerapisResponse.data.terapis);

//       } catch (error) {
//         showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message));
//       }
//     };

//     // Panggil pertama kali
//     fetchData();
    
//   }, [token, userId]);

//   // Submit Jadwal Terapi (existing code)
//   const handleSubmitJadwal = async (e) => {
//     e.preventDefault();

//     if (!selectedTerapis) {
//       showToast("warning", "Peringatan", "Silakan pilih terapis!");
//       return;
//     }
//     if (!jadwal) {
//       showToast("warning", "Peringatan", "Silakan pilih jadwal terapi!");
//       return;
//     }
//     if (jenisLayanan === "Home Visit" && !alamat.trim()) {
//       showToast("warning", "Peringatan", "Silakan masukkan alamat untuk layanan Home Visit!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${API_URL}/jadwal-terapi`,
//         {
//           terapis_id: selectedTerapis,
//           user_id: userId,
//           jadwal_terapi: jadwal,
//           jenis_layanan: jenisLayanan,
//           alamat: jenisLayanan === "Home Visit" ? alamat : null,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       showToast("success", "Sukses", "Jadwal terapi berhasil diajukan!");

//       setSelectedTerapis("");
//       setJadwal("");
//       setAlamat("");
//       setJenisLayanan("Home Visit");

//       // Refresh daftar jadwal
//       const jadwalResponse = await axios.get(`${API_URL}/jadwal-terapi`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const userJadwal = jadwalResponse.data.data.filter((jadwal) => jadwal.user_id == userId);
//       setJadwalList(userJadwal);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengajukan jadwal terapi: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const openChat = (partner) => {
//     setSelectedChatPartner(partner);
//     setIsChatModalOpen(true);
//   };

//   const closeChat = () => {
//     setIsChatModalOpen(false);
//     setSelectedChatPartner(null);
//   };

//   return (
//     <div>
//       <Navbar />
//       <section className="bg-white py-7 px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           {/* Toast Container */}
//           <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
//             {toasts.map((toast) => (
//               <div
//                 key={toast.id}
//                 className={`toast flex items-start p-4 rounded-lg border shadow-lg ${
//                   toast.type === "success"
//                     ? "bg-green-50 border-green-100"
//                     : toast.type === "danger"
//                     ? "bg-red-50 border-red-100"
//                     : "bg-yellow-50 border-yellow-100"
//                 }`}
//               >
//                 <div className="flex-shrink-0">
//                   {toast.type === "success" && (
//                     <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   {toast.type === "danger" && (
//                     <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                   {toast.type === "warning" && (
//                     <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   )}
//                 </div>
//                 <div className="ml-3">
//                   <h3
//                     className={`text-sm font-medium ${
//                       toast.type === "success"
//                         ? "text-green-800"
//                         : toast.type === "danger"
//                         ? "text-red-800"
//                         : "text-yellow-800"
//                     }`}
//                   >
//                     {toast.title}
//                   </h3>
//                   <p
//                     className={`mt-1 text-sm ${
//                       toast.type === "success"
//                         ? "text-green-600"
//                         : toast.type === "danger"
//                         ? "text-red-600"
//                         : "text-yellow-600"
//                     }`}
//                   >
//                     {toast.message}
//                   </p>
//                 </div>
//                 <button
//                   className={`ml-auto ${
//                     toast.type === "success"
//                       ? "text-green-400 hover:text-green-500"
//                       : toast.type === "danger"
//                       ? "text-red-400 hover:text-red-500"
//                       : "text-yellow-400 hover:text-yellow-500"
//                   }`}
//                   onClick={() =>
//                     setToasts((prev) => prev.filter((t) => t.id !== toast.id))
//                   }
//                 >
//                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>

//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <div>
//               <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
//                 Dashboard Pasien
//               </h2>
//               <p className="mt-2 text-lg text-gray-600">
//                 Selamat datang, <span className="font-semibold text-rose-600">{nama}</span>!
//               </p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-md transition"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Content Grid */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Main Form Section */}
//             <div className="lg:col-span-2 space-y-8">
//               {/* Form Pengajuan Jadwal (existing code) */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6">Ajukan Jadwal Terapi</h3>
//                 <form onSubmit={handleSubmitJadwal} className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Pilih Terapis
//                     </label>
//                     <select
//                       value={selectedTerapis}
//                       onChange={(e) => setSelectedTerapis(e.target.value)}
//                       className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                       required
//                     >
//                       <option value="">-- Pilih Terapis --</option>
//                       {terapisList.map((t) => (
//                         <option key={t.id_terapis} value={t.id_terapis}>
//                           {t.user?.nama || t.nama} - {t.spesialisasi || "Tidak ada spesialisasi"}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Jadwal Terapi
//                     </label>
//                     <input
//                       type="datetime-local"
//                       value={jadwal}
//                       onChange={(e) => setJadwal(e.target.value)}
//                       min={new Date().toISOString().slice(0, 16)}
//                       className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Jenis Layanan
//                     </label>
//                     <select
//                       value={jenisLayanan}
//                       onChange={(e) => setJenisLayanan(e.target.value)}
//                       className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                     >
//                       <option value="Home Visit">Home Visit</option>
//                       <option value="Online">Online</option>
//                     </select>
//                   </div>

//                   {jenisLayanan === "Home Visit" && (
//                     <div>
//                       <label className="block text-sm font-semibold text-gray-700 mb-2">
//                         Alamat Kunjungan
//                       </label>
//                       <input
//                         type="text"
//                         value={alamat}
//                         onChange={(e) => setAlamat(e.target.value)}
//                         placeholder="Masukkan alamat lengkap"
//                         className="w-full px-4 py-2.5 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-base"
//                         required
//                       />
//                     </div>
//                   )}

//                   <button
//                     type="submit"
//                     className="w-full rounded-md bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
//                   >
//                     Ajukan Jadwal
//                   </button>
//                 </form>
//               </div>

//               {/* Daftar Jadwal yang Diajukan (existing code) */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6">Riwayat Pengajuan Jadwal</h3>
//                 {jadwalList.length > 0 ? (
//                   <div className="space-y-4">
//                     {jadwalList.map((jadwal) => {
//                       const terapis = terapisList.find((t) => t.id_terapis == jadwal.terapis_id);
//                       return (
//                         <div key={jadwal.id} className="border-b pb-4">
//                           <h4 className="text-sm font-medium text-gray-900">
//                             Terapis: {terapis?.user?.nama || terapis?.nama || "Tidak diketahui"}
//                           </h4>
//                           <p className="text-sm text-gray-500">
//                             Jadwal: {new Date(jadwal.jadwal_terapi).toLocaleString()}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Jenis Layanan: {jadwal.jenis_layanan}
//                           </p>
//                           {jadwal.jenis_layanan === "Home Visit" && (
//                             <p className="text-sm text-gray-500">Alamat: {jadwal.alamat}</p>
//                           )}
//                           <p className="text-sm text-gray-500">
//                             Status: {jadwal.status || "Menunggu Konfirmasi"}
//                           </p>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p>
//                 )}
//               </div>
//             </div>

//             {/* Sidebar Section */}
//             <div className="space-y-6">
//               {/* Info Box (existing code) */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-rose-50">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-3">Informasi Penting</h3>
//                 <ul className="space-y-2 text-sm text-gray-700">
//                   <li className="flex items-start">
//                     <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Pastikan jadwal yang dipilih sesuai dengan kesepakatan terapis</span>
//                   </li>
//                   <li className="flex items-start">
//                     <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Untuk layanan home visit, pastikan alamat sudah benar</span>
//                   </li>
//                   <li className="flex items-start">
//                     <svg className="h-5 w-5 text-rose-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     <span>Konfirmasi jadwal akan dikirim via email setelah terapis menyetujui</span>
//                   </li>
//                 </ul>
//               </div>

//               {/* Terapis List (existing code, perhaps convert to "start chat" list) */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Mulai Chat dengan Terapis</h3>
//                 <div className="space-y-4">
//                     {availableTerapisForChat.length > 0 ? (
//                         availableTerapisForChat.map((terapis) => (
//                         <div key={terapis.id} className="flex items-center justify-between border-b pb-2">
//                             <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
//                                 <span className="text-rose-600 font-medium">
//                                 {(terapis.name)?.charAt(0) || "?"}
//                                 </span>
//                             </div>
//                             <div className="ml-3">
//                                 <h4 className="text-sm font-medium text-gray-900">
//                                 {terapis.name || "Tidak diketahui"}
//                                 </h4>
//                                 <p className="text-xs text-gray-500">
//                                 {terapis.specialization || "Tidak ada spesialisasi"}
//                                 </p>
//                             </div>
//                             </div>
//                             <button
//                                 onClick={() => openChat(terapis)}
//                                 className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
//                             >
//                                 Chat
//                             </button>
//                         </div>
//                         ))
//                     ) : (
//                         <p className="text-sm text-gray-500">Tidak ada terapis tersedia untuk chat.</p>
//                     )}
//                 </div>
//               </div>

//               {/* Recent Chats Section */}
//               <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Terbaru</h3>
//                 <div className="space-y-4">
//                   {chatPartners.length > 0 ? (
//                     chatPartners.map((partner) => (
//                       <div key={partner.id} className="flex items-center justify-between border-b pb-2">
//                         <div className="flex items-center">
//                           <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                             <span className="text-blue-600 font-medium">
//                               {(partner.name)?.charAt(0) || "?"}
//                             </span>
//                           </div>
//                           <div className="ml-3">
//                             <h4 className="text-sm font-medium text-gray-900">{partner.name}</h4>
//                             <p className="text-xs text-gray-500 truncate w-48">
//                               {partner.last_message || "Belum ada pesan."}
//                             </p>
//                             {partner.last_message_time && (
//                               <p className="text-xs text-gray-400">
//                                 {new Date(partner.last_message_time).toLocaleString()}
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                         <button
//                           onClick={() => openChat(partner)}
//                           className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
//                         >
//                           Buka Chat
//                         </button>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">Belum ada riwayat chat.</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <Footer />

//       {/* Chat Modal */}
//       <ChatModal
//         isOpen={isChatModalOpen}
//         onClose={closeChat}
//         currentUserId={parseInt(userId)}
//         currentUserRole={userRole}
//         chatPartner={selectedChatPartner}
//       />
//     </div>
//   );
// }

// export default DashboardPasien;


// =====================
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ChatModal from "../components/ChatModal";
// import Footer from "../components/Footer";

// const API_URL = "http://localhost:8000/api";
// const STORAGE_URL = "http://localhost:8000/storage/";

// const DashboardPasien = () => {
//   const navigate = useNavigate();
//   const [nama, setNama] = useState(localStorage.getItem("nama") || "Pasien");
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("iduser");
//   const userRole = localStorage.getItem("role");

//   const [activeTab, setActiveTab] = useState("dokter");
//   const [terapisList, setTerapisList] = useState([]);
//   const [jadwalList, setJadwalList] = useState([]);
//   const [userProfile, setUserProfile] = useState(null);
//   const [toasts, setToasts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedTerapis, setSelectedTerapis] = useState("");
//   const [jadwal, setJadwal] = useState("");
//   const [alamat, setAlamat] = useState("");
//   const [jenisLayanan, setJenisLayanan] = useState("Home Visit");
//   const [buktiPembayaran, setBuktiPembayaran] = useState(null);
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [selectedChatPartner, setSelectedChatPartner] = useState(null);
//   const [chatPartners, setChatPartners] = useState([]);
//   const [availableTerapisForChat, setAvailableTerapisForChat] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
//   const [newName, setNewName] = useState(nama);
//   const [formErrors, setFormErrors] = useState({});

//   const showToast = (type, title, message) => {
//     const id = Date.now();
//     setToasts((prev) => [{ id, type, title, message }, ...prev]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((t) => t.id !== id));
//     }, 4000);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("nama");
//     localStorage.removeItem("iduser");
//     showToast("success", "Logout", "Anda telah keluar dari akun.");
//     setTimeout(() => navigate("/login"), 1000);
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [terapisResponse, jadwalResponse, userResponse, chatPartnersResponse, allTerapisResponse] = await Promise.all([
//           axios.get(`${API_URL}/terapis`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/jadwal-terapi`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/chat/partners`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/chat/terapis`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);
//         setTerapisList(terapisResponse.data.data);
//         setJadwalList(jadwalResponse.data.data.filter((jadwal) => jadwal.user_id == userId));
//         setUserProfile(userResponse.data.data);
//         setChatPartners(chatPartnersResponse.data.partners);
//         setAvailableTerapisForChat(allTerapisResponse.data.terapis);
//         setNewName(userResponse.data.data.nama);
//       } catch (error) {
//         showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message));
//       }
//     };
//     if (token && userId) {
//       fetchData();
//     } else {
//       navigate("/login");
//     }
//   }, [token, userId, navigate]);

//   const validateForm = () => {
//     const errors = {};
//     if (!selectedTerapis) errors.selectedTerapis = "Silakan pilih terapis!";
//     if (!jadwal) errors.jadwal = "Silakan pilih jadwal terapi!";
//     if (jenisLayanan === "Home Visit" && !alamat.trim()) errors.alamat = "Silakan masukkan alamat!";
//     if (!buktiPembayaran) errors.buktiPembayaran = "Silakan unggah bukti pembayaran!";
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmitJadwal = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       showToast("warning", "Peringatan", "Harap lengkapi semua field yang diperlukan!");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("terapis_id", selectedTerapis);
//       formData.append("user_id", userId);
//       formData.append("jadwal_terapi", jadwal);
//       formData.append("jenis_layanan", jenisLayanan);
//       if (jenisLayanan === "Home Visit") formData.append("alamat", alamat);
//       formData.append("bukti_pembayaran", buktiPembayaran);

//       await axios.post(`${API_URL}/jadwal-terapi`, formData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//       });
//       showToast("success", "Sukses", "Jadwal terapi berhasil diajukan!");

//       setSelectedTerapis("");
//       setJadwal("");
//       setAlamat("");
//       setJenisLayanan("Home Visit");
//       setBuktiPembayaran(null);
//       setFormErrors({});
//       setIsModalOpen(false);
//       setTimeout(() => window.location.reload(), 1000);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengajukan jadwal terapi: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleEditProfile = async (e) => {
//     e.preventDefault();
//     if (!newName.trim()) {
//       showToast("warning", "Peringatan", "Nama tidak boleh kosong!");
//       return;
//     }

//     try {
//       await axios.put(
//         `${API_URL}/users/${userId}`,
//         { nama: newName },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setNama(newName);
//       localStorage.setItem("nama", newName);
//       setUserProfile((prev) => ({ ...prev, nama: newName }));
//       showToast("success", "Sukses", "Nama berhasil diperbarui!");
//       setIsEditProfileOpen(false);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal memperbarui nama: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const openChat = (partner) => {
//     setSelectedChatPartner({ id: partner.id, name: partner.name, role: partner.role, email: partner.email });
//     setIsChatModalOpen(true);
//   };

//   const closeChat = () => {
//     setIsChatModalOpen(false);
//     setSelectedChatPartner(null);
//   };

//   const openModal = (terapisId) => {
//     setSelectedTerapis(terapisId || "");
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTerapis("");
//     setJadwal("");
//     setAlamat("");
//     setJenisLayanan("Home Visit");
//     setBuktiPembayaran(null);
//     setFormErrors({});
//   };

//   const getPhotoUrl = (foto) => (foto ? `${STORAGE_URL}${foto}` : "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg");
//   const getBuktiPembayaranUrl = (path) => (path ? `${STORAGE_URL}${path}` : "#");

//   return (
//     <div className="flex h-screen bg-gray-50 font-poppins">
//       {/* Sidebar */}
//       <input type="checkbox" id="menu-toggle" className="hidden peer" />
//       <div className="hidden peer-checked:flex md:flex flex-col w-64 bg-white border-r border-gray-300 transition-all duration-300 ease-in-out shadow-sm">
//         <div className="flex items-center justify-between h-16 bg-white border-b border-gray-300 px-4">
//           <span className="text-gray-900 text-xl font-bold">
//             Terapy<span className="text-rose-600">Care</span>
//           </span>
//           <label htmlFor="menu-toggle" className="text-gray-600 cursor-pointer md:hidden">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </label>
//         </div>
//         <div className="flex flex-col flex-1 overflow-y-auto">
//           <nav className="flex-1 px-3 py-4">
//             {["terapis", "riwayat", "pesan"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium ${
//                   activeTab === tab ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600" : "border-l-4 border-transparent"
//                 }`}
//                 aria-current={activeTab === tab ? "page" : undefined}
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                   aria-hidden="true"
//                 >
//                   {tab === "terapis" && (
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
//                     />
//                   )}
//                   {tab === "riwayat" && (
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
//                     />
//                   )}
//                   {tab === "pesan" && (
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.582 9 8z"
//                     />
//                   )}
//                 </svg>
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//             <button
//               onClick={handleLogout}
//               className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5 mr-3"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1"
//                 />
//               </svg>
//               Logout
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto">
//         <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4">
//           <div className="flex items-center">
//             <label
//               htmlFor="menu-toggle"
//               className="md:hidden mr-4 bg-rose-600 text-white p-2 rounded focus:outline-none cursor-pointer"
//               aria-label="Toggle sidebar"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="white"
//                 aria-hidden="true"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </label>
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth="1.5"
//               stroke="currentColor"
//               className="h-6 w-6 mr-2 text-gray-600"
//               aria-hidden="true"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
//               />
//             </svg>
//             <input
//               className="mx-2 w-full max-w-xs border rounded-md px-4 py-2 text-sm focus:border-rose-600 focus:ring-2 focus:ring-rose-100"
//               type="text"
//               placeholder="Cari..."
//               aria-label="Search"
//             />
//           </div>
//           <div className="relative">
//             <img
//               src={userProfile?.foto ? getPhotoUrl(userProfile.foto) : "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg"}
//               alt="Profile"
//               className="w-10 h-10 rounded-full object-cover cursor-pointer"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               onError={(e) => {
//                 e.target.src = "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg";
//               }}
//               aria-label="Toggle profile dropdown"
//             />
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                 <div className="py-2">
//                   <p className="px-4 py-2 text-sm text-gray-700 font-medium">{nama}</p>
//                   <button
//                     onClick={() => {
//                       setIsEditProfileOpen(true);
//                       setIsDropdownOpen(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition"
//                     aria-label="Edit profile"
//                   >
//                     Edit Profil
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <section className=" bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
//           <div className="max-w-7xl mx-auto">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               {activeTab === "terapis" && (
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 mb-6">Daftar Terapis</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                     {terapisList.map((terapis) => (
//                       <div
//                         key={terapis.id_terapis}
//                         className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
//                       >
//                         <img
//                           src={getPhotoUrl(terapis.foto)}
//                           alt={terapis.user?.nama || terapis.nama || "Dokter"}
//                           className="w-full h-80 object-cover"
//                           onError={(e) => {
//                             e.target.src = "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg";
//                           }}
//                         />
//                         <div className="p-4 text-center">
//                           <h3 className="text-sm font-medium text-gray-900">
//                             {terapis.user?.nama || terapis.nama || "Tidak Diketahui"}
//                           </h3>
//                           <p className="text-xs text-gray-500">{terapis.spesialisasi || "Dokter Umum"}</p>
//                           <button
//                             onClick={() => openModal(terapis.id_terapis)}
//                             className="mt-4 w-full bg-rose-600 text-white text-xs font-medium py-2 rounded-md hover:bg-rose-700 transition-colors"
//                             aria-label={`Buat janji dengan ${terapis.user?.nama || terapis.nama || "Dokter"}`}
//                           >
//                             Buat Janji
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {activeTab === "riwayat" && (
//                 <div>
//                   {jadwalList.length > 0 ? (
//                     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                       <div className="p-6 border-b border-gray-200">
//                         <h2 className="text-lg font-semibold text-gray-800">Riwayat Jadwal Terapi</h2>
//                         <p className="text-sm text-gray-500 mt-1">Kelola jadwal terapi Anda di sini.</p>
//                       </div>
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Terapis
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Jadwal
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Jenis Layanan
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Alamat
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Nominal
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Bukti
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Status
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Keluhan
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Panduan
//                               </th>
//                               <th
//                                 scope="col"
//                                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                               >
//                                 Update
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {jadwalList.map((jadwal) => {
//                               const terapis = terapisList.find((t) => t.id_terapis == jadwal.terapis_id);
//                               return (
//                                 <tr
//                                   key={jadwal.id_jadwal_terapi}
//                                   className="hover:bg-gray-50 transition-colors duration-150"
//                                 >
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-900">
//                                       {terapis?.user?.nama || terapis?.nama || "Tidak Diketahui"}
//                                     </div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-900">
//                                       {new Date(jadwal.jadwal_terapi).toLocaleString("id-ID", {
//                                         dateStyle: "medium",
//                                         timeStyle: "short",
//                                       })}
//                                     </div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-900">{jadwal.jenis_layanan}</div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-900">
//                                       {jadwal.jenis_layanan === "Home Visit" ? jadwal.alamat || "-" : "-"}
//                                     </div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-900">
//                                       Rp {parseFloat(jadwal.nominal_payment).toLocaleString("id-ID")}
//                                     </div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     {jadwal.bukti_pembayaran ? (
//                                       <a
//                                         href={getBuktiPembayaranUrl(jadwal.bukti_pembayaran)}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         className="text-rose-600 hover:text-rose-700 text-sm"
//                                         aria-label="Lihat bukti pembayaran"
//                                       >
//                                         Lihat
//                                       </a>
//                                     ) : (
//                                       <span className="text-sm text-gray-500">Tidak Ada</span>
//                                     )}
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <span
//                                       className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
//                                         jadwal.status === "Diterima"
//                                           ? "bg-green-100 text-green-800"
//                                           : jadwal.status === "Ditolak"
//                                           ? "bg-red-100 text-red-800"
//                                           : "bg-yellow-100 text-yellow-800"
//                                       }`}
//                                     >
//                                       {jadwal.status || "Menunggu Konfirmasi"}
//                                     </span>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <div className="text-sm text-gray-500">-</div>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <button
//                                       className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                                       aria-label="Lihat panduan"
//                                     >
//                                       Panduan
//                                     </button>
//                                   </td>
//                                   <td className="px-6 py-4 whitespace-nowrap">
//                                     <button
//                                       className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                                       aria-label="Update perkembangan"
//                                     >
//                                       Update
//                                     </button>
//                                   </td>
//                                 </tr>
//                               );
//                             })}
//                           </tbody>
//                         </table>
//                       </div>
//                       <div className="bg-white px-6 py-4 border-t border-gray-200">
//                         <div className="flex items-center justify-between flex-col sm:flex-row">
//                           <div className="mb-2 sm:mb-0">
//                             <p className="text-sm text-gray-700">
//                               Menampilkan <span className="font-medium">1</span> sampai{" "}
//                               <span className="font-medium">{jadwalList.length}</span> dari{" "}
//                               <span className="font-medium">{jadwalList.length}</span> hasil
//                             </p>
//                           </div>
//                           <div>
//                             <nav
//                               className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//                               aria-label="Pagination"
//                             >
//                               <a
//                                 href="#"
//                                 className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                                 aria-label="Previous page"
//                               >
//                                 <span className="sr-only">Previous</span>
//                                 <svg
//                                   className="h-5 w-5"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   viewBox="0 0 20 20"
//                                   fill="currentColor"
//                                   aria-hidden="true"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                               </a>
//                               <a
//                                 href="#"
//                                 className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-rose-50 text-sm font-medium text-rose-600 hover:bg-rose-100"
//                                 aria-current="page"
//                               >
//                                 1
//                               </a>
//                               <a
//                                 href="#"
//                                 className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
//                                 aria-label="Next page"
//                               >
//                                 <span className="sr-only">Next</span>
//                                 <svg
//                                   className="h-5 w-5"
//                                   xmlns="http://www.w3.org/2000/svg"
//                                   viewBox="0 0 20 20"
//                                   fill="currentColor"
//                                   aria-hidden="true"
//                                 >
//                                   <path
//                                     fillRule="evenodd"
//                                     d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
//                                     clipRule="evenodd"
//                                   />
//                                 </svg>
//                               </a>
//                             </nav>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p>
//                   )}
//                 </div>
//               )}

//               {activeTab === "pesan" && (
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesan</h2>
//                   <div className="space-y-4" role="list" aria-label="Daftar kontak untuk chat">
//                     {[...availableTerapisForChat, ...chatPartners].length > 0 ? (
//                       [...availableTerapisForChat, ...chatPartners]
//                         .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
//                         .map((partner) => (
//                           <div
//                             key={partner.id}
//                             className="flex items-center justify-between border-b border-gray-100 py-3 cursor-pointer hover:bg-gray-50 p-4 rounded-md transition"
//                             onClick={() => openChat(partner)}
//                             role="button"
//                             tabIndex={0}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" || e.key === " ") {
//                                 openChat(partner);
//                               }
//                             }}
//                             aria-label={`Buka chat dengan ${partner.name || "Pengguna"}`}
//                           >
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
//                                 <span className="text-rose-600 font-medium text-lg">
//                                   {partner.name?.charAt(0) || "?"}
//                                 </span>
//                               </div>
//                               <div className="ml-4">
//                                 <h4 className="text-base font-medium text-gray-900">
//                                   {partner.name || "Tidak diketahui"}
//                                 </h4>
//                                 <p className="text-sm text-gray-500">
//                                   {partner.specialization || "Tidak ada spesialisasi"}
//                                 </p>
//                               </div>
//                             </div>
//                             <div className="ml-4 px-3 py-1 text-sm text-rose-500 font-medium">
//                               {chatPartners.some((p) => p.id === partner.id) ? "Buka Chat →" : "Mulai Chat →"}
//                             </div>
//                           </div>
//                         ))
//                     ) : (
//                       <p className="text-sm text-gray-500">Belum ada terapis yang dapat dihubungi.</p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div
//               className="fixed top-4 right-4 z-50 space-y-2 w-72"
//               aria-live="polite"
//               aria-atomic="true"
//             >
//               {toasts.map((toast) => (
//                 <div
//                   key={toast.id}
//                   className={`flex items-start p-3 rounded-lg border shadow-sm animate-fade-in ${
//                     toast.type === "success"
//                       ? "bg-green-50 border-green-100"
//                       : toast.type === "danger"
//                       ? "bg-red-50 border-red-100"
//                       : "bg-yellow-50 border-yellow-100"
//                   }`}
//                 >
//                   <div className="flex-shrink-0">
//                     {toast.type === "success" && (
//                       <svg
//                         className="w-4 h-4 text-green-500"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         aria-hidden="true"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                     {toast.type === "danger" && (
//                       <svg
//                         className="w-4 h-4 text-red-500"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         aria-hidden="true"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                     {toast.type === "warning" && (
//                       <svg
//                         className="w-4 h-4 text-yellow-500"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                         aria-hidden="true"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     )}
//                   </div>
//                   <div className="ml-2">
//                     <h3
//                       className={`text-sm font-medium ${
//                         toast.type === "success"
//                           ? "text-green-800"
//                           : toast.type === "danger"
//                           ? "text-red-800"
//                           : "text-yellow-800"
//                       }`}
//                     >
//                       {toast.title}
//                     </h3>
//                     <p
//                       className={`mt-1 text-sm ${
//                         toast.type === "success"
//                           ? "text-green-600"
//                           : toast.type === "danger"
//                           ? "text-red-600"
//                           : "text-yellow-600"
//                       }`}
//                     >
//                       {toast.message}
//                     </p>
//                   </div>
//                   <button
//                     className={`ml-auto ${
//                       toast.type === "success"
//                         ? "text-green-400 hover:text-green-500"
//                         : toast.type === "danger"
//                         ? "text-red-400 hover:text-red-500"
//                         : "text-yellow-400 hover:text-yellow-500"
//                     }`}
//                     onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
//                     aria-label="Tutup notifikasi"
//                   >
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
//                       <path
//                         fillRule="evenodd"
//                         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//         {isModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Ajukan Jadwal Terapi</h3>
//               <form onSubmit={handleSubmitJadwal} className="space-y-6" encType="multipart/form-data">
//                 <div className="relative">
//                   <label htmlFor="terapis" className="block text-sm font-medium text-gray-700 mb-2">
//                     Pilih Terapis
//                   </label>
//                   <div className="flex items-center">
//                     <svg
//                       className="absolute left-3 top-10 h-5 w-5 text-gray-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
//                       />
//                     </svg>
//                     <select
//                       id="terapis"
//                       value={selectedTerapis}
//                       onChange={(e) => setSelectedTerapis(e.target.value)}
//                       className={`w-full pl-10 pr-4 py-2 rounded-md border ${
//                         formErrors.selectedTerapis ? "border-red-500" : "border-gray-200"
//                       } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`}
//                       aria-invalid={!!formErrors.selectedTerapis}
//                       aria-describedby="terapis-error"
//                     >
//                       <option value="">Pilih Terapis</option>
//                       {terapisList.map((terapis) => (
//                         <option key={terapis.id_terapis} value={terapis.id_terapis}>
//                           {terapis.user?.nama || terapis.nama || "Tidak Diketahui"} (
//                           {terapis.spesialisasi || "Dokter Umum"})
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   {formErrors.selectedTerapis && (
//                     <p id="terapis-error" className="mt-1 text-sm text-red-500">
//                       {formErrors.selectedTerapis}
//                     </p>
//                   )}
//                 </div>
//                 <div className="relative">
//                   <label htmlFor="jadwal" className="block text-sm font-medium text-gray-700 mb-2">
//                     Jadwal Terapi
//                   </label>
//                   <div className="flex items-center">
//                     <svg
//                       className="absolute left-3 top-10 h-5 w-5 text-gray-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                     <input
//                       id="jadwal"
//                       type="datetime-local"
//                       value={jadwal}
//                       onChange={(e) => setJadwal(e.target.value)}
//                       min={new Date().toISOString().slice(0, 16)}
//                       className={`w-full pl-10 pr-4 py-2 rounded-md border ${
//                         formErrors.jadwal ? "border-red-500" : "border-gray-200"
//                       } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`}
//                       required
//                       aria-invalid={!!formErrors.jadwal}
//                       aria-describedby="jadwal-error"
//                     />
//                   </div>
//                   {formErrors.jadwal && (
//                     <p id="jadwal-error" className="mt-1 text-sm text-red-500">
//                       {formErrors.jadwal}
//                     </p>
//                   )}
//                 </div>
//                 <div className="relative">
//                   <label htmlFor="jenisLayanan" className="block text-sm font-medium text-gray-700 mb-2">
//                     Jenis Layanan
//                   </label>
//                   <div className="flex items-center">
//                     <svg
//                       className="absolute left-3 top-10 h-5 w-5 text-gray-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                       />
//                     </svg>
//                     <select
//                       id="jenisLayanan"
//                       value={jenisLayanan}
//                       onChange={(e) => setJenisLayanan(e.target.value)}
//                       className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                     >
//                       <option value="Home Visit">Home Visit (Rp 200.000)</option>
//                       <option value="Online">Online (Rp 30.000)</option>
//                     </select>
//                   </div>
//                 </div>
//                 {jenisLayanan === "Home Visit" && (
//                   <div className="relative">
//                     <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2">
//                       Alamat Kunjungan
//                     </label>
//                     <div className="flex items-start">
//                       <svg
//                         className="absolute left-3 top-10 h-5 w-5 text-gray-400"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         aria-hidden="true"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                         />
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                         />
//                       </svg>
//                       <textarea
//                         id="alamat"
//                         value={alamat}
//                         onChange={(e) => setAlamat(e.target.value)}
//                         placeholder="Masukkan alamat lengkap"
//                         className={`w-full pl-10 pr-4 py-2 rounded-md border ${
//                           formErrors.alamat ? "border-red-500" : "border-gray-200"
//                         } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24`}
//                         required
//                         aria-invalid={!!formErrors.alamat}
//                         aria-describedby="alamat-error"
//                       />
//                     </div>
//                     {formErrors.alamat && (
//                       <p id="alamat-error" className="mt-1 text-sm text-red-500">
//                         {formErrors.alamat}
//                       </p>
//                     )}
//                   </div>
//                 )}
//                 <div className="relative">
//                   <label htmlFor="buktiPembayaran" className="block text-sm font-medium text-gray-700 mb-2">
//                     Bukti Pembayaran
//                   </label>
//                   <div className="flex items-center">
//                     <svg
//                       className="absolute left-3 top-10 h-5 w-5 text-gray-400"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                       aria-hidden="true"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                       />
//                     </svg>
//                     <input
//                       id="buktiPembayaran"
//                       type="file"
//                       accept="image/jpeg,image/png,application/pdf"
//                       onChange={(e) => setBuktiPembayaran(e.target.files[0])}
//                       className={`w-full pl-10 pr-4 py-2 rounded-md border ${
//                         formErrors.buktiPembayaran ? "border-red-500" : "border-gray-200"
//                       } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`}
//                       required
//                       aria-invalid={!!formErrors.buktiPembayaran}
//                       aria-describedby="buktiPembayaran-error"
//                     />
//                   </div>
//                   {buktiPembayaran && (
//                     <p className="mt-2 text-sm text-gray-500">File: {buktiPembayaran.name}</p>
//                   )}
//                   {buktiPembayaran && buktiPembayaran.type.startsWith("image/") && (
//                     <img
//                       src={URL.createObjectURL(buktiPembayaran)}
//                       alt="Bukti Pembayaran Preview"
//                       className="mt-2 w-full h-32 object-contain rounded-md border border-gray-200"
//                     />
//                   )}
//                   <p className="mt-2 text-sm text-gray-500">Unggah file JPG, PNG, atau PDF (maks 2MB).</p>
//                   {formErrors.buktiPembayaran && (
//                     <p id="buktiPembayaran-error" className="mt-1 text-sm text-red-500">
//                       {formErrors.buktiPembayaran}
//                     </p>
//                   )}
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={closeModal}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
//                     aria-label="Batal"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                     aria-label="Ajukan jadwal"
//                   >
//                     Ajukan Jadwal
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         {isEditProfileOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
//               <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profil</h3>
//               <form onSubmit={handleEditProfile} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
//                   <input
//                     type="text"
//                     value={newName}
//                     onChange={(e) => setNewName(e.target.value)}
//                     placeholder="Masukkan nama baru"
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                     required
//                     aria-label="Nama"
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditProfileOpen(false);
//                       setNewName(nama);
//                     }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
//                     aria-label="Batal"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                     aria-label="Simpan profil"
//                   >
//                     Simpan
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//         <ChatModal
//           isOpen={isChatModalOpen}
//           onClose={closeChat}
//           currentUserId={parseInt(userId)}
//           currentUserRole={userRole}
//           chatPartner={selectedChatPartner}
//           token={token}
//           showToast={showToast}
//         />
//       </div>
//     </div>
//   );
// };

// export default DashboardPasien;

  import React, { useEffect, useState } from "react";
  import axios from "axios"; // [cite: 2]
  import { useNavigate } from "react-router-dom";
  import ChatModal from "../components/ChatModal"; // [cite: 2]
  import Footer from "../components/Footer"; // [cite: 2]
  import PdfModal from "./PdfModal";

  const API_URL = "http://localhost:8000/api"; // [cite: 3]
  const STORAGE_URL = "http://localhost:8000/storage/"; // [cite: 3]

  // Progress Update Modal Component
  const ProgressModal = ({ isOpen, onClose, onSubmit, laporanPasienId, showToast }) => {
    const [ringkasanPerkembangan, setRingkasanPerkembangan] = useState("");
    const [filePerkembangan, setFilePerkembangan] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const token = localStorage.getItem("token");

    if (!isOpen) return null;

    const validateProgressForm = () => {
      const errors = {};
      if (!ringkasanPerkembangan.trim()) errors.ringkasanPerkembangan = "Ringkasan perkembangan tidak boleh kosong!";
      if (!filePerkembangan) errors.filePerkembangan = "File perkembangan harus diunggah!";
      // Add file type/size validation if needed
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
      formData.append("file_perkembangan", filePerkembangan);
      formData.append("tanggal_laporan", new Date().toISOString().split('T')[0]); // Current date

      try {
        await axios.post(`${API_URL}/laporan-perkembangan`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        showToast("success", "Sukses", "Laporan perkembangan berhasil dikirim!");
        onSubmit(); // This could be used to refresh data on the parent
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
            <div>
              <label htmlFor="filePerkembangan" className="block text-sm font-medium text-gray-700 mb-2">
                File Pendukung (PDF, DOCX, maks 10MB)
              </label>
              <input
                id="filePerkembangan"
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setFilePerkembangan(e.target.files[0])}
                className={`w-full px-3 py-2 rounded-md border file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 ${
                  formErrors.filePerkembangan ? "border-red-500" : "border-gray-200"
                } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`}
                aria-invalid={!!formErrors.filePerkembangan}
                aria-describedby="file-perkembangan-error"
              />
              {filePerkembangan && (
                <p className="mt-2 text-sm text-gray-500">File: {filePerkembangan.name}</p>
              )}
              {formErrors.filePerkembangan && (
                <p id="file-perkembangan-error" className="mt-1 text-sm text-red-500">
                  {formErrors.filePerkembangan}
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
    const navigate = useNavigate(); // [cite: 2]
    const [nama, setNama] = useState(localStorage.getItem("nama") || "Pasien"); // [cite: 4]
    const token = localStorage.getItem("token"); // [cite: 4]
    const userId = localStorage.getItem("iduser"); // [cite: 4]
    const userRole = localStorage.getItem("role"); // [cite: 4]
    const [activeTab, setActiveTab] = useState("terapis"); // [cite: 5]
    const [terapisList, setTerapisList] = useState([]); // [cite: 5]
    const [jadwalList, setJadwalList] = useState([]); // [cite: 5]
    const [userProfile, setUserProfile] = useState(null); // [cite: 5]
    const [toasts, setToasts] = useState([]); // [cite: 6]
    const [isModalOpen, setIsModalOpen] = useState(false); // [cite: 6]
    const [selectedTerapis, setSelectedTerapis] = useState(""); // [cite: 6]
    const [jadwal, setJadwal] = useState(""); // [cite: 6]
    const [alamat, setAlamat] = useState(""); // [cite: 7]
    const [jenisLayanan, setJenisLayanan] = useState("Home Visit"); // [cite: 7]
    const [buktiPembayaran, setBuktiPembayaran] = useState(null); // [cite: 7]
    const [isChatModalOpen, setIsChatModalOpen] = useState(false); // [cite: 8]
    const [selectedChatPartner, setSelectedChatPartner] = useState(null); // [cite: 8]
    const [chatPartners, setChatPartners] = useState([]); // [cite: 8]
    const [availableTerapisForChat, setAvailableTerapisForChat] = useState([]); // [cite: 8]
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // [cite: 9]
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false); // [cite: 9]
    const [newName, setNewName] = useState(nama); // [cite: 9]
    const [formErrors, setFormErrors] = useState({}); // [cite: 9]

    // New states for added features
    const [laporanPasienList, setLaporanPasienList] = useState([]);
    const [laporanPerkembanganList, setLaporanPerkembanganList] = useState([]);
    const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const [pdfTitle, setPdfTitle] = useState("");
    const [showPdf, setShowPdf] = useState(false);
    const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
    const [selectedLaporanPasienIdForProgress, setSelectedLaporanPasienIdForProgress] = useState(null);


    const showToast = (type, title, message) => { // [cite: 10]
      const id = Date.now(); // [cite: 10]
      setToasts((prev) => [{ id, type, title, message }, ...prev]); // [cite: 11]
      setTimeout(() => { // [cite: 11]
        setToasts((prev) => prev.filter((t) => t.id !== id)); // [cite: 11]
      }, 4000); // [cite: 11]
    };

    const handleLogout = () => { // [cite: 12]
      localStorage.removeItem("token"); // [cite: 12]
      localStorage.removeItem("role"); // [cite: 12]
      localStorage.removeItem("nama"); // [cite: 12]
      localStorage.removeItem("iduser"); // [cite: 12]
      showToast("success", "Logout", "Anda telah keluar dari akun."); // [cite: 13]
      setTimeout(() => navigate("/login"), 1000); // [cite: 13]
    };

    const fetchData = async () => { // Combined fetchData logic
      try {
        const [
          terapisResponse, 
          jadwalResponse, 
          userResponse, 
          chatPartnersResponse, 
          allTerapisResponse,
          laporanPasienResponse, // Fetching Laporan Pasien
          laporanPerkembanganResponse // Fetching Laporan Perkembangan
        ] = await Promise.all([
          axios.get(`${API_URL}/terapis`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/jadwal-terapi`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/chat/partners`, { headers: { Authorization: `Bearer ${token}` } }), // [cite: 14, 15]
          axios.get(`${API_URL}/chat/terapis`, { headers: { Authorization: `Bearer ${token}` } }), // [cite: 15]
          axios.get(`${API_URL}/laporan-pasien`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/laporan-perkembangan`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setTerapisList(terapisResponse.data.data); // [cite: 15]
        setJadwalList(jadwalResponse.data.data.filter((jwl) => jwl.user_id == userId)); // [cite: 15]
        setUserProfile(userResponse.data.data); // [cite: 15]
        setChatPartners(chatPartnersResponse.data.partners); // [cite: 15]
        setAvailableTerapisForChat(allTerapisResponse.data.terapis); // [cite: 15]
        setNewName(userResponse.data.data.nama); // [cite: 16]
        
        setLaporanPasienList(laporanPasienResponse.data.data || []);
        // Filter laporan perkembangan for this user (pasien)
        // Assuming laporanPerkembangan includes nested structure to identify the patient through laporanPasien.jadwalTerapi.user_id
        const userLaporanPerkembangan = (laporanPerkembanganResponse.data.data || []).filter(lp => 
          lp.laporan_pasien && lp.laporan_pasien.jadwal_terapi && lp.laporan_pasien.jadwal_terapi.user_id == userId
        );
        setLaporanPerkembanganList(userLaporanPerkembangan);

      } catch (error) {
        showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message)); // [cite: 16]
      }
    };

    useEffect(() => { // [cite: 14]
      if (token && userId) { // [cite: 17]
        fetchData(); // [cite: 17]
      } else { // [cite: 18]
        navigate("/login"); // [cite: 18]
      }
    }, [token, userId, navigate]); // [cite: 18]

    const validateForm = () => { // [cite: 19]
      const errors = {}; // [cite: 19]
      if (!selectedTerapis) errors.selectedTerapis = "Silakan pilih terapis!"; // [cite: 19]
      if (!jadwal) errors.jadwal = "Silakan pilih jadwal terapi!"; // [cite: 20]
      if (jenisLayanan === "Home Visit" && !alamat.trim()) errors.alamat = "Silakan masukkan alamat!"; // [cite: 20]
      if (!buktiPembayaran) errors.buktiPembayaran = "Silakan unggah bukti pembayaran!"; // [cite: 21]
      setFormErrors(errors); // [cite: 21]
      return Object.keys(errors).length === 0; // [cite: 21]
    };

    const handleSubmitJadwal = async (e) => { // [cite: 22]
      e.preventDefault(); // [cite: 22]
      if (!validateForm()) { // [cite: 23]
        showToast("warning", "Peringatan", "Harap lengkapi semua field yang diperlukan!"); // [cite: 23]
        return; // [cite: 23]
      }

      try { // [cite: 24]
        const formData = new FormData(); // [cite: 24]
        formData.append("terapis_id", selectedTerapis); // [cite: 24]
        formData.append("user_id", userId); // [cite: 24]
        formData.append("jadwal_terapi", jadwal); // [cite: 25]
        formData.append("jenis_layanan", jenisLayanan); // [cite: 25]
        if (jenisLayanan === "Home Visit") formData.append("alamat", alamat); // [cite: 25]
        formData.append("bukti_pembayaran", buktiPembayaran); // [cite: 25]

        await axios.post(`${API_URL}/jadwal-terapi`, formData, { // [cite: 26]
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }, // [cite: 26]
        });
        showToast("success", "Sukses", "Jadwal terapi berhasil diajukan!"); // [cite: 27]

        setSelectedTerapis(""); // [cite: 27]
        setJadwal(""); // [cite: 27]
        setAlamat(""); // [cite: 27]
        setJenisLayanan("Home Visit"); // [cite: 27]
        setBuktiPembayaran(null); // [cite: 27]
        setFormErrors({}); // [cite: 27]
        setIsModalOpen(false); // [cite: 27]
        setTimeout(() => window.location.reload(), 1000); // For simplicity, reloading. Better to update state. // [cite: 27]
      } catch (error) { // [cite: 28]
        showToast("danger", "Error", "Gagal mengajukan jadwal terapi: " + (error.response?.data?.message || error.message)); // [cite: 28]
      }
    };

    const handleEditProfile = async (e) => { // [cite: 29]
      e.preventDefault(); // [cite: 29]
      if (!newName.trim()) { // [cite: 30]
        showToast("warning", "Peringatan", "Nama tidak boleh kosong!"); // [cite: 30]
        return; // [cite: 30]
      }

      try { // [cite: 31]
        await axios.put( // [cite: 31]
          `${API_URL}/users/${userId}`, // [cite: 31]
          { nama: newName }, // [cite: 31]
          { headers: { Authorization: `Bearer ${token}` } } // [cite: 31]
        );
        setNama(newName); // [cite: 32]
        localStorage.setItem("nama", newName); // [cite: 32]
        setUserProfile((prev) => ({ ...prev, nama: newName })); // [cite: 32]
        showToast("success", "Sukses", "Nama berhasil diperbarui!"); // [cite: 32]
        setIsEditProfileOpen(false); // [cite: 32]
      } catch (error) { // [cite: 33]
        showToast("danger", "Error", "Gagal memperbarui nama: " + (error.response?.data?.message || error.message)); // [cite: 33]
      }
    };

    const openChat = (partner) => { // [cite: 34]
      setSelectedChatPartner({ id: partner.id, name: partner.name, role: partner.role, email: partner.email }); // [cite: 34]
      setIsChatModalOpen(true); // [cite: 35]
    };

    const closeChat = () => { // [cite: 35]
      setIsChatModalOpen(false); // [cite: 35]
      setSelectedChatPartner(null); // [cite: 35]
    };

    const openModal = (terapisId) => { // [cite: 36]
      setSelectedTerapis(terapisId || ""); // [cite: 36]
      setIsModalOpen(true); // [cite: 36]
    };

    const closeModal = () => { // [cite: 37]
      setIsModalOpen(false); // [cite: 37]
      setSelectedTerapis(""); // [cite: 37]
      setJadwal(""); // [cite: 37]
      setAlamat(""); // [cite: 37]
      setJenisLayanan("Home Visit"); // [cite: 37]
      setBuktiPembayaran(null); // [cite: 37]
      setFormErrors({}); // [cite: 37]
    };

    const getPhotoUrl = (foto) => (foto ? `${STORAGE_URL}${foto}` : "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg"); // [cite: 38]
    const getBuktiPembayaranUrl = (path) => (path ? `${STORAGE_URL}${path}` : "#"); // [cite: 38]

    // Handlers for new modals
const handleOpenPdfModal = (fileIdentifier, title) => {
  // Encode the fileIdentifier to handle spaces and special characters
  const encodedFileIdentifier = encodeURIComponent(fileIdentifier);
  setPdfUrl(`${STORAGE_URL}panduan_latihan/${encodedFileIdentifier}`);
  console.log("PDF URL:", `${STORAGE_URL}panduan_latihan/${encodedFileIdentifier}`);

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
      // Reset progress form states if necessary, or do it inside ProgressModal's close
    };
    
    const handleProgressSubmitted = () => {
      // Refetch data to show updated progress status or list
      fetchData(); 
    };


    return (
      <div className="flex h-screen bg-gray-50 font-poppins"> {/* [cite: 39] */}
        {/* Sidebar */}
        <input type="checkbox" id="menu-toggle" className="hidden peer" /> {/* [cite: 39] */}
        <div className="hidden peer-checked:flex md:flex flex-col w-64 bg-white border-r border-gray-300 transition-all duration-300 ease-in-out shadow-sm"> {/* [cite: 39] */}
          <div className="flex items-center justify-between h-16 bg-white border-b border-gray-300 px-4"> {/* [cite: 39] */}
            <span className="text-gray-900 text-xl font-bold"> {/* [cite: 39] */}
              Terapy<span className="text-rose-600">Care</span> {/* [cite: 39] */}
            </span>
            <label htmlFor="menu-toggle" className="text-gray-600 cursor-pointer md:hidden"> {/* [cite: 40] */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> {/* [cite: 40] */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> {/* [cite: 40] */}
              </svg>
            </label>
          </div>
          <div className="flex flex-col flex-1 overflow-y-auto"> {/* [cite: 40] */}
            <nav className="flex-1 px-3 py-4"> {/* [cite: 41] */}
              {["terapis", "riwayat", "pesan"].map((tab) => ( // [cite: 41]
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg 
                  transition-colors text-sm font-medium ${ // [cite: 41]
                    activeTab === tab ? // [cite: 42]
                    "bg-rose-50 text-rose-600 border-l-4 border-rose-600" : "border-l-4 border-transparent" // [cite: 43]
                  }`}
                  aria-current={activeTab === tab ? "page" : undefined} // [cite: 43, 44]
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg" // [cite: 44]
                    className="h-5 w-5 mr-3" // [cite: 44]
                    fill="none" // [cite: 44]
                    viewBox="0 0 24 24" // [cite: 45]
                    stroke="currentColor" // [cite: 45]
                    aria-hidden="true" // [cite: 45]
                  >
                    {tab === "terapis" && ( // [cite: 45]
                      <path // [cite: 46]
                        strokeLinecap="round" // [cite: 46]
                        strokeLinejoin="round" // [cite: 46]
                        strokeWidth="2" // [cite: 46]
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 
                        6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" // [cite: 46, 47]
                      />
                    )}
                    {tab === "riwayat" && ( // [cite: 47]
                      <path
                        strokeLinecap="round" // [cite: 48]
                        strokeLinejoin="round" // [cite: 48]
                        strokeWidth="2" // [cite: 48]
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 
                        012-2h2a2 2 0 012 2v5m-4 0h4" // [cite: 48, 49]
                      />
                    )}
                    {tab === "pesan" && ( // [cite: 49]
                      <path
                        strokeLinecap="round" // [cite: 50]
                        strokeLinejoin="round" // [cite: 50]
                        strokeWidth="2" // [cite: 50]
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.582 9 8z" // [cite: 50]
                      />
                    )}
                  </svg>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} {/* [cite: 51] */}
                </button>
              ))}
              <button // [cite: 52]
                onClick={handleLogout} // [cite: 52]
                className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent" // [cite: 52]
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg" // [cite: 52]
                  className="h-5 w-5 mr-3" // [cite: 53]
                  fill="none" // [cite: 53]
                  viewBox="0 0 24 24" // [cite: 53]
                  stroke="currentColor" // [cite: 53]
                  aria-hidden="true" // [cite: 53]
                >
                  <path // [cite: 54]
                    strokeLinecap="round" // [cite: 54]
                    strokeLinejoin="round" // [cite: 54]
                    strokeWidth="2" // [cite: 54]
                    d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" // [cite: 54]
                  />
                </svg>
                Logout {/* [cite: 55] */}
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-y-auto"> {/* [cite: 55] */}
          <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4"> {/* [cite: 56] */}
            <div className="flex items-center"> {/* [cite: 56] */}
              <label
                htmlFor="menu-toggle"
                className="md:hidden mr-4 bg-rose-600 text-white p-2 rounded focus:outline-none cursor-pointer" // [cite: 56]
                aria-label="Toggle sidebar" // [cite: 56]
              >
                <svg // [cite: 57]
                  xmlns="http://www.w3.org/2000/svg" // [cite: 57]
                  className="h-6 w-6" // [cite: 57]
                  fill="none" // [cite: 57]
                  viewBox="0 0 24 24" // [cite: 57]
                  stroke="white" // [cite: 57]
                  aria-hidden="true" // [cite: 58]
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /> {/* [cite: 58] */}
                </svg>
              </label>
              <svg
                xmlns="http://www.w3.org/2000/svg" // [cite: 58]
                fill="none" // [cite: 59]
                viewBox="0 0 24 24" // [cite: 59]
                strokeWidth="1.5" // [cite: 59]
                stroke="currentColor" // [cite: 59]
                className="h-6 w-6 mr-2 text-gray-600" // [cite: 59]
                aria-hidden="true" // [cite: 59]
              >
                <path // [cite: 60]
                  strokeLinecap="round" // [cite: 60]
                  strokeLinejoin="round" // [cite: 60]
                  d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" // [cite: 60]
                />
              </svg>
              <input
                className="mx-2 w-full max-w-xs border rounded-md px-4 py-2 text-sm focus:border-rose-600 focus:ring-2 focus:ring-rose-100" // [cite: 61]
                type="text" // [cite: 61]
                placeholder="Cari..." // [cite: 61]
                aria-label="Search" // [cite: 61]
              />
            </div>
            <div className="relative"> {/* [cite: 62] */}
              <img
                src={userProfile?.foto ? getPhotoUrl(userProfile.foto) : "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg"} // [cite: 62, 63]
                alt="Profile" // [cite: 63]
                className="w-10 h-10 rounded-full object-cover cursor-pointer" // [cite: 63]
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // [cite: 63]
                onError={(e) => { // [cite: 63]
                  e.target.src = "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg"; // [cite: 63]
                }}
                aria-label="Toggle profile dropdown" // [cite: 64]
              />
              {isDropdownOpen && ( // [cite: 64]
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50"> {/* [cite: 64] */}
                  <div className="py-2"> {/* [cite: 64] */}
                    <p className="px-4 py-2 text-sm text-gray-700 font-medium">{nama}</p> {/* [cite: 65] */}
                    <button
                      onClick={() => { // [cite: 65]
                        setIsEditProfileOpen(true); // [cite: 65]
                        setIsDropdownOpen(false); // [cite: 65]
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition" // [cite: 66]
                      aria-label="Edit profile" // [cite: 66]
                    >
                      Edit Profil
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <section className=" bg-gray-50 py-6 px-4 sm:px-6 lg:px-8"> {/* [cite: 67] */}
            <div className="max-w-7xl mx-auto"> {/* [cite: 68] */}
              <div className="bg-white rounded-lg shadow-sm p-6"> {/* [cite: 68] */}
                {activeTab === "terapis" && ( // [cite: 68]
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Daftar Terapis</h2> {/* [cite: 68] */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {terapisList.map((terapis) => ( // [cite: 69]
                        <div
                          key={terapis.id_terapis} // [cite: 69]
                          className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden" // [cite: 69]
                        >
                          <img
                            src={getPhotoUrl(terapis.foto)} // [cite: 70]
                            alt={terapis.user?.nama || terapis.nama || "Dokter"} // [cite: 70, 71]
                            className="w-full h-80 object-cover" // [cite: 71]
                            onError={(e) => { // [cite: 71]
                              e.target.src = "https://img.freepik.com/premium-vector/profile-icon_933463-643.jpg"; // [cite: 71]
                            }}
                          />
                          <div className="p-4 text-center"> {/* [cite: 72] */}
                            <h3 className="text-sm font-medium text-gray-900"> {/* [cite: 72] */}
                              {terapis.user?.nama || terapis.nama || "Tidak Diketahui"} {/* [cite: 73, 74] */}
                            </h3>
                            <p className="text-xs text-gray-500">{terapis.spesialisasi || "Dokter Umum"}</p> {/* [cite: 74, 75] */}
                            <button
                              onClick={() => openModal(terapis.id_terapis)} // [cite: 75]
                              className="mt-4 w-full bg-rose-600 text-white text-xs font-medium py-2 rounded-md hover:bg-rose-700 transition-colors" // [cite: 75]
                              aria-label={`Buat janji dengan ${terapis.user?.nama || terapis.nama || "Dokter"}`} // [cite: 76, 77]
                            >
                              Buat Janji
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "riwayat" && ( // [cite: 79]
                  <div>
                    {jadwalList.length > 0 ? ( // [cite: 79]
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden"> {/* [cite: 79] */}
                        <div className="p-6 border-b border-gray-200"> {/* [cite: 80] */}
                          <h2 className="text-lg font-semibold text-gray-800">Riwayat Jadwal Terapi</h2> {/* [cite: 80] */}
                          <p className="text-sm text-gray-500 mt-1">Kelola jadwal terapi Anda di sini.</p> {/* [cite: 80] */}
                        </div>
                        <div className="overflow-x-auto"> {/* [cite: 81] */}
                          <table className="min-w-full divide-y divide-gray-200"> {/* [cite: 81] */}
                            <thead className="bg-gray-50"> {/* [cite: 81] */}
                              <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terapis</th> {/* [cite: 82, 83] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jadwal</th> {/* [cite: 84, 85] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Layanan</th> {/* [cite: 86, 87] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th> {/* [cite: 88, 89] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th> {/* [cite: 90, 91] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th> {/* [cite: 92, 93] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> {/* [cite: 94, 95] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keluhan Terapis</th> {/* MODIFIED */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Panduan</th> {/* [cite: 98, 99] */}
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Perkembangan</th> {/* MODIFIED */}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200"> {/* [cite: 102] */}
                              {jadwalList.map((jadwalItem) => {
                                const terapis = terapisList.find((t) => t.id_terapis == jadwalItem.terapis_id); // [cite: 102]
                                // Find the corresponding LaporanPasien for this jadwalItem
                                const laporanPasien = laporanPasienList.find(
                                  (lp) => lp.jadwal_terapi_id_jadwal_terapi === jadwalItem.id_jadwal_terapi
                                );
                                // Find if progress has been submitted for this laporanPasien
                                const perkembanganSubmitted = laporanPasien ? laporanPerkembanganList.find(
                                  (l_perk) => l_perk.laporan_pasiens_id_laporan_pasiens === laporanPasien.id_laporan_pasien
                                ) : null;

                                return (
                                  <tr key={jadwalItem.id_jadwal_terapi} className="hover:bg-gray-50 transition-colors duration-150"> {/* [cite: 103, 104] */}
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 104] */}
                                      <div className="text-sm text-gray-900">{terapis?.user?.nama || terapis?.nama || "Tidak Diketahui"}</div> {/* [cite: 105] */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 106] */}
                                      <div className="text-sm text-gray-900"> {/* [cite: 106] */}
                                        {new Date(jadwalItem.jadwal_terapi).toLocaleString("id-ID", { // [cite: 107]
                                          dateStyle: "medium", // [cite: 107]
                                          timeStyle: "short", // [cite: 108]
                                        })}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 109] */}
                                      <div className="text-sm text-gray-900">{jadwalItem.jenis_layanan}</div> {/* [cite: 110] */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 110] */}
                                      <div className="text-sm text-gray-900"> {/* [cite: 111] */}
                                        {jadwalItem.jenis_layanan === "Home Visit" ? jadwalItem.alamat || "-" : "-"} {/* [cite: 111, 112] */}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 113] */}
                                      <div className="text-sm text-gray-900"> {/* [cite: 113] */}
                                        Rp {parseFloat(jadwalItem.nominal_payment).toLocaleString("id-ID")} {/* [cite: 113] */}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 114] */}
                                      {jadwalItem.bukti_pembayaran ? ( // [cite: 115]
                                        <a
                                          href={getBuktiPembayaranUrl(jadwalItem.bukti_pembayaran)} // [cite: 116]
                                          target="_blank" // [cite: 117]
                                          rel="noopener noreferrer" // [cite: 117]
                                          className="text-rose-600 hover:text-rose-700 text-sm" // [cite: 117, 118]
                                          aria-label="Lihat bukti pembayaran" // [cite: 118]
                                        >
                                          Lihat {/* [cite: 119] */}
                                        </a>
                                      ) : (
                                        <span className="text-sm text-gray-500">Tidak Ada</span> // [cite: 120]
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"> {/* [cite: 121] */}
                                      <span
                                        className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${ // [cite: 122]
                                          jadwalItem.status === "Diterima" // [cite: 122]
                                            ? "bg-green-100 text-green-800" // [cite: 123, 124]
                                            : jadwalItem.status === "Ditolak" // [cite: 124]
                                            ? "bg-red-100 text-red-800" // [cite: 124, 125]
                                            : "bg-yellow-100 text-yellow-800" // [cite: 125]
                                        }`}
                                      >
                                        {jadwalItem.status || "Menunggu Konfirmasi"} {/* [cite: 126, 127] */}
                                      </span>
                                    </td>
                                    {/* Keluhan Terapis Column */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm text-gray-700">
                                        {laporanPasien ? (
                                          laporanPasien.keluhan_pasien || <span className="text-gray-400 italic">Tidak ada keluhan</span>
                                        ) : (
                                          <span className="text-gray-400 italic">Belum ada catatan</span>
                                        )}
                                      </div>
                                    </td>
                                    {/* Panduan Column */}
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
                                    {/* Update Perkembangan Column */}
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {laporanPasien ? ( // Can only update if therapist has made a report (laporanPasien)
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
                        {/* Pagination (existing code) */} {/* [cite: 136] */}
                        <div className="bg-white px-6 py-4 border-t border-gray-200"> {/* [cite: 136] */}
                          <div className="flex items-center justify-between flex-col sm:flex-row"> {/* [cite: 137] */}
                            <div className="mb-2 sm:mb-0"> {/* [cite: 137] */}
                              <p className="text-sm text-gray-700"> {/* [cite: 137] */}
                                Menampilkan <span className="font-medium">1</span> sampai{" "} {/* [cite: 138] */}
                                <span className="font-medium">{jadwalList.length}</span> dari{" "} {/* [cite: 138] */}
                                <span className="font-medium">{jadwalList.length}</span> hasil {/* [cite: 138] */}
                              </p>
                            </div>
                            <div> {/* [cite: 139] */}
                              <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" // [cite: 140]
                                aria-label="Pagination" // [cite: 140]
                              >
                                <a
                                  href="#" // [cite: 141]
                                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" // [cite: 141]
                                  aria-label="Previous page" // [cite: 142]
                                >
                                  <span className="sr-only">Previous</span> {/* [cite: 142] */}
                                  <svg // [cite: 143]
                                    className="h-5 w-5" // [cite: 143]
                                    xmlns="http://www.w3.org/2000/svg" // [cite: 143]
                                    viewBox="0 0 20 20" // [cite: 144]
                                    fill="currentColor" // [cite: 144]
                                    aria-hidden="true" // [cite: 144]
                                  >
                                    <path // [cite: 145]
                                      fillRule="evenodd" // [cite: 145]
                                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" // [cite: 146]
                                      clipRule="evenodd" // [cite: 146]
                                    />
                                  </svg>
                                </a>
                                <a
                                  href="#" // [cite: 148]
                                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-rose-50 text-sm font-medium text-rose-600 hover:bg-rose-100" // [cite: 148]
                                  aria-current="page" // [cite: 149]
                                >
                                  1 {/* [cite: 149] */}
                                </a>
                                <a
                                  href="#" // [cite: 150]
                                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" // [cite: 151]
                                  aria-label="Next page" // [cite: 151]
                                >
                                  <span className="sr-only">Next</span> {/* [cite: 152] */}
                                  <svg // [cite: 152]
                                    className="h-5 w-5" // [cite: 152]
                                    xmlns="http://www.w3.org/2000/svg" // [cite: 153]
                                    viewBox="0 0 20 20" // [cite: 153]
                                    fill="currentColor" // [cite: 153]
                                    aria-hidden="true" // [cite: 154]
                                  >
                                    <path
                                      fillRule="evenodd" // [cite: 155]
                                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" // [cite: 155]
                                      clipRule="evenodd" // [cite: 156]
                                    />
                                  </svg>
                                </a>
                              </nav>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p> // [cite: 158]
                    )}
                  </div>
                )}

                {activeTab === "pesan" && ( // [cite: 159]
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesan</h2> {/* [cite: 159] */}
                    <div className="space-y-4" role="list" aria-label="Daftar kontak untuk chat"> {/* [cite: 159, 160] */}
                      {[...availableTerapisForChat, ...chatPartners].length > 0 ? ( // [cite: 160]
                        [...availableTerapisForChat, ...chatPartners] // [cite: 161]
                          .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)) // [cite: 161]
                          .map((partner) => ( // [cite: 161]
                            <div
                              key={partner.id} // [cite: 162]
                              className="flex items-center justify-between border-b border-gray-100 py-3 cursor-pointer hover:bg-gray-50 p-4 rounded-md transition" // [cite: 162]
                              onClick={() => openChat(partner)} // [cite: 163]
                              role="button" // [cite: 163]
                              tabIndex={0} // [cite: 163]
                              onKeyDown={(e) => { // [cite: 163]
                                if (e.key === "Enter" || e.key === " ") { // [cite: 164]
                                  openChat(partner); // [cite: 164]
                                }
                              }}
                              aria-label={`Buka chat dengan ${partner.name || "Pengguna"}`} // [cite: 165]
                            >
                              <div className="flex items-center"> {/* [cite: 166] */}
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center"> {/* [cite: 166] */}
                                  <span className="text-rose-600 font-medium text-lg"> {/* [cite: 166] */}
                                    {partner.name?.charAt(0) || "?"} {/* [cite: 167, 168] */}
                                  </span>
                                </div>
                                <div className="ml-4"> {/* [cite: 168] */}
                                  <h4 className="text-base font-medium text-gray-900">{partner.name || "Tidak diketahui"}</h4> {/* [cite: 169, 170] */}
                                  <p className="text-sm text-gray-500">{partner.specialization || "Tidak ada spesialisasi"}</p> {/* [cite: 170, 171] */}
                                </div>
                              </div>
                              <div className="ml-4 px-3 py-1 text-sm text-rose-500 font-medium"> {/* [cite: 172] */}
                                {chatPartners.some((p) => p.id === partner.id) ? "Buka Chat →" : "Mulai Chat →"} {/* [cite: 172, 173] */}
                              </div>
                            </div>
                          ))
                      ) : ( // [cite: 174]
                        <p className="text-sm text-gray-500">Belum ada terapis yang dapat dihubungi.</p> // [cite: 174]
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Toast Notifications (existing code) */} {/* [cite: 175] */}
              <div
                className="fixed top-4 right-4 z-50 space-y-2 w-72" // [cite: 175]
                aria-live="polite" // [cite: 175]
                aria-atomic="true" // [cite: 175]
              >
                {toasts.map((toast) => ( // [cite: 176]
                  <div
                    key={toast.id} // [cite: 176]
                    className={`flex items-start p-3 rounded-lg border shadow-sm animate-fade-in ${ // [cite: 176]
                      toast.type === "success" // [cite: 176]
                        ? "bg-green-50 border-green-100" // [cite: 177]
                        : toast.type === "danger" // [cite: 177]
                        ? "bg-red-50 border-red-100" // [cite: 177]
                        : "bg-yellow-50 border-yellow-100" // [cite: 177]
                    }`}
                  >
                    <div className="flex-shrink-0"> {/* [cite: 178] */}
                      {toast.type === "success" && ( // [cite: 178]
                        <svg
                          className="w-4 h-4 text-green-500" // [cite: 179]
                          fill="currentColor" // [cite: 179]
                          viewBox="0 0 20 20" // [cite: 179]
                          aria-hidden="true" // [cite: 179]
                        >
                          <path // [cite: 180]
                            fillRule="evenodd" // [cite: 180]
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 
                            0 001.414 0l4-4z" // [cite: 180, 181]
                            clipRule="evenodd" // [cite: 181]
                          />
                        </svg>
                      )}
                      {toast.type === "danger" && ( // [cite: 182]
                        <svg
                          className="w-4 h-4 text-red-500" // [cite: 182]
                          fill="currentColor" // [cite: 182]
                          viewBox="0 0 20 20" // [cite: 183]
                          aria-hidden="true" // [cite: 183]
                        >
                          <path
                            fillRule="evenodd" // [cite: 184]
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" // [cite: 184]
                            clipRule="evenodd" // [cite: 184]
                          />
                        </svg>
                      )}
                      {toast.type === "warning" && ( // [cite: 185]
                        <svg
                          className="w-4 h-4 text-yellow-500" // [cite: 186]
                          fill="currentColor" // [cite: 186]
                          viewBox="0 0 20 20" // [cite: 186]
                          aria-hidden="true" // [cite: 187]
                        >
                          <path // [cite: 187]
                            fillRule="evenodd" // [cite: 187]
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" // [cite: 188]
                            clipRule="evenodd" // [cite: 188]
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-2"> {/* [cite: 189] */}
                      <h3
                        className={`text-sm font-medium ${ // [cite: 190]
                          toast.type === "success" // [cite: 190]
                            ? "text-green-800" // [cite: 191]
                            : toast.type === "danger" // [cite: 191]
                            ? "text-red-800" // [cite: 192]
                            : "text-yellow-800" // [cite: 192]
                        }`}
                      >
                        {toast.title} {/* [cite: 192] */}
                      </h3>
                      <p
                        className={`mt-1 text-sm ${ // [cite: 193]
                          toast.type === "success" // [cite: 193]
                            ? "text-green-600" // [cite: 194]
                            : toast.type === "danger" // [cite: 194]
                            ? "text-red-600" // [cite: 195]
                            : "text-yellow-600" // [cite: 195]
                        }`}
                      >
                        {toast.message} {/* [cite: 195] */}
                      </p>
                    </div>
                    <button
                      className={`ml-auto ${ // [cite: 196]
                        toast.type === "success" // [cite: 196]
                          ? "text-green-400 hover:text-green-500" // [cite: 197, 198]
                          : toast.type === "danger" // [cite: 198]
                          ? "text-red-400 hover:text-red-500" // [cite: 199]
                          : "text-yellow-400 hover:text-yellow-500" // [cite: 199]
                      }`}
                      onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))} // [cite: 199]
                      aria-label="Tutup notifikasi" // [cite: 199]
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"> {/* [cite: 200] */}
                        <path // [cite: 200]
                          fillRule="evenodd" // [cite: 200]
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" // [cite: 201]
                          clipRule="evenodd" // [cite: 201]
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
          {/* Jadwal Modal (existing code) */} {/* [cite: 202] */}
          {isModalOpen && ( // [cite: 202]
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> {/* [cite: 203] */}
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg"> {/* [cite: 203] */}
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Ajukan Jadwal Terapi</h3> {/* [cite: 203] */}
                <form onSubmit={handleSubmitJadwal} className="space-y-6" encType="multipart/form-data"> {/* [cite: 203] */}
                  <div className="relative"> {/* [cite: 203] */}
                    <label htmlFor="terapis" className="block text-sm font-medium text-gray-700 mb-2"> {/* [cite: 204] */}
                      Pilih Terapis
                    </label>
                    <div className="flex items-center"> {/* [cite: 204] */}
                      <svg
                        className="absolute left-3 top-10 h-5 w-5 text-gray-400" // [cite: 205]
                        xmlns="http://www.w3.org/2000/svg" // [cite: 205]
                        fill="none" // [cite: 205]
                        viewBox="0 0 24 24" // [cite: 205]
                        stroke="currentColor" // [cite: 206]
                        aria-hidden="true" // [cite: 206]
                      >
                        <path // [cite: 206]
                          strokeLinecap="round" // [cite: 206]
                          strokeLinejoin="round" // [cite: 207]
                          strokeWidth="2" // [cite: 207]
                          d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" // [cite: 207]
                        />
                      </svg>
                      <select
                        id="terapis" // [cite: 208]
                        value={selectedTerapis} // [cite: 208]
                        onChange={(e) => setSelectedTerapis(e.target.value)} // [cite: 209]
                        className={`w-full pl-10 pr-4 py-2 rounded-md border ${ // [cite: 209]
                          formErrors.selectedTerapis ? "border-red-500" : "border-gray-200" // [cite: 209, 210]
                        } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`} // [cite: 210]
                        aria-invalid={!!formErrors.selectedTerapis} // [cite: 210]
                        aria-describedby="terapis-error" // [cite: 210]
                      >
                        <option value="">Pilih Terapis</option> {/* [cite: 211] */}
                        {terapisList.map((terapis) => ( // [cite: 211]
                          <option key={terapis.id_terapis} value={terapis.id_terapis}> {/* [cite: 211] */}
                            {terapis.user?.nama || terapis.nama || "Tidak Diketahui"} ( {/* [cite: 211] */}
                            {terapis.spesialisasi || "Dokter Umum"}) {/* [cite: 212] */}
                          </option>
                        ))}
                      </select>
                    </div>
                    {formErrors.selectedTerapis && ( // [cite: 213]
                      <p id="terapis-error" className="mt-1 text-sm text-red-500"> {/* [cite: 213] */}
                        {formErrors.selectedTerapis} {/* [cite: 213] */}
                      </p>
                    )}
                  </div>
                  <div className="relative"> {/* [cite: 214] */}
                    <label htmlFor="jadwal" className="block text-sm font-medium text-gray-700 mb-2"> {/* [cite: 214] */}
                      Jadwal Terapi
                    </label>
                    <div className="flex items-center"> {/* [cite: 215] */}
                      <svg
                        className="absolute left-3 top-10 h-5 w-5 text-gray-400" // [cite: 215]
                        xmlns="http://www.w3.org/2000/svg" // [cite: 216]
                        fill="none" // [cite: 216]
                        viewBox="0 0 24 24" // [cite: 216]
                        stroke="currentColor" // [cite: 216]
                        aria-hidden="true" // [cite: 216]
                      >
                        <path // [cite: 217]
                          strokeLinecap="round" // [cite: 217]
                          strokeLinejoin="round" // [cite: 217]
                          strokeWidth="2" // [cite: 218]
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" // [cite: 218]
                        />
                      </svg>
                      <input
                        id="jadwal" // [cite: 219]
                        type="datetime-local" // [cite: 219]
                        value={jadwal} // [cite: 219]
                        onChange={(e) => setJadwal(e.target.value)} // [cite: 219, 220]
                        min={new Date().toISOString().slice(0, 16)} // [cite: 220]
                        className={`w-full pl-10 pr-4 py-2 rounded-md border ${ // [cite: 220]
                          formErrors.jadwal ? "border-red-500" : "border-gray-200" // [cite: 220, 221]
                        } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`} // [cite: 221]
                        required // [cite: 221]
                        aria-invalid={!!formErrors.jadwal} // [cite: 221]
                        aria-describedby="jadwal-error" // [cite: 221]
                      />
                    </div>
                    {formErrors.jadwal && ( // [cite: 222]
                      <p id="jadwal-error" className="mt-1 text-sm text-red-500"> {/* [cite: 222] */}
                        {formErrors.jadwal} {/* [cite: 223] */}
                      </p>
                    )}
                  </div>
                  <div className="relative"> {/* [cite: 223] */}
                    <label htmlFor="jenisLayanan" className="block text-sm font-medium text-gray-700 mb-2"> {/* [cite: 223] */}
                      Jenis Layanan {/* [cite: 224] */}
                    </label>
                    <div className="flex items-center"> {/* [cite: 224] */}
                      <svg
                        className="absolute left-3 top-10 h-5 
  w-5 text-gray-400" // [cite: 224, 225]
                        xmlns="http://www.w3.org/2000/svg" // [cite: 225]
                        fill="none" // [cite: 225]
                        viewBox="0 0 24 24" // [cite: 225]
                        stroke="currentColor" // [cite: 225]
                        aria-hidden="true" // [cite: 226]
                      >
                        <path // [cite: 226]
                          strokeLinecap="round" // [cite: 226]
                          strokeLinejoin="round" // [cite: 227]
                          strokeWidth="2" // [cite: 227]
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" // [cite: 227]
                        />
                      </svg>
                      <select
                        id="jenisLayanan" // [cite: 228]
                        value={jenisLayanan} // [cite: 228]
                        onChange={(e) => setJenisLayanan(e.target.value)} // [cite: 229]
                        className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm" // [cite: 229]
                      >
                        <option value="Home Visit">Home Visit (Rp 200.000)</option> {/* [cite: 229] */}
                        <option value="Online">Online (Rp 30.000)</option> {/* [cite: 230] */}
                      </select>
                    </div>
                  </div>
                  {jenisLayanan === "Home Visit" && ( // [cite: 230]
                    <div className="relative"> {/* [cite: 231] */}
                      <label htmlFor="alamat" className="block text-sm font-medium text-gray-700 mb-2"> {/* [cite: 231] */}
                        Alamat Kunjungan
                      </label>
                      <div className="flex items-start"> {/* [cite: 232] */}
                        <svg
                          className="absolute left-3 top-10 h-5 w-5 text-gray-400" // [cite: 232]
                          xmlns="http://www.w3.org/2000/svg" // [cite: 232]
                          fill="none" // [cite: 233]
                          viewBox="0 0 24 24" // [cite: 233]
                          stroke="currentColor" // [cite: 233]
                          aria-hidden="true" // [cite: 233]
                        >
                          <path // [cite: 234]
                            strokeLinecap="round" // [cite: 234]
                            strokeLinejoin="round" // [cite: 234]
                            strokeWidth="2" // [cite: 235]
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" // [cite: 235]
                          />
                          <path
                            strokeLinecap="round" // [cite: 236]
                            strokeLinejoin="round" // [cite: 236]
                            strokeWidth="2" // [cite: 236]
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 
  0z" // [cite: 236, 237]
                          />
                        </svg>
                        <textarea
                          id="alamat" // [cite: 237]
                          value={alamat} // [cite: 238]
                          onChange={(e) => setAlamat(e.target.value)} // [cite: 238]
                          placeholder="Masukkan alamat lengkap" // [cite: 238]
                          className={`w-full pl-10 pr-4 py-2 rounded-md border ${ // [cite: 238]
                            formErrors.alamat ? "border-red-500" : "border-gray-200" // [cite: 239, 240]
                          } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24`} // [cite: 240]
                          required // [cite: 240]
                          aria-invalid={!!formErrors.alamat} // [cite: 240]
                          aria-describedby="alamat-error" // [cite: 241]
                        />
                      </div>
                      {formErrors.alamat && ( // [cite: 241]
                        <p id="alamat-error" className="mt-1 text-sm text-red-500"> {/* [cite: 241] */}
                          {formErrors.alamat} {/* [cite: 242] */}
                        </p>
                      )}
                    </div>
                  )}
                  <div className="relative"> {/* [cite: 243] */}
                    <label htmlFor="buktiPembayaran" className="block text-sm font-medium text-gray-700 mb-2"> {/* [cite: 243] */}
                      Bukti Pembayaran
                    </label>
                    <div className="flex items-center"> {/* [cite: 243] */}
                      <svg
                        className="absolute left-3 top-10 h-5 w-5 text-gray-400" // [cite: 244]
                        xmlns="http://www.w3.org/2000/svg" // [cite: 244]
                        fill="none" // [cite: 244]
                        viewBox="0 0 24 24" // [cite: 245]
                        stroke="currentColor" // [cite: 245]
                        aria-hidden="true" // [cite: 245]
                      >
                        <path
                          strokeLinecap="round" // [cite: 246]
                          strokeLinejoin="round" // [cite: 246]
                          strokeWidth="2" // [cite: 246]
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 
  16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" // [cite: 246, 247]
                        />
                      </svg>
                      <input
                        id="buktiPembayaran" // [cite: 248]
                        type="file" // [cite: 248]
                        accept="image/jpeg,image/png,application/pdf" // [cite: 248]
                        onChange={(e) => setBuktiPembayaran(e.target.files[0])} // [cite: 248]
                        className={`w-full pl-10 pr-4 py-2 rounded-md border 
  ${// [cite: 248, 249]
                          formErrors.buktiPembayaran ? "border-red-500" : "border-gray-200" // [cite: 249, 250]
                        } bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm`} // [cite: 250]
                        required // [cite: 250]
                        aria-invalid={!!formErrors.buktiPembayaran} // [cite: 250]
                        aria-describedby="buktiPembayaran-error" // [cite: 250]
                      />
                    </div>
                    {buktiPembayaran && ( // [cite: 251]
                      <p className="mt-2 text-sm text-gray-500">File: {buktiPembayaran.name}</p> // [cite: 251]
                    )}
                    {buktiPembayaran && buktiPembayaran.type.startsWith("image/") && ( // [cite: 252]
                      <img
                        src={URL.createObjectURL(buktiPembayaran)} // [cite: 252]
                        alt="Bukti Pembayaran Preview" // [cite: 252]
                        className="mt-2 w-full h-32 object-contain rounded-md border border-gray-200" // [cite: 253]
                      />
                    )}
                    <p className="mt-2 text-sm text-gray-500">Unggah file JPG, PNG, atau PDF (maks 2MB).</p> {/* [cite: 253] */}
                    {formErrors.buktiPembayaran && ( // [cite: 253]
                      <p id="buktiPembayaran-error" className="mt-1 text-sm text-red-500"> {/* [cite: 254] */}
                        {formErrors.buktiPembayaran} {/* [cite: 254] */}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3"> {/* [cite: 255] */}
                    <button
                      type="button" // [cite: 255]
                      onClick={closeModal} // [cite: 255]
                      className="px-4 py-2 text-sm font-medium text-gray-700 
  bg-gray-200 rounded-md hover:bg-gray-300 transition" // [cite: 255, 256]
                      aria-label="Batal" // [cite: 256]
                    >
                      Batal
                    </button>
                    <button
                      type="submit" // [cite: 257]
                      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition" // [cite: 257]
                      aria-label="Ajukan jadwal" // [cite: 257]
                    >
                      Ajukan Jadwal {/* [cite: 258] */}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Edit Profile Modal (existing code) */} {/* [cite: 258] */}
          {isEditProfileOpen && ( // [cite: 258]
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"> {/* [cite: 259] */}
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg"> {/* [cite: 259] */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profil</h3> {/* [cite: 259] */}
                <form onSubmit={handleEditProfile} className="space-y-4"> {/* [cite: 259] */}
                  <div> {/* [cite: 259] */}
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label> {/* [cite: 260] */}
                    <input
                      type="text" // [cite: 260]
                      value={newName} // [cite: 260]
                      onChange={(e) => setNewName(e.target.value)} // [cite: 260]
                      placeholder="Masukkan nama baru" // [cite: 261]
                      className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm" // [cite: 261]
                      required // [cite: 261]
                      aria-label="Nama" // [cite: 261]
                    />
                  </div>
                  <div className="flex justify-end space-x-3"> {/* [cite: 262] */}
                    <button
                      type="button" // [cite: 262]
                      onClick={() => { // [cite: 262]
                        setIsEditProfileOpen(false); // [cite: 263]
                        setNewName(nama); // [cite: 263]
  }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition" // [cite: 264]
                      aria-label="Batal" // [cite: 264]
                    >
                      Batal {/* [cite: 264] */}
                    </button>
                    <button
                      type="submit" // [cite: 265]
                      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition" // [cite: 265]
                      aria-label="Simpan profil" // [cite: 265]
                    >
                      Simpan {/* [cite: 266] */}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <ChatModal
            isOpen={isChatModalOpen} // [cite: 267]
            onClose={closeChat} // [cite: 267]
            currentUserId={parseInt(userId)} // [cite: 267]
            currentUserRole={userRole} // [cite: 267]
            chatPartner={selectedChatPartner} // [cite: 267]
            token={token} // [cite: 267]
            showToast={showToast} // [cite: 267]
          />
          {/* PDF Viewer Modal */}
          <PdfModal 
            isOpen={isPdfModalOpen}
            onClose={handleClosePdfModal}
            pdfUrl={pdfUrl}
            title={pdfTitle}
          />
          {/* Progress Update Modal */}
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