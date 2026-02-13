<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function dashboard(): Response
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function dispatch(): Response
    {
        return Inertia::render('Admin/Dispatch');
    }

    public function kasir(): Response
    {
        return Inertia::render('Admin/Kasir');
    }

    public function laporan(): Response
    {
        return Inertia::render('Admin/Laporan');
    }
}
