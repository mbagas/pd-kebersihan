<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArmadaController extends Controller
{
    public function index(Request $request): Response
    {
        $armada = MockData::armada();
        $mitra = MockData::mitra();

        // Search
        if ($request->has('search') && $request->search) {
            $search = strtolower($request->search);
            $armada = array_filter($armada, fn ($a) => str_contains(strtolower($a['plat_nomor']), $search)
            );
        }

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $armada = array_filter($armada, fn ($a) => $a['status'] === $request->status);
        }

        // Pagination
        $page = $request->get('page', 1);
        $perPage = 10;
        $total = count($armada);
        $armada = array_values($armada);
        $offset = ($page - 1) * $perPage;
        $paginatedArmada = array_slice($armada, $offset, $perPage);

        return Inertia::render('Admin/Master/Armada/Index', [
            'armada' => [
                'data' => $paginatedArmada,
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
                'status' => $request->get('status', 'all'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil ditambahkan');
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        return redirect()->route('admin.armada.index')->with('success', 'Armada berhasil dihapus');
    }
}
