import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
    ORDER_STATUS,
    ORDER_STATUS_LABELS,
    type OrderStatus,
} from '@/types/order';

interface StatusBadgeProps {
    status: OrderStatus;
    className?: string;
}

const statusVariants: Record<OrderStatus, string> = {
    [ORDER_STATUS.PENDING]:
        'bg-warning/20 text-warning-foreground border-warning/30 hover:bg-warning/30',
    [ORDER_STATUS.ASSIGNED]:
        'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30',
    [ORDER_STATUS.PROCESSING]:
        'bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30',
    [ORDER_STATUS.DONE]:
        'bg-success/20 text-success border-success/30 hover:bg-success/30',
    [ORDER_STATUS.CANCELLED]:
        'bg-destructive/20 text-destructive border-destructive/30 hover:bg-destructive/30',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    return (
        <Badge
            variant="outline"
            className={cn(statusVariants[status], className)}
        >
            {ORDER_STATUS_LABELS[status]}
        </Badge>
    );
}
