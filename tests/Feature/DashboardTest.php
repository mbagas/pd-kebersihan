<?php

use App\Models\User;

test('guests are redirected to the login page when accessing admin dashboard', function () {
    $response = $this->get('/admin');
    $response->assertRedirect(route('login'));
});

test('admin users can visit the admin dashboard', function () {
    $user = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertOk();
});

test('non-admin users cannot access admin dashboard', function () {
    $user = User::factory()->create(['role' => User::ROLE_CUSTOMER]);
    $this->actingAs($user);

    $response = $this->get(route('admin.dashboard'));
    $response->assertForbidden();
});
