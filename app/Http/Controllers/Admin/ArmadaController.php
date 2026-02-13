<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArmadaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Master/Armada/Index');
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Master/Armada/Create');
    }

    public function store(Request $request)
    {
        // TODO: Implement store logic
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil ditambahkan');
    }

    public function show(string $id): Response
    {
        return Inertia::render('Admin/Master/Armada/Show', ['id' => $id]);
    }

    public function edit(string $id): Response
    {
        return Inertia::render('Admin/Master/Armada/Edit', ['id' => $id]);
    }

    public function update(Request $request, string $id)
    {
        // TODO: Implement update logic
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        // TODO: Implement delete logic
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil dihapus');
    }
}
