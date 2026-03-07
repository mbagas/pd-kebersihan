<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerProfile extends Model
{
    protected $fillable = [
        'customer_type',
        'company_name',
        'npwp',
        'pic_name',
        'business_type',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeHousehold(Builder $query): Builder
    {
        return $query->where('customer_type', 'household');
    }

    public function scopeInstitution(Builder $query): Builder
    {
        return $query->where('customer_type', 'institution');
    }
}
