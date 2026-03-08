<?php

namespace App\Actions;

use App\Models\User;

class StoreOrder
{
    /**
     * Validation rules shared by both public and customer order forms.
     *
     * @return array<string, array<int, mixed>>
     */
    public static function rules(): array
    {
        return [
            'customer_type' => ['required', 'in:household,institution'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
            'location' => ['required', 'array'],
            'location.lat' => ['required', 'numeric', 'between:-90,90'],
            'location.lng' => ['required', 'numeric', 'between:-180,180'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'npwp' => ['nullable', 'string', 'max:30'],
            'pic_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'estimated_volume' => ['nullable', 'numeric', 'min:0'],
            'has_grease_trap' => ['nullable', 'boolean'],
            'payment_method' => ['required', 'in:cod,transfer'],
            'notes' => ['nullable', 'string', 'max:500'],
            'save_address' => ['nullable', 'boolean'],
            'address_label' => ['nullable', 'required_if:save_address,true', 'string', 'max:50'],
        ];
    }

    /**
     * Fetch the current tariff.
     *
     * @return array{household: int, institution: int}
     */
    public static function tariff(): array
    {
        // TODO: Fetch tariff from database (Issue #16)
        return [
            'household' => 150000,
            'institution' => 200000,
        ];
    }

    /**
     * Handle order creation and optional address saving.
     *
     * @param  array<string, mixed>  $validated
     */
    public function execute(array $validated, ?User $user = null): void
    {
        // Save new address if requested by logged-in customer
        if ($user && $user->isCustomer() && ($validated['save_address'] ?? false)) {
            $addressCount = $user->customerAddresses()->count();

            if ($addressCount < 5) {
                $user->customerAddresses()->create([
                    'label' => $validated['address_label'],
                    'address' => $validated['address'],
                    'lat' => $validated['location']['lat'],
                    'lng' => $validated['location']['lng'],
                    'is_default' => $addressCount === 0,
                ]);
            }
        }

        // TODO: Create actual order record (Issue #19 - Order Schema)
    }
}
