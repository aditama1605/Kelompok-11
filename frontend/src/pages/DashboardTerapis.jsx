// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const API_URL = "http://localhost:8000/api";

// const DashboardTerapis = () => {
//   const [terapisData, setTerapisData] = useState(null);
//   const [jadwalList, setJadwalList] = useState([]);
//   const [toasts, setToasts] = useState([]);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const iduser = localStorage.getItem("iduser");

//   useEffect(() => {
//     const loadData = async () => {
//       // Langkah 1: Ambil data terapis
//       await fetchTerapisData();
//     };
//     loadData();
//   }, [token, iduser]);

//   useEffect(() => {
//     // Langkah 2: Ambil data jadwal hanya setelah terapisData tersedia
//     if (terapisData) {
//       fetchJadwalData();
//     }
//   }, [terapisData]);

//   const fetchTerapisData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/terapis`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Respons API /terapis:", response.data); // Debug: Log respons API
//       const terapis = response.data.data.find((t) => t.iduser == iduser);
//       if (terapis) {
//         console.log("Terapis yang ditemukan:", terapis); // Debug: Log terapis yang cocok
//         setTerapisData(terapis);
//       } else {
//         console.log("Tidak ada terapis yang cocok dengan iduser:", iduser);
//         showToast("danger", "Error", "Data terapis tidak ditemukan");
//       }
//     } catch (error) {
//       console.error("Error fetchTerapisData:", error.response?.data || error.message);
//       showToast("danger", "Error", "Gagal mengambil data terapis: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const fetchJadwalData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/jadwal-terapi`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("Respons API /jadwal-terapi:", response.data); // Debug: Log respons API
//       console.log("TerapisData saat ini:", terapisData); // Debug: Log terapisData

//       // Pastikan terapisData tersedia dan memiliki id_terapis
//       if (!terapisData || !terapisData.id_terapis) {
//         console.log("TerapisData tidak valid:", terapisData);
//         showToast("danger", "Error", "Data terapis tidak valid");
//         return;
//       }

//       // Filter jadwal berdasarkan terapis_id
//       const filteredJadwal = response.data.data.filter((jadwal) => {
//         const match = jadwal.terapis_id == terapisData.id_terapis;
//         console.log(`Mencocokkan jadwal ${jadwal.id_jadwal_terapi}: terapis_id=${jadwal.terapis_id}, id_terapis=${terapisData.id_terapis}, Cocok=${match}`);
//         return match;
//       });

//       console.log("Filtered Jadwal:", filteredJadwal); // Debug: Log hasil filter
//       setJadwalList(filteredJadwal);

//       if (filteredJadwal.length === 0) {
//         showToast("info", "Info", "Belum ada jadwal yang diajukan untuk Anda");
//       }
//     } catch (error) {
//       console.error("Error fetchJadwalData:", error.response?.data || error.message);
//       showToast("danger", "Error", "Gagal mengambil daftar jadwal: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const updateJadwalStatus = async (jadwalId, newStatus) => {
//     try {
//       await axios.put(
//         `${API_URL}/jadwal-terapi/${jadwalId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("success", "Sukses", `Status jadwal berhasil diubah ke ${newStatus}`);
//       fetchJadwalData(); // Refresh daftar jadwal
//     } catch (error) {
//       console.error("Error updateJadwalStatus:", error.response?.data || error.message);
//       showToast("danger", "Error", "Gagal mengubah status jadwal: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const showToast = (type, title, message) => {
//     const id = Date.now();
//     setToasts((prev) => [{ id, type, title, message }, ...prev]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("nama");
//     localStorage.removeItem("iduser");
//     showToast("success", "Logout", "Anda telah keluar dari akun.");
//     setTimeout(() => navigate("/login"), 1000);
//   };

//   return (
//     <div>
//       <Navbar />
//       <section className="py-7 px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-3xl font-extrabold text-gray-900">Dashboard Terapis</h2>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-md transition"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Toast Container */}
//           <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
//             {toasts.map((toast) => (
//               <div
//                 key={toast.id}
//                 className={`p-4 rounded-lg border shadow-lg ${
//                   toast.type === "success"
//                     ? "bg-green-50 border-green-100"
//                     : toast.type === "danger"
//                     ? "bg-red-50 border-red-100"
//                     : "bg-blue-50 border-blue-100"
//                 }`}
//               >
//                 <div className="flex items-start">
//                   <div className="ml-3">
//                     <h3
//                       className={`text-sm font-medium ${
//                         toast.type === "success" ? "text-green-800" : toast.type === "danger" ? "text-red-800" : "text-blue-800"
//                       }`}
//                     >
//                       {toast.title}
//                     </h3>
//                     <p
//                       className={`mt-1 text-sm ${
//                         toast.type === "success" ? "text-green-600" : toast.type === "danger" ? "text-red-600" : "text-blue-600"
//                       }`}
//                     >
//                       {toast.message}
//                     </p>
//                   </div>
//                   <button
//                     className={`ml-auto ${
//                       toast.type === "success" ? "text-green-400" : toast.type === "danger" ? "text-red-400" : "text-blue-400"
//                     } hover:text-opacity-80`}
//                     onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
//                   >
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Data Terapis */}
//           {terapisData ? (
//             <div className="border rounded-md p-4 mb-8">
//               <h3 className="text-xl font-semibold mb-4">Data Anda</h3>
//               <p><strong>Nama:</strong> {terapisData.user?.nama || "Tidak diketahui"}</p>
//               <p><strong>Email:</strong> {terapisData.user?.email || "-"}</p>
//               <p><strong>Spesialisasi:</strong> {terapisData.spesialisasi || "-"}</p>
//               {terapisData.foto && (
//                 <img
//                   src={terapisData.file_url}
//                   alt={terapisData.user?.nama || "Terapis"}
//                   className="mt-2 w-32 h-32 object-cover rounded-md"
//                 />
//               )}
//             </div>
//           ) : (
//             <p className="text-gray-500">Memuat data terapis...</p>
//           )}

