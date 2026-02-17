import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DriverOrderStatus } from '@/types/driver';
import {
    DRIVER_ORDER_STATUS_COLORS,
    DRIVER_ORDER_STATUS_LABELS,
} from '@/types/driver';

interface DriverStatusBadgeProps {
    status: DriverOrderStatus;
    className?: string;
}

export function DriverStatusBadge({ status, className }: DriverStatusBadgeProps) {
    return (
        <Badge className={cn(DRIVER_ORDER_STATUS_COLORS[status], className)}>
            {DRIVER_ORDER_STATUS_LABELS[status]}
        </Badge>
    );
}
