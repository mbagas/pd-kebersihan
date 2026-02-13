<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Master/Petugas/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Master/Petugas/Create');
    }

    public function store(Request $request)
    {
        // TODO: Implement store logic
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil ditambahkan');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Admin/Master/Petugas/Show', ['id' => $id]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('Admin/Master/Petugas/Edit', ['id' => $id]);
    }

    public function update(Request $request, string $id)
    {
        // TODO: Implement update logic
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        // TODO: Implement delete logic
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil dihapus');
    }
}
