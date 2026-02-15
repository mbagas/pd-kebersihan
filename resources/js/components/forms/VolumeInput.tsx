import { forwardRef, useState } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type VolumeInputProps = Omit<ComponentProps<'input'>, 'type' | 'onChange'> & {
    onChange?: (value: number) => void;
    onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    maxVolume?: number;
};

export const VolumeInput = forwardRef<HTMLInputElement, VolumeInputProps>(
    (
        {
            className,
            onChange,
            onInputChange,
            value,
            defaultValue,
            maxVolume = 20,
            ...props
        },
        ref,
    ) => {
        const [displayValue, setDisplayValue] = useState(() => {
            const initial = (value ?? defaultValue ?? '') as string;
            return initial;
        });

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const inputVal = e.target.value;

            // Allow empty or valid decimal numbers
            if (inputVal === '' || /^\d*\.?\d{0,2}$/.test(inputVal)) {
                const numVal = parseFloat(inputVal) || 0;

                // Validate max volume
                if (numVal > maxVolume) {
                    return;
                }

                setDisplayValue(inputVal);

                if (onChange) {
                    onChange(numVal);
                }
                if (onInputChange) {
                    onInputChange(e);
                }
            }
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type="text"
                    inputMode="decimal"
                    className={cn('pr-10', className)}
                    value={displayValue}
                    onChange={handleChange}
                    placeholder="0"
                    {...props}
                />
                <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                    m³
                </span>
            </div>
        );
    },
);

VolumeInput.displayName = 'VolumeInput';
