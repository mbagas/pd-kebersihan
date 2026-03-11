<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TarifController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Master/Tarif/Index', [
            'tarif' => MockData::tarif(),
        ]);
    }

    public function update(Request $request, string $id)
    {
        return redirect()->route('admin.tarif.index')->with('success', 'Tarif berhasil diperbarui');
    }
}
