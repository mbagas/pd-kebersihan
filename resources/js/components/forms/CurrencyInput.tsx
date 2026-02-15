import { forwardRef, useState } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type CurrencyInputProps = Omit<ComponentProps<'input'>, 'type' | 'onChange'> & {
    onChange?: (value: number) => void;
    onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Format angka ke format Rupiah
 * Input: 1500000 -> Output: 1.500.000
 */
function formatCurrency(value: number | string): string {
    const num =
        typeof value === 'string'
            ? parseInt(value.replace(/\D/g, ''), 10)
            : value;
    if (isNaN(num)) return '';
    return num.toLocaleString('id-ID');
}

function parseCurrency(value: string): number {
    return parseInt(value.replace(/\D/g, ''), 10) || 0;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
    (
        { className, onChange, onInputChange, value, defaultValue, ...props },
        ref,
    ) => {
        const [displayValue, setDisplayValue] = useState(() => {
            const initial = (value ?? defaultValue ?? '') as string | number;
            return formatCurrency(initial);
        });

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const raw = parseCurrency(e.target.value);
            // Limit to reasonable amount (10 trillion)
            if (raw > 10_000_000_000_000) return;

            const formatted = formatCurrency(raw);
            setDisplayValue(formatted);

            if (onChange) {
                onChange(raw);
            }
            if (onInputChange) {
                onInputChange(e);
            }
        };

        return (
            <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    Rp
                </span>
                <Input
                    ref={ref}
                    type="text"
                    inputMode="numeric"
                    className={cn('pl-10', className)}
                    value={displayValue}
                    onChange={handleChange}
                    placeholder="0"
                    {...props}
                />
            </div>
        );
    },
);

CurrencyInput.displayName = 'CurrencyInput';
