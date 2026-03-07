import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Circle,
    MapPin,
    Phone,
    Truck,
    User,
} from 'lucide-react';
import { PaymentBadge, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CustomerLayout from '@/layouts/CustomerLayout';
import { cn } from '@/lib/utils';
import type { CustomerOrder } from '@/types/customer';
import {
    ORDER_STATUS,
    type OrderStatus,
} from '@/types/order';

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
    const currentIndex = getStatusIndex(order.status);

    return (
        <CustomerLayout>
            <Head title={`Pesanan ${order.ticket_number}`} />

            <div className="space-y-4 p-4">
                {/* Back button */}
                <Link
                    href="/customer/orders"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-lg font-bold">
                            {order.ticket_number}
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
                            {timelineSteps.map(
                                (step, index) => {
                                    const stepIndex =
                                        getStatusIndex(
                                            step.status,
                                        );
                                    const isCompleted =
                                        currentIndex >=
                                        stepIndex;
                                    const isCurrent =
                                        order.status ===
                                        step.status;
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
                                                    timelineSteps.length -
                                                        1 && (
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
                                                    {
                                                        step.label
                                                    }
                                                </p>
                                                {isCurrent && (
                                                    <p className="text-xs text-primary">
                                                        Saat
                                                        ini
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                },
                            )}
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
                            <span>
                                {order.customer_address}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span>
                                {order.customer_phone}
                            </span>
                        </div>
                        {order.scheduled_at && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span>
                                    Dijadwalkan:{' '}
                                    {formatDate(
                                        order.scheduled_at,
                                    )}
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
                {order.officer && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">
                                Petugas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">
                                        {
                                            order.officer
                                                .name
                                        }
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {
                                            order.officer
                                                .phone
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Payment */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Pembayaran
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Metode
                            </span>
                            <span className="font-medium capitalize">
                                {order.payment_method ===
                                'cod'
                                    ? 'Bayar di Tempat (COD)'
                                    : 'Transfer Bank'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Status
                            </span>
                            <PaymentBadge
                                status={
                                    order.payment_status
                                }
                            />
                        </div>
                        <Separator />
                        {order.volume_estimate && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Estimasi Volume
                                </span>
                                <span>
                                    {order.volume_estimate}{' '}
                                    m³
                                </span>
                            </div>
                        )}
                        {order.volume_actual && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Volume Aktual
                                </span>
                                <span>
                                    {order.volume_actual} m³
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="font-medium">
                                Total
                            </span>
                            <span className="text-lg font-bold text-primary">
                                {formatCurrency(
                                    order.total_price,
                                )}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex gap-3">
                    {order.status === 'done' && (
                        <Button asChild className="flex-1">
                            <Link
                                href={`/customer/orders/${order.id}/reorder`}
                                method="post"
                                as="button"
                            >
                                Pesan Lagi
                            </Link>
                        </Button>
                    )}
                    {order.payment_method === 'transfer' &&
                        order.payment_status === 'unpaid' && (
                            <Button
                                variant="outline"
                                className="flex-1"
                            >
                                Upload Bukti Transfer
                            </Button>
                        )}
                </div>
            </div>
        </CustomerLayout>
    );
}
