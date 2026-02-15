/**
 * Order Status Types
 */
export const ORDER_STATUS = {
    PENDING: 'pending',
    ASSIGNED: 'assigned',
    PROCESSING: 'processing',
    DONE: 'done',
    CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]: 'Menunggu',
    [ORDER_STATUS.ASSIGNED]: 'Ditugaskan',
    [ORDER_STATUS.PROCESSING]: 'Diproses',
    [ORDER_STATUS.DONE]: 'Selesai',
    [ORDER_STATUS.CANCELLED]: 'Dibatalkan',
};

/**
 * Payment Status Types
 */
export const PAYMENT_STATUS = {
    UNPAID: 'unpaid',
    PAID: 'paid',
    DEPOSIT_HELD: 'deposit_held',
} as const;

export type PaymentStatus =
    (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    [PAYMENT_STATUS.UNPAID]: 'Belum Bayar',
    [PAYMENT_STATUS.PAID]: 'Lunas',
    [PAYMENT_STATUS.DEPOSIT_HELD]: 'Deposit',
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
