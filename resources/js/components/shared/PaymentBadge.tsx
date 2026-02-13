import { Badge } from '@/components/ui/badge';
import { PAYMENT_STATUS, PAYMENT_STATUS_LABELS, type PaymentStatus } from '@/types/order';
import { cn } from '@/lib/utils';

interface PaymentBadgeProps {
    status: PaymentStatus;
    className?: string;
}

const paymentVariants: Record<PaymentStatus, string> = {
    [PAYMENT_STATUS.UNPAID]: 'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30',
    [PAYMENT_STATUS.PAID]: 'bg-success/20 text-success border-success/30 hover:bg-success/30',
    [PAYMENT_STATUS.DEPOSIT_HELD]: 'bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30',
};

export function PaymentBadge({ status, className }: PaymentBadgeProps) {
    return (
        <Badge variant="outline" className={cn(paymentVariants[status], className)}>
            {PAYMENT_STATUS_LABELS[status]}
        </Badge>
    );
}
