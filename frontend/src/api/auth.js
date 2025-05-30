import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Ganti sesuai URL backend Anda

export async function login(email, password) {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "Login gagal" };
  }
}

export async function register(nama, email, password, role) {
  try {
    const response = await axios.post(`${API_URL}/register`, { nama, email, password, role });
    return response.data;
  } catch (error) {
    return error.response?.data || { status: "error", message: "Registrasi gagal" };
  }
}