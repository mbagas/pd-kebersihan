# SIM-PALD Complete ERD & Migration Plan

> This document defines the canonical data structures for the entire application.
> It supersedes the schema in issue #12 with field names synchronized in PR #42.

## Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (unique)      │
│ phone (unique, null)│
│ role (enum)         │◄──── admin | driver | auditor | customer
│ password            │
│ timestamps          │
└──────────┬──────────┘
           │
    ┌──────┼──────────────────┐
    │ 1:1  │ 1:N              │
    ▼      │                  ▼
┌──────────────────┐  ┌────────────────────┐
│customer_profiles │  │ customer_addresses │
├──────────────────┤  ├────────────────────┤
│id (PK)           │  │id (PK)             │
│user_id (FK,uniq) │  │user_id (FK)        │
│customer_type     │  │label               │
│company_name?     │  │address (text)      │
│npwp?             │  │lat (decimal 10,8)  │
│pic_name?         │  │lng (decimal 11,8)  │
│business_type?    │  │is_default (bool)   │
│timestamps        │  │notes?              │
└──────────────────┘  │timestamps          │
                      └────────────────────┘

┌──────────────┐
│    mitra     │
├──────────────┤
│id (PK)       │
│nama          │
│tipe (enum)   │◄──── internal | external
│kontak        │
│alamat?       │
│timestamps    │
└──────┬───────┘
       │
  ┌────┴────────────┐
  │ 1:N             │ 1:N
  ▼                 ▼
┌──────────────┐  ┌──────────────────┐
│   armada     │  │    petugas       │
├──────────────┤  ├──────────────────┤
│id (PK)       │  │id (PK)           │
│plat_nomor    │  │nama              │
│  (unique)    │  │kontak            │
│kapasitas     │  │mitra_id (FK)     │
│status (enum) │  │armada_id (FK?)   │
│mitra_id (FK) │  │status_aktif      │
│timestamps    │  │saldo_hutang      │◄── COD balance
└──────┬───────┘  │timestamps        │
       │          └────────┬─────────┘
       │                   │
       │     ┌─────────────┤
       │     │             │ 1:N
       │     │             ▼
       │     │      ┌──────────────────┐
       │     │      │    setorans      │
       │     │      ├──────────────────┤
       │     │      │id (PK)           │
       │     │      │petugas_id (FK)   │
       │     │      │jumlah            │
       │     │      │tanggal           │
       │     │      │keterangan?       │
       │     │      │verified_by (FK?) │◄── users.id (admin)
       │     │      │verified_at?      │
       │     │      │timestamps        │
       │     │      └────────┬─────────┘
       │     │               │
       ▼     ▼               ▼
┌──────────────────────────────────────────────────────────┐
│                        orders                            │
├──────────────────────────────────────────────────────────┤
│ id (PK)                                                  │
│ order_number (unique)          ◄── format: ORD-YYYY-XXXX │
│                                                          │
│ ── Customer Info ──                                      │
│ customer_name                                            │
│ customer_type (enum)           ◄── household | institution│
│ customer_address (text)                                  │
│ customer_phone                                           │
│ customer_npwp?                                           │
│                                                          │
│ ── Volume & Pricing ──                                   │
│ volume_estimate (decimal, m³)                            │
│ volume_actual? (decimal, m³)   ◄── filled on completion  │
│ total_amount (integer)                                   │
│                                                          │
│ ── Status ──                                             │
│ status (enum)                  ◄── pending | assigned |  │
│                                    on_the_way | arrived |│
│                                    processing | done |   │
│                                    cancelled             │
│                                                          │
│ ── Payment ──                                            │
│ payment_method (enum)          ◄── cash | transfer       │
│ payment_status (enum)          ◄── unpaid |              │
│                                    pending_verification |│
│                                    paid                  │
│ cash_collection_status (enum)  ◄── not_applicable |      │
│                                    pending | collected |  │
│                                    deposited             │
│ bukti_transfer?                ◄── upload path           │
│ transfer_verified_at?                                    │
│ transfer_verified_by? (FK)     ◄── users.id (admin)      │
│                                                          │
│ ── Location ──                                           │
│ latitude? (decimal 10,8)                                 │
│ longitude? (decimal 11,8)                                │
│                                                          │
│ ── Evidence (JSON) ──                                    │
│ evidence? { before: string[], after: string[] }          │
│                                                          │
│ ── GPS Arrival (JSON) ──                                 │
│ gps_arrival? { lat, lng, validated, invalid_reason? }    │
│                                                          │
│ ── General ──                                            │
│ notes?                                                   │
│                                                          │
│ ── Timestamps ──                                         │
│ scheduled_at?                                            │
│ assigned_at?                                             │
│ started_at?                                              │
│ arrived_at?                                              │
│ completed_at?                                            │
│ created_at, updated_at                                   │
│                                                          │
│ ── Foreign Keys ──                                       │
│ petugas_id? (FK → petugas)                               │
│ armada_id? (FK → armada)                                 │
│ setoran_id? (FK → setorans)                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────┐
│     tarif        │
├──────────────────┤
│id (PK)           │
│tipe_customer     │◄── household | institution
│harga_per_m3      │◄── 100,000 | 150,000
│keterangan?       │
│timestamps        │
└──────────────────┘
```

## Relationships Summary

| Relationship | Type | Description |
|---|---|---|
| `users` → `customer_profiles` | 1:1 | Only for role=customer |
| `users` → `customer_addresses` | 1:N | Max 5 per user |
| `mitra` → `armada` | 1:N | Partner owns vehicles |
| `mitra` → `petugas` | 1:N | Partner employs drivers |
| `petugas` → `armada` | N:1 | Driver assigned to vehicle |
| `petugas` → `orders` | 1:N | Driver handles orders |
| `armada` → `orders` | 1:N | Vehicle used for orders |
| `petugas` → `setorans` | 1:N | Driver makes deposits |
| `setorans` → `orders` | 1:N | Deposit covers multiple orders |
| `users` (admin) → `setorans.verified_by` | 1:N | Admin verifies deposits |

## Order Lifecycle

```
pending → assigned → on_the_way → arrived → processing → done
    ↓         ↓           ↓          ↓           ↓
 cancelled  cancelled  cancelled  cancelled   cancelled
