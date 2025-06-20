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


## Prerequisites

- PHP >= 8.1
- Composer
- Node.js & npm
- MySQL/MariaDB
- Git
- [Laragon](https://laragon.org/) (optional, for local development)

---

## Backend Installation (Laravel)

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

---

## Frontend Installation

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

---

## ServerChat Installation (Node.js + Socket.IO)

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

---

## Notes

- Make sure backend, frontend, and ServerChat run on different ports.
- Change the API endpoint configuration in the frontend if needed.
- For JWT, ensure the `JWT_SECRET` variable in the backend `.env` file is set.
- If using Laragon, you can manage services easily via the Laragon dashboard.

---

Selamat mencoba!