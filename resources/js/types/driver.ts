/**
 * Driver/Petugas Types for PWA
 */

import type { Armada, Mitra, PaymentMethod } from './admin';
import type { CustomerType } from './order';

/**
 * Driver Order Status - Extended for driver workflow
 */
export const DRIVER_ORDER_STATUS = {
    ASSIGNED: 'assigned',      // Tugas baru ditugaskan
    ON_THE_WAY: 'on_the_way',  // Petugas dalam perjalanan
    ARRIVED: 'arrived',        // Sampai di lokasi
    PROCESSING: 'processing',  // Sedang mengerjakan
    DONE: 'done',              // Selesai
} as const;

export type DriverOrderStatus = (typeof DRIVER_ORDER_STATUS)[keyof typeof DRIVER_ORDER_STATUS];

export const DRIVER_ORDER_STATUS_LABELS: Record<DriverOrderStatus, string> = {
    [DRIVER_ORDER_STATUS.ASSIGNED]: 'Ditugaskan',
    [DRIVER_ORDER_STATUS.ON_THE_WAY]: 'Dalam Perjalanan',
    [DRIVER_ORDER_STATUS.ARRIVED]: 'Sampai Lokasi',
    [DRIVER_ORDER_STATUS.PROCESSING]: 'Dikerjakan',
    [DRIVER_ORDER_STATUS.DONE]: 'Selesai',
};

export const DRIVER_ORDER_STATUS_COLORS: Record<DriverOrderStatus, string> = {
    [DRIVER_ORDER_STATUS.ASSIGNED]: 'bg-blue-100 text-blue-800',
    [DRIVER_ORDER_STATUS.ON_THE_WAY]: 'bg-yellow-100 text-yellow-800',
    [DRIVER_ORDER_STATUS.ARRIVED]: 'bg-purple-100 text-purple-800',
    [DRIVER_ORDER_STATUS.PROCESSING]: 'bg-orange-100 text-orange-800',
    [DRIVER_ORDER_STATUS.DONE]: 'bg-green-100 text-green-800',
};

/**
 * Driver Task/Order Interface
 */
export interface DriverTask {
    id: number;
    order_number: string;
    customer_name: string;
    customer_type: CustomerType;
    customer_address: string;
    customer_phone: string;
    customer_npwp?: string;
    // Location
    latitude?: number;
    longitude?: number;
    // Order details
    volume_estimate: number;      // Estimasi volume dari order
    volume_actual?: number;       // Volume realisasi
    status: DriverOrderStatus;
    notes?: string;
    // Payment
    payment_method: PaymentMethod;
    total_amount: number;
    // Evidence
    foto_sebelum?: string[];
    foto_sesudah?: string[];
    // GPS validation
    gps_arrival_lat?: number;
    gps_arrival_lng?: number;
    gps_valid?: boolean;
    gps_invalid_reason?: string;
    // Timestamps
    scheduled_at?: string;
    started_at?: string;          // Mulai perjalanan
    arrived_at?: string;          // Sampai lokasi
    completed_at?: string;        // Selesai
    created_at: string;
    // Relations
    armada?: Armada;
}

/**
 * GPS Invalid Reasons
 */
export const GPS_INVALID_REASONS = {
    LOCATION_DIFFERENT: 'location_different',
    GPS_ERROR: 'gps_error',
    CUSTOMER_MOVED: 'customer_moved',
    OTHER: 'other',
} as const;

export type GpsInvalidReason = (typeof GPS_INVALID_REASONS)[keyof typeof GPS_INVALID_REASONS];

export const GPS_INVALID_REASON_LABELS: Record<GpsInvalidReason, string> = {
    [GPS_INVALID_REASONS.LOCATION_DIFFERENT]: 'Lokasi berbeda dari pinpoint',
    [GPS_INVALID_REASONS.GPS_ERROR]: 'GPS tidak akurat',
    [GPS_INVALID_REASONS.CUSTOMER_MOVED]: 'Customer pindah lokasi',
    [GPS_INVALID_REASONS.OTHER]: 'Lainnya',
};

/**
 * Driver Profile with COD balance
 */
export interface DriverProfile {
    id: number;
    nama: string;
    kontak: string;
    email: string;
    mitra?: Mitra;
    armada?: Armada;
    saldo_hutang: number;  // COD balance to be deposited
    total_tugas_selesai: number;
    total_volume: number;
}

/**
 * Riwayat Summary
 */
export interface RiwayatSummary {
    total_order: number;
    total_volume: number;
    total_cod: number;
}

/**
 * Filter for task list
 */
export type TaskFilter = 'today' | 'all';
