<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    public function index(Request $request): Response
    {
        $petugas = MockData::petugas();
        $mitra = MockData::mitra();

        // Search
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $petugas = array_filter($petugas, fn ($p) => str_contains(strtolower($p['nama']), $search) ||
                str_contains(strtolower($p['kontak']), $search)
            );
        }

        // Filter by mitra
        if ($request->has('mitra_id') && $request->mitra_id !== 'all') {
            $petugas = array_filter($petugas, fn ($p) => $p['mitra_id'] == $request->mitra_id);
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $isActive = $request->status === 'active';
            $petugas = array_filter($petugas, fn ($p) => $p['status_aktif'] === $isActive);
        }

        // Pagination
        $page = $request->get('page', 1);
        $perPage = 10;
        $total = count($petugas);
        $petugas = array_values($petugas);
        $offset = ($page - 1) * $perPage;
        $paginatedPetugas = array_slice($petugas, $offset, $perPage);

        return Inertia::render('Admin/Master/Petugas/Index', [
            'petugas' => [
                'data' => $paginatedPetugas,
                'meta' => [
                    'current_page' => (int) $page,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
            'mitra' => $mitra,
            'filters' => [
                'search' => $request->get('search', ''),
                'mitra_id' => $request->get('mitra_id', 'all'),
                'status' => $request->get('status', 'all'),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Master/Petugas/Create', [
            'mitra' => MockData::mitra(),
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil ditambahkan');
    }

    public function show(string $id): Response
    {
        $petugas = collect(MockData::petugas())->firstWhere('id', (int) $id);

        return Inertia::render('Admin/Master/Petugas/Show', [
            'petugas' => $petugas,
        ]);
    }

    public function edit(string $id): Response
    {
        $petugas = collect(MockData::petugas())->firstWhere('id', (int) $id);

        return Inertia::render('Admin/Master/Petugas/Edit', [
            'petugas' => $petugas,
            'mitra' => MockData::mitra(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil dihapus');
    }
}
