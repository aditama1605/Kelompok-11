import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DataPasien() {
  const navigate = useNavigate();
  const nama = localStorage.getItem("nama") || "Terapis";
  const token = localStorage.getItem("token");
  const [toasts, setToasts] = useState([]);
  const [jadwalList, setJadwalList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("semua");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Toast notification system
  const showToast = (type, title, message) => {
    const id = Date.now();
    const newToast = { id, type, title, message };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("nama");
    localStorage.removeItem("iduser");
    navigate("/login");
  };

  // Ambil jadwal terapi
  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/jadwal-terapi", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJadwalList(response.data.data);
      } catch (error) {
        showToast("danger", "Error", "Gagal memuat data jadwal");
      }
    };
    fetchJadwal();
  }, [token]);

  // Ambil semua user (untuk total pasien)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserList(response.data.data);
      } catch (error) {
        console.error("Gagal ambil data user:", error);
      }
    };
    fetchUsers();
  }, [token]);

  // Hitung total semua pasien (role === 'pasien')
  const totalPasien = userList.filter((u) => u.role === "pasien").length;

  // Filter dan search jadwal
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() - today.getDay() + 6);

  const filteredJadwal = jadwalList
    .filter(j => {
      // Cari user berdasarkan user_id
      const user = userList.find(u => u.id === j.user_id);

      // Gabungkan semua kolom yang ingin dicari
      const searchString = [
        j.user?.nama,
        j.alamat,
        j.no_telepon,
        j.tanggal,
        j.layanan_terapi,
        j.jenis_layanan,
        j.jadwal_terapi,
        j.alamat,
        j.no_telepon
      ]
        .map(x => (x || '').toString().toLowerCase())
        .join(' ');

      if (search && !searchString.includes(search.toLowerCase())) return false;

      // Filter waktu
      if (filter === "hariini") {
        const tgl = new Date(j.tanggal || j.jadwal_terapi);
        return (
          tgl.getDate() === today.getDate() &&
          tgl.getMonth() === today.getMonth() &&
          tgl.getFullYear() === today.getFullYear()
        );
      }
      if (filter === "mingguini") {
        const tgl = new Date(j.tanggal || j.jadwal_terapi);
        return tgl >= startOfWeek && tgl <= endOfWeek;
      }
      if (filter === "bulanini") {
        const tgl = new Date(j.tanggal || j.jadwal_terapi);
        return (
          tgl.getMonth() === today.getMonth() &&
          tgl.getFullYear() === today.getFullYear()
        );
      }
      return true; // semua & terbaru
    })
    .sort((a, b) => {
      if (filter === "terbaru") {
        return new Date(b.tanggal || b.jadwal_terapi) - new Date(a.tanggal || a.jadwal_terapi);
      }
      return 0;
    });

  // Pagination logic
  const totalRows = filteredJadwal.length;
  const totalPages = rowsPerPage === "all" ? 1 : Math.ceil(totalRows / rowsPerPage);
  const paginatedJadwal =
    rowsPerPage === "all"
      ? filteredJadwal
      : filteredJadwal.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Reset page ke 1 jika filter/search berubah
  useEffect(() => {
    setPage(1);
  }, [search, filter, rowsPerPage]);

  return (
    <div>
      <Navbar role="terapis" />
      <section className="bg-white py-7 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Toast Container */}
          <div className="fixed top-4 right-4 z-50 space-y-3 w-80">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`toast flex items-start p-4 rounded-lg border shadow-lg ${
                  toast.type === "success"
                    ? "bg-green-50 border-green-100"
                    : toast.type === "danger"
                    ? "bg-red-50 border-red-100"
                    : "bg-yellow-50 border-yellow-100"
                }`}
              >
                <div className="flex-shrink-0">
                  {toast.type === "success" && (
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {toast.type === "danger" && (
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {toast.type === "warning" && (
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
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
                  onClick={() =>
                    setToasts((prev) => prev.filter((t) => t.id !== toast.id))
                  }
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
                Selamat datang, <span className="font-semibold text-rose-600">{nama}</span>
              </h2>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 rounded-md transition"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div style={styles.searchFilterContainer}>
            <input
              placeholder="Cari..."
              style={styles.searchInput}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              style={styles.filterSelect}
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="semua">Semua</option>
              <option value="terbaru">Terbaru</option>
              <option value="hariini">Hari Ini</option>
              <option value="mingguini">Minggu Ini</option>
              <option value="bulanini">Bulan Ini</option>
            </select>
            <div style={styles.totalBox}>
              <div style={styles.totalNumber}>{totalPasien}</div>
              <div style={styles.totalLabel}>Total pasien</div>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>No.</th>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Alamat</th>
                  <th style={styles.th}>No. Telepon</th>
                  <th style={styles.th}>Tanggal Terapi</th>
                  <th style={styles.th}>Layanan Terapi</th>
                  <th style={styles.th}>Panduan Latihan</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJadwal.map((j, index) => {
                  const user = userList.find(u => u.id === j.user_id);
                  return (
                    <tr key={j.id}>
                      <td style={styles.td}>
                        {rowsPerPage === "all"
                          ? index + 1
                          : (page - 1) * rowsPerPage + index + 1}
                      </td>
                      <td style={styles.td}>{j.user ? j.user.nama : '-'}</td>
                      <td style={styles.td}>{j.alamat || j.alamat || '-'}</td>
                      <td style={styles.td}>{j.no_telepon || j.no_telepon || '-'}</td>
                      <td style={styles.td}>{j.tanggal || j.jadwal_terapi || '-'}</td>
                      <td style={styles.td}>{j.layanan_terapi || j.jenis_layanan || '-'}</td>
                      <td style={styles.td}><a href="#" style={styles.link}>Buat</a></td>
                      <td style={styles.td}><a href="#" style={styles.link}>Lihat Detail</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <span>Showing</span>
            <select
              value={rowsPerPage}
              onChange={e => {
                setRowsPerPage(e.target.value === "all" ? "all" : parseInt(e.target.value));
                setPage(1);
              }}
              style={styles.pageInput}
            >
              <option value={10}>10 data</option>
              <option value={50}>50 data</option>
              <option value={100}>100 data</option>
              <option value="all">All</option>
            </select>
            <span>per page</span>
            <div style={styles.pageButtons}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  style={n === page ? styles.activePageButton : styles.pageButton}
                  onClick={() => setPage(n)}
                  disabled={n === page}
                >
                  {n}
                </button>
              ))}
              {totalPages > 1 && page < totalPages && (
                <button
                  style={styles.pageButton}
                  onClick={() => setPage(page + 1)}
                >
                  &gt;
                </button>
              )}
              {totalPages > 1 && page !== totalPages && (
                <button
                  style={styles.pageButton}
                  onClick={() => setPage(totalPages)}
                >
                  &gt;&gt;
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'sans-serif',
    padding: '1rem',
    maxWidth: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee',
    flexWrap: 'wrap'
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  navItem: {
    textDecoration: 'none',
    color: '#000',
    fontWeight: 'bold',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
  },
  welcome: {
    marginTop: '2rem',
    fontSize: '1.25rem',
  },
  searchFilterContainer: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  searchInput: {
    flex: '1',
    minWidth: '200px',
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  filterSelect: {
    padding: '0.5rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minWidth: '150px',
  },
  totalBox: {
    marginLeft: 'auto',
    textAlign: 'right',
  },
  totalNumber: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  totalLabel: {
    fontSize: '0.875rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  th: {
    textAlign: 'left',
    padding: '0.75rem',
    fontWeight: 'bold',
    borderBottom: '2px solid #ccc',
    fontSize: '0.875rem',
  },
  td: {
    padding: '0.75rem',
    fontSize: '0.875rem',
    borderBottom: '1px solid #eee',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
  pagination: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '0.5rem',
    marginTop: '1rem',
  },
  pageInput: {
    width: '80px',
    textAlign: 'center',
    padding: '0.25rem',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  pageButtons: {
    display: 'flex',
    gap: '0.25rem',
    marginLeft: '1rem',
  },
  pageButton: {
    padding: '0.5rem 0.75rem',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  activePageButton: {
    padding: '0.5rem 0.75rem',
    border: '1px solid red',
    backgroundColor: 'red',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  footer: {
    textAlign: 'center',
    padding: '2rem 0',
    borderTop: '1px solid #eee',
    fontWeight: 'bold',
    marginTop: '2rem',
  },
};