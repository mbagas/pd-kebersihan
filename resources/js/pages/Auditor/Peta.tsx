import { Head } from '@inertiajs/react';
import AuditorLayout from '@/layouts/AuditorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/audit' },
    { title: 'Peta Sebaran', href: '/audit/peta' },
];

export default function Peta() {
    return (
        <AuditorLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Sebaran" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader title="Peta Sebaran Order" description="Visualisasi lokasi order di peta" />

                <Card className="min-h-[500px]">
                    <CardHeader>
                        <CardTitle>Peta</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Peta akan diimplementasikan dengan Leaflet JS.</p>
                    </CardContent>
                </Card>
            </div>
        </AuditorLayout>
    );
}
