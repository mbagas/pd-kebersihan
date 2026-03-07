import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    Clock,
    CreditCard,
    Package,
} from 'lucide-react';
import { CustomerOrderCard } from '@/components/customer/CustomerOrderCard';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import CustomerLayout from '@/layouts/CustomerLayout';
import type {
    CustomerDashboardStats,
    CustomerOrder,
} from '@/types/customer';

interface Props {
    stats: CustomerDashboardStats;
    activeOrders: CustomerOrder[];
    recentOrders: CustomerOrder[];
}

const statCards = [
    {
        key: 'total_orders' as const,
        label: 'Total Pesanan',
        icon: Package,
        color: 'text-primary',
        bg: 'bg-primary/10',
    },
    {
        key: 'active_orders' as const,
        label: 'Aktif',
        icon: Clock,
        color: 'text-yellow-600',
        bg: 'bg-yellow-50',
    },
    {
        key: 'completed_orders' as const,
        label: 'Selesai',
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-50',
    },
    {
        key: 'pending_payments' as const,
        label: 'Belum Bayar',
        icon: CreditCard,
        color: 'text-red-600',
        bg: 'bg-red-50',
    },
];

export default function Dashboard({
    stats,
    activeOrders,
    recentOrders,
}: Props) {
    const { auth } = usePage().props;
    const userName = auth.user?.name?.split(' ')[0] ?? 'Pelanggan';

    return (
        <CustomerLayout>
            <Head title="Dashboard" />

            <div className="space-y-6 p-4">
                {/* Welcome */}
                <div>
                    <h1 className="text-xl font-bold">
                        Halo, {userName}!
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola pesanan dan layanan Anda
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.key}>
                                <CardContent className="flex items-center gap-3 p-4">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
                                    >
                                        <Icon
                                            className={`h-5 w-5 ${stat.color}`}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {stats[stat.key]}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {stat.label}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-3">
                    <Button asChild className="flex-1">
                        <Link href="/order">Pesan Lagi</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="flex-1"
                    >
                        <Link href="/customer/orders">
                            Lacak Pesanan
                        </Link>
                    </Button>
                </div>

                {/* Active Orders */}
                {activeOrders.length > 0 && (
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Pesanan Aktif
                            </h2>
                            <Link
                                href="/customer/orders"
                                className="flex items-center gap-1 text-sm text-primary"
                            >
                                Lihat Semua
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {activeOrders.map((order) => (
                                <CustomerOrderCard
                                    key={order.id}
                                    order={order}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Recent Orders */}
                {recentOrders.length > 0 && (
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="font-semibold">
                                Pesanan Terbaru
                            </h2>
                            <Link
                                href="/customer/orders"
                                className="flex items-center gap-1 text-sm text-primary"
                            >
                                Lihat Semua
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <CustomerOrderCard
                                    key={order.id}
                                    order={order}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* Empty State */}
                {recentOrders.length === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground/50" />
                            <h3 className="mb-1 font-semibold">
                                Belum ada pesanan
                            </h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Pesan layanan sedot tinja
                                sekarang
                            </p>
                            <Button asChild>
                                <Link href="/order">
                                    Pesan Sekarang
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </CustomerLayout>
    );
}
