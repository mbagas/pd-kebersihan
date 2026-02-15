import { Building, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    PARTNER_TYPE,
    PARTNER_TYPE_LABELS,
    type PartnerType,
} from '@/types/order';

interface PartnerLabelProps {
    type: PartnerType;
    name?: string;
    className?: string;
    showIcon?: boolean;
}

const partnerTypeIcons: Record<PartnerType, React.ReactNode> = {
    [PARTNER_TYPE.UPT_PUSAT]: <Building className="mr-1.5 h-4 w-4" />,
    [PARTNER_TYPE.CV_SWASTA]: <Truck className="mr-1.5 h-4 w-4" />,
};

const partnerTypeColors: Record<PartnerType, string> = {
    [PARTNER_TYPE.UPT_PUSAT]: 'text-primary',
    [PARTNER_TYPE.CV_SWASTA]: 'text-accent-foreground',
};

export function PartnerLabel({
    type,
    name,
    className,
    showIcon = true,
}: PartnerLabelProps) {
    const displayName = name || PARTNER_TYPE_LABELS[type];

    return (
        <span
            className={cn(
                'inline-flex items-center text-sm font-medium',
                partnerTypeColors[type],
                className,
            )}
        >
            {showIcon && partnerTypeIcons[type]}
            {displayName}
        </span>
    );
}
