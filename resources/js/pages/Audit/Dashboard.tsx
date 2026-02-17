import { Head, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Calendar,
    Eye,
    FileText,
    Receipt,
    TrendingUp,
    Truck,
} from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    AuditStats,
    DailyTrend,
    MonthlyRevenue,
    OrderDistribution,
} from '@/types/audit';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Statistik', href: '/audit' }];

interface Props {
    stats: AuditStats;
    orderDistribution: OrderDistribution[];
    monthlyRevenue: MonthlyRevenue[];
    dailyTrend: DailyTrend[];
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

function formatCompactCurrency(amount: number): string {
    if (amount >= 1000000) {
        return `Rp ${(amount / 1000000).toFixed(1)}jt`;
    }
    if (amount >= 1000) {
        return `Rp ${(amount / 1000).toFixed(0)}rb`;
    }
    return formatCurrency(amount);
}

export default function AuditDashboard({
    stats,
    orderDistribution,
    monthlyRevenue,
    dailyTrend,
}: Props) {
    const { auth } = usePage().props;
    const isAuditor = auth.user?.role === 'auditor';

    const statCards = [
        {
            title: 'Total Order (Bulan Ini)',
            value: stats.total_order_bulan_ini.toString(),
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: 'Total Pendapatan',
            value: formatCurrency(stats.total_pendapatan),
            icon: Receipt,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Total Volume',
            value: `${stats.total_volume} m³`,
            icon: Truck,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Rata-rata Order/Hari',
            value: stats.rata_rata_order_per_hari.toString(),
            icon: TrendingUp,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Statistik" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
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
                            Mode Auditor
                        </Badge>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">
                                        {stat.title}
                                    </CardTitle>
                                    <div
                                        className={`rounded-lg p-2 ${stat.bgColor}`}
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
                    })}
                </div>

                {/* Charts Row 1 */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Pie Chart - Order Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart3 className="h-4 w-4" />
                                Distribusi Order (Pusat vs Mitra)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={orderDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                                            }
                                        >
                                            {orderDistribution.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [
                                                `${value} order`,
                                                'Jumlah',
                                            ]}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bar Chart - Monthly Revenue */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Receipt className="h-4 w-4" />
                                Pendapatan Bulanan (6 Bulan Terakhir)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyRevenue}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            className="stroke-muted"
                                        />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12 }}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tickFormatter={(value) =>
                                                formatCompactCurrency(value)
                                            }
                                            tick={{ fontSize: 12 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                formatCurrency(value as number),
                                                'Pendapatan',
                                            ]}
                                        />
                                        <Bar
                                            dataKey="pendapatan"
                                            fill="#3b82f6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Line Chart - Daily Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Calendar className="h-4 w-4" />
                            Trend Order Harian (30 Hari Terakhir)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={dailyTrend}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-muted"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 10 }}
                                        tickLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        formatter={(value) => [
                                            `${value} order`,
                                            'Jumlah Order',
                                        ]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="orders"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={{ fill: '#10b981', r: 3 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
