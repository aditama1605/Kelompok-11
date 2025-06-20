<<<<<<< HEAD
# 🧠 TerapyApp - Mental Health Platform

![Project Banner](https://placehold.co/1200x400/4F46E5/FFFFFF?text=TerapyApp) <!-- Replace with actual banner image -->

A comprehensive mental health platform featuring therapy sessions, mood tracking, and real-time chat support.

## 🚀 Features

- **User Authentication** (JWT secured)
- **Therapy Session Management**
- **Real-time Chat** (Socket.IO)
- **Mood & Activity Tracking**
- **Admin Dashboard**
- **Responsive Frontend** (Vue.js/React)

## 🛠 Tech Stack

**Backend**:
![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

**Frontend**:
![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Real-time**:
![Socket.IO](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

=======
![TerapyApp Banner](https://placehold.co/1200x400/4F46E5/FFFFFF?text=TerapyCare)
>>>>>>> 1a3a45088fef8a52f3fb467f11783e48b5366693

<p align="center">
  <a href="https://laravel.com"><img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"></a>
  <a href="https://www.php.net"><img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"></a>
  <a href="https://www.mysql.com"><img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"></a>
  <a href="https://reactjs.org"><img src="https://img.shields.io/badge/ReactJs-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="ReactJs"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"></a>
  <a href="https://socket.io"><img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" alt="Socket.IO"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
</p>

> TerapyApp (TerapyCare) adalah platform digital yang dikembangkan untuk mempermudah masyarakat dalam mengakses layanan fisioterapi profesional. Melalui aplikasi ini, pasien dapat memesan layanan secara online untuk kunjungan rumah maupun konsultasi daring, menjadikan layanan kesehatan lebih cepat, efisien, dan mudah dijangkau.


### 💡 **Why It Matters**
Di era digital, masih banyak masyarakat mengalami kesulitan dalam mengakses layanan fisioterapi karena keterbatasan waktu, lokasi, dan informasi. TerapyApp hadir untuk:
- Mempercepat dan menyederhanakan proses pemesanan dan komunikasi.
- Meningkatkan kesadaran masyarakat akan pentingnya terapi fisik.
- Menghubungkan pasien dan terapis secara langsung melalui fitur real-time chat.
- Memberikan edukasi dan panduan latihan dari terapis.

### ⚙️ **How It Works**
- Pasien: Dapat melihat profil terapis, memesan layanan, mengunggah bukti pembayaran, mengakses panduan latihan, serta berkomunikasi dengan terapis.
- Terapis: Dapat mengelola jadwal, membuat laporan perkembangan pasien, serta memberikan panduan latihan.
- Admin: Mengelola data pengguna, memverifikasi akun & pembayaran, serta memonitor keseluruhan aktivitas platform.

---

### Backend Installation (Laravel)

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/Kelompok-11.git
   cd Kelompok-11/backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Copy the environment file**
   ```bash
   cp .env.example .env
   ```

4. **Generate APP_KEY**
   ```bash
   php artisan key:generate
   ```

5. **Configure the database**  
   Edit the `.env` file:
   ```
   DB_DATABASE=your_database
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   ```

6. **Run database migrations**
   ```bash
   php artisan migrate
   ```

7. **Seed admin user**
   ```bash
   php artisan db:seed --class=AdminSeeder
   ```

8. **Install JWT Auth**
   ```bash
   composer require tymon/jwt-auth
   php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
   php artisan jwt:secret
   ```

9. **Run the server**
   ```bash
   php artisan serve
   ```

### Frontend Installation

1. **Navigate to the frontend folder**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```


<<<<<<< HEAD
## ServerChat Installation (Node.js + Socket.IO)
=======
### ServerChat Installation (Node.js + Socket.IO)
>>>>>>> 1a3a45088fef8a52f3fb467f11783e48b5366693

1. **Navigate to the ServerChat folder**
   ```bash
   cd ../ServerChat
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the chat server**
   ```bash
   node server.js
   ```

<<<<<<< HEAD
---

## Notes
=======
### 📝 **Notes**
>>>>>>> 1a3a45088fef8a52f3fb467f11783e48b5366693

- Make sure backend, frontend, and ServerChat run on different ports.
- Change the API endpoint configuration in the frontend if needed.
- For JWT, ensure the `JWT_SECRET` variable in the backend `.env` file is set.
- If using Laragon, you can manage services easily via the Laragon dashboard.

---
<<<<<<< HEAD

Selamat mencoba!
=======
### 👥 Meet Our Extraordinary Team 11


| ID         | Name                  | Campus                               | GitHub Profile                                |
|------------|-----------------------|--------------------------------------|-----------------------------------------------|
| FWD02023   | Zidan Ibadurrahman    | STT Terpadu Nurul Fikri              | [Zibad12](https://github.com/Zibad12)         |
| FWD02103   | Nisa Kris Cahyani     | Politeknik Negeri Banyuwangi         | [nisakris](https://github.com/nisakris)       |
| FWD02105   | M. Albi Mustakim      | Universitas Bhayangkara Jakarta Raya | [albimst](https://github.com/albimst)         |
| FWD02107   | Adi Indra Pratama     | Universitas Negeri Surabaya          | [aditama1605](https://github.com/aditama1605) |
| FWD02109   | Muhammad Zikri        | Universitas Muhammadiyah Jakarta     | [Mu-jikri](https://github.com/Mu-jikri)       |
>>>>>>> 1a3a45088fef8a52f3fb467f11783e48b5366693
