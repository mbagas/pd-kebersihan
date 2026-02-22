import { Head, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileSearch,
    Filter,
    Image,
    MapPin,
    Search,
    Truck,
    XCircle,
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PaginatedResponse } from '@/types';
import type { AuditOrder, TrailFilters } from '@/types/audit';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Statistik', href: '/audit' },
    { title: 'Audit Trail', href: '/audit/trail' },
];

interface Props {
    orders: PaginatedResponse<AuditOrder>;
    filters: TrailFilters;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    on_the_way: 'bg-violet-100 text-violet-800',
    arrived: 'bg-indigo-100 text-indigo-800',
    processing: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Ditugaskan',
    on_the_way: 'Dalam Perjalanan',
    arrived: 'Tiba di Lokasi',
    processing: 'Diproses',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
};

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
    household: 'Rumah Tangga',
    institution: 'Instansi',
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
        year: 'numeric',
    });
}

function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}


function OrderRow({ order }: { order: AuditOrder }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setIsOpen(!isOpen)}>
                <TableCell>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">
                    {order.order_number}
                </TableCell>
                <TableCell className="text-sm">
                    {formatDate(order.created_at)}
                </TableCell>
                <TableCell>
                    <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">
                            {CUSTOMER_TYPE_LABELS[order.customer_type]}
                        </p>
                    </div>
                </TableCell>
                <TableCell>
                    {order.petugas_nama ? (
                        <div>
                            <p className="font-medium">{order.petugas_nama}</p>
                            <p className="text-xs text-muted-foreground">
                                {order.mitra_nama}
                            </p>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">-</span>
                    )}
                </TableCell>
                <TableCell className="text-right">{order.volume} m³</TableCell>
                <TableCell className="text-right font-medium text-green-600">
                    {formatCurrency(order.total_amount)}
                </TableCell>
                <TableCell>
                    <Badge className={STATUS_COLORS[order.status]}>
                        {STATUS_LABELS[order.status]}
                    </Badge>
                </TableCell>
            </TableRow>
            {isOpen && (
                <TableRow className="bg-muted/30">
                    <TableCell colSpan={8} className="p-0">
                        <div className="p-4">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <Image className="h-4 w-4" />
                                        Foto Bukti
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">Before</p>
                                            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                                                {order.foto_before ? (
                                                    <Image className="h-8 w-8 text-muted-foreground" />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Tidak ada</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground">After</p>
                                            <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                                                {order.foto_after ? (
                                                    <Image className="h-8 w-8 text-muted-foreground" />
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Tidak ada</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <Clock className="h-4 w-4" />
                                        Log Waktu
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`h-2 w-2 rounded-full ${order.timeline.assigned_at ? 'bg-blue-500' : 'bg-gray-300'}`} />
                                            <span className="text-muted-foreground">Ditugaskan:</span>
                                            <span>{order.timeline.assigned_at ? formatDateTime(order.timeline.assigned_at) : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`h-2 w-2 rounded-full ${order.timeline.arrived_at ? 'bg-purple-500' : 'bg-gray-300'}`} />
                                            <span className="text-muted-foreground">Tiba:</span>
                                            <span>{order.timeline.arrived_at ? formatDateTime(order.timeline.arrived_at) : '-'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`h-2 w-2 rounded-full ${order.timeline.completed_at ? 'bg-green-500' : 'bg-gray-300'}`} />
                                            <span className="text-muted-foreground">Selesai:</span>
                                            <span>{order.timeline.completed_at ? formatDateTime(order.timeline.completed_at) : '-'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="flex items-center gap-2 text-sm font-semibold">
                                        <MapPin className="h-4 w-4" />
                                        Validasi GPS
                                    </h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            {order.gps_validated ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                                    Tervalidasi
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-800">
                                                    <XCircle className="mr-1 h-3 w-3" />
                                                    Belum Validasi
                                                </Badge>
                                            )}
                                        </div>
                                        {order.latitude && order.longitude && (
                                            <p className="text-xs text-muted-foreground">
                                                {order.latitude.toFixed(6)}, {order.longitude.toFixed(6)}
                                            </p>
                                        )}
                                    </div>
                                    {order.armada_plat && (
                                        <div className="mt-4">
                                            <h4 className="flex items-center gap-2 text-sm font-semibold">
                                                <Truck className="h-4 w-4" />
                                                Armada
                                            </h4>
                                            <p className="mt-1 text-sm">{order.armada_plat}</p>
                                        </div>
                                    )}
                                    {order.notes && (
                                        <div className="mt-4">
                                            <h4 className="text-sm font-semibold">Catatan</h4>
                                            <p className="mt-1 text-sm text-muted-foreground">{order.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}


function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
            >
                Sebelumnya
            </Button>
            <span className="text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages}
            </span>
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
            >
                Selanjutnya
            </Button>
        </div>
    );
}

export default function Trail({ orders, filters }: Props) {
    const { auth } = usePage().props;
    const isAuditor = auth.user?.role === 'auditor';
    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: keyof TrailFilters, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/audit/trail', { ...localFilters, page: 1 }, { preserveState: true, preserveScroll: true });
    };

    const handlePageChange = (page: number) => {
        router.get('/audit/trail', { ...filters, page }, { preserveState: true, preserveScroll: true });
    };

    const resetFilters = () => {
        const defaultFilters = {
            search: '',
            status: 'all',
            customer_type: 'all',
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
        };
        setLocalFilters(defaultFilters);
        router.get('/audit/trail', defaultFilters, { preserveState: true, preserveScroll: true });
    };

    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const data = [
            ['No Tiket', 'Tanggal', 'Customer', 'Tipe', 'Alamat', 'Telepon', 'Petugas', 'Mitra', 'Armada', 'Volume (m³)', 'Total', 'Status', 'Metode Bayar', 'GPS Valid', 'Waktu Assign', 'Waktu Tiba', 'Waktu Selesai'],
            ...orders.data.map((o) => [
                o.order_number,
                formatDate(o.created_at),
                o.customer_name,
                CUSTOMER_TYPE_LABELS[o.customer_type],
                o.customer_address,
                o.customer_phone,
                o.petugas_nama || '-',
                o.mitra_nama || '-',
                o.armada_plat || '-',
                o.volume,
                o.total_amount,
                STATUS_LABELS[o.status],
                o.payment_method === 'cash' ? 'Tunai' : 'Transfer',
                o.gps_validated ? 'Ya' : 'Tidak',
                o.timeline.assigned_at ? formatDateTime(o.timeline.assigned_at) : '-',
                o.timeline.arrived_at ? formatDateTime(o.timeline.arrived_at) : '-',
                o.timeline.completed_at ? formatDateTime(o.timeline.completed_at) : '-',
            ]),
        ];
        const sheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, sheet, 'Audit Trail');
        XLSX.writeFile(wb, `Audit_Trail_${localFilters.start_date}_${localFilters.end_date}.xlsx`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Trail" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <PageHeader title="Audit Trail" description="Riwayat detail semua order" />
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

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filter & Pencarian
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="min-w-[200px] flex-1 space-y-2">
                                <Label>Cari</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input placeholder="No tiket, nama, alamat..." value={localFilters.search} onChange={(e) => handleFilterChange('search', e.target.value)} className="pl-9" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input type="date" value={localFilters.start_date} onChange={(e) => handleFilterChange('start_date', e.target.value)} className="w-[140px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Akhir</Label>
                                <Input type="date" value={localFilters.end_date} onChange={(e) => handleFilterChange('end_date', e.target.value)} className="w-[140px]" />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={localFilters.status} onValueChange={(v) => handleFilterChange('status', v)}>
                                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="assigned">Ditugaskan</SelectItem>
                                        <SelectItem value="on_the_way">Dalam Perjalanan</SelectItem>
                                        <SelectItem value="arrived">Tiba</SelectItem>
                                        <SelectItem value="processing">Diproses</SelectItem>
                                        <SelectItem value="done">Selesai</SelectItem>
                                        <SelectItem value="cancelled">Dibatalkan</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipe</Label>
                                <Select value={localFilters.customer_type} onValueChange={(v) => handleFilterChange('customer_type', v)}>
                                    <SelectTrigger className="w-[140px]"><SelectValue placeholder="Tipe" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="household">Rumah Tangga</SelectItem>
                                        <SelectItem value="institution">Instansi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={applyFilters}><Search className="mr-2 h-4 w-4" />Cari</Button>
                                <Button variant="outline" onClick={resetFilters}>Reset</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Menampilkan {orders.data.length} dari {orders.meta.total} order</p>
                </div>

                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10"></TableHead>
                                    <TableHead>No Tiket</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Petugas (Mitra)</TableHead>
                                    <TableHead className="text-right">Volume</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length > 0 ? (
                                    orders.data.map((order) => <OrderRow key={order.id} order={order} />)
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-32 text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <FileSearch className="h-8 w-8 text-muted-foreground" />
                                                <p className="text-muted-foreground">Tidak ada data yang sesuai filter</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {orders.meta.last_page > 1 && (
                    <Pagination currentPage={orders.meta.current_page} totalPages={orders.meta.last_page} onPageChange={handlePageChange} />
                )}
            </div>
        </AppLayout>
    );
}
