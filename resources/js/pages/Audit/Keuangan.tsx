import { Head, router, usePage } from '@inertiajs/react';
import {
    Banknote,
    Building2,
    CreditCard,
    Download,
    Eye,
    FileSpreadsheet,
    Filter,
    Home,
    Receipt,
    Search,
    Truck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import { PageHeader } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type {
    CustomerTypeBreakdown,
    KeuanganSummary,
    MitraBreakdown,
    PaymentMethodBreakdown,
} from '@/types/audit';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Statistik', href: '/audit' },
    { title: 'Laporan Keuangan', href: '/audit/keuangan' },
];

interface Props {
    summary: KeuanganSummary;
    mitraBreakdown: MitraBreakdown[];
    customerTypeBreakdown: CustomerTypeBreakdown[];
    paymentMethodBreakdown: PaymentMethodBreakdown[];
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

export default function Keuangan({
    summary,
    mitraBreakdown,
    customerTypeBreakdown,
    paymentMethodBreakdown,
    filters,
}: Props) {
    const { auth } = usePage().props;
    const isAuditor = auth.user?.role === 'auditor';

    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: string, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/audit/keuangan', localFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Export to Excel
    const exportToExcel = () => {
        // Create workbook
        const wb = XLSX.utils.book_new();

        // Summary sheet
        const summaryData = [
            ['Laporan Keuangan'],
            [
                `Periode: ${localFilters.start_date} s/d ${localFilters.end_date}`,
            ],
            [],
            ['Ringkasan'],
            ['Total Pendapatan', summary.total_pendapatan],
            ['Total Order', summary.total_orders],
            ['Total Volume (m³)', summary.total_volume],
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Ringkasan');

        // Mitra breakdown sheet
        const mitraData = [
            ['Breakdown per Mitra'],
            [],
            ['Mitra', 'Total Order', 'Total Pendapatan', 'Total Volume (m³)'],
            ...mitraBreakdown.map((m) => [
                m.mitra_nama,
                m.total_orders,
                m.total_pendapatan,
                m.total_volume,
            ]),
        ];
        const mitraSheet = XLSX.utils.aoa_to_sheet(mitraData);
        XLSX.utils.book_append_sheet(wb, mitraSheet, 'Per Mitra');

        // Customer type breakdown sheet
        const customerData = [
            ['Breakdown per Tipe Customer'],
            [],
            ['Tipe Customer', 'Total Order', 'Total Pendapatan'],
            ...customerTypeBreakdown.map((c) => [
                c.label,
                c.total_orders,
                c.total_pendapatan,
            ]),
        ];
        const customerSheet = XLSX.utils.aoa_to_sheet(customerData);
        XLSX.utils.book_append_sheet(wb, customerSheet, 'Per Tipe Customer');

        // Payment method breakdown sheet
        const paymentData = [
            ['Breakdown per Metode Bayar'],
            [],
            ['Metode Bayar', 'Total Order', 'Total Pendapatan'],
            ...paymentMethodBreakdown.map((p) => [
                p.label,
                p.total_orders,
                p.total_pendapatan,
            ]),
        ];
        const paymentSheet = XLSX.utils.aoa_to_sheet(paymentData);
        XLSX.utils.book_append_sheet(wb, paymentSheet, 'Per Metode Bayar');

        // Download
        const fileName = `Laporan_Keuangan_${localFilters.start_date}_${localFilters.end_date}.xlsx`;
        XLSX.writeFile(wb, fileName);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Keuangan" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Laporan Keuangan"
                        description="Ringkasan pendapatan dan transaksi"
                    />
                    <div className="flex items-center gap-2">
                        {isAuditor && (
                            <Badge variant="secondary" className="gap-1.5">
                                <Eye className="h-3 w-3" />
                                Mode Auditor
                            </Badge>
                        )}
                        <Button onClick={exportToExcel} variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filter Periode
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={localFilters.start_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                    className="w-[160px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Akhir</Label>
                                <Input
                                    type="date"
                                    value={localFilters.end_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'end_date',
                                            e.target.value,
                                        )
                                    }
                                    className="w-[160px]"
                                />
                            </div>
                            <Button onClick={applyFilters}>
                                <Search className="mr-2 h-4 w-4" />
                                Terapkan
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-green-50 p-3">
                                <Receipt className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Pendapatan
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(summary.total_pendapatan)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-blue-50 p-3">
                                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Order
                                </p>
                                <p className="text-2xl font-bold">
                                    {summary.total_orders}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-lg bg-purple-50 p-3">
                                <Truck className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Volume
                                </p>
                                <p className="text-2xl font-bold">
                                    {summary.total_volume} m³
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Breakdown Tables */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Per Mitra */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Users className="h-4 w-4" />
                                Breakdown per Mitra
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mitra</TableHead>
                                        <TableHead className="text-right">
                                            Order
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Volume
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Pendapatan
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mitraBreakdown.map((mitra) => (
                                        <TableRow key={mitra.mitra_id}>
                                            <TableCell className="font-medium">
                                                {mitra.mitra_nama}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {mitra.total_orders}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {mitra.total_volume} m³
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatCurrency(
                                                    mitra.total_pendapatan,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {mitraBreakdown.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center text-muted-foreground"
                                            >
                                                Tidak ada data
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Per Tipe Customer */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Building2 className="h-4 w-4" />
                                Breakdown per Tipe Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tipe</TableHead>
                                        <TableHead className="text-right">
                                            Order
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Pendapatan
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {customerTypeBreakdown.map((ct) => (
                                        <TableRow key={ct.customer_type}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {ct.customer_type ===
                                                    'household' ? (
                                                        <Home className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                    {ct.label}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {ct.total_orders}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-green-600">
                                                {formatCurrency(
                                                    ct.total_pendapatan,
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Per Metode Bayar */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CreditCard className="h-4 w-4" />
                                Breakdown per Metode Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {paymentMethodBreakdown.map((pm) => (
                                    <div
                                        key={pm.payment_method}
                                        className="flex items-center justify-between rounded-lg border p-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`rounded-lg p-2 ${
                                                    pm.payment_method === 'cash'
                                                        ? 'bg-orange-50'
                                                        : 'bg-blue-50'
                                                }`}
                                            >
                                                {pm.payment_method ===
                                                'cash' ? (
                                                    <Banknote className="h-5 w-5 text-orange-600" />
                                                ) : (
                                                    <CreditCard className="h-5 w-5 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium">
                                                    {pm.label}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {pm.total_orders} order
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-lg font-bold text-green-600">
                                            {formatCurrency(pm.total_pendapatan)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
