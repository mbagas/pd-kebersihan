import type { PaymentMethod } from './admin';
import type {
    ArmadaSummary,
    Evidence,
    GpsArrival,
    MitraSummary,
    OrderStatus,
    PaymentStatus,
    PetugasSummary,
} from './order';

/**
 * Audit Dashboard Types
 */

export interface AuditStats {
    total_order_bulan_ini: number;
    total_pendapatan: number;
    total_volume: number;
    rata_rata_order_per_hari: number;
}

export interface OrderDistribution {
    name: string;
    value: number;
    color: string;
}

export interface MonthlyRevenue {
    month: string;
    pendapatan: number;
}

export interface DailyTrend {
    date: string;
    orders: number;
}

export interface AuditDashboardData {
    stats: AuditStats;
    orderDistribution: OrderDistribution[];
    monthlyRevenue: MonthlyRevenue[];
    dailyTrend: DailyTrend[];
}

/**
 * Peta Sebaran Types
 */
export interface MapOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_type: 'household' | 'institution';
    customer_address: string;
    latitude: number;
    longitude: number;
    volume_estimate: number;
    volume_actual?: number;
    total_amount: number;
    status: OrderStatus;
    created_at: string;
}

export interface PetaFilters {
    start_date: string;
    end_date: string;
    status: string;
    customer_type: string;
}

/**
 * Laporan Keuangan Types
 */
export interface KeuanganSummary {
    total_pendapatan: number;
    total_orders: number;
    total_volume: number;
}

export interface MitraBreakdown {
    mitra_id: number;
    mitra_nama: string;
    total_orders: number;
    total_pendapatan: number;
    total_volume: number;
}

export interface CustomerTypeBreakdown {
    customer_type: string;
    label: string;
    total_orders: number;
    total_pendapatan: number;
}

export interface PaymentMethodBreakdown {
    payment_method: string;
    label: string;
    total_orders: number;
    total_pendapatan: number;
}

export interface KeuanganData {
    summary: KeuanganSummary;
    mitraBreakdown: MitraBreakdown[];
    customerTypeBreakdown: CustomerTypeBreakdown[];
    paymentMethodBreakdown: PaymentMethodBreakdown[];
}

/**
 * Audit Trail Types
 */
export interface AuditOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_type: 'household' | 'institution';
    customer_address: string;
    customer_phone: string;
    customer_npwp?: string;
    volume_estimate: number;
    volume_actual?: number;
    total_amount: number;
    status: OrderStatus;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    latitude?: number;
    longitude?: number;
    petugas?: PetugasSummary & { mitra?: MitraSummary };
    armada?: ArmadaSummary;
    evidence?: Evidence;
    gps_arrival?: GpsArrival;
    notes?: string;
    created_at: string;
    scheduled_at?: string;
    assigned_at?: string;
    started_at?: string;
    arrived_at?: string;
    completed_at?: string;
}

export interface TrailFilters {
    search: string;
    status: string;
    customer_type: string;
    start_date: string;
    end_date: string;
}
