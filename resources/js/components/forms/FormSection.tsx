import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FormSectionProps {
    title: string;
    description?: string;
    className?: string;
    children: ReactNode;
}

export function FormSection({
    title,
    description,
    className,
    children,
}: FormSectionProps) {
    return (
        <fieldset className={cn('space-y-4', className)}>
            <legend className="sr-only">{title}</legend>
            <div className="space-y-1">
                <h3 className="text-lg font-medium">{title}</h3>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            <div className="grid gap-4">{children}</div>
        </fieldset>
    );
}
