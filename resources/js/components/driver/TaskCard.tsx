import { Link } from '@inertiajs/react';
import { Calendar, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DriverTask } from '@/types/driver';
import {
    DRIVER_ORDER_STATUS_COLORS,
    DRIVER_ORDER_STATUS_LABELS,
} from '@/types/driver';
import { CUSTOMER_TYPE_LABELS } from '@/types/order';

interface TaskCardProps {
    task: DriverTask;
    className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
    const statusColor = DRIVER_ORDER_STATUS_COLORS[task.status];
    const statusLabel = DRIVER_ORDER_STATUS_LABELS[task.status];
    const customerTypeLabel = CUSTOMER_TYPE_LABELS[task.customer_type];

    const scheduledTime = task.scheduled_at
        ? new Date(task.scheduled_at).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
          })
        : null;

    const formattedDate = task.scheduled_at
        ? new Date(task.scheduled_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
          })
        : new Date(task.created_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
          });

    return (
        <Link href={`/app/tugas/${task.id}`}>
            <Card
                className={cn(
                    'active:bg-muted/50 transition-colors touch-manipulation',
                    className,
                )}
            >
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2">
                            {/* Order number & badges */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-medium text-muted-foreground">
                                    {task.order_number}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0"
                                >
                                    {customerTypeLabel}
                                </Badge>
                                <Badge className={cn('text-xs px-1.5 py-0', statusColor)}>
                                    {statusLabel}
                                </Badge>
                            </div>

                            {/* Customer name */}
                            <h3 className="font-semibold leading-tight truncate">
                                {task.customer_name}
                            </h3>

                            {/* Address */}
                            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                                <span className="line-clamp-2">
                                    {task.customer_address}
                                </span>
                            </div>

                            {/* Time info */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formattedDate}</span>
                                </div>
                                {scheduledTime && (
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        <span>{scheduledTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