//           {/* Daftar Jadwal */}
//           <div className="border rounded-md p-4">
//             <h3 className="text-xl font-semibold mb-4">Daftar Jadwal Terapi</h3>
//             {jadwalList.length > 0 ? (
//               <div className="space-y-4">
//                 {jadwalList.map((jadwal) => (
//                   <div key={jadwal.id_jadwal_terapi} className="border-b pb-4">
//                     <h4 className="text-sm font-medium text-gray-900">
//                       Pasien: {jadwal.user?.nama || "Tidak diketahui"}
//                     </h4>
//                     <p className="text-sm text-gray-500">
//                       Jadwal: {new Date(jadwal.jadwal_terapi).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Jenis Layanan: {jadwal.jenis_layanan}
//                     </p>
//                     {jadwal.jenis_layanan === "Home Visit" && (
//                       <p className="text-sm text-gray-500">Alamat: {jadwal.alamat}</p>
//                     )}
//                     <p className="text-sm text-gray-500">
//                       Status: {jadwal.status || "Menunggu Konfirmasi"}
//                     </p>
//                     <div className="mt-2 space-x-2">
//                       <button
//                         onClick={() => updateJadwalStatus(jadwal.id_jadwal_terapi, "Diterima")}
//                         className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
//                       >
//                         Terima
//                       </button>
//                       <button
//                         onClick={() => updateJadwalStatus(jadwal.id_jadwal_terapi, "Selesai")}
//                         className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
//                       >
//                         Selesai
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p>
//             )}
//           </div>
//         </div>
//       </section>
//       <Footer />
//     </div>
//   );
// };


// ========================================================================================

// export default DashboardTerapis;
// src/pages/DashboardTerapis.jsx
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import ChatModal from "../components/ChatModal"; // Import ChatModal

// const API_URL = "http://localhost:8000/api";

// const DashboardTerapis = () => {
//   const [terapisData, setTerapisData] = useState(null);
//   const [jadwalList, setJadwalList] = useState([]);
//   const [toasts, setToasts] = useState([]);
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const iduser = localStorage.getItem("iduser"); // User ID (associated with terapis)
//   const userRole = localStorage.getItem("role"); // Role user (terapis)

//   // State for Chat
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [selectedChatPartner, setSelectedChatPartner] = useState(null);
//   const [chatPartners, setChatPartners] = useState([]); // List of people therapist has chatted with
//   const [availablePatientsForChat, setAvailablePatientsForChat] = useState([]); // All patients for initiating new chat


// useEffect(() => {
//     let intervalId;
//     const loadData = async () => {
//       await fetchTerapisData();
//     };
    
//     // Panggil pertama kali
//     loadData();
    
//   }, [token, iduser]);

//   useEffect(() => {
//     let intervalId;
//     const loadDependentData = async () => {
//       if (terapisData) {
//         await fetchJadwalData();
//         await fetchChatData();
//       }
//     };
    
//     // Panggil pertama kali
//     loadDependentData();
    
//   }, [terapisData]); // Depend on terapisData

