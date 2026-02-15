import { forwardRef, useState } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type NPWPInputProps = Omit<ComponentProps<'input'>, 'type' | 'onChange'> & {
    onChange?: (value: string) => void;
    onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Format NPWP Indonesia
 * Format: XX.XXX.XXX.X-XXX.XXX (15 digit)
 * Contoh: 01.234.567.8-901.234
 */
function formatNPWP(value: string): string {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    if (digits.length <= 8)
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
    if (digits.length <= 9)
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8)}`;
    if (digits.length <= 12)
        return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}.${digits.slice(8, 9)}-${digits.slice(9, 12)}.${digits.slice(12, 15)}`;
}

function unformatNPWP(value: string): string {
    return value.replace(/\D/g, '');
}

/**
 * Validasi NPWP sederhana (hanya cek panjang)
 */
export function isValidNPWP(value: string): boolean {
    const digits = unformatNPWP(value);
    return digits.length === 15;
}

export const NPWPInput = forwardRef<HTMLInputElement, NPWPInputProps>(
    (
        { className, onChange, onInputChange, value, defaultValue, ...props },
        ref,
    ) => {
        const [displayValue, setDisplayValue] = useState(() => {
            const initial = (value ?? defaultValue ?? '') as string;
            return formatNPWP(initial);
        });

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const raw = unformatNPWP(e.target.value);
            // NPWP max 15 digits
            if (raw.length > 15) return;

            const formatted = formatNPWP(raw);
            setDisplayValue(formatted);

            if (onChange) {
                onChange(raw);
            }
            if (onInputChange) {
                onInputChange(e);
            }
        };

        return (
            <Input
                ref={ref}
                type="text"
                inputMode="numeric"
                className={cn(className)}
                value={displayValue}
                onChange={handleChange}
                placeholder="00.000.000.0-000.000"
                {...props}
            />
        );
    },
);

NPWPInput.displayName = 'NPWPInput';
