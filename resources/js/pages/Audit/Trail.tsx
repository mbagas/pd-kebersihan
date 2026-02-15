import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader, EmptyState } from '@/components/shared';
import { FileSearch } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Statistik', href: '/audit' },
    { title: 'Audit Trail', href: '/audit/trail' },
];

export default function Trail() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Trail" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Audit Trail"
                    description="Riwayat aktivitas dan perubahan data"
                />

                <Card>
                    <CardHeader>
                        <CardTitle>Log Aktivitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EmptyState
                            icon={FileSearch}
                            title="Belum ada log"
                            description="Log aktivitas akan muncul di sini"
                        />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
