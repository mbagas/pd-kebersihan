import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/shared';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Statistik', href: '/audit' },
    { title: 'Peta Sebaran', href: '/audit/peta' },
];

export default function Peta() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Sebaran" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Peta Sebaran Order"
                    description="Visualisasi lokasi order di peta"
                />

                <Card className="min-h-[500px]">
                    <CardHeader>
                        <CardTitle>Peta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Peta akan diimplementasikan dengan Leaflet JS.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
