import { Building2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CUSTOMER_TYPE } from '@/types/order';
import type { CustomerType } from '@/types/order';

interface CustomerTypeSelectorProps {
    value?: CustomerType;
    onChange?: (value: CustomerType) => void;
    name?: string;
    disabled?: boolean;
    className?: string;
}

const options = [
    {
        value: CUSTOMER_TYPE.HOUSEHOLD,
        label: 'Rumah Tangga',
        description: 'Untuk kebutuhan rumah pribadi',
        icon: Home,
    },
    {
        value: CUSTOMER_TYPE.INSTITUTION,
        label: 'Instansi / Niaga',
        description: 'Hotel, restoran, rumah sakit, dll',
        icon: Building2,
    },
] as const;

export function CustomerTypeSelector({
    value,
    onChange,
    name = 'customer_type',
    disabled,
    className,
}: CustomerTypeSelectorProps) {
    return (
        <div
            className={cn('grid gap-3 sm:grid-cols-2', className)}
            role="radiogroup"
            aria-label="Pilih tipe pelanggan"
        >
            {options.map((option) => {
                const isSelected = value === option.value;
                const Icon = option.icon;

                return (
                    <label
                        key={option.value}
                        className={cn(
                            'relative flex cursor-pointer flex-col rounded-lg border-2 p-4 transition-all',
                            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:border-primary/50',
                            isSelected
                                ? 'border-primary bg-primary/5'
                                : 'border-muted',
                            disabled && 'cursor-not-allowed opacity-50',
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => onChange?.(option.value)}
                            disabled={disabled}
                            className="sr-only"
                        />
                        <div className="flex items-center gap-3">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-full',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                        {isSelected && (
                            <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                        )}
                    </label>
                );
            })}
        </div>
    );
}
