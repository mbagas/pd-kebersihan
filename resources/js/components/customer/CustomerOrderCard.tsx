import { Link } from '@inertiajs/react';
import { Calendar, MapPin, RefreshCw } from 'lucide-react';
import { PaymentBadge, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import type { CustomerOrder } from '@/types/customer';

interface CustomerOrderCardProps {
    order: CustomerOrder;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export function CustomerOrderCard({ order }: CustomerOrderCardProps) {
    return (
        <div>
            <Link href={`/customer/orders/${order.id}`} className="block">
                <Card className="gap-0 py-3 transition-shadow hover:shadow-md">
                    <CardHeader className="px-4 pb-2">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    {order.order_number}
                                </p>
                                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDate(order.created_at)}</span>
                                </div>
                            </div>
                            <StatusBadge status={order.status} />
                        </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-2">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="line-clamp-1">
                                {order.customer_address}
                            </span>
                        </div>
                        {order.volume_estimate && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                Volume: {order.volume_estimate} m³
                            </p>
                        )}
                    </CardContent>
                    <CardFooter className="border-t px-4 pt-2">
                        <div className="flex w-full items-center justify-between">
                            <PaymentBadge status={order.payment_status} />
                            <span className="text-sm font-semibold text-primary">
                                {formatCurrency(order.total_amount)}
                            </span>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
            {order.status === 'done' && (
                <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full gap-1.5"
                >
                    <Link
                        href={`/customer/orders/${order.id}/reorder`}
                        method="post"
                        as="button"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Pesan Lagi
                    </Link>
                </Button>
            )}
        </div>
    );
}
