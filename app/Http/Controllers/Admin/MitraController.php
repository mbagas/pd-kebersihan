<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MitraController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Master/Mitra/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Master/Mitra/Create');
    }

    public function store(Request $request)
    {
        // TODO: Implement store logic
        return redirect()->route('admin.mitra.index')->with('success', 'Mitra berhasil ditambahkan');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Admin/Master/Mitra/Show', ['id' => $id]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('Admin/Master/Mitra/Edit', ['id' => $id]);
    }

    public function update(Request $request, string $id)
    {
        // TODO: Implement update logic
        return redirect()->route('admin.mitra.index')->with('success', 'Mitra berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        // TODO: Implement delete logic
        return redirect()->route('admin.mitra.index')->with('success', 'Mitra berhasil dihapus');
    }
}
