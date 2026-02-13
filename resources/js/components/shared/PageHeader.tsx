import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export interface BreadcrumbItemType {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItemType[];
    actions?: React.ReactNode;
    className?: string;
}

export function PageHeader({ title, description, breadcrumbs, actions, className }: PageHeaderProps) {
    return (
        <div className={cn('space-y-2', className)}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {breadcrumbs.map((item, index) => (
                            <Fragment key={index}>
                                <BreadcrumbItem>
                                    {item.href ? (
                                        <BreadcrumbLink asChild>
                                            <Link href={item.href}>{item.label}</Link>
                                        </BreadcrumbLink>
                                    ) : (
                                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                    )}
                                </BreadcrumbItem>
                                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                            </Fragment>
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && <p className="text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        </div>
    );
}
