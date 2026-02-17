<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\ArmadaController;
use App\Http\Controllers\Admin\MitraController;
use App\Http\Controllers\Admin\PetugasController;
use App\Http\Controllers\Admin\TarifController;
use App\Http\Controllers\AuditorController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/order', [PublicController::class, 'order'])->name('order');
Route::post('/order', [PublicController::class, 'storeOrder'])->name('order.store');
Route::get('/tracking', [PublicController::class, 'tracking'])->name('tracking');

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::get('/', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/dispatch', [AdminController::class, 'dispatch'])->name('admin.dispatch');
    Route::get('/kasir', [AdminController::class, 'kasir'])->name('admin.kasir');
    Route::get('/laporan', [AdminController::class, 'laporan'])->name('admin.laporan');

    // Master Data - Modal CRUD (index, store, update, destroy only)
    Route::resource('master/mitra', MitraController::class)->names('admin.mitra')->only(['index', 'store', 'update', 'destroy']);
    Route::resource('master/armada', ArmadaController::class)->names('admin.armada')->only(['index', 'store', 'update', 'destroy']);
    Route::resource('master/tarif', TarifController::class)->names('admin.tarif')->only(['index', 'update']);
    
    // Master Data - Page CRUD (full resource)
    Route::resource('master/petugas', PetugasController::class)->names('admin.petugas');
});

/*
|--------------------------------------------------------------------------
| Driver/Petugas Routes (PWA)
|--------------------------------------------------------------------------
*/
Route::prefix('app')->middleware(['auth', 'verified', 'role:driver'])->group(function () {
    Route::get('/tugas', [DriverController::class, 'index'])->name('driver.tugas');
    Route::get('/tugas/{id}', [DriverController::class, 'show'])->name('driver.tugas.show');
    Route::get('/riwayat', [DriverController::class, 'riwayat'])->name('driver.riwayat');
    Route::get('/profil', [DriverController::class, 'profil'])->name('driver.profil');
});

/*
|--------------------------------------------------------------------------
| Audit Routes (Admin & Auditor can access)
|--------------------------------------------------------------------------
*/
Route::prefix('audit')->middleware(['auth', 'verified', 'role:admin,auditor'])->group(function () {
    Route::get('/', [AuditorController::class, 'dashboard'])->name('audit.dashboard');
    Route::get('/peta', [AuditorController::class, 'peta'])->name('audit.peta');
    Route::get('/keuangan', [AuditorController::class, 'keuangan'])->name('audit.keuangan');
    Route::get('/trail', [AuditorController::class, 'trail'])->name('audit.trail');
});

/*
|--------------------------------------------------------------------------
| Auth & Settings Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/settings.php';
