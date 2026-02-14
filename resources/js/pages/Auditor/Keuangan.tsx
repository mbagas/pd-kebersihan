import { Head } from '@inertiajs/react';
import AuditorLayout from '@/layouts/AuditorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/audit' },
    { title: 'Laporan Keuangan', href: '/audit/keuangan' },
];

export default function Keuangan() {
    return (
        <AuditorLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Keuangan" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader title="Laporan Keuangan" description="Ringkasan pendapatan dan transaksi" />

                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Keuangan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Data keuangan akan ditampilkan di sini.</p>
                    </CardContent>
                </Card>
            </div>
        </AuditorLayout>
    );
}
