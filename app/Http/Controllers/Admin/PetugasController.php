<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PetugasController extends Controller
{
    private function getMockMitra(): array
    {
        return [
            ['id' => 1, 'nama' => 'UPT Kebersihan Pusat', 'tipe' => 'internal'],
            ['id' => 2, 'nama' => 'CV. Bersih Jaya', 'tipe' => 'external'],
            ['id' => 3, 'nama' => 'CV. Maju Bersama', 'tipe' => 'external'],
        ];
    }

    private function getMockArmada(): array
    {
        $mitra = $this->getMockMitra();
        return [
            ['id' => 1, 'plat_nomor' => 'B 1234 ABC', 'kapasitas' => 6, 'status' => 'available', 'mitra_id' => 1, 'mitra' => $mitra[0]],
            ['id' => 2, 'plat_nomor' => 'B 5678 DEF', 'kapasitas' => 8, 'status' => 'in_use', 'mitra_id' => 1, 'mitra' => $mitra[0]],
            ['id' => 3, 'plat_nomor' => 'B 9012 GHI', 'kapasitas' => 6, 'status' => 'available', 'mitra_id' => 2, 'mitra' => $mitra[1]],
            ['id' => 4, 'plat_nomor' => 'B 3456 JKL', 'kapasitas' => 10, 'status' => 'maintenance', 'mitra_id' => 2, 'mitra' => $mitra[1]],
            ['id' => 5, 'plat_nomor' => 'B 7890 MNO', 'kapasitas' => 8, 'status' => 'available', 'mitra_id' => 3, 'mitra' => $mitra[2]],
        ];
    }

    private function getMockPetugas(): array
    {
        $mitra = $this->getMockMitra();
        $armada = $this->getMockArmada();
        return [
            ['id' => 1, 'nama' => 'Budi Santoso', 'kontak' => '081111111111', 'mitra_id' => 1, 'mitra' => $mitra[0], 'armada_id' => 1, 'armada' => $armada[0], 'status_aktif' => true, 'saldo_hutang' => 0, 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'nama' => 'Agus Wijaya', 'kontak' => '081222222222', 'mitra_id' => 1, 'mitra' => $mitra[0], 'armada_id' => 2, 'armada' => $armada[1], 'status_aktif' => true, 'saldo_hutang' => 150000, 'created_at' => '2026-01-02 08:00:00', 'updated_at' => '2026-02-15 16:00:00'],
            ['id' => 3, 'nama' => 'Dedi Kurniawan', 'kontak' => '081333333333', 'mitra_id' => 2, 'mitra' => $mitra[1], 'armada_id' => 3, 'armada' => $armada[2], 'status_aktif' => true, 'saldo_hutang' => 75000, 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-02-14 11:00:00'],
            ['id' => 4, 'nama' => 'Eko Prasetyo', 'kontak' => '081444444444', 'mitra_id' => 2, 'mitra' => $mitra[1], 'armada_id' => 4, 'armada' => $armada[3], 'status_aktif' => true, 'saldo_hutang' => 0, 'created_at' => '2026-01-06 09:00:00', 'updated_at' => '2026-01-06 09:00:00'],
            ['id' => 5, 'nama' => 'Fajar Hidayat', 'kontak' => '081555555555', 'mitra_id' => 3, 'mitra' => $mitra[2], 'armada_id' => 5, 'armada' => $armada[4], 'status_aktif' => true, 'saldo_hutang' => 200000, 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-02-16 08:00:00'],
            ['id' => 6, 'nama' => 'Gunawan', 'kontak' => '081666666666', 'mitra_id' => 3, 'mitra' => $mitra[2], 'armada_id' => null, 'armada' => null, 'status_aktif' => false, 'saldo_hutang' => 0, 'created_at' => '2026-01-11 10:00:00', 'updated_at' => '2026-02-01 09:00:00'],
        ];
    }

    public function index(Request $request): Response
    {
        $petugas = $this->getMockPetugas();
        $mitra = $this->getMockMitra();
        
        // Search
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $petugas = array_filter($petugas, fn($p) => 
                str_contains(strtolower($p['nama']), $search) ||
                str_contains(strtolower($p['kontak']), $search)
            );
        }
        
        // Filter by mitra
        if ($request->has('mitra_id') && $request->mitra_id !== 'all') {
            $petugas = array_filter($petugas, fn($p) => $p['mitra_id'] == $request->mitra_id);
        }
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $isActive = $request->status === 'active';
            $petugas = array_filter($petugas, fn($p) => $p['status_aktif'] === $isActive);
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
            'mitra' => $this->getMockMitra(),
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('admin.petugas.index')->with('success', 'Petugas berhasil ditambahkan');
    }

    public function show(string $id): Response
    {
        $petugas = collect($this->getMockPetugas())->firstWhere('id', (int) $id);
        return Inertia::render('Admin/Master/Petugas/Show', [
            'petugas' => $petugas,
        ]);
    }

    public function edit(string $id): Response
    {
        $petugas = collect($this->getMockPetugas())->firstWhere('id', (int) $id);
        return Inertia::render('Admin/Master/Petugas/Edit', [
            'petugas' => $petugas,
            'mitra' => $this->getMockMitra(),
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
