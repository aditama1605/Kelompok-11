import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const API_URL = "http://localhost:8000/api";
const STORAGE_URL = "http://localhost:8000/storage/";

const DashboardAdmin = () => {
  const [terapisList, setTerapisList] = useState([]);
  const [pasienList, setPasienList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
    spesialisasi: "",
    foto: null,
  });
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [activeTab, setActiveTab] = useState("terapis");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [nama, setNama] = useState(localStorage.getItem("nama") || "Admin");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (role !== "admin") {
      showToast("danger", "Error", "Anda tidak memiliki akses ke halaman ini");
      navigate("/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [terapisResponse, pasienResponse] = await Promise.all([
          axios.get(`${API_URL}/terapis`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setTerapisList(terapisResponse.data.data);
        const patients = pasienResponse.data.data.filter((user) => user.role === "pasien");
        setPasienList(patients);
      } catch (error) {
        showToast(
          "danger",
          "Error",
          "Gagal mengambil data: " + (error.response?.data?.message || error.message)
        );
      }
    };
    fetchData();
  }, [token, role, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData();
  data.append("nama", formData.nama);
  data.append("email", formData.email);
  if (formData.password) data.append("password", formData.password); // Only append password if provided
  data.append("spesialisasi", formData.spesialisasi);
  if (formData.foto) data.append("foto", formData.foto);
  if (editingId) data.append("_method", "PUT"); // Add _method for updates only

  try {
    const url = editingId ? `${API_URL}/terapis/${editingId}` : `${API_URL}/terapis`;
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    showToast("success", "Sukses", `Terapis ${editingId ? "diperbarui" : "ditambahkan"}`);
    setFormData({ nama: "", email: "", password: "", spesialisasi: "", foto: null });
    setEditingId(null);
    setIsEditModalOpen(false);
    const terapisResponse = await axios.get(`${API_URL}/terapis`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTerapisList(terapisResponse.data.data);
  } catch (error) {
    const errorMessage =
      error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(", ")
        : error.response?.data?.message || "Gagal menyimpan data terapis";
    showToast("danger", "Error", errorMessage);
  }
};

  const handleEdit = (terapis) => {
    setFormData({
      nama: terapis.user?.nama || "",
      email: terapis.user?.email || "",
      password: "", // Password is optional for updates
      spesialisasi: terapis.spesialisasi || "",
      foto: null,
    });
    setEditingId(terapis.id_terapis);
    setIsEditModalOpen(true);
  };

const handleDelete = async () => {
  try {
    await axios.delete(`${API_URL}/terapis/${deleteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showToast("success", "Sukses", "Terapis berhasil dihapus");
    setIsDeleteModalOpen(false);
    setDeleteId(null);
    // Refresh terapis list
    const response = await axios.get(`${API_URL}/terapis`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTerapisList(response.data.data);
  } catch (error) {
    showToast(
      "danger",
      "Error",
      error.response?.data?.message || "Gagal menghapus terapis"
    );
    setIsDeleteModalOpen(false);
  }
};
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const getPhotoUrl = (foto) => (foto ? `${STORAGE_URL}${foto}` : "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?w=740");

  
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
            {["terapis", "pasien"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium ${
                  activeTab === tab ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600" : "border-l-4 border-transparent"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {tab === "terapis" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                  {tab === "pasien" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
                </svg>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
            <button onClick={handleLogout} className="flex items-center px-4 py-3 text-gray-700 hover:bg-rose-50 w-full text-left rounded-lg transition-colors text-sm font-medium border-l-4 border-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h3a3 3 0 013 3v1" />
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            <input className="mx-4 w-full border rounded-md px-4 py-2" type="text" placeholder="Search" aria-label="Search" />
          </div>
          <div className="relative">
            <img
              src="https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?w=740"
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            />
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <div className="py-2">
                  <p className="px-4 py-2 text-sm text-gray-700">{nama}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <section className="min-h-screen bg-gray-50 py-4 px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {/* Statistics Cards */}
            <div className="flex flex-wrap -mx-6 mb-8">
              <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                  <div className="p-3 rounded-full bg-rose-600 bg-opacity-75">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">{terapisList.length}</h4>
                    <div className="text-gray-500">Total Terapis</div>
                  </div>
                </div>
              </div>
              <div className="w-full mt-6 px-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                <div className="flex items-center px-5 py-6 shadow-sm rounded-md bg-slate-100">
                  <div className="p-3 rounded-full bg-rose-600 bg-opacity-75">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" fill="currentColor"/>
                    </svg>
                  </div>
                  <div className="mx-5">
                    <h4 className="text-2xl font-semibold text-gray-700">{pasienList.length}</h4>
                    <div className="text-gray-500">Total Pasien</div>
                  </div>
                </div>
              </div>
            </div>

            {activeTab === "terapis" && (
              <>
                {/* Tambah Terapis Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">{editingId ? "Edit Terapis" : "Tambah Terapis"}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          required
                          aria-label="Nama"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          required
                          aria-label="Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password {editingId && "(Kosongkan jika tidak diubah)"}</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          aria-label="Password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
                        <input
                          type="text"
                          name="spesialisasi"
                          value={formData.spesialisasi}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          aria-label="Spesialisasi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                        <input
                          type="file"
                          name="foto"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          aria-label="Foto"
                        />
                        {formData.foto && (
                          <img
                            src={URL.createObjectURL(formData.foto)}
                            alt="Preview Foto"
                            className="mt-2 w-20 h-20 object-cover rounded-md border-2 border-gray-200"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                      >
                        {editingId ? "Update Terapis" : "Tambah Terapis"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Daftar Terapis Section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Daftar Terapis</h2>
                  {terapisList.length > 0 ? (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-200">
                        <h2 className="text-base font-semibold text-gray-800">Data Terapis</h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola data terapis di sini.</p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Spesialisasi</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                              <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {terapisList.map((terapis) => (
                              <tr key={terapis.id_terapis} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{terapis.user?.nama || "Tidak Diketahui"}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{terapis.user?.email || "-"}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">{terapis.spesialisasi || "-"}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {terapis.foto ? (
                                    <a href={getPhotoUrl(terapis.foto)} target="_blank" rel="noopener noreferrer" className="text-rose-600 hover:text-rose-700 text-sm">View</a>
                                  ) : (
                                    <span className="text-sm text-gray-500">Tidak Ada</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                  <button
                                    onClick={() => handleEdit(terapis)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => openDeleteModal(terapis.id_terapis)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                                  >
                                    Hapus
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="bg-white px-6 py-2 border-t border-gray-200">
                        <div className="flex items-center justify-between flex-col sm:flex-row py-2">
                          <div className="mb-2 sm:mb-0">
                            <p className="text-sm text-gray-700">
                              Showing <span className="font-medium">1</span> to <span className="font-medium">{terapisList.length}</span> of <span className="font-medium">{terapisList.length}</span> results
                            </p>
                          </div>
                          <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </a>
                              <a href="#" className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-rose-50 text-sm font-medium text-rose-600 hover:bg-rose-100">1</a>
                              <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              </a>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Belum ada terapis yang terdaftar.</p>
                  )}
                </div>
              </>
            )}

            {activeTab === "pasien" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Daftar Pasien</h2>
                {pasienList.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                      <h2 className="text-base font-semibold text-gray-800">Data Pasien</h2>
                      <p className="text-sm text-gray-500 mt-1">Lihat data pasien di sini.</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pasienList.map((pasien) => (
                            <tr key={pasien.iduser} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{pasien.nama || "Tidak Diketahui"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{pasien.email || "-"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{pasien.role || "-"}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="bg-white px-6 py-2 border-t border-gray-200">
                      <div className="flex items-center justify-between flex-col sm:flex-row py-2">
                        <div className="mb-2 sm:mb-0">
                          <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{pasienList.length}</span> of <span className="font-medium">{pasienList.length}</span> results
                          </p>
                        </div>
                        <div>
                          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                              <span className="sr-only">Previous</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                            <a href="#" className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-rose-50 text-sm font-medium text-rose-600 hover:bg-rose-100">1</a>
                            <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                              <span className="sr-only">Next</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Belum ada pasien yang terdaftar.</p>
                )}
              </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Terapis</h3>
                  <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
                        <input
                          type="text"
                          name="nama"
                          value={formData.nama}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          required
                          aria-label="Nama"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          required
                          aria-label="Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password (Kosongkan jika tidak diubah)</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          aria-label="Password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Spesialisasi</label>
                        <input
                          type="text"
                          name="spesialisasi"
                          value={formData.spesialisasi}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          aria-label="Spesialisasi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto</label>
                        <input
                          type="file"
                          name="foto"
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 rounded-md border border-gray-200 bg-white focus:border-rose-600 focus:ring-2 focus:ring-rose-100 transition text-sm"
                          aria-label="Foto"
                        />
                        {formData.foto && (
                          <img
                            src={URL.createObjectURL(formData.foto)}
                            alt="Preview Foto"
                            className="mt-2 w-20 h-20 object-cover rounded-md border-2 border-gray-200"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(false);
                          setFormData({ nama: "", email: "", password: "", spesialisasi: "", foto: null });
                          setEditingId(null);
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 transition"
                      >
                        Update Terapis
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 sm:mx-auto shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Konfirmasi Hapus</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Apakah Anda yakin ingin menghapus terapis ini? Tindakan ini tidak dapat dibatalkan.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsDeleteModalOpen(false);
                        setDeleteId(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 z-50 space-y-2 w-72">
              {toasts.map((toast) => (
                <div
                  key={toast.id}
                  className={`flex items-start p-3 rounded-lg border shadow-sm ${
                    toast.type === "success" ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {toast.type === "success" && <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                    {toast.type === "danger" && <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>}
                  </div>
                  <div className="ml-2">
                    <h3 className={`text-sm font-medium ${toast.type === "success" ? "text-green-800" : "text-red-800"}`}>{toast.title}</h3>
                    <p className={`mt-1 text-sm ${toast.type === "success" ? "text-green-600" : "text-red-600"}`}>{toast.message}</p>
                  </div>
                  <button className={`ml-auto ${toast.type === "success" ? "text-green-400 hover:text-green-500" : "text-red-400 hover:text-red-500"}`} onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardAdmin;