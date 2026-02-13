import { Badge } from '@/components/ui/badge';
import { CUSTOMER_TYPE, CUSTOMER_TYPE_LABELS, type CustomerType } from '@/types/order';
import { cn } from '@/lib/utils';
import { Building2, Home } from 'lucide-react';

interface CustomerTypeBadgeProps {
    type: CustomerType;
    className?: string;
    showIcon?: boolean;
}

const customerTypeVariants: Record<CustomerType, string> = {
    [CUSTOMER_TYPE.HOUSEHOLD]: 'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20',
    [CUSTOMER_TYPE.INSTITUTION]: 'bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20',
};

const customerTypeIcons: Record<CustomerType, React.ReactNode> = {
    [CUSTOMER_TYPE.HOUSEHOLD]: <Home className="mr-1 h-3 w-3" />,
    [CUSTOMER_TYPE.INSTITUTION]: <Building2 className="mr-1 h-3 w-3" />,
};

export function CustomerTypeBadge({ type, className, showIcon = true }: CustomerTypeBadgeProps) {
    return (
        <Badge variant="outline" className={cn(customerTypeVariants[type], className)}>
            {showIcon && customerTypeIcons[type]}
            {CUSTOMER_TYPE_LABELS[type]}
        </Badge>
    );
}
