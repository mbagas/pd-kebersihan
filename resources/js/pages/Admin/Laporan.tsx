import { Head, router } from '@inertiajs/react';
import {
    Building,
    Calendar,
    Download,
    FileSpreadsheet,
    Package,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { DataTable, PageHeader } from '@/components/shared';
import type { Column } from '@/components/shared/DataTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem, DispatchOrder, Mitra } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Laporan', href: '/admin/laporan' },
];

interface MitraBreakdown {
    mitra: Mitra;
    total_orders: number;
    total_revenue: number;
    total_volume: number;
}

interface Props {
    summary: {
        total_orders: number;
        total_revenue: number;
        total_volume: number;
    };
    mitraBreakdown: MitraBreakdown[];
    orders: DispatchOrder[];
    filters: {
        start_date: string;
        end_date: string;
    };
}

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
        year: 'numeric',
    });
}

export default function Laporan({
    summary,
    mitraBreakdown,
    orders,
    filters,
}: Props) {
    const [startDate, setStartDate] = useState(filters.start_date);
    const [endDate, setEndDate] = useState(filters.end_date);
    const [exporting, setExporting] = useState(false);

    const handleFilter = () => {
        router.get(
            '/admin/laporan',
            { start_date: startDate, end_date: endDate },
            { preserveState: true },
        );
    };

    const handleExport = () => {
        setExporting(true);
        // Simulate export
        setTimeout(() => {
            toast.success('Laporan berhasil diexport');
            setExporting(false);
        }, 1500);
    };

    const mitraColumns: Column<MitraBreakdown>[] = [
        {
            key: 'mitra',
            header: 'Mitra',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Building className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">{item.mitra.nama}</p>
                        <p className="text-xs capitalize text-muted-foreground">
                            {item.mitra.tipe}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'total_orders',
            header: 'Total Order',
            render: (item) => (
                <span className="font-medium">{item.total_orders}</span>
            ),
        },
        {
            key: 'total_volume',
            header: 'Volume',
            render: (item) => <span>{item.total_volume} m³</span>,
        },
        {
            key: 'total_revenue',
            header: 'Pendapatan',
            render: (item) => (
                <span className="font-medium text-green-600">
                    {formatCurrency(item.total_revenue)}
                </span>
            ),
        },
    ];

    const orderColumns: Column<DispatchOrder>[] = [
        {
            key: 'order_number',
            header: 'No. Order',
            render: (order) => (
                <span className="font-mono text-sm">{order.order_number}</span>
            ),
        },
        {
            key: 'customer_name',
            header: 'Pelanggan',
            render: (order) => order.customer_name,
        },
        {
            key: 'volume',
            header: 'Volume',
            render: (order) => `${order.volume} m³`,
        },
        {
            key: 'total_amount',
            header: 'Total',
            render: (order) => formatCurrency(order.total_amount),
        },
        {
            key: 'completed_at',
            header: 'Selesai',
            render: (order) =>
                order.completed_at ? formatDate(order.completed_at) : '-',
        },
        {
            key: 'petugas',
            header: 'Petugas',
            render: (order) => order.petugas?.nama || '-',
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Laporan"
                    description="Lihat dan export laporan operasional"
                    actions={
                        <Button onClick={handleExport} disabled={exporting}>
                            <Download className="mr-2 h-4 w-4" />
                            {exporting ? 'Mengexport...' : 'Export Excel'}
                        </Button>
                    }
                />

                {/* Filter */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Calendar className="h-4 w-4" />
                            Filter Periode
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-[180px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Akhir</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-[180px]"
                                />
                            </div>
                            <Button onClick={handleFilter}>Terapkan</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Order Selesai
                            </CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {summary.total_orders}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Pendapatan
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(summary.total_revenue)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Volume
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {summary.total_volume} m³
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown per Mitra */}
                <Card>
                    <CardHeader>
                        <CardTitle>Breakdown per Mitra</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={mitraBreakdown}
                            columns={mitraColumns}
                            keyExtractor={(item) => item.mitra.id}
                            emptyTitle="Tidak ada data"
                            emptyDescription="Tidak ada order pada periode ini"
                        />
                    </CardContent>
                </Card>

                {/* Detail Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DataTable
                            data={orders}
                            columns={orderColumns}
                            keyExtractor={(order) => order.id}
                            emptyTitle="Tidak ada order"
                            emptyDescription="Tidak ada order selesai pada periode ini"
                        />
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
