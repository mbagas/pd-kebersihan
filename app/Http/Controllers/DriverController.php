<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DriverController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Driver/Tugas/Index');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Driver/Tugas/Show', [
            'id' => $id,
        ]);
    }

    public function riwayat(): Response
    {
        return Inertia::render('Driver/Riwayat');
    }

    public function profil(): Response
    {
        return Inertia::render('Driver/Profil');
    }
}
