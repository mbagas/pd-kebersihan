import { forwardRef, useState } from 'react';
import type { ChangeEvent, ComponentProps } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type AddressInputProps = Omit<ComponentProps<'textarea'>, 'onChange'> & {
    onChange?: (value: string) => void;
    onInputChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    maxLength?: number;
    showCount?: boolean;
};

export const AddressInput = forwardRef<HTMLTextAreaElement, AddressInputProps>(
    (
        {
            className,
            onChange,
            onInputChange,
            value,
            defaultValue,
            maxLength = 500,
            showCount = true,
            ...props
        },
        ref,
    ) => {
        const [charCount, setCharCount] = useState(() => {
            const initial = (value ?? defaultValue ?? '') as string;
            return initial.length;
        });

        const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
            const newValue = e.target.value;

            if (newValue.length <= maxLength) {
                setCharCount(newValue.length);

                if (onChange) {
                    onChange(newValue);
                }
                if (onInputChange) {
                    onInputChange(e);
                }
            }
        };

        return (
            <div className="relative">
                <Textarea
                    ref={ref}
                    className={cn('min-h-24 resize-none', className)}
                    onChange={handleChange}
                    maxLength={maxLength}
                    placeholder="Masukkan alamat lengkap..."
                    defaultValue={defaultValue}
                    {...props}
                />
                {showCount && (
                    <span className="absolute right-3 bottom-2 text-xs text-muted-foreground">
                        {charCount}/{maxLength}
                    </span>
                )}
            </div>
        );
    },
);

AddressInput.displayName = 'AddressInput';
