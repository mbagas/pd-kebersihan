import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    Calendar,
    Camera,
    CheckCircle2,
    Circle,
    CreditCard,
    ImageIcon,
    MapPin,
    Phone,
    Truck,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { PhotoUploader } from '@/components/forms';
import { PaymentBadge, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CustomerLayout from '@/layouts/CustomerLayout';
import { cn } from '@/lib/utils';
import type { CustomerOrder } from '@/types/customer';
import { ORDER_STATUS, type OrderStatus } from '@/types/order';

interface Props {
    order: CustomerOrder;
}

const timelineSteps: {
    status: OrderStatus;
    label: string;
    icon: typeof Circle;
}[] = [
    {
        status: ORDER_STATUS.PENDING,
        label: 'Pesanan Dibuat',
        icon: Circle,
    },
    {
        status: ORDER_STATUS.ASSIGNED,
        label: 'Petugas Ditugaskan',
        icon: User,
    },
    {
        status: ORDER_STATUS.PROCESSING,
        label: 'Sedang Dikerjakan',
        icon: Truck,
    },
    {
        status: ORDER_STATUS.DONE,
        label: 'Selesai',
        icon: CheckCircle2,
    },
];

const statusOrder: OrderStatus[] = [
    'pending',
    'assigned',
    'on_the_way',
    'arrived',
    'processing',
    'done',
];

// Placeholder bank account details
const BANK_ACCOUNT = {
    bank: 'Bank Lampung',
    accountNumber: '380.03.01.12345.6',
    accountHolder: 'PD Kebersihan Kota Bandar Lampung',
};

function getStatusIndex(status: OrderStatus): number {
    return statusOrder.indexOf(status);
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function OrderShow({ order }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string };
    }>().props;
    const currentIndex = getStatusIndex(order.status);
    const [paymentProofFiles, setPaymentProofFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUploadProof = () => {
        if (paymentProofFiles.length === 0) return;

        setIsSubmitting(true);
        router.post(
            `/customer/orders/${order.id}/payment-proof`,
            { payment_proof: paymentProofFiles[0] },
            {
                forceFormData: true,
                onFinish: () => {
                    setIsSubmitting(false);
                    setPaymentProofFiles([]);
                },
            },
        );
    };

    const hasEvidence =
        (order.evidence?.before && order.evidence.before.length > 0) ||
        (order.evidence?.after && order.evidence.after.length > 0);

    const showTransferUpload =
        order.payment_method === 'transfer' &&
        order.payment_status === 'unpaid' &&
        !order.bukti_transfer;

    return (
        <CustomerLayout>
            <Head title={`Pesanan ${order.order_number}`} />

            <div className="space-y-4 p-4">
                {/* Back button */}
                <Link
                    href="/customer/orders"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Link>

                {/* Success Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-bold">
                            {order.order_number}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(order.created_at)}
                        </p>
                    </div>
                    <StatusBadge status={order.status} />
                </div>

                {/* Status Timeline */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Status Pesanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {timelineSteps.map((step, index) => {
                                const stepIndex = getStatusIndex(step.status);
                                const isCompleted = currentIndex >= stepIndex;
                                const isCurrent = order.status === step.status;
                                const Icon = step.icon;

                                return (
                                    <div
                                        key={step.status}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="flex flex-col items-center">
                                            <div
                                                className={cn(
                                                    'flex h-8 w-8 items-center justify-center rounded-full',
                                                    isCompleted
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-muted-foreground',
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            {index <
                                                timelineSteps.length - 1 && (
                                                <div
                                                    className={cn(
                                                        'mt-1 h-6 w-0.5',
                                                        isCompleted
                                                            ? 'bg-primary'
                                                            : 'bg-muted',
                                                    )}
                                                />
                                            )}
                                        </div>
                                        <div className="pt-1">
                                            <p
                                                className={cn(
                                                    'text-sm font-medium',
                                                    !isCompleted &&
                                                        'text-muted-foreground',
                                                )}
                                            >
                                                {step.label}
                                            </p>
                                            {isCurrent && (
                                                <p className="text-xs text-primary">
                                                    Saat ini
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Order Details */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Detail Pesanan
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-2 text-sm">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>{order.customer_address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>{order.customer_phone}</span>
                        </div>
                        {order.scheduled_at && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span>
                                    Dijadwalkan:{' '}
                                    {formatDate(order.scheduled_at)}
                                </span>
                            </div>
                        )}
                        {order.notes && (
                            <div className="rounded-lg bg-muted/50 p-3 text-sm">
                                <p className="mb-1 text-xs font-medium text-muted-foreground">
                                    Catatan
                                </p>
                                {order.notes}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Officer Info */}
                {order.petugas && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Petugas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {order.petugas.nama}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {order.petugas.kontak}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Evidence Photos */}
                {hasEvidence && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-sm">
                                <Camera className="h-4 w-4" />
                                Dokumentasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {order.evidence?.before &&
                                order.evidence.before.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                            Sebelum
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {order.evidence.before.map(
                                                (_url, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted"
                                                    >
                                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            {order.evidence?.after &&
                                order.evidence.after.length > 0 && (
                                    <div>
                                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                                            Sesudah
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {order.evidence.after.map(
                                                (_url, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-muted"
                                                    >
                                                        <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                        </CardContent>
                    </Card>
                )}

                {/* Payment */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Metode
                            </span>
                            <div className="flex items-center gap-1.5 font-medium">
                                {order.payment_method === 'cash' ? (
                                    <>
                                        <Banknote className="h-4 w-4" />
                                        Bayar di Tempat (COD)
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        Transfer Bank
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Status
                            </span>
                            <PaymentBadge status={order.payment_status} />
                        </div>
                        <Separator />

                        {/* Price Breakdown */}
                        {order.volume_estimate && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Estimasi Volume
                                </span>
                                <span>{order.volume_estimate} m³</span>
                            </div>
                        )}
                        {order.volume_actual && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Volume Aktual
                                </span>
                                <span>{order.volume_actual} m³</span>
                            </div>
                        )}
                        {order.volume_estimate && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Tarif ×{' '}
                                    {order.volume_actual ??
                                        order.volume_estimate}{' '}
                                    m³
                                </span>
                                <span>{formatCurrency(order.total_amount)}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Total</span>
                            <span className="text-lg font-bold text-primary">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </div>

                        {/* COD Instructions */}
                        {order.payment_method === 'cash' && (
                            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                                <p className="font-medium">Pembayaran Tunai</p>
                                <p className="mt-1 text-xs">
                                    Siapkan pembayaran tunai saat petugas tiba
                                    di lokasi. Petugas akan memberikan kwitansi
                                    resmi.
                                </p>
                            </div>
                        )}

                        {/* Transfer Bank Details */}
                        {order.payment_method === 'transfer' &&
                            order.payment_status === 'unpaid' && (
                                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                                    <p className="font-medium">
                                        Transfer ke Rekening
                                    </p>
                                    <div className="mt-2 space-y-1 text-xs">
                                        <p>
                                            <span className="text-blue-600">
                                                Bank:
                                            </span>{' '}
                                            {BANK_ACCOUNT.bank}
                                        </p>
                                        <p>
                                            <span className="text-blue-600">
                                                No. Rekening:
                                            </span>{' '}
                                            <span className="font-mono font-medium">
                                                {BANK_ACCOUNT.accountNumber}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="text-blue-600">
                                                Atas Nama:
                                            </span>{' '}
                                            {BANK_ACCOUNT.accountHolder}
                                        </p>
                                    </div>
                                    <p className="mt-2 text-xs text-blue-600">
                                        Transfer senilai{' '}
                                        <strong>
                                            {formatCurrency(order.total_amount)}
                                        </strong>{' '}
                                        lalu upload bukti transfer di bawah.
                                    </p>
                                </div>
                            )}

                        {/* Transfer Upload Section */}
                        {showTransferUpload && (
                            <div className="space-y-3">
                                <p className="text-sm font-medium">
                                    Upload Bukti Transfer
                                </p>
                                <PhotoUploader
                                    maxFiles={1}
                                    maxSizeKB={500}
                                    showCamera={true}
                                    onChange={setPaymentProofFiles}
                                />
                                {paymentProofFiles.length > 0 && (
                                    <Button
                                        className="w-full"
                                        onClick={handleUploadProof}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting
                                            ? 'Mengirim...'
                                            : 'Kirim Bukti Transfer'}
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Existing payment proof */}
                        {order.bukti_transfer && (
                            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                Bukti transfer sudah dikirim
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                {order.status === 'done' && (
                    <div className="flex gap-3">
                        <Button asChild className="flex-1">
                            <Link
                                href={`/customer/orders/${order.id}/reorder`}
                                method="post"
                                as="button"
                            >
                                Pesan Lagi
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
