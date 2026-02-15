import { Head, usePage } from '@inertiajs/react';
import { BarChart3, Receipt, FileText, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Statistik', href: '/audit' }];

export default function AuditDashboard() {
    const { auth } = usePage().props;
    const isAuditor = auth.user?.role === 'auditor';

    const stats = [
        { title: 'Total Order', value: '0', icon: FileText },
        { title: 'Order Pusat', value: '0', icon: BarChart3 },
        { title: 'Order Mitra', value: '0', icon: BarChart3 },
        { title: 'Total Pendapatan', value: 'Rp 0', icon: Receipt },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Statistik" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Dashboard Statistik
                        </h1>
                        <p className="text-muted-foreground">
                            Monitoring kinerja dan statistik operasional
                        </p>
                    </div>
                    {isAuditor && (
                        <Badge variant="secondary" className="gap-1.5">
                            <Eye className="h-3 w-3" />
                            Read-Only
                        </Badge>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className="h-5 w-5 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stat.value}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
