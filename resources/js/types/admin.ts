/**
 * Mitra (Partner) Types
 */
export const MITRA_TYPE = {
    INTERNAL: 'internal',
    EXTERNAL: 'external',
} as const;

export type MitraType = (typeof MITRA_TYPE)[keyof typeof MITRA_TYPE];

export const MITRA_TYPE_LABELS: Record<MitraType, string> = {
    [MITRA_TYPE.INTERNAL]: 'Internal',
    [MITRA_TYPE.EXTERNAL]: 'External',
};

export interface Mitra {
    id: number;
    nama: string;
    tipe: MitraType;
    kontak: string;
    alamat?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Armada (Fleet) Types
 */
export const ARMADA_STATUS = {
    AVAILABLE: 'available',
    IN_USE: 'in_use',
    MAINTENANCE: 'maintenance',
} as const;

export type ArmadaStatus = (typeof ARMADA_STATUS)[keyof typeof ARMADA_STATUS];

export const ARMADA_STATUS_LABELS: Record<ArmadaStatus, string> = {
    [ARMADA_STATUS.AVAILABLE]: 'Tersedia',
    [ARMADA_STATUS.IN_USE]: 'Digunakan',
    [ARMADA_STATUS.MAINTENANCE]: 'Maintenance',
};

export interface Armada {
    id: number;
    plat_nomor: string;
    kapasitas: number; // dalam m³
    status: ArmadaStatus;
    mitra_id?: number;
    mitra?: Mitra;
    created_at: string;
    updated_at: string;
}

/**
 * Petugas (Officer/Driver) Types
 */
export interface Petugas {
    id: number;
    nama: string;
    kontak: string;
    mitra_id: number;
    mitra?: Mitra;
    armada_id?: number;
    armada?: Armada;
    status_aktif: boolean;
    saldo_hutang: number;
    created_at: string;
    updated_at: string;
}

/**
 * Tarif Types
 */
export interface Tarif {
    id: number;
    tipe_customer: 'household' | 'institution';
    harga_per_m3: number;
    keterangan?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Extended Order for Dispatch
 */
export interface DispatchOrder {
    id: number;
    order_number: string;
    customer_name: string;
    customer_type: 'household' | 'institution';
    customer_address: string;
    customer_phone: string;
    customer_npwp?: string;
    volume: number;
    status: 'pending' | 'assigned' | 'processing' | 'done' | 'cancelled';
    payment_status: 'unpaid' | 'paid' | 'deposit_held';
    payment_method?: 'cash' | 'transfer';
    total_amount: number;
    notes?: string;
    latitude?: number;
    longitude?: number;
    scheduled_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
    // Relations
    petugas_id?: number;
    petugas?: Petugas;
    armada_id?: number;
    armada?: Armada;
    bukti_transfer?: string;
}

/**
 * Setoran (Deposit) Types
 */
export interface Setoran {
    id: number;
    petugas_id: number;
    petugas?: Petugas;
    jumlah: number;
    tanggal: string;
    keterangan?: string;
    created_at: string;
}

/**
 * Dashboard Stats
 */
export interface DashboardStats {
    total_order_hari_ini: number;
    order_pending: number;
    pendapatan_hari_ini: number;
    setoran_pending: number;
}

/**
 * Weekly Chart Data
 */
export interface WeeklyChartData {
    day: string;
    orders: number;
    revenue: number;
}

/**
 * Pagination
 */
export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}
