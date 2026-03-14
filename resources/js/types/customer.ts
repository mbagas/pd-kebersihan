/**
 * Customer Portal Types
 */

import type { PaymentMethod } from './admin';
import type {
    ArmadaSummary,
    CustomerType,
    Evidence,
    OrderStatus,
    PaymentStatus,
    PetugasSummary,
} from './order';

/**
 * Customer Profile
 */
export interface CustomerProfile {
    id: number;
    user_id: number;
    customer_type: CustomerType;
    company_name?: string;
    npwp?: string;
    pic_name?: string;
    business_type?: string;
    default_address_id?: number;
    created_at: string;
    updated_at: string;
}

/**
 * Customer Address
 */
export interface CustomerAddress {
    id: number;
    user_id: number;
    label: string;
    address: string;
    lat: number;
    lng: number;
    is_default: boolean;
    notes?: string;
    created_at: string;
    updated_at: string;
}

/**
 * Customer Order (customer-facing view of an order)
 */
export interface CustomerOrder {
    id: number;
    order_number: string;
    status: OrderStatus;
    payment_method: PaymentMethod;
    payment_status: PaymentStatus;
    customer_name: string;
    customer_type: CustomerType;
    customer_address: string;
    customer_phone: string;
    customer_npwp?: string;
    volume_estimate?: number;
    volume_actual?: number;
    total_amount: number;
    notes?: string;
    scheduled_at?: string;
    assigned_at?: string;
    started_at?: string;
    completed_at?: string;
    created_at: string;
    petugas?: PetugasSummary;
    armada?: ArmadaSummary;
    evidence?: Evidence;
    bukti_transfer?: string;
}

/**
 * Customer Dashboard Stats
 */
export interface CustomerDashboardStats {
    total_orders: number;
    active_orders: number;
    completed_orders: number;
    pending_payments: number;
}