//   const fetchTerapisData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/terapis`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const terapis = response.data.data.find((t) => t.iduser == iduser);
//       if (terapis) {
//         setTerapisData(terapis);
//       } else {
//         showToast("danger", "Error", "Data terapis tidak ditemukan");
//       }
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengambil data terapis: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const fetchJadwalData = async () => {
//     try {
//       const response = await axios.get(`${API_URL}/jadwal-terapi`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!terapisData || !terapisData.id_terapis) {
//         showToast("danger", "Error", "Data terapis tidak valid");
//         return;
//       }
//       const filteredJadwal = response.data.data.filter((jadwal) => {
//         return jadwal.terapis_id == terapisData.id_terapis;
//       });
//       setJadwalList(filteredJadwal);

//       if (filteredJadwal.length === 0) {
//         showToast("info", "Info", "Belum ada jadwal yang diajukan untuk Anda");
//       }
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengambil daftar jadwal: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const fetchChatData = async () => {
//     try {
//         // Fetch Chat Partners (existing chats)
//         const chatPartnersResponse = await axios.get(`${API_URL}/chat/partners`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         setChatPartners(chatPartnersResponse.data.partners);

//         // Fetch All Patients for new chat initiation
//         const allPatientsResponse = await axios.get(`${API_URL}/chat/patients`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });
//         setAvailablePatientsForChat(allPatientsResponse.data.patients);

//     } catch (error) {
//         console.error("Error fetching chat data:", error);
//         showToast("danger", "Error", "Gagal memuat data chat: " + (error.response?.data?.message || error.message));
//     }
//   };


//   const updateJadwalStatus = async (jadwalId, newStatus) => {
//     try {
//       await axios.put(
//         `${API_URL}/jadwal-terapi/${jadwalId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("success", "Sukses", `Status jadwal berhasil diubah ke ${newStatus}`);
//       fetchJadwalData(); // Refresh daftar jadwal
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengubah status jadwal: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const showToast = (type, title, message) => {
//     const id = Date.now();
//     setToasts((prev) => [{ id, type, title, message }, ...prev]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     localStorage.removeItem("nama");
//     localStorage.removeItem("iduser");
//     showToast("success", "Logout", "Anda telah keluar dari akun.");
//     setTimeout(() => navigate("/login"), 1000);
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
//       <section className="py-7 px-4 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-7xl">
//           <div className="flex justify-between items-center mb-6">
//             <h2 className="text-3xl font-extrabold text-gray-900">Dashboard Terapis</h2>
//             <button
//               onClick={handleLogout}
//               className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-md transition"
//             >
//               Logout
//             </button>
//           </div>

//           {/* Toast Container */}
//           <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
//             {toasts.map((toast) => (
//               <div
//                 key={toast.id}
//                 className={`p-4 rounded-lg border shadow-lg ${
//                   toast.type === "success"
//                     ? "bg-green-50 border-green-100"
//                     : toast.type === "danger"
//                     ? "bg-red-50 border-red-100"
//                     : "bg-blue-50 border-blue-100"
//                 }`}
//               >
//                 <div className="flex items-start">
//                   <div className="ml-3">
//                     <h3
//                       className={`text-sm font-medium ${
//                         toast.type === "success" ? "text-green-800" : toast.type === "danger" ? "text-red-800" : "text-blue-800"
//                       }`}
//                     >
//                       {toast.title}
//                     </h3>
//                     <p
//                       className={`mt-1 text-sm ${
//                         toast.type === "success" ? "text-green-600" : toast.type === "danger" ? "text-red-600" : "text-blue-600"
//                       }`}
//                     >
//                       {toast.message}
//                     </p>
//                   </div>
//                   <button
//                     className={`ml-auto ${
//                       toast.type === "success" ? "text-green-400" : toast.type === "danger" ? "text-red-400" : "text-blue-400"
//                     } hover:text-opacity-80`}
//                     onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
//                   >
//                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Data Terapis */}
//           {terapisData ? (
//             <div className="border rounded-md p-4 mb-8">
//               <h3 className="text-xl font-semibold mb-4">Data Anda</h3>
//               <p><strong>Nama:</strong> {terapisData.user?.nama || "Tidak diketahui"}</p>
//               <p><strong>Email:</strong> {terapisData.user?.email || "-"}</p>
//               <p><strong>Spesialisasi:</strong> {terapisData.spesialisasi || "-"}</p>
//               {terapisData.foto && (
//                 <img
//                   src={terapisData.file_url}
//                   alt={terapisData.user?.nama || "Terapis"}
//                   className="mt-2 w-32 h-32 object-cover rounded-md"
//                 />
//               )}
//             </div>
//           ) : (
//             <p className="text-gray-500">Memuat data terapis...</p>
//           )}

//           {/* Chat Sections (for therapists) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
//             {/* Start Chat with Patient */}
//             <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Mulai Chat dengan Pasien</h3>
//                 <div className="space-y-4">
//                     {availablePatientsForChat.length > 0 ? (
//                         availablePatientsForChat.map((patient) => (
//                         <div key={patient.id} className="flex items-center justify-between border-b pb-2">
//                             <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
//                                 <span className="text-green-600 font-medium">
//                                 {(patient.nama)?.charAt(0) || "?"}
//                                 </span>
//                             </div>
//                             <div className="ml-3">
//                                 <h4 className="text-sm font-medium text-gray-900">
//                                 {patient.nama || "Tidak diketahui"}
//                                 </h4>
//                                 <p className="text-xs text-gray-500">
//                                     {patient.email}
//                                 </p>
//                             </div>
//                             </div>
//                             <button
//                                 onClick={() => openChat(patient)}
//                                 className="ml-4 px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
//                             >
//                                 Chat
//                             </button>
//                         </div>
//                         ))
//                     ) : (
//                         <p className="text-sm text-gray-500">Tidak ada pasien tersedia untuk chat.</p>
//                     )}
//                 </div>
//             </div>

//             {/* Recent Chats Section (for therapists) */}
//             <div className="rounded-2xl border border-gray-200 shadow-sm p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Chat Terbaru</h3>
//                 <div className="space-y-4">
//                   {chatPartners.length > 0 ? (
//                     chatPartners.map((partner) => (
//                       <div
//                         key={partner.id}
//                         onClick={() =>
//                           openChat({
//                             id: partner.id, // <-- pastikan ini adalah iduser
//                             name: partner.name,
//                             role: partner.role
//                           })
//                         }
//                         className="cursor-pointer flex items-center justify-between border-b pb-2"
//                       >
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

//                         {/* Tombol hanya sebagai indikator visual */}
//                         <div className="ml-4 px-3 py-1 text-sm text-blue-500">
//                           Buka Chat →
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500">Belum ada riwayat chat.</p>
//                   )}
//                 </div>
//             </div>
//           </div>


//           {/* Daftar Jadwal */}
//           <div className="border rounded-md p-4">
//             <h3 className="text-xl font-semibold mb-4">Daftar Jadwal Terapi</h3>
//             {jadwalList.length > 0 ? (
//               <div className="space-y-4">
//                 {jadwalList.map((jadwal) => (
//                   <div key={jadwal.id_jadwal_terapi} className="border-b pb-4">
//                     <h4 className="text-sm font-medium text-gray-900">
//                       Pasien: {jadwal.user?.nama || "Tidak diketahui"}
//                     </h4>
//                     <p className="text-sm text-gray-500">
//                       Jadwal: {new Date(jadwal.jadwal_terapi).toLocaleString()}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Jenis Layanan: {jadwal.jenis_layanan}
//                     </p>
//                     {jadwal.jenis_layanan === "Home Visit" && (
//                       <p className="text-sm text-gray-500">Alamat: {jadwal.alamat}</p>
//                     )}
//                     <p className="text-sm text-gray-500">
//                       Status: {jadwal.status || "Menunggu Konfirmasi"}
//                     </p>
//                     <div className="mt-2 space-x-2">
//                       <button
//                         onClick={() => updateJadwalStatus(jadwal.id_jadwal_terapi, "Diterima")}
//                         className="px-3 py-1 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
//                       >
//                         Terima
//                       </button>
//                       <button
//                         onClick={() => updateJadwalStatus(jadwal.id_jadwal_terapi, "Selesai")}
//                         className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
//                       >
//                         Selesai
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-sm text-gray-500">Belum ada jadwal yang diajukan.</p>
//             )}
//           </div>
//         </div>
//       </section>
//       <Footer />

//       {/* Chat Modal */}
//       <ChatModal
//         isOpen={isChatModalOpen}
//         onClose={closeChat}
//         currentUserId={parseInt(iduser)}
//         currentUserRole={userRole}
//         chatPartner={selectedChatPartner}
//       />
//     </div>
//   );
// };

// export default DashboardTerapis;

// ===================================================

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import ChatModal from "../components/ChatModal";
// import Footer from "../components/Footer";

// const API_URL = "http://localhost:8000/api";
// const STORAGE_URL = "http://localhost:8000/storage/";

// const DashboardTerapis = () => {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");
//   const userId = localStorage.getItem("iduser");
//   const userRole = localStorage.getItem("role");
//   const [nama, setNama] = useState(localStorage.getItem("nama") || "Terapis");
//   const [terapisData, setTerapisData] = useState(null);
//   const [jadwalList, setJadwalList] = useState([]);
//   const [panduanList, setPanduanList] = useState([]);
//   const [laporanPerkembanganList, setLaporanPerkembanganList] = useState([]);
//   const [toasts, setToasts] = useState([]);
//   const [activeTab, setActiveTab] = useState("jadwal");
//   const [isChatModalOpen, setIsChatModalOpen] = useState(false);
//   const [selectedChatPartner, setSelectedChatPartner] = useState(null);
//   const [chatPartners, setChatPartners] = useState([]);
//   const [availablePatientsForChat, setAvailablePatientsForChat] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
//   const [newName, setNewName] = useState(nama);
//   const [newSpesialisasi, setNewSpesialisasi] = useState("");
//   const [newFoto, setNewFoto] = useState(null);
//   const [isKeluhanModalOpen, setIsKeluhanModalOpen] = useState(false);
//   const [isPanduanFormOpen, setIsPanduanFormOpen] = useState(false);
//   const [selectedJadwalId, setSelectedJadwalId] = useState(null);
//   const [keluhan, setKeluhan] = useState("");
//   const [selectedPanduanId, setSelectedPanduanId] = useState("");
//   const [namaLatihan, setNamaLatihan] = useState("");
//   const [deskripsiLatihan, setDeskripsiLatihan] = useState("");
//   const [fileLatihan, setFileLatihan] = useState(null);

//   const showToast = (type, title, message) => {
//     const id = Date.now();
//     setToasts((prev) => [{ id, type, title, message }, ...prev]);
//     setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
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
//       if (!token || !userId) {
//         showToast("danger", "Error", "Token atau ID pengguna tidak ditemukan. Silakan login kembali.");
//         navigate("/login");
//         return;
//       }

//       try {
//         const [terapisResponse, jadwalResponse, panduanResponse, laporanPerkembanganResponse, chatPartnersResponse, allPatientsResponse] = await Promise.all([
//           axios.get(`${API_URL}/terapis`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/jadwal-terapi`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/panduan-latihan`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/laporan-perkembangan`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/chat/partners`, { headers: { Authorization: `Bearer ${token}` } }),
//           axios.get(`${API_URL}/chat/patients`, { headers: { Authorization: `Bearer ${token}` } }),
//         ]);

//         const terapis = terapisResponse.data.data.find((t) => t.iduser == userId);
//         if (terapis) {
//           setTerapisData(terapis);
//           setNewName(terapis.user?.nama || terapis.nama || "Terapis");
//           setNewSpesialisasi(terapis.spesialisasi || "");
//           setJadwalList(jadwalResponse.data.data.filter((jadwal) => jadwal.terapis_id == terapis.id_terapis));
//         } else {
//           showToast("danger", "Error", "Data terapis tidak ditemukan");
//         }
//         setPanduanList(panduanResponse.data.data);
//         setLaporanPerkembanganList(laporanPerkembanganResponse.data.data);
//         setChatPartners(chatPartnersResponse.data.partners || []);
//         setAvailablePatientsForChat(allPatientsResponse.data.patients || []);
//       } catch (error) {
//         showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message));
//       }
//     };
//     fetchData();
//   }, [token, userId, navigate]);

//   const updateJadwalStatus = async (jadwalId, newStatus, user) => {
//     try {
//       await axios.put(
//         `${API_URL}/jadwal-terapi/${jadwalId}`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("success", "Sukses", `Status jadwal berhasil diubah ke ${newStatus}`);
//       if (newStatus === "Diterima" && user) {
//         setSelectedChatPartner({
//           id: user.iduser,
//           name: user.nama,
//           role: user.role,
//           email: user.email,
//         });
//         setIsChatModalOpen(true);
//       }
//       const response = await axios.get(`${API_URL}/jadwal-terapi`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setJadwalList(response.data.data.filter((jadwal) => jadwal.terapis_id == terapisData?.id_terapis));
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengubah status jadwal: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleSubmitKeluhan = async (e) => {
//     e.preventDefault();
//     if (!keluhan.trim() || !selectedPanduanId) {
//       showToast("warning", "Peringatan", "Keluhan dan panduan tidak boleh kosong!");
//       return;
//     }

//     try {
//       await axios.post(
//         `${API_URL}/laporan-pasien`,
//         { jadwal_terapi_id_jadwal_terapi: selectedJadwalId, keluhan_pasien: keluhan, panduan_latihan_id_panduan_latihan: selectedPanduanId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       showToast("success", "Sukses", "Keluhan berhasil diajukan!");
//       setIsKeluhanModalOpen(false);
//       setKeluhan("");
//       setSelectedPanduanId("");
//       setSelectedJadwalId(null);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal mengajukan keluhan: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleSubmitPanduanForm = async (e) => {
//     e.preventDefault();
//     if (!namaLatihan.trim() || !deskripsiLatihan.trim()) {
//       showToast("warning", "Peringatan", "Nama latihan dan deskripsi tidak boleh kosong!");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("nama_latihan", namaLatihan);
//       formData.append("deskripsi_latihan", deskripsiLatihan);
//       formData.append("terapis_id_terapis", terapisData.id_terapis);
//       if (fileLatihan) formData.append("file_latihan", fileLatihan);

//       await axios.post(`${API_URL}/panduan-latihan`, formData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//       });
//       showToast("success", "Sukses", "Panduan berhasil dibuat!");
//       setIsPanduanFormOpen(false);
//       setNamaLatihan("");
//       setDeskripsiLatihan("");
//       setFileLatihan(null);

//       const response = await axios.get(`${API_URL}/panduan-latihan`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setPanduanList(response.data.data);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal membuat panduan: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const handleEditProfile = async (e) => {
//     e.preventDefault();
//     if (!newName.trim()) {
//       showToast("warning", "Peringatan", "Nama tidak boleh kosong!");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("nama", newName);
//       formData.append("spesialisasi", newSpesialisasi);
//       if (newFoto) formData.append("foto", newFoto);

//       await axios.put(`${API_URL}/terapis/${terapisData.id_terapis}`, formData, {
//         headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
//       });

//       setNama(newName);
//       localStorage.setItem("nama", newName);
//       setTerapisData((prev) => ({
//         ...prev,
//         user: { ...prev.user, nama: newName },
//         spesialisasi: newSpesialisasi,
//         foto: newFoto ? URL.createObjectURL(newFoto) : prev.foto,
//       }));
//       showToast("success", "Sukses", "Profil berhasil diperbarui!");
//       setIsEditProfileOpen(false);
//       setNewFoto(null);
//     } catch (error) {
//       showToast("danger", "Error", "Gagal memperbarui profil: " + (error.response?.data?.message || error.message));
//     }
//   };

//   const openChat = (partner) => {
//     if (!partner || !partner.id) return;
//     setSelectedChatPartner({
//       id: partner.id,
//       name: partner.name || partner.nama,
//       role: partner.role,
//       email: partner.email,
//     });
//     setIsChatModalOpen(true);
//   };

//   const closeChat = () => {
//     setIsChatModalOpen(false);
//     setSelectedChatPartner(null);
//   };

//   const getPhotoUrl = (foto) => (foto ? `${STORAGE_URL}${foto}` : "https://picsum.photos/150");
//   const getBuktiPembayaranUrl = (path) => (path ? `${STORAGE_URL}${path}` : "#");

//   if (!token || !userId) {
//     navigate("/login");
//     return null;
//   }

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
//             {["jadwal", "panduan", "pesan"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium ${
//                   activeTab === tab ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600" : "border-l-4 border-transparent"
//                 }`}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   {tab === "jadwal" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4" />}
//                   {tab === "panduan" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
//                   {tab === "pesan" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 4.582 9 8z" />}
//                 </svg>
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//             <button onClick={handleLogout} className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
//               </svg>
//               Logout
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 overflow-y-auto ml-1">
//         <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 py-4">
//           <div className="flex items-center px-1">
//             <label htmlFor="menu-toggle" className="md:hidden mr-4 bg-rose-600 text-white p-2 Rounded focus:outline-none cursor-pointer">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </label>
//             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
//               <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
//             </svg>
//             <input className="mx-4 w-full border rounded-md px-4 py-2" type="text" placeholder="Search" aria-label="Search" />
//           </div>
//           <div className="relative">
//             <img
//               src={terapisData?.foto ? getPhotoUrl(terapisData.foto) : "https://picsum.photos/150"}
//               alt="Profile"
//               className="w-10 h-10 rounded-full object-cover cursor-pointer"
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               onError={(e) => { e.target.src = "https://picsum.photos/150"; }}
//             />
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
//                 <div className="py-2">
//                   <p className="px-4 py-2 text-sm text-gray-700">{nama}</p>
//                   <button
//                     onClick={() => {
//                       setIsEditProfileOpen(true);
//                       setIsDropdownOpen(false);
//                     }}
//                     className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition"
//                   >
//                     Edit Profile
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         <section className="min-h-screen bg-gray-50 py-4 px-8 lg:px-12">
//           <div className="max-w-7xl mx-auto">
//             <div className="bg-white rounded-lg shadow-sm p-6">
//               {activeTab === "jadwal" && (
//                 <div>
//                   {jadwalList.length > 0 ? (
//                     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                       <div className="p-4 border-b border-gray-200">
//                         <h2 className="text-base font-semibold text-gray-800">Jadwal Terapi Pasien</h2>
//                         <p className="text-sm text-gray-500 mt-1">Kelola jadwal terapi pasien Anda di sini.</p>
//                       </div>
//                       <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                           <thead className="bg-gray-50">
//                             <tr>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Jenis Layanan</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Keluhan</th>
//                               <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Laporan Perkembangan</th>
//                             </tr>
//                           </thead>
//                           <tbody className="bg-white divide-y divide-gray-200">
//                             {jadwalList.map((jadwal) => (
//                               <tr key={jadwal.id_jadwal_terapi} className="hover:bg-gray-50 transition-colors duration-150">
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">{jadwal.user?.nama || "Tidak Diketahui"}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">{new Date(jadwal.jadwal_terapi).toLocaleString()}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">{jadwal.jenis_layanan}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">{jadwal.jenis_layanan === "Home Visit" ? jadwal.alamat || "-" : "-"}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="text-sm text-gray-900">Rp {parseFloat(jadwal.nominal_payment).toLocaleString('id-ID')}</div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   {jadwal.bukti_pembayaran ? (
//                                     <a href={getBuktiPembayaranUrl(jadwal.bukti_pembayaran)} target="_blank" className="text-rose-600 hover:text-rose-700 text-sm">Lihat</a>
//                                   ) : (
//                                     <span className="text-sm text-gray-500">Tidak Ada</span>
//                                   )}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <span
//                                     className={`px-2 inline-flex text-sm leading-5 font-medium rounded-full ${
//                                       jadwal.status === "Diterima" ? "bg-green-100 text-green-800" :
//                                       jadwal.status === "Ditolak" ? "bg-red-100 text-red-800" :
//                                       jadwal.status === "Selesai" ? "bg-blue-100 text-blue-800" :
//                                       "bg-yellow-100 text-yellow-800"
//                                     }`}
//                                   >
//                                     {jadwal.status || "Menunggu Konfirmasi"}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <div className="relative inline-block text-left">
//                                     <select
//                                       onChange={(e) => updateJadwalStatus(jadwal.id_jadwal_terapi, e.target.value, jadwal.user)}
//                                       className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-opacity-50"
//                                       disabled={jadwal.status === "Selesai"}
//                                     >
//                                       <option value="">Pilih Aksi</option>
//                                       <option value="Diterima">Terima</option>
//                                       <option value="Selesai">Selesai</option>
//                                     </select>
//                                   </div>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   <button
//                                     onClick={() => {
//                                       setSelectedJadwalId(jadwal.id_jadwal_terapi);
//                                       setIsKeluhanModalOpen(true);
//                                     }}
//                                     className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                                   >
//                                     Buat Keluhan
//                                   </button>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                   {laporanPerkembanganList.filter((laporan) => laporan.laporan_pasiens?.jadwal_terapi_id_jadwal_terapi == jadwal.id_jadwal_terapi).length > 0 ? (
//                                     <div>
//                                       {laporanPerkembanganList
//                                         .filter((laporan) => laporan.laporan_pasiens?.jadwal_terapi_id_jadwal_terapi == jadwal.id_jadwal_terapi)
//                                         .map((laporan) => (
//                                           <div key={laporan.id_laporan_perkembangan} className="text-sm text-gray-900">
//                                             {laporan.ringkasan_perkembangan}
//                                             {laporan.file_perkembangan && (
//                                               <a href={`${STORAGE_URL}${laporan.file_perkembangan}`} target="_blank" className="text-rose-600 hover:text-rose-700 text-sm ml-2">Lihat File</a>
//                                             )}
//                                           </div>
//                                         ))}
//                                     </div>
//                                   ) : (
//                                     <span className="text-sm text-gray-500">Belum ada laporan</span>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                       <div className="bg-white px-6 py-2 border-t border-gray-200">
//                         <div className="flex items-center justify-between flex-col sm:flex-row py-2">
//                           <div className="mb-2 sm:mb-0">
//                             <p className="text-sm text-gray-700">
//                               Showing <span className="font-medium">1</span> to <span className="font-medium">{jadwalList.length}</span> of <span className="font-medium">{jadwalList.length}</span> results
//                             </p>
//                           </div>
//                           <div>
//                             <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                               <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                                 <span className="sr-only">Previous</span>
//                                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                   <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//                                 </svg>
//                               </a>
//                               <a href="#" className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-rose-50 text-sm font-medium text-rose-600 hover:bg-rose-100">1</a>
//                               <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
//                                 <span className="sr-only">Next</span>
//                                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//                                   <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
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

//               {activeTab === "panduan" && (
//                 <div>
//                   <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-lg font-semibold text-gray-900">Panduan Latihan</h2>
//                     <button
//                       onClick={() => setIsPanduanFormOpen(true)}
//                       className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                     >
//                       Buat Panduan
//                     </button>
//                   </div>
//                   {panduanList.length > 0 ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {panduanList.map((panduan) => (
//                         <div key={panduan.id_panduan_latihan} className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
//                           <div className="p-4">
//                             <h3 className="text-sm font-medium text-gray-900">{panduan.nama_latihan}</h3>
//                             <p className="text-xs text-gray-500 mt-1">Oleh: {panduan.terapis?.user?.nama || "Tidak Diketahui"}</p>
//                             <p className="text-xs text-gray-500 mt-1">{panduan.deskripsi_latihan}</p>
//                             {panduan.file_latihan && (
//                               <a href={`${STORAGE_URL}${panduan.file_latihan}`} target="_blank" className="text-rose-600 hover:text-rose-700 text-sm mt-2 inline-block">Lihat File</a>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-sm text-gray-500">Belum ada panduan latihan.</p>
//                   )}
//                 </div>
//               )}

//               {activeTab === "pesan" && (
//                 <div>
//                   <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesan</h2>
//                   <div className="space-y-4">
//                     {[...availablePatientsForChat, ...chatPartners].length > 0 ? (
//                       [...availablePatientsForChat, ...chatPartners]
//                         .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
//                         .map((partner) => (
//                           <div
//                             key={partner.id}
//                             className="flex items-center justify-between border-b border-gray-100 py-3 cursor-pointer hover:bg-gray-50 p-4 rounded-md"
//                             onClick={() => openChat(partner)}
//                           >
//                             <div className="flex items-center">
//                               <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
//                                 <span className="text-rose-600 font-medium">{(partner.nama || partner.name)?.charAt(0) || "?"}</span>
//                               </div>
//                               <div className="ml-4">
//                                 <h4 className="text-base font-medium text-gray-900">{partner.nama || partner.name || "Tidak diketahui"}</h4>
//                                 <p className="text-sm text-gray-500">{partner.role || "Pasien"}</p>
//                               </div>
//                             </div>
//                             <div className="ml-4 px-3 py-1 text-sm text-rose-500">
//                               {chatPartners.some((p) => p.id === partner.id) ? "Buka Chat →" : "Mulai Chat →"}
//                             </div>
//                           </div>
//                         ))
//                     ) : (
//                       <p className="text-sm text-gray-500">Belum ada pasien yang dapat dihubungi.</p>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
//               {toasts.map((toast) => (
//                 <div
//                   key={toast.id}
//                   className={`flex items-start p-3 rounded-lg border shadow-sm ${
//                     toast.type === "success" ? "bg-green-50 border-green-100" :
//                     toast.type === "danger" ? "bg-red-50 border-red-100" :
//                     "bg-yellow-50 border-yellow-100"
//                   }`}
//                 >
//                   <div className="flex-shrink-0">
//                     {toast.type === "success" && <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
//                     {toast.type === "danger" && <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
//                     {toast.type === "warning" && <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
//                   </div>
//                   <div className="ml-2">
//                     <h3 className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : toast.type === "danger" ? "text-red-800" : "text-yellow-800"}`}>{toast.title}</h3>
//                     <p className={`mt-1 text-sm ${toast.type === "success" ? "text-green-600" : toast.type === "danger" ? "text-red-600" : "text-yellow-600"}`}>{toast.message}</p>
//                   </div>
//                   <button className={`ml-auto ${toast.type === "success" ? "text-green-400 hover:text-green-500" : toast.type === "danger" ? "text-red-400 hover:text-red-500" : "text-yellow-400 hover:text-yellow-500"}`} onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
//                     <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>

//         {isKeluhanModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Buat Keluhan</h3>
//               <form onSubmit={handleSubmitKeluhan} className="space-y-6">
//                 <div>
//                   <label htmlFor="panduan" className="block text-sm font-medium text-gray-700 mb-2">Pilih Panduan</label>
//                   <select
//                     id="panduan"
//                     value={selectedPanduanId}
//                     onChange={(e) => setSelectedPanduanId(e.target.value)}
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                     required
//                   >
//                     <option value="">Pilih Panduan</option>
//                     {panduanList.map((panduan) => (
//                       <option key={panduan.id_panduan_latihan} value={panduan.id_panduan_latihan}>
//                         {panduan.nama_latihan}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div>
//                   <label htmlFor="keluhan" className="block text-sm font-medium text-gray-700 mb-2">Keluhan</label>
//                   <textarea
//                     id="keluhan"
//                     value={keluhan}
//                     onChange={(e) => setKeluhan(e.target.value)}
//                     placeholder="Masukkan keluhan untuk pasien"
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24"
//                     required
//                   />
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsKeluhanModalOpen(false);
//                       setKeluhan("");
//                       setSelectedPanduanId("");
//                       setSelectedJadwalId(null);
//                     }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                   >
//                     Kirim Keluhan
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {isPanduanFormOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
//               <h3 className="text-lg font-semibold text-gray-900 mb-6">Buat Panduan Latihan</h3>
//               <form onSubmit={handleSubmitPanduanForm} className="space-y-6" encType="multipart/form-data">
//                 <div>
//                   <label htmlFor="namaLatihan" className="block text-sm font-medium text-gray-700 mb-2">Nama Latihan</label>
//                   <input
//                     id="namaLatihan"
//                     type="text"
//                     value={namaLatihan}
//                     onChange={(e) => setNamaLatihan(e.target.value)}
//                     placeholder="Masukkan nama latihan"
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="deskripsiLatihan" className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Latihan</label>
//                   <textarea
//                     id="deskripsiLatihan"
//                     value={deskripsiLatihan}
//                     onChange={(e) => setDeskripsiLatihan(e.target.value)}
//                     placeholder="Masukkan deskripsi latihan"
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm resize-none h-24"
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label htmlFor="fileLatihan" className="block text-sm font-medium text-gray-700 mb-2">File Latihan (PDF/JPG/PNG)</label>
//                   <input
//                     id="fileLatihan"
//                     type="file"
//                     accept="image/jpeg,image/png,application/pdf"
//                     onChange={(e) => setFileLatihan(e.target.files[0])}
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                   />
//                   {fileLatihan && fileLatihan.type.startsWith("image/") && (
//                     <img
//                       src={URL.createObjectURL(fileLatihan)}
//                       alt="Preview File Latihan"
//                       className="mt-2 w-full h-32 object-contain rounded-md border border-gray-200"
//                     />
//                   )}
//                   {fileLatihan && fileLatihan.type === "application/pdf" && (
//                     <p className="mt-2 text-sm text-gray-500">File: {fileLatihan.name}</p>
//                   )}
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsPanduanFormOpen(false);
//                       setNamaLatihan("");
//                       setDeskripsiLatihan("");
//                       setFileLatihan(null);
//                     }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
//                   >
//                     Simpan Panduan
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
//               <form onSubmit={handleEditProfile} className="space-y-4" encType="multipart/form-data">
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
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
//                   <input
//                     type="text"
//                     value={newSpesialisasi}
//                     onChange={(e) => setNewSpesialisasi(e.target.value)}
//                     placeholder="Masukkan spesialisasi"
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                     aria-label="Spesialisasi"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Foto Profil</label>
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/png"
//                     onChange={(e) => setNewFoto(e.target.files[0])}
//                     className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
//                     aria-label="Foto Profil"
//                   />
//                   {newFoto && (
//                     <img
//                       src={URL.createObjectURL(newFoto)}
//                       alt="Preview Foto Profil"
//                       className="mt-2 w-20 h-20 object-cover rounded-full border-2 border-gray-200"
//                     />
//                   )}
//                 </div>
//                 <div className="flex justify-end space-x-3">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditProfileOpen(false);
//                       setNewName(nama);
//                       setNewSpesialisasi(terapisData?.spesialisasi || "");
//                       setNewFoto(null);
//                     }}
//                     className="px-4 py-2 text-sm font-medium text-gray-700.bg-gray-200 rounded-md hover:bg-gray-300 transition"
//                   >
//                     Batal
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
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
//         />
//       </div>
//     </div>
//   );
// };

// export default DashboardTerapis;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ChatModal from "../components/ChatModal";
import Footer from "../components/Footer";

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

const STORAGE_URL_PDF = 'http://localhost:8000/';

const ImageModal = ({ isOpen, onClose, imageUrl, description }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-4 w-full max-w-lg mx-4 shadow-lg flex flex-col items-center">
        <button
          onClick={onClose}
          className="self-end text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt="Laporan Perkembangan"
          className="max-w-full h-auto mb-4 rounded shadow"
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

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) {
        showToast("danger", "Error", "Token atau ID pengguna tidak ditemukan. Silakan login kembali.");
        navigate("/login");
        return;
      }

      try {
        const [
          terapisResponse,
          jadwalResponse,
          panduanResponse,
          laporanPerkembanganResponse,
          chatPartnersResponse,
          allPatientsResponse,
          laporanPasienResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/terapis`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/jadwal-terapi`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/panduan-latihan`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/laporan-perkembangan`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/chat/partners`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/chat/patients`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/laporan-pasien`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const terapis = terapisResponse.data.data.find((t) => t.iduser == userId);
        if (terapis) {
          setTerapisData(terapis);
          setNewName(terapis.user?.nama || terapis.nama || "Terapis");
          setNewSpesialisasi(terapis.spesialisasi || "");
          setJadwalList(jadwalResponse.data.data.filter((jadwal) => jadwal.terapis_id == terapis.id_terapis || !jadwal.terapis_id));
        } else {
          showToast("danger", "Error", "Data terapis tidak ditemukan");
        }
        setPanduanList(panduanResponse.data.data || []);
        setLaporanPerkembanganList(laporanPerkembanganResponse.data.data || []);
        setChatPartners(chatPartnersResponse.data.partners || []);
        setAvailablePatientsForChat(allPatientsResponse.data.patients || []);
        setLaporanPasienList(laporanPasienResponse.data.data || []);
      } catch (error) {
        console.error("Fetch Data Error:", error);
        showToast("danger", "Error", "Gagal memuat data: " + (error.response?.data?.message || error.message));
      }
    };
    fetchData();
  }, [token, userId, navigate]);

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
      const response = await axios.get(`${API_URL}/jadwal-terapi`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJadwalList(response.data.data.filter((jadwal) => jadwal.terapis_id == terapisData?.id_terapis));
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
      const laporanPasienResponse = await axios.get(`${API_URL}/laporan-pasien`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLaporanPasienList(laporanPasienResponse.data.data);
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

      const response = await axios.get(`${API_URL}/panduan-latihan`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPanduanList(response.data.data);
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
            {["jadwal", "panduan", "laporan", "pesan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium ${
                  activeTab === tab ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600" : "border-l-4 border-transparent"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  {tab === "laporan" && (
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
                {tab === "laporan" ? "Laporan Perkembangan" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
      <div className="flex flex-col flex-1 overflow-y-auto ml-1">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center px-1">
            <label htmlFor="menu-toggle" className="md:hidden mr-4 bg-rose-600 text-white p-2 rounded focus:outline-none cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <input
              className="mx-4 w-full border rounded-md px-4 py-2"
              type="text"
              placeholder="Search"
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
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <p className="px-4 py-2 text-sm text-gray-700">{nama}</p>
                  <button
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 transition"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="min-h-screen bg-gray-50 py-4 px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {activeTab === "jadwal" && (
                <div>
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
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Jadwal</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Jenis Layanan</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Keluhan</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Laporan Perkembangan</th>
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
                                    <div className="text-sm text-gray-900">{jadwal.jenis_layanan === "Home Visit" ? jadwal.alamat || "-" : "-"}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">Rp {parseFloat(jadwal.nominal_payment).toLocaleString("id-ID")}</div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {jadwal.bukti_pembayaran ? (
                                      <a
                                        href={getBuktiPembayaranUrl(jadwal.bukti_pembayaran)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-rose-600 hover:text-rose-700 text-sm"
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
                                      <div>
                                        {laporanPerkembanganList
                                          .filter((laporan) => laporan.laporan_pasien?.jadwal_terapi_id_jadwal_terapi === jadwal.id_jadwal_terapi)
                                          .map((laporan) => (
                                            <div key={laporan.id_laporan_perkembangan} className="text-sm text-gray-900">
                                              <button
                                                onClick={() => handleOpenImageModal(laporan.file_perkembangan, laporan.ringkasan_perkembangan)}
                                                className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                                              >
                                                Lihat Gambar
                                              </button>
                                            
                                            </div>
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
                              Showing <span className="font-medium">1</span> to <span className="font-medium">{jadwalList.length}</span> of{" "}
                              <span className="font-medium">{jadwalList.length}</span> results
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                              <a
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                              >
                                1
                              </a>
                              <a
                                href="#"
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                              >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
                      className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                    >
                      Buat Panduan
                    </button>
                  </div>
                  {panduanList?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {panduanList.map((panduan) => (
                        <div
                          key={panduan.id_panduan_latihan}
                          className="bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                        >
                          <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-900">{panduan.nama_latihan}</h3>
                            <p className="text-xs text-gray-500 mt-1">Oleh: {panduan.terapis?.user?.nama || "Tidak Diketahui"}</p>
                            <p className="text-xs text-gray-500 mt-1">{panduan.deskripsi_latihan}</p>
                            {panduan.file_latihan && (
                              <a
                                href={`${STORAGE_URL}panduan_latihan/${panduan.file_latihan}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-rose-600 hover:text-rose-700 text-sm mt-2 inline-block"
                              >
                                Lihat File
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada panduan latihan.</p>
                  )}
                </div>
              )}

{activeTab === "laporan" && (
  <div>
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Laporan Perkembangan</h2>
    {laporanPerkembanganList?.length > 0 ? (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Pasien</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Tanggal Laporan</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Ringkasan</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">File</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {laporanPerkembanganList.map((laporan) => (
                <tr key={laporan.id_laporan_perkembangan} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {laporan.laporan_pasien?.jadwal_terapi?.user?.nama || "Tidak Diketahui"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(laporan.tanggal_laporan).toLocaleDateString("id-ID", {
                        dateStyle: "medium",
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{laporan.ringkasan_perkembangan}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {laporan.file_perkembangan_url ? (
                    <button
                      onClick={() => handleOpenImageModal(laporan.file_perkembangan, laporan.ringkasan_perkembangan)}
                      className="px-3 py-1 text-sm bg-sky-600 text-white rounded hover:bg-sky-700"
                    >
                      Lihat Gambar
                    </button>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Tidak Ada File</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <p className="text-sm text-gray-500">Belum ada laporan perkembangan.</p>
    )}
  </div>
)}

              {activeTab === "pesan" && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Pesan</h2>
                  <div className="space-y-4">
                    {[...availablePatientsForChat, ...chatPartners]?.length > 0 ? (
                      [...availablePatientsForChat, ...chatPartners]
                        .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
                        .map((partner) => (
                          <div
                            key={partner.id}
                            className="flex items-center justify-between border-b border-gray-100 py-3 cursor-pointer hover:bg-gray-50 p-4 rounded-md"
                            onClick={() => openChat(partner)}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                                <span className="text-rose-600 font-medium">{(partner.nama || partner.name)?.charAt(0) || "?"}</span>
                              </div>
                              <div className="ml-4">
                                <h4 className="text-base font-medium text-gray-900">{partner.nama || partner.name || "Tidak diketahui"}</h4>
                                <p className="text-sm text-gray-500">{partner.role || "Pasien"}</p>
                              </div>
                            </div>
                            <div className="ml-4 px-3 py-1 text-sm text-rose-500">
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
            <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`flex items-start p-3 rounded-lg border shadow-sm ${
                    toast.type === "success"
                      ? "bg-green-50 border-green-100"
                      : toast.type === "danger"
                      ? "bg-red-50 border-red-100"
                      : "bg-yellow-50 border-yellow-100"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {toast.type === "success" && (
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {toast.type === "danger" && (
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {toast.type === "warning" && (
                      <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
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
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
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
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
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
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                  >
                    Simpan
                  </button>
                </div>
              </form>
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
        />
      </div>
    </div>
  );
};

export default DashboardTerapis;