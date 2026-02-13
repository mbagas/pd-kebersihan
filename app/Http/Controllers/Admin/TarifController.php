<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TarifController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Master/Tarif/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Master/Tarif/Create');
    }

    public function store(Request $request)
    {
        // TODO: Implement store logic
        return redirect()->route('admin.tarif.index')->with('success', 'Tarif berhasil ditambahkan');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Admin/Master/Tarif/Show', ['id' => $id]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('Admin/Master/Tarif/Edit', ['id' => $id]);
    }

    public function update(Request $request, string $id)
    {
        // TODO: Implement update logic
        return redirect()->route('admin.tarif.index')->with('success', 'Tarif berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        // TODO: Implement delete logic
        return redirect()->route('admin.tarif.index')->with('success', 'Tarif berhasil dihapus');
    }
}
