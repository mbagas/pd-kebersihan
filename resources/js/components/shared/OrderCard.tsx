import { Calendar, MapPin, Phone } from 'lucide-react';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Order } from '@/types/order';
import { CustomerTypeBadge } from './CustomerTypeBadge';
import { PartnerLabel } from './PartnerLabel';
import { PaymentBadge } from './PaymentBadge';
import { StatusBadge } from './StatusBadge';

interface OrderCardProps {
    order: Order;
    className?: string;
    onClick?: () => void;
}

export function OrderCard({ order, className, onClick }: OrderCardProps) {
    const formattedDate = new Date(order.created_at).toLocaleDateString(
        'id-ID',
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        },
    );

    const formattedAmount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(order.total_amount);

    return (
        <Card
            className={cn(
                'cursor-pointer transition-shadow hover:shadow-md',
                className,
            )}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={
                onClick ? (e) => e.key === 'Enter' && onClick() : undefined
            }
        >
            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                            {order.order_number}
                        </p>
                        <h3 className="leading-tight font-semibold">
                            {order.customer_name}
                        </h3>
                    </div>
                    <CustomerTypeBadge
                        type={order.customer_type}
                        showIcon={false}
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-2 pb-2">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="line-clamp-1">
                        {order.customer_address}
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    <span>{order.customer_phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{formattedDate}</span>
                </div>
                {order.partner_type && (
                    <PartnerLabel
                        type={order.partner_type}
                        name={order.partner_name}
                    />
                )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t pt-3">
                <div className="flex gap-2">
                    <StatusBadge status={order.status} />
                    <PaymentBadge status={order.payment_status} />
                </div>
                <span className="font-semibold text-primary">
                    {formattedAmount}
                </span>
            </CardFooter>
        </Card>
    );
}
