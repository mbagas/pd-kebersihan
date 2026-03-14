<?php

namespace App\Support;

class MockData
{
    /**
     * Canonical tariff values (per m3).
     * Single source of truth for all controllers.
     */
    public static function tarif(): array
    {
        return [
            ['id' => 1, 'tipe_customer' => 'household', 'harga_per_m3' => 100000, 'keterangan' => 'Tarif rumah tangga standar', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'tipe_customer' => 'institution', 'harga_per_m3' => 150000, 'keterangan' => 'Tarif instansi/perusahaan', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
        ];
    }

    /**
     * Tariff as a simple map: customer_type => price_per_m3.
     */
    public static function tarifMap(): array
    {
        return [
            'household' => 100000,
            'institution' => 150000,
        ];
    }

    /**
     * All valid order statuses in lifecycle order.
     */
    public static function orderStatuses(): array
    {
        return ['pending', 'assigned', 'on_the_way', 'arrived', 'processing', 'done', 'cancelled'];
    }

    /**
     * Statuses considered "active" (order is in progress).
     */
    public static function activeStatuses(): array
    {
        return ['pending', 'assigned', 'on_the_way', 'arrived', 'processing'];
    }

    /**
     * Canonical mitra data.
     */
    public static function mitra(): array
    {
        return [
            ['id' => 1, 'nama' => 'UPT Kebersihan Pusat', 'tipe' => 'internal', 'kontak' => '021-5551234', 'alamat' => 'Jl. Kebersihan No. 1', 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'nama' => 'CV. Bersih Jaya', 'tipe' => 'external', 'kontak' => '081234567890', 'alamat' => 'Jl. Industri No. 45', 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-01-05 09:00:00'],
            ['id' => 3, 'nama' => 'CV. Maju Bersama', 'tipe' => 'external', 'kontak' => '082345678901', 'alamat' => 'Jl. Raya Timur No. 12', 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-01-10 10:00:00'],
        ];
    }

    /**
     * Canonical armada data.
     */
    public static function armada(): array
    {
        $mitra = self::mitra();

        return [
            ['id' => 1, 'plat_nomor' => 'BE 1234 AB', 'kapasitas' => 6, 'status' => 'available', 'mitra_id' => 1, 'mitra' => $mitra[0], 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'plat_nomor' => 'BE 5678 CD', 'kapasitas' => 8, 'status' => 'in_use', 'mitra_id' => 1, 'mitra' => $mitra[0], 'created_at' => '2026-01-02 08:00:00', 'updated_at' => '2026-02-16 09:00:00'],
            ['id' => 3, 'plat_nomor' => 'BE 9012 EF', 'kapasitas' => 6, 'status' => 'available', 'mitra_id' => 2, 'mitra' => $mitra[1], 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-01-05 09:00:00'],
            ['id' => 4, 'plat_nomor' => 'BE 3456 GH', 'kapasitas' => 10, 'status' => 'maintenance', 'mitra_id' => 2, 'mitra' => $mitra[1], 'created_at' => '2026-01-06 09:00:00', 'updated_at' => '2026-02-10 14:00:00'],
            ['id' => 5, 'plat_nomor' => 'BE 7890 IJ', 'kapasitas' => 8, 'status' => 'available', 'mitra_id' => 3, 'mitra' => $mitra[2], 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-01-10 10:00:00'],
        ];
    }

    /**
     * Canonical petugas data.
     */
    public static function petugas(): array
    {
        $mitra = self::mitra();
        $armada = self::armada();

        return [
            ['id' => 1, 'nama' => 'Budi Santoso', 'kontak' => '081111111111', 'mitra_id' => 1, 'mitra' => $mitra[0], 'armada_id' => 1, 'armada' => $armada[0], 'status_aktif' => true, 'saldo_hutang' => 0, 'created_at' => '2026-01-01 08:00:00', 'updated_at' => '2026-01-01 08:00:00'],
            ['id' => 2, 'nama' => 'Agus Wijaya', 'kontak' => '081222222222', 'mitra_id' => 1, 'mitra' => $mitra[0], 'armada_id' => 2, 'armada' => $armada[1], 'status_aktif' => true, 'saldo_hutang' => 150000, 'created_at' => '2026-01-02 08:00:00', 'updated_at' => '2026-02-15 16:00:00'],
            ['id' => 3, 'nama' => 'Dedi Kurniawan', 'kontak' => '081333333333', 'mitra_id' => 2, 'mitra' => $mitra[1], 'armada_id' => 3, 'armada' => $armada[2], 'status_aktif' => true, 'saldo_hutang' => 75000, 'created_at' => '2026-01-05 09:00:00', 'updated_at' => '2026-02-14 11:00:00'],
            ['id' => 4, 'nama' => 'Eko Prasetyo', 'kontak' => '081444444444', 'mitra_id' => 2, 'mitra' => $mitra[1], 'armada_id' => 4, 'armada' => $armada[3], 'status_aktif' => true, 'saldo_hutang' => 0, 'created_at' => '2026-01-06 09:00:00', 'updated_at' => '2026-01-06 09:00:00'],
            ['id' => 5, 'nama' => 'Fajar Hidayat', 'kontak' => '081555555555', 'mitra_id' => 3, 'mitra' => $mitra[2], 'armada_id' => 5, 'armada' => $armada[4], 'status_aktif' => true, 'saldo_hutang' => 200000, 'created_at' => '2026-01-10 10:00:00', 'updated_at' => '2026-02-16 08:00:00'],
            ['id' => 6, 'nama' => 'Gunawan', 'kontak' => '081666666666', 'mitra_id' => 3, 'mitra' => $mitra[2], 'armada_id' => null, 'armada' => null, 'status_aktif' => false, 'saldo_hutang' => 0, 'created_at' => '2026-01-11 10:00:00', 'updated_at' => '2026-02-01 09:00:00'],
        ];
    }

    /**
     * Shared customer names pool.
     */
    public static function customerNames(): array
    {
        return [
            'household' => ['Pak Ahmad', 'Bu Siti', 'Pak Joko', 'Bu Dewi', 'Pak Hendra', 'Bu Rina', 'Pak Bambang', 'Bu Yuni', 'Pak Darmawan', 'Bu Lestari'],
            'institution' => ['PT. Maju Jaya', 'CV. Berkah Abadi', 'RS. Sehat Sentosa', 'Hotel Grand Palace', 'Mall Central', 'Universitas Nusantara', 'Bank Mandiri Cabang Utama', 'Kantor Kecamatan', 'Pabrik Tekstil Indah', 'Restoran Padang Sederhana'],
        ];
    }

    /**
     * Shared address pool.
     */
    public static function addresses(): array
    {
        return [
            'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
            'Jl. Kartini No. 88, Teluk Betung, Bandar Lampung',
            'Jl. Diponegoro No. 12, Kedaton, Bandar Lampung',
            'Jl. Teuku Umar No. 77, Sukarame, Bandar Lampung',
            'Jl. Ahmad Yani No. 55, Tanjung Karang, Bandar Lampung',
            'Jl. Gatot Subroto No. 100, Teluk Betung, Bandar Lampung',
            'Jl. Imam Bonjol No. 33, Kemiling, Bandar Lampung',
            'Jl. Pangeran Antasari No. 23, Kedaton, Bandar Lampung',
            'Jl. Sultan Agung No. 15, Way Halim, Bandar Lampung',
            'Jl. Pemuda No. 67, Rajabasa, Bandar Lampung',
        ];
    }

    /**
     * Generate canonical order number format: ORD-YYYY-XXXX.
     */
    public static function orderNumber(int $id): string
    {
        return 'ORD-2026-'.str_pad($id, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Generate a canonical order record with all fields.
     * This is the single source of truth for the order data structure.
     *
     * Canonical fields:
     * - id, order_number
     * - customer_name, customer_type, customer_address, customer_phone, customer_npwp
     * - volume_estimate, volume_actual
     * - status (pending|assigned|on_the_way|arrived|processing|done|cancelled)
     * - payment_method (cash|transfer)
     * - payment_status (unpaid|pending_verification|paid)
     * - cash_collection_status (not_applicable|pending|collected|deposited)
     * - total_amount
     * - bukti_transfer, setoran_id
     * - latitude, longitude
     * - notes
     * - petugas: {id, nama, kontak, mitra_id, mitra: {id, nama, tipe}}
     * - armada: {id, plat_nomor, kapasitas}
     * - evidence: {before: [], after: []}
     * - gps_arrival: {lat, lng, validated}
     * - scheduled_at, assigned_at, started_at, arrived_at, completed_at
     * - created_at, updated_at
     */
    public static function generateOrders(int $count = 25, ?int $daysBack = 14): array
    {
        $petugas = self::petugas();
        $customerTypes = ['household', 'institution'];
        $paymentMethods = ['cash', 'transfer'];
        $customerNames = self::customerNames();
        $addresses = self::addresses();
        $tarifMap = self::tarifMap();

        $orders = [];
        $baseDate = now()->subDays($daysBack);

        for ($i = 1; $i <= $count; $i++) {
            $customerType = $customerTypes[array_rand($customerTypes)];
            $status = self::weightedRandom([
                'pending' => 10,
                'assigned' => 10,
                'on_the_way' => 8,
                'arrived' => 7,
                'processing' => 10,
                'done' => 50,
                'cancelled' => 5,
            ]);

            $paymentMethod = $paymentMethods[array_rand($paymentMethods)];

            // Determine payment & cash collection status
            $paymentStatus = 'unpaid';
            $cashCollectionStatus = $paymentMethod === 'cash' ? 'pending' : 'not_applicable';
            $buktiTransfer = null;
            $setoranId = null;

            if ($status === 'cancelled') {
                $paymentStatus = 'unpaid';
                $cashCollectionStatus = $paymentMethod === 'cash' ? 'pending' : 'not_applicable';
            } elseif ($paymentMethod === 'transfer') {
                if ($status === 'done') {
                    $paymentStatus = 'paid';
                    $buktiTransfer = '/storage/bukti/transfer-'.$i.'.jpg';
                } elseif (in_array($status, ['assigned', 'on_the_way', 'arrived', 'processing'])) {
                    if (rand(0, 1)) {
                        $paymentStatus = 'pending_verification';
                        $buktiTransfer = '/storage/bukti/transfer-'.$i.'.jpg';
                    }
                }
            } else {
                if ($status === 'done') {
                    $cashFlow = self::weightedRandom([
                        'collected' => 40,
                        'deposited' => 60,
                    ]);
                    $cashCollectionStatus = $cashFlow;
                    $paymentStatus = $cashFlow === 'deposited' ? 'paid' : 'unpaid';
                    if ($cashFlow === 'deposited') {
                        $setoranId = rand(1, 5);
                    }
                } elseif (in_array($status, ['processing', 'arrived'])) {
                    $cashCollectionStatus = rand(0, 1) ? 'collected' : 'pending';
                }
            }

            $volumeEstimate = $customerType === 'household' ? rand(2, 6) : rand(5, 15);
            $volumeActual = in_array($status, ['done']) ? round($volumeEstimate + (rand(-10, 5) / 10), 1) : null;
            if ($volumeActual !== null && $volumeActual < 1) {
                $volumeActual = round($volumeEstimate * 0.9, 1);
            }
            $pricePerM3 = $tarifMap[$customerType];
            $billedVolume = $volumeActual ?? $volumeEstimate;
            $totalAmount = (int) ($billedVolume * $pricePerM3);

            $createdAt = $baseDate->copy()->addDays(rand(0, $daysBack))->addHours(rand(6, 18));
            $scheduledAt = $createdAt->copy()->addDays(rand(0, 3));

            // Assign petugas for non-pending/cancelled orders
            $assignedPetugas = null;
            $assignedArmada = null;
            $hasPetugas = in_array($status, ['assigned', 'on_the_way', 'arrived', 'processing', 'done']);

            if ($hasPetugas) {
                $activePetugas = array_filter($petugas, fn ($p) => $p['status_aktif'] && $p['armada']);
                $activePetugas = array_values($activePetugas);
                $petugasIndex = array_rand($activePetugas);
                $assignedPetugas = $activePetugas[$petugasIndex];
                $assignedArmada = $assignedPetugas['armada'];
            }

            // Timeline
            $assignedAt = $hasPetugas ? $createdAt->copy()->addMinutes(rand(5, 60))->format('Y-m-d H:i:s') : null;
            $startedAt = in_array($status, ['on_the_way', 'arrived', 'processing', 'done']) ? $scheduledAt->copy()->addMinutes(rand(0, 30))->format('Y-m-d H:i:s') : null;
            $arrivedAt = in_array($status, ['arrived', 'processing', 'done']) ? $scheduledAt->copy()->addMinutes(rand(30, 90))->format('Y-m-d H:i:s') : null;
            $completedAt = $status === 'done' ? $scheduledAt->copy()->addHours(rand(1, 4))->format('Y-m-d H:i:s') : null;

            // GPS
            $latitude = -5.35 + (rand(-100, 100) / 1000);
            $longitude = 105.25 + (rand(-100, 100) / 1000);
            $gpsArrival = in_array($status, ['arrived', 'processing', 'done']) ? [
                'lat' => $latitude + (rand(-5, 5) / 10000),
                'lng' => $longitude + (rand(-5, 5) / 10000),
                'validated' => rand(0, 10) > 2,
            ] : null;

            // Evidence
            $evidence = ['before' => [], 'after' => []];
            if (in_array($status, ['processing', 'done'])) {
                $evidence['before'] = ['/storage/evidence/before-'.$i.'-1.jpg'];
            }
            if ($status === 'done') {
                $evidence['after'] = ['/storage/evidence/after-'.$i.'-1.jpg'];
            }

            $orders[] = [
                'id' => $i,
                'order_number' => self::orderNumber($i),
                'customer_name' => $customerNames[$customerType][array_rand($customerNames[$customerType])],
                'customer_type' => $customerType,
                'customer_address' => $addresses[array_rand($addresses)],
                'customer_phone' => '08'.rand(1000000000, 9999999999),
                'customer_npwp' => $customerType === 'institution' ? rand(10, 99).'.'.rand(100, 999).'.'.rand(100, 999).'.'.rand(1, 9).'-'.rand(100, 999).'.'.rand(100, 999) : null,
                'volume_estimate' => $volumeEstimate,
                'volume_actual' => $volumeActual,
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_status' => $paymentStatus,
                'cash_collection_status' => $cashCollectionStatus,
                'total_amount' => $totalAmount,
                'bukti_transfer' => $buktiTransfer,
                'setoran_id' => $setoranId,
                'notes' => rand(0, 1) ? 'Catatan untuk order #'.$i : null,
                'latitude' => $latitude,
                'longitude' => $longitude,
                'gps_arrival' => $gpsArrival,
                'evidence' => $evidence,
                'petugas_id' => $assignedPetugas ? $assignedPetugas['id'] : null,
                'petugas' => $assignedPetugas ? [
                    'id' => $assignedPetugas['id'],
                    'nama' => $assignedPetugas['nama'],
                    'kontak' => $assignedPetugas['kontak'],
                    'mitra_id' => $assignedPetugas['mitra_id'],
                    'mitra' => [
                        'id' => $assignedPetugas['mitra']['id'],
                        'nama' => $assignedPetugas['mitra']['nama'],
                        'tipe' => $assignedPetugas['mitra']['tipe'],
                    ],
                ] : null,
                'armada_id' => $assignedArmada ? $assignedArmada['id'] : null,
                'armada' => $assignedArmada ? [
                    'id' => $assignedArmada['id'],
                    'plat_nomor' => $assignedArmada['plat_nomor'],
                    'kapasitas' => $assignedArmada['kapasitas'],
                ] : null,
                'scheduled_at' => $scheduledAt->format('Y-m-d H:i:s'),
                'assigned_at' => $assignedAt,
                'started_at' => $startedAt,
                'arrived_at' => $arrivedAt,
                'completed_at' => $completedAt,
                'created_at' => $createdAt->format('Y-m-d H:i:s'),
                'updated_at' => $createdAt->format('Y-m-d H:i:s'),
            ];
        }

        usort($orders, fn ($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));

        return $orders;
    }

    /**
     * Generate fixed customer-specific orders (for customer view).
     * Uses the same canonical structure as generateOrders().
     */
    public static function customerOrders(string $customerName = 'Budi Santoso', string $customerPhone = '081234567890'): array
    {
        $tarifMap = self::tarifMap();
        $petugas = self::petugas();

        return [
            [
                'id' => 1,
                'order_number' => self::orderNumber(1),
                'customer_name' => $customerName,
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => $customerPhone,
                'customer_npwp' => null,
                'volume_estimate' => 4,
                'volume_actual' => 3.5,
                'status' => 'done',
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'cash_collection_status' => 'deposited',
                'total_amount' => (int) (3.5 * $tarifMap['household']),
                'bukti_transfer' => null,
                'setoran_id' => 1,
                'notes' => 'Rumah warna biru, pagar hitam',
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'gps_arrival' => ['lat' => -5.4296, 'lng' => 105.2620, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-1-1.jpg'],
                    'after' => ['/storage/evidence/after-1-1.jpg'],
                ],
                'petugas_id' => $petugas[0]['id'],
                'petugas' => [
                    'id' => $petugas[0]['id'],
                    'nama' => $petugas[0]['nama'],
                    'kontak' => $petugas[0]['kontak'],
                    'mitra_id' => $petugas[0]['mitra_id'],
                    'mitra' => ['id' => $petugas[0]['mitra']['id'], 'nama' => $petugas[0]['mitra']['nama'], 'tipe' => $petugas[0]['mitra']['tipe']],
                ],
                'armada_id' => $petugas[0]['armada']['id'],
                'armada' => ['id' => $petugas[0]['armada']['id'], 'plat_nomor' => $petugas[0]['armada']['plat_nomor'], 'kapasitas' => $petugas[0]['armada']['kapasitas']],
                'scheduled_at' => '2026-02-17 09:00:00',
                'assigned_at' => '2026-02-17 09:30:00',
                'started_at' => '2026-02-17 10:00:00',
                'arrived_at' => '2026-02-17 10:25:00',
                'completed_at' => '2026-02-17 12:00:00',
                'created_at' => '2026-02-16 14:00:00',
                'updated_at' => '2026-02-17 12:00:00',
            ],
            [
                'id' => 2,
                'order_number' => self::orderNumber(2),
                'customer_name' => $customerName,
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => $customerPhone,
                'customer_npwp' => null,
                'volume_estimate' => 5,
                'volume_actual' => null,
                'status' => 'processing',
                'payment_method' => 'transfer',
                'payment_status' => 'paid',
                'cash_collection_status' => 'not_applicable',
                'total_amount' => 5 * $tarifMap['household'],
                'bukti_transfer' => '/storage/bukti/transfer-2.jpg',
                'setoran_id' => null,
                'notes' => null,
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'gps_arrival' => ['lat' => -5.4296, 'lng' => 105.2620, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-2-1.jpg'],
                    'after' => [],
                ],
                'petugas_id' => $petugas[2]['id'],
                'petugas' => [
                    'id' => $petugas[2]['id'],
                    'nama' => $petugas[2]['nama'],
                    'kontak' => $petugas[2]['kontak'],
                    'mitra_id' => $petugas[2]['mitra_id'],
                    'mitra' => ['id' => $petugas[2]['mitra']['id'], 'nama' => $petugas[2]['mitra']['nama'], 'tipe' => $petugas[2]['mitra']['tipe']],
                ],
                'armada_id' => $petugas[2]['armada']['id'],
                'armada' => ['id' => $petugas[2]['armada']['id'], 'plat_nomor' => $petugas[2]['armada']['plat_nomor'], 'kapasitas' => $petugas[2]['armada']['kapasitas']],
                'scheduled_at' => '2026-03-05 10:00:00',
                'assigned_at' => '2026-03-05 10:15:00',
                'started_at' => '2026-03-05 11:00:00',
                'arrived_at' => '2026-03-05 11:25:00',
                'completed_at' => null,
                'created_at' => '2026-03-04 16:00:00',
                'updated_at' => '2026-03-05 11:25:00',
            ],
            [
                'id' => 3,
                'order_number' => self::orderNumber(3),
                'customer_name' => $customerName,
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => $customerPhone,
                'customer_npwp' => null,
                'volume_estimate' => 3,
                'volume_actual' => null,
                'status' => 'assigned',
                'payment_method' => 'cash',
                'payment_status' => 'unpaid',
                'cash_collection_status' => 'pending',
                'total_amount' => 3 * $tarifMap['household'],
                'bukti_transfer' => null,
                'setoran_id' => null,
                'notes' => 'Hubungi dulu sebelum datang',
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'gps_arrival' => null,
                'evidence' => ['before' => [], 'after' => []],
                'petugas_id' => $petugas[0]['id'],
                'petugas' => [
                    'id' => $petugas[0]['id'],
                    'nama' => $petugas[0]['nama'],
                    'kontak' => $petugas[0]['kontak'],
                    'mitra_id' => $petugas[0]['mitra_id'],
                    'mitra' => ['id' => $petugas[0]['mitra']['id'], 'nama' => $petugas[0]['mitra']['nama'], 'tipe' => $petugas[0]['mitra']['tipe']],
                ],
                'armada_id' => $petugas[0]['armada']['id'],
                'armada' => ['id' => $petugas[0]['armada']['id'], 'plat_nomor' => $petugas[0]['armada']['plat_nomor'], 'kapasitas' => $petugas[0]['armada']['kapasitas']],
                'scheduled_at' => '2026-03-08 09:00:00',
                'assigned_at' => '2026-03-07 14:00:00',
                'started_at' => null,
                'arrived_at' => null,
                'completed_at' => null,
                'created_at' => '2026-03-06 10:00:00',
                'updated_at' => '2026-03-07 14:00:00',
            ],
            [
                'id' => 4,
                'order_number' => self::orderNumber(4),
                'customer_name' => $customerName,
                'customer_type' => 'household',
                'customer_address' => 'Jl. Diponegoro No. 12, Kedaton, Bandar Lampung',
                'customer_phone' => $customerPhone,
                'customer_npwp' => null,
                'volume_estimate' => 4,
                'volume_actual' => null,
                'status' => 'pending',
                'payment_method' => 'transfer',
                'payment_status' => 'unpaid',
                'cash_collection_status' => 'not_applicable',
                'total_amount' => 4 * $tarifMap['household'],
                'bukti_transfer' => null,
                'setoran_id' => null,
                'notes' => null,
                'latitude' => -5.3891,
                'longitude' => 105.2456,
                'gps_arrival' => null,
                'evidence' => ['before' => [], 'after' => []],
                'petugas_id' => null,
                'petugas' => null,
                'armada_id' => null,
                'armada' => null,
                'scheduled_at' => null,
                'assigned_at' => null,
                'started_at' => null,
                'arrived_at' => null,
                'completed_at' => null,
                'created_at' => '2026-03-07 08:00:00',
                'updated_at' => '2026-03-07 08:00:00',
            ],
            [
                'id' => 5,
                'order_number' => self::orderNumber(5),
                'customer_name' => $customerName,
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => $customerPhone,
                'customer_npwp' => null,
                'volume_estimate' => 6,
                'volume_actual' => 5.5,
                'status' => 'done',
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'cash_collection_status' => 'deposited',
                'total_amount' => (int) (5.5 * $tarifMap['household']),
                'bukti_transfer' => null,
                'setoran_id' => 2,
                'notes' => null,
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'gps_arrival' => ['lat' => -5.4296, 'lng' => 105.2620, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-5-1.jpg'],
                    'after' => ['/storage/evidence/after-5-1.jpg'],
                ],
                'petugas_id' => $petugas[2]['id'],
                'petugas' => [
                    'id' => $petugas[2]['id'],
                    'nama' => $petugas[2]['nama'],
                    'kontak' => $petugas[2]['kontak'],
                    'mitra_id' => $petugas[2]['mitra_id'],
                    'mitra' => ['id' => $petugas[2]['mitra']['id'], 'nama' => $petugas[2]['mitra']['nama'], 'tipe' => $petugas[2]['mitra']['tipe']],
                ],
                'armada_id' => $petugas[2]['armada']['id'],
                'armada' => ['id' => $petugas[2]['armada']['id'], 'plat_nomor' => $petugas[2]['armada']['plat_nomor'], 'kapasitas' => $petugas[2]['armada']['kapasitas']],
                'scheduled_at' => '2026-01-20 09:00:00',
                'assigned_at' => '2026-01-19 14:00:00',
                'started_at' => '2026-01-20 09:15:00',
                'arrived_at' => '2026-01-20 09:40:00',
                'completed_at' => '2026-01-20 12:00:00',
                'created_at' => '2026-01-19 11:00:00',
                'updated_at' => '2026-01-20 12:00:00',
            ],
        ];
    }

    /**
     * Generate fixed driver task orders (for driver view).
     * Uses the same canonical structure as generateOrders().
     */
    public static function driverTasks(): array
    {
        $tarifMap = self::tarifMap();
        $armada = self::armada();
        $driverArmada = ['id' => $armada[0]['id'], 'plat_nomor' => $armada[0]['plat_nomor'], 'kapasitas' => $armada[0]['kapasitas']];
        $petugas = self::petugas();
        $driverPetugas = [
            'id' => $petugas[0]['id'],
            'nama' => $petugas[0]['nama'],
            'kontak' => $petugas[0]['kontak'],
            'mitra_id' => $petugas[0]['mitra_id'],
            'mitra' => ['id' => $petugas[0]['mitra']['id'], 'nama' => $petugas[0]['mitra']['nama'], 'tipe' => $petugas[0]['mitra']['tipe']],
        ];

        return [
            [
                'id' => 1,
                'order_number' => self::orderNumber(1),
                'customer_name' => 'Budi Santoso',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Raden Intan No. 45, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '081234567890',
                'customer_npwp' => null,
                'volume_estimate' => 4,
                'volume_actual' => null,
                'status' => 'assigned',
                'payment_method' => 'cash',
                'payment_status' => 'unpaid',
                'cash_collection_status' => 'pending',
                'total_amount' => 4 * $tarifMap['household'],
                'bukti_transfer' => null,
                'setoran_id' => null,
                'notes' => 'Rumah warna biru, pagar hitam',
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'gps_arrival' => null,
                'evidence' => ['before' => [], 'after' => []],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-17 09:00:00',
                'assigned_at' => '2026-02-17 08:30:00',
                'started_at' => null,
                'arrived_at' => null,
                'completed_at' => null,
                'created_at' => '2026-02-16 14:00:00',
                'updated_at' => '2026-02-17 08:30:00',
            ],
            [
                'id' => 2,
                'order_number' => self::orderNumber(2),
                'customer_name' => 'PT. Maju Jaya',
                'customer_type' => 'institution',
                'customer_address' => 'Jl. Kartini No. 88, Teluk Betung, Bandar Lampung',
                'customer_phone' => '082345678901',
                'customer_npwp' => '12.345.678.9-012.345',
                'volume_estimate' => 8,
                'volume_actual' => null,
                'status' => 'on_the_way',
                'payment_method' => 'transfer',
                'payment_status' => 'pending_verification',
                'cash_collection_status' => 'not_applicable',
                'total_amount' => 8 * $tarifMap['institution'],
                'bukti_transfer' => '/storage/bukti/transfer-2.jpg',
                'setoran_id' => null,
                'notes' => 'Gedung 3 lantai, masuk dari pintu belakang',
                'latitude' => -5.4512,
                'longitude' => 105.2701,
                'gps_arrival' => null,
                'evidence' => ['before' => [], 'after' => []],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-17 11:00:00',
                'assigned_at' => '2026-02-17 10:00:00',
                'started_at' => '2026-02-17 10:30:00',
                'arrived_at' => null,
                'completed_at' => null,
                'created_at' => '2026-02-16 15:00:00',
                'updated_at' => '2026-02-17 10:30:00',
            ],
            [
                'id' => 3,
                'order_number' => self::orderNumber(3),
                'customer_name' => 'Siti Aminah',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Diponegoro No. 12, Kedaton, Bandar Lampung',
                'customer_phone' => '083456789012',
                'customer_npwp' => null,
                'volume_estimate' => 3,
                'volume_actual' => null,
                'status' => 'arrived',
                'payment_method' => 'cash',
                'payment_status' => 'unpaid',
                'cash_collection_status' => 'pending',
                'total_amount' => 3 * $tarifMap['household'],
                'bukti_transfer' => null,
                'setoran_id' => null,
                'notes' => null,
                'latitude' => -5.3891,
                'longitude' => 105.2456,
                'gps_arrival' => ['lat' => -5.3892, 'lng' => 105.2457, 'validated' => true],
                'evidence' => ['before' => [], 'after' => []],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-17 14:00:00',
                'assigned_at' => '2026-02-17 13:00:00',
                'started_at' => '2026-02-17 13:30:00',
                'arrived_at' => '2026-02-17 13:55:00',
                'completed_at' => null,
                'created_at' => '2026-02-16 16:00:00',
                'updated_at' => '2026-02-17 13:55:00',
            ],
            [
                'id' => 4,
                'order_number' => self::orderNumber(4),
                'customer_name' => 'Ahmad Hidayat',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Teuku Umar No. 77, Sukarame, Bandar Lampung',
                'customer_phone' => '084567890123',
                'customer_npwp' => null,
                'volume_estimate' => 5,
                'volume_actual' => null,
                'status' => 'processing',
                'payment_method' => 'cash',
                'payment_status' => 'unpaid',
                'cash_collection_status' => 'pending',
                'total_amount' => 5 * $tarifMap['household'],
                'bukti_transfer' => null,
                'setoran_id' => null,
                'notes' => null,
                'latitude' => -5.3756,
                'longitude' => 105.3012,
                'gps_arrival' => ['lat' => -5.3757, 'lng' => 105.3013, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-4-1.jpg'],
                    'after' => [],
                ],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-17 16:00:00',
                'assigned_at' => '2026-02-17 15:00:00',
                'started_at' => '2026-02-17 15:30:00',
                'arrived_at' => '2026-02-17 15:50:00',
                'completed_at' => null,
                'created_at' => '2026-02-16 17:00:00',
                'updated_at' => '2026-02-17 15:50:00',
            ],
        ];
    }

    /**
     * Generate fixed driver riwayat (completed tasks).
     * Uses the same canonical structure as generateOrders().
     */
    public static function driverRiwayat(): array
    {
        $tarifMap = self::tarifMap();
        $petugas = self::petugas();
        $armada = self::armada();
        $driverArmada = ['id' => $armada[0]['id'], 'plat_nomor' => $armada[0]['plat_nomor'], 'kapasitas' => $armada[0]['kapasitas']];
        $driverPetugas = [
            'id' => $petugas[0]['id'],
            'nama' => $petugas[0]['nama'],
            'kontak' => $petugas[0]['kontak'],
            'mitra_id' => $petugas[0]['mitra_id'],
            'mitra' => ['id' => $petugas[0]['mitra']['id'], 'nama' => $petugas[0]['mitra']['nama'], 'tipe' => $petugas[0]['mitra']['tipe']],
        ];

        return [
            [
                'id' => 10,
                'order_number' => self::orderNumber(10),
                'customer_name' => 'Dewi Lestari',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Ahmad Yani No. 55, Tanjung Karang, Bandar Lampung',
                'customer_phone' => '085678901234',
                'customer_npwp' => null,
                'volume_estimate' => 4,
                'volume_actual' => 3.5,
                'status' => 'done',
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'cash_collection_status' => 'deposited',
                'total_amount' => (int) (3.5 * $tarifMap['household']),
                'bukti_transfer' => null,
                'setoran_id' => 1,
                'notes' => null,
                'latitude' => -5.4295,
                'longitude' => 105.2619,
                'gps_arrival' => ['lat' => -5.4296, 'lng' => 105.2620, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-10-1.jpg'],
                    'after' => ['/storage/evidence/after-10-1.jpg'],
                ],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-16 09:00:00',
                'assigned_at' => '2026-02-15 16:00:00',
                'started_at' => '2026-02-16 09:15:00',
                'arrived_at' => '2026-02-16 09:45:00',
                'completed_at' => '2026-02-16 11:30:00',
                'created_at' => '2026-02-15 14:00:00',
                'updated_at' => '2026-02-16 11:30:00',
            ],
            [
                'id' => 11,
                'order_number' => self::orderNumber(11),
                'customer_name' => 'CV. Berkah Abadi',
                'customer_type' => 'institution',
                'customer_address' => 'Jl. Gatot Subroto No. 100, Teluk Betung, Bandar Lampung',
                'customer_phone' => '086789012345',
                'customer_npwp' => '21.456.789.0-123.456',
                'volume_estimate' => 10,
                'volume_actual' => 9,
                'status' => 'done',
                'payment_method' => 'transfer',
                'payment_status' => 'paid',
                'cash_collection_status' => 'not_applicable',
                'total_amount' => 9 * $tarifMap['institution'],
                'bukti_transfer' => '/storage/bukti/transfer-11.jpg',
                'setoran_id' => null,
                'notes' => null,
                'latitude' => -5.4512,
                'longitude' => 105.2701,
                'gps_arrival' => ['lat' => -5.4513, 'lng' => 105.2702, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-11-1.jpg'],
                    'after' => ['/storage/evidence/after-11-1.jpg'],
                ],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-16 13:00:00',
                'assigned_at' => '2026-02-15 17:00:00',
                'started_at' => '2026-02-16 13:15:00',
                'arrived_at' => '2026-02-16 13:45:00',
                'completed_at' => '2026-02-16 15:00:00',
                'created_at' => '2026-02-15 16:00:00',
                'updated_at' => '2026-02-16 15:00:00',
            ],
            [
                'id' => 12,
                'order_number' => self::orderNumber(12),
                'customer_name' => 'Hendra Wijaya',
                'customer_type' => 'household',
                'customer_address' => 'Jl. Pangeran Antasari No. 23, Kedaton, Bandar Lampung',
                'customer_phone' => '087890123456',
                'customer_npwp' => null,
                'volume_estimate' => 5,
                'volume_actual' => 5,
                'status' => 'done',
                'payment_method' => 'cash',
                'payment_status' => 'paid',
                'cash_collection_status' => 'deposited',
                'total_amount' => 5 * $tarifMap['household'],
                'bukti_transfer' => null,
                'setoran_id' => 3,
                'notes' => null,
                'latitude' => -5.3891,
                'longitude' => 105.2456,
                'gps_arrival' => ['lat' => -5.3892, 'lng' => 105.2457, 'validated' => true],
                'evidence' => [
                    'before' => ['/storage/evidence/before-12-1.jpg'],
                    'after' => ['/storage/evidence/after-12-1.jpg'],
                ],
                'petugas_id' => $driverPetugas['id'],
                'petugas' => $driverPetugas,
                'armada_id' => $driverArmada['id'],
                'armada' => $driverArmada,
                'scheduled_at' => '2026-02-15 08:00:00',
                'assigned_at' => '2026-02-14 10:00:00',
                'started_at' => '2026-02-15 08:15:00',
                'arrived_at' => '2026-02-15 08:45:00',
                'completed_at' => '2026-02-15 10:00:00',
                'created_at' => '2026-02-14 09:00:00',
                'updated_at' => '2026-02-15 10:00:00',
            ],
        ];
    }

    /**
     * Weighted random helper.
     */
    public static function weightedRandom(array $weights): string
    {
        $total = array_sum($weights);
        $rand = rand(1, $total);
        $current = 0;

        foreach ($weights as $key => $weight) {
            $current += $weight;
            if ($rand <= $current) {
                return $key;
            }
        }

        return array_key_first($weights);
    }
}
