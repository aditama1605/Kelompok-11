# TerapyApp

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

7. **Install JWT Auth**
   ```bash
   composer require tymon/jwt-auth
   php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
   php artisan jwt:secret
   ```

8. **Run the server**
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

## Notes

- Make sure backend and frontend run on different ports.
- Change the API endpoint configuration in the frontend if needed.
- For JWT, ensure the `JWT_SECRET` variable in the backend `.env` file is set.

---