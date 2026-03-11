<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MitraController extends Controller
{
    public function index(Request $request): Response
    {
        $mitra = MockData::mitra();

        // Search
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $mitra = array_filter($mitra, fn ($m) => str_contains(strtolower($m['nama']), $search) ||
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
