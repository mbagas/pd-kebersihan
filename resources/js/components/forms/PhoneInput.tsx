import { forwardRef, useState } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type PhoneInputProps = Omit<ComponentProps<'input'>, 'type' | 'onChange'> & {
    onChange?: (value: string) => void;
    onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

/**
 * Format nomor HP Indonesia
 * Input: 81234567890 -> Output: 812-3456-7890
 */
function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    // Remove leading 0 or 62
    let cleaned = digits;
    if (cleaned.startsWith('62')) {
        cleaned = cleaned.slice(2);
    } else if (cleaned.startsWith('0')) {
        cleaned = cleaned.slice(1);
    }

    // Format: XXX-XXXX-XXXX
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 7)
        return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
}

function unformatPhoneNumber(value: string): string {
    return value.replace(/\D/g, '');
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
    (
        { className, onChange, onInputChange, value, defaultValue, ...props },
        ref,
    ) => {
        const [displayValue, setDisplayValue] = useState(() => {
            const initial = (value ?? defaultValue ?? '') as string;
            return formatPhoneNumber(initial);
        });

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const raw = unformatPhoneNumber(e.target.value);
            // Limit to 12 digits (Indonesian mobile max)
            if (raw.length > 12) return;

            const formatted = formatPhoneNumber(raw);
            setDisplayValue(formatted);

            // Call onChange with +62 prefixed value
            if (onChange) {
                onChange(raw ? `+62${raw}` : '');
            }
            if (onInputChange) {
                onInputChange(e);
            }
        };

        return (
            <div className="relative">
                <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                    +62
                </span>
                <Input
                    ref={ref}
                    type="tel"
                    inputMode="numeric"
                    className={cn('pl-12', className)}
                    value={displayValue}
                    onChange={handleChange}
                    placeholder="812-3456-7890"
                    {...props}
                />
            </div>
        );
    },
);

PhoneInput.displayName = 'PhoneInput';
