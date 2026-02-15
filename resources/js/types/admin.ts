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
 * Payment Method Types
 */
export const PAYMENT_METHOD = {
    CASH: 'cash',
    TRANSFER: 'transfer',
} as const;

export type PaymentMethod =
    (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
    [PAYMENT_METHOD.CASH]: 'Tunai',
    [PAYMENT_METHOD.TRANSFER]: 'Transfer',
};

/**
 * Payment Status Types (for order)
 */
export const PAYMENT_STATUS = {
    UNPAID: 'unpaid',
    PENDING_VERIFICATION: 'pending_verification', // Transfer uploaded, waiting admin
    PAID: 'paid',
} as const;

export type PaymentStatus =
    (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    [PAYMENT_STATUS.UNPAID]: 'Belum Bayar',
    [PAYMENT_STATUS.PENDING_VERIFICATION]: 'Menunggu Verifikasi',
    [PAYMENT_STATUS.PAID]: 'Lunas',
};

/**
 * Cash Collection Status (for cash payment orders)
 * Tracks whether petugas has collected cash from customer
 */
export const CASH_COLLECTION_STATUS = {
    NOT_APPLICABLE: 'not_applicable', // For transfer payments
    PENDING: 'pending', // Cash not yet collected
    COLLECTED: 'collected', // Petugas collected cash, added to saldo_hutang
    DEPOSITED: 'deposited', // Petugas has deposited to kasir
} as const;

export type CashCollectionStatus =
    (typeof CASH_COLLECTION_STATUS)[keyof typeof CASH_COLLECTION_STATUS];

export const CASH_COLLECTION_STATUS_LABELS: Record<CashCollectionStatus, string> = {
    [CASH_COLLECTION_STATUS.NOT_APPLICABLE]: '-',
    [CASH_COLLECTION_STATUS.PENDING]: 'Belum Ditagih',
    [CASH_COLLECTION_STATUS.COLLECTED]: 'Sudah Ditagih',
    [CASH_COLLECTION_STATUS.DEPOSITED]: 'Sudah Disetor',
};

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
    // Payment fields
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    cash_collection_status: CashCollectionStatus;
    total_amount: number;
    // Transfer specific
    bukti_transfer?: string;
    transfer_verified_at?: string;
    transfer_verified_by?: number;
    // Cash specific - tracks which setoran this order was deposited in
    setoran_id?: number;
    // General
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
    // Orders included in this setoran
    order_ids?: number[];
    orders?: DispatchOrder[];
    created_at: string;
    verified_by?: number;
    verified_at?: string;
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
