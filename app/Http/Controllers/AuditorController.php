<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditorController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Auditor/Dashboard');
    }

    public function peta(): Response
    {
        return Inertia::render('Auditor/Peta');
    }

    public function keuangan(): Response
    {
        return Inertia::render('Auditor/Keuangan');
    }

    public function trail(): Response
    {
        return Inertia::render('Auditor/Trail');
    }
}
