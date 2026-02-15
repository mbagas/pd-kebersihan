import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    required?: boolean;
    description?: string;
    className?: string;
    children: ReactNode;
}

export function FormField({
    label,
    htmlFor,
    error,
    required,
    description,
    className,
    children,
}: FormFieldProps) {
    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={htmlFor}>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {children}
            {description && !error && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
            <InputError message={error} />
        </div>
    );
}
