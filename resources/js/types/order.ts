/**
 * Order Status Types
 */
export const ORDER_STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    ON_THE_WAY: 'on_the_way',
    ARRIVED: 'arrived',
    PROCESSING: 'processing',
    DONE: 'done',
    CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]: 'Menunggu',
    [ORDER_STATUS.ASSIGNED]: 'Ditugaskan',
    [ORDER_STATUS.ON_THE_WAY]: 'Dalam Perjalanan',
    [ORDER_STATUS.ARRIVED]: 'Sampai Lokasi',
    [ORDER_STATUS.PROCESSING]: 'Diproses',
    [ORDER_STATUS.DONE]: 'Selesai',
    [ORDER_STATUS.CANCELLED]: 'Dibatalkan',
};

/**
 * Payment Status Types
 */
export const PAYMENT_STATUS = {
    UNPAID: 'unpaid',
    PENDING_VERIFICATION: 'pending_verification',
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
 * Customer Type
 */
export const CUSTOMER_TYPE = {
    HOUSEHOLD: 'household',
    INSTITUTION: 'institution',
} as const;

export type CustomerType = (typeof CUSTOMER_TYPE)[keyof typeof CUSTOMER_TYPE];

export const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
    [CUSTOMER_TYPE.HOUSEHOLD]: 'Rumah Tangga',
    [CUSTOMER_TYPE.INSTITUTION]: 'Instansi',
};

/**
 * Partner Type
 */
export const PARTNER_TYPE = {
    UPT_PUSAT: 'upt_pusat',
    CV_SWASTA: 'cv_swasta',
} as const;

export type PartnerType = (typeof PARTNER_TYPE)[keyof typeof PARTNER_TYPE];

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
    [PARTNER_TYPE.UPT_PUSAT]: 'UPT Pusat',
    [PARTNER_TYPE.CV_SWASTA]: 'CV. Swasta',
};

/**
 * Shared relation subtypes (lightweight versions sent by backend)
 */
export interface MitraSummary {
    id: number;
    nama: string;
    tipe: string;
}

export interface PetugasSummary {
    id: number;
    nama: string;
    kontak: string;
    mitra_id: number;
    mitra?: MitraSummary;
}

export interface ArmadaSummary {
    id: number;
    plat_nomor: string;
    kapasitas: number;
}

export interface Evidence {
    before?: string[];
    after?: string[];
}

export interface GpsArrival {
    lat?: number;
    lng?: number;
    validated?: boolean;
}

/**
 * Order Interface
 */
export interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    customer_type: CustomerType;
    customer_address: string;
    customer_phone: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    partner_type?: PartnerType;
    partner_name?: string;
    total_amount: number;
    notes?: string;
    scheduled_at?: string;
    completed_at?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Prefill data for reorder flow
 */
export interface OrderFormPrefill {
    customer_type?: CustomerType;
    name?: string;
    phone?: string;
    address?: string;
    estimated_volume?: number;
    payment_method?: 'cash' | 'transfer';
    notes?: string;
}
