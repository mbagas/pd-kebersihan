<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerAddress extends Model
{
    protected $fillable = [
        'label',
        'address',
        'lat',
        'lng',
        'is_default',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'lat' => 'decimal:8',
            'lng' => 'decimal:8',
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Set this address as the default, unsetting others for the same user.
     */
    public function setAsDefault(): void
    {
        self::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }
}
