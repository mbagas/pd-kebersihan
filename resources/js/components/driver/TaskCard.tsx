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
        <Link href={`/app/tugas/${task.id}`} className="block">
            <Card
                className={cn(
                    'active:bg-muted/50 transition-colors touch-manipulation border-l-4',
                    statusColor.includes('blue') && 'border-l-blue-500',
                    statusColor.includes('yellow') && 'border-l-yellow-500',
                    statusColor.includes('purple') && 'border-l-purple-500',
                    statusColor.includes('orange') && 'border-l-orange-500',
                    statusColor.includes('green') && 'border-l-green-500',
                    className,
                )}
            >
                <CardContent className="p-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1 space-y-2.5">
                            {/* Status badge & order number */}
                            <div className="flex items-center justify-between">
                                <Badge className={cn('text-xs px-2 py-0.5', statusColor)}>
                                    {statusLabel}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {task.order_number}
                                </span>
                            </div>

                            {/* Customer name & type */}
                            <div className="space-y-1">
                                <h3 className="font-semibold text-base leading-tight">
                                    {task.customer_name}
                                </h3>
                                <Badge
                                    variant="outline"
                                    className="text-xs px-1.5 py-0 font-normal"
                                >
                                    {customerTypeLabel}
                                </Badge>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span className="line-clamp-2 leading-snug">
                                    {task.customer_address}
                                </span>
                            </div>

                            {/* Time info */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    <span>{formattedDate}</span>
                                </div>
                                {scheduledTime && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{scheduledTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Arrow */}
                        <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 self-center" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
