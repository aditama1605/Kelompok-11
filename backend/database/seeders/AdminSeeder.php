<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Cek apakah admin sudah ada
        if (!User::where('email', 'admin@terapyapp.com')->exists()) {
            User::create([
                'nama' => 'Administrator',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('12345678'), // Ganti dengan password yang kuat
                'role' => 'admin'
            ]);

            $this->command->info('Admin user created successfully!');
            $this->command->info('Email: admin@gmail.com');
            $this->command->info('Password: 12345678');
        } else {
            $this->command->info('Admin user already exists!');
        }
    }
}