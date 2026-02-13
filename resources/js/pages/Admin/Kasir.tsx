import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Kasir', href: '/admin/kasir' },
];

export default function Kasir() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kasir" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader title="Kasir" description="Kelola pembayaran dan setoran petugas" />

                <Card>
                    <CardHeader>
                        <CardTitle>Setoran Pending</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Belum ada setoran yang perlu diverifikasi.</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
