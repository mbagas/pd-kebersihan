<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::factory()->create([
            'name' => 'Admin SIM-PALD',
            'email' => 'admin@simpald.test',
            'role' => User::ROLE_ADMIN,
        ]);

        // Driver User
        User::factory()->create([
            'name' => 'Budi Driver',
            'email' => 'driver@simpald.test',
            'role' => User::ROLE_DRIVER,
        ]);

        // Auditor User
        User::factory()->create([
            'name' => 'Auditor Pemda',
            'email' => 'auditor@simpald.test',
            'role' => User::ROLE_AUDITOR,
        ]);

        // Customer User
        User::factory()->create([
            'name' => 'Pelanggan Test',
            'email' => 'customer@simpald.test',
            'role' => User::ROLE_CUSTOMER,
        ]);
    }
}
