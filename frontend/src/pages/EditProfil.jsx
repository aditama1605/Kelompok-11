import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditProfil = () => {
  const navigate = useNavigate();

  // Form state
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Gambar profil state
  const [previewImage, setPreviewImage] = useState("/avatar-placeholder.png");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  // Ganti foto
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Preview langsung
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nama", nama);
      formData.append("email", email);
      formData.append("password", password);
      if (selectedFile) {
        formData.append("foto", selectedFile); // Kirim file ke backend
      }

      await axios.put("http://localhost:5000/api/pasien/edit", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profil berhasil diperbarui!");
      navigate("/dashboard-pasien");
    } catch (error) {
      console.error("Gagal update profil:", error);
      alert("Gagal update profil!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md max-w-xl w-full">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={previewImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mb-2 object-cover"
          />
          <button
            type="button"
            className="bg-black text-white px-4 py-2 rounded"
            onClick={() => fileInputRef.current.click()}
          >
            Ganti Foto Profile
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium">Nama</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="Nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white px-4 py-2 rounded w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfil;
