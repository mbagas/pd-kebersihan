<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TarifController extends Controller
{
    private function getMockTarif(): array
    {
        return [
            ['id' => 1, 'tipe_customer' => 'household', 'harga_per_m3' => 50000, 'keterangan' => 'Tarif rumah tangga standar', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'tipe_customer' => 'institution', 'harga_per_m3' => 75000, 'keterangan' => 'Tarif instansi/perusahaan', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
        ];
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Master/Tarif/Index', [
            'tarif' => $this->getMockTarif(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('admin.tarif.index')->with('success', 'Tarif berhasil diperbarui');
    }
}
