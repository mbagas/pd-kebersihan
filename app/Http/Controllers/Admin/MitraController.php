<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MitraController extends Controller
{
    private function getMockMitra(): array
    {
        return [
            ['id' => 1, 'nama' => 'UPT Kebersihan Pusat', 'tipe' => 'internal', 'kontak' => '021-5551234', 'alamat' => 'Jl. Kebersihan No. 1', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'nama' => 'CV. Bersih Jaya', 'tipe' => 'external', 'kontak' => '081234567890', 'alamat' => 'Jl. Industri No. 45', 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-01-05 09:00:00'],
            ['id' => 3, 'nama' => 'CV. Maju Bersama', 'tipe' => 'external', 'kontak' => '082345678901', 'alamat' => 'Jl. Raya Timur No. 12', 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-01-10 10:00:00'],
        ];
    }

    public function index(Request $request): Response
    {
        $mitra = $this->getMockMitra();
        
        // Search
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $mitra = array_filter($mitra, fn($m) => 
                str_contains(strtolower($m['nama']), $search) ||
                str_contains(strtolower($m['kontak']), $search)
            );
        }
        
        // Pagination
        $page = $request->get('page', 1);
        $perPage = 10;
        $total = count($mitra);
        $mitra = array_values($mitra);
        $offset = ($page - 1) * $perPage;
        $paginatedMitra = array_slice($mitra, $offset, $perPage);

        return Inertia::render('Admin/Master/Mitra/Index', [
            'mitra' => [
                'data' => $paginatedMitra,
                'meta' => [
                    'current_page' => (int) $page,
                    'last_page' => (int) ceil($total / $perPage),
                    'per_page' => $perPage,
                    'total' => $total,
                ],
            ],
            'filters' => [
                'search' => $request->get('search', ''),
            ],
        ]);
    }

    public function store(Request $request)
    {
        // Mockup: just return success
        return redirect()->route('admin.mitra.index')->with('success', 'Mitra berhasil ditambahkan');
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('admin.mitra.index')->with('success', 'Mitra berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        return redirect()->route('admin.mitra.index')->with('success', 'Mitra berhasil dihapus');
    }
}
