import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Dispatch', href: '/admin/dispatch' },
];

export default function Dispatch() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dispatch" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader title="Dispatch Order" description="Kelola dan assign order ke petugas" />

                <Card>
                    <CardHeader>
                        <CardTitle>Order Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Belum ada order yang perlu di-dispatch.</p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
