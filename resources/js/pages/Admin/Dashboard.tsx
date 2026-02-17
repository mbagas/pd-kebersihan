import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    ClipboardList,
    Clock,
    TrendingUp,
    Wallet,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem, DashboardStats, DispatchOrder, WeeklyChartData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/admin' }];

interface Props {
    stats: DashboardStats;
    weeklyChart: WeeklyChartData[];
    recentOrders: DispatchOrder[];
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Ditugaskan',
    processing: 'Diproses',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Dashboard({ stats, weeklyChart, recentOrders }: Props) {
    const statCards = [
        {
            title: 'Order Hari Ini',
            value: stats.total_order_hari_ini.toString(),
            icon: ClipboardList,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Order Pending',
            value: stats.order_pending.toString(),
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            href: '/admin/dispatch?status=pending',
        },
        {
            title: 'Pendapatan Hari Ini',
            value: formatCurrency(stats.pendapatan_hari_ini),
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Setoran Pending',
            value: formatCurrency(stats.setoran_pending),
            icon: Wallet,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            href: '/admin/kasir',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Button asChild>
                        <Link href="/admin/dispatch">
                            <ClipboardList className="mr-2 h-4 w-4" />
                            Dispatch Console
                        </Link>
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        const content = (
                            <Card
                                className={
                                    stat.href
                                        ? 'cursor-pointer transition-shadow hover:shadow-md'
                                        : ''
                                }
                            >
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`rounded-full p-2 ${stat.bgColor}`}
                                    >
                                        <Icon
                                            className={`h-4 w-4 ${stat.color}`}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stat.value}
                                    </p>
                                </CardContent>
                            </Card>
                        );

                        return stat.href ? (
                            <Link key={stat.title} href={stat.href}>
                                {content}
                            </Link>
                        ) : (
                            <div key={stat.title}>{content}</div>
                        );
                    })}
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Mingguan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={weeklyChart}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-muted"
                                />
                                <XAxis
                                    dataKey="day"
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor:
                                            'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                    }}
                                    formatter={(value, name) => [
                                        name === 'revenue'
                                            ? formatCurrency(value as number)
                                            : value,
                                        name === 'orders'
                                            ? 'Order'
                                            : 'Pendapatan',
                                    ]}
                                />
                                <Bar
                                    dataKey="orders"
                                    fill="hsl(var(--primary))"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Order Terbaru</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/dispatch">
                                Lihat Semua
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <AlertCircle className="mb-2 h-8 w-8 text-muted-foreground" />
                                <p className="text-muted-foreground">
                                    Belum ada order hari ini
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm font-medium">
                                                    {order.order_number}
                                                </span>
                                                <Badge
                                                    className={
                                                        STATUS_COLORS[
                                                            order.status
                                                        ]
                                                    }
                                                >
                                                    {STATUS_LABELS[order.status]}
                                                </Badge>
                                            </div>
                                            <p className="text-sm">
                                                {order.customer_name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(order.created_at)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                {formatCurrency(
                                                    order.total_amount,
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.volume} m³
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
