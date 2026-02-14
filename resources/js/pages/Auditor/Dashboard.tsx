import { Head } from '@inertiajs/react';
import AuditorLayout from '@/layouts/AuditorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Receipt, FileText } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard Auditor', href: '/audit' }];

export default function AuditorDashboard() {
    const stats = [
        { title: 'Total Order', value: '0', icon: FileText },
        { title: 'Order Pusat', value: '0', icon: BarChart3 },
        { title: 'Order Mitra', value: '0', icon: BarChart3 },
        { title: 'Total Pendapatan', value: 'Rp 0', icon: Receipt },
    ];

    return (
        <AuditorLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Auditor" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Dashboard Auditor</h1>
                <p className="text-muted-foreground">Monitoring kinerja dan statistik operasional (Read-Only)</p>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AuditorLayout>
    );
}
