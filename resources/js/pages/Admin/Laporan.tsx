import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Laporan', href: '/admin/laporan' },
];

export default function Laporan() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader title="Laporan" description="Lihat dan export laporan operasional" />

                <Card>
                    <CardHeader>
                        <CardTitle>Laporan Bulanan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Pilih periode untuk melihat laporan.</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
