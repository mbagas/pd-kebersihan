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
    volume: number;
    total_amount: number;
    status: string;
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
export interface OrderTimeline {
    assigned_at?: string;
    arrived_at?: string;
    completed_at?: string;
}

export interface AuditOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_type: 'household' | 'institution';
    customer_address: string;
    customer_phone: string;
    volume: number;
    total_amount: number;
    status: string;
    payment_method: 'cash' | 'transfer';
    payment_status: string;
    latitude?: number;
    longitude?: number;
    petugas_nama?: string;
    mitra_nama?: string;
    armada_plat?: string;
    foto_before?: string;
    foto_after?: string;
    timeline: OrderTimeline;
    gps_validated: boolean;
    notes?: string;
    created_at: string;
    scheduled_at?: string;
    completed_at?: string;
}

export interface TrailFilters {
    search: string;
    status: string;
    customer_type: string;
    start_date: string;
    end_date: string;
}
