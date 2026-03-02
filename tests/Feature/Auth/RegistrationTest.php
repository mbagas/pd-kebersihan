<?php

use App\Models\User;

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '+6281234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    // Customer role redirects to /customer
    $response->assertRedirect('/customer');
});

test('new users are assigned customer role', function () {
    $this->post(route('register.store'), [
        'name' => 'Test Customer',
        'email' => 'customer@example.com',
        'phone' => '+6289876543210',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $user = User::where('email', 'customer@example.com')->first();

    expect($user)->not->toBeNull()
        ->and($user->role)->toBe(User::ROLE_CUSTOMER)
        ->and($user->phone)->toBe('+6289876543210');
});

test('registration requires phone number', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('phone');
});

test('registration validates indonesian phone format', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '1234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('phone');
});

test('registration rejects duplicate phone number', function () {
    User::factory()->create(['phone' => '+6281234567890']);

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'unique@example.com',
        'phone' => '+6281234567890',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertSessionHasErrors('phone');
});