```

### Status Timestamp Mapping

| Status | Timestamp Field |
|---|---|
| pending | `created_at` |
| assigned | `assigned_at` |
| on_the_way | `started_at` |
| arrived | `arrived_at` |
| processing | (no separate timestamp) |
| done | `completed_at` |

## Payment Flows

### Cash Payment
```
cash_collection_status: pending
  → Petugas collects cash → collected (saldo_hutang += amount)
  → Kasir processes setoran → deposited (saldo_hutang -= amount)
  → payment_status: paid
```

### Transfer Payment
```
payment_status: unpaid
  → Customer uploads bukti_transfer → pending_verification
  → Admin verifies → paid (transfer_verified_at/by set)
cash_collection_status: not_applicable (always)
```

## Migrations Needed

Ordered by dependency:

1. **`mitra`** - No dependencies
2. **`tarif`** - No dependencies
3. **`armada`** - Depends on `mitra`
4. **`petugas`** - Depends on `mitra`, `armada`
5. **`orders`** - Depends on `petugas`, `armada`
6. **`setorans`** - Depends on `petugas`, `users`
7. **Update `orders`** - Add `setoran_id` FK to `setorans`

> `users`, `customer_profiles`, and `customer_addresses` already have migrations.

## Eloquent Models Needed

| Model | Table | Key Relationships |
|---|---|---|
| `Mitra` | `mitra` | hasMany(Armada), hasMany(Petugas) |
| `Armada` | `armada` | belongsTo(Mitra), hasMany(Order), hasOne(Petugas) |
| `Petugas` | `petugas` | belongsTo(Mitra), belongsTo(Armada), hasMany(Order), hasMany(Setoran) |
| `Order` | `orders` | belongsTo(Petugas), belongsTo(Armada), belongsTo(Setoran) |
| `Tarif` | `tarif` | standalone |
| `Setoran` | `setorans` | belongsTo(Petugas), hasMany(Order), belongsTo(User, 'verified_by') |

## Canonical Field Names (locked in PR #42)

| Field | Type | Notes |
|---|---|---|
| `order_number` | string | NOT `ticket_number` |
| `total_amount` | integer | NOT `total_price` |
| `volume_estimate` / `volume_actual` | decimal | NOT single `volume` |
| `payment_method: cash \| transfer` | enum | NOT `cod` |
| `customer_type: household \| institution` | enum | NOT `commercial` |
| `evidence: { before, after }` | JSON | NOT `foto_sebelum`/`foto_before` |
| `gps_arrival: { lat, lng, validated }` | JSON | NOT flat `gps_valid` fields |
| `petugas.nama` / `petugas.kontak` | nested | NOT `petugas_nama` flat fields |
| `armada.plat_nomor` / `armada.kapasitas` | nested | NOT `armada_plat` flat fields |

## Seed Data

Convert `MockData` class to database seeders:

- 3 Mitra (PD Kebersihan UPT, CV Bersih Jaya, CV Tapis Mandiri)
- 5 Armada (BE plate numbers, 4-8 m³ capacity)
- 6 Petugas across mitra
- 2 Tarif (household: 100,000/m³, institution: 150,000/m³)
