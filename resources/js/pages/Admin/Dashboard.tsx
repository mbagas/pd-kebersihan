import { Head } from '@inertiajs/react';
import { ClipboardList, Truck, Users, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin' }];

export default function Dashboard() {
    const stats = [
        {
            title: 'Order Hari Ini',
            value: '0',
            icon: ClipboardList,
            color: 'text-primary',
        },
        {
            title: 'Armada Aktif',
            value: '0',
            icon: Truck,
            color: 'text-success',
        },
        { title: 'Petugas', value: '0', icon: Users, color: 'text-accent' },
        {
            title: 'Pendapatan',
            value: 'Rp 0',
            icon: Wallet,
            color: 'text-warning',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Dashboard Admin</h1>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
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

                <Card>
                    <CardHeader>
                        <CardTitle>Order Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Belum ada order.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
