import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Edit,
    Eye,
    Filter,
    Phone,
    Plus,
    Search,
    Trash2,
    Truck,
    User,
    Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog, DataTable, PageHeader } from '@/components/shared';
import type { Column, PaginationConfig } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem, Mitra, PaginatedResponse, Petugas } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Petugas', href: '/admin/master/petugas' },
];

interface Props {
    petugas: PaginatedResponse<Petugas>;
    mitra: Mitra[];
    filters: {
        search: string;
        mitra_id: string;
        status: string;
    };
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function PetugasIndex({ petugas, mitra, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [deleteConfirm, setDeleteConfirm] = useState<Petugas | null>(null);
    const [detailSheet, setDetailSheet] = useState<Petugas | null>(null);

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/admin/master/petugas',
            { ...filters, [key]: value, page: 1 },
            { preserveState: true },
        );
    };

    const handleSearch = () => {
        router.get(
            '/admin/master/petugas',
            { ...filters, search, page: 1 },
            { preserveState: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/master/petugas',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        router.delete(`/admin/master/petugas/${deleteConfirm.id}`, {
            onSuccess: () => {
                setDeleteConfirm(null);
                toast.success('Petugas berhasil dihapus');
            },
        });
    };

    const columns: Column<Petugas>[] = [
        {
            key: 'nama',
            header: 'Nama Petugas',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">{item.nama}</p>
                        <p className="text-xs text-muted-foreground">
                            {item.mitra?.nama}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'armada',
            header: 'Armada',
            render: (item) =>
                item.armada ? (
                    <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <div>
                            <p className="text-sm font-medium">
                                {item.armada.plat_nomor}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {item.armada.kapasitas} m³
                            </p>
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">
                        Belum ada
                    </span>
                ),
        },
        {
            key: 'kontak',
            header: 'Kontak',
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.kontak}</span>
                </div>
            ),
        },
        {
            key: 'status_aktif',
            header: 'Status',
            render: (item) => (
                <Badge
                    className={
                        item.status_aktif
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }
                >
                    {item.status_aktif ? 'Aktif' : 'Nonaktif'}
                </Badge>
            ),
        },
        {
            key: 'saldo_hutang',
            header: 'Saldo Hutang',
            render: (item) => (
                <span
                    className={
                        item.saldo_hutang > 0
                            ? 'font-medium text-red-600'
                            : 'text-muted-foreground'
                    }
                >
                    {item.saldo_hutang > 0
                        ? formatCurrency(item.saldo_hutang)
                        : '-'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (item) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDetailSheet(item)}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/master/petugas/${item.id}/edit`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setDeleteConfirm(item)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    const pagination: PaginationConfig = {
        currentPage: petugas.meta.current_page,
        totalPages: petugas.meta.last_page,
        totalItems: petugas.meta.total,
        perPage: petugas.meta.per_page,
        onPageChange: handlePageChange,
    };

    const totalDebt = petugas.data.reduce((sum, p) => sum + p.saldo_hutang, 0);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Petugas" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Petugas"
                    description="Kelola data petugas/driver"
                    actions={
                        <Button asChild>
                            <Link href="/admin/master/petugas/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Petugas
                            </Link>
                        </Button>
                    }
                />

                {/* Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Petugas
                            </CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {petugas.meta.total}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Petugas Aktif
                            </CardTitle>
                            <User className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {petugas.data.filter((p) => p.status_aktif).length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Hutang
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(totalDebt)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari nama atau kontak..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filters.mitra_id}
                                onValueChange={(v) =>
                                    handleFilterChange('mitra_id', v)
                                }
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Mitra" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Mitra
                                    </SelectItem>
                                    {mitra.map((m) => (
                                        <SelectItem
                                            key={m.id}
                                            value={m.id.toString()}
                                        >
                                            {m.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.status}
                                onValueChange={(v) =>
                                    handleFilterChange('status', v)
                                }
                            >
                                <SelectTrigger className="w-[140px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="active">Aktif</SelectItem>
                                    <SelectItem value="inactive">
                                        Nonaktif
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={handleSearch}>
                                Cari
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <DataTable
                    data={petugas.data}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    pagination={pagination}
                    emptyTitle="Belum ada data petugas"
                    emptyDescription="Tambahkan petugas baru untuk memulai"
                />
            </div>

            {/* Detail Sheet */}
            <Sheet
                open={!!detailSheet}
                onOpenChange={() => setDetailSheet(null)}
            >
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Detail Petugas</SheetTitle>
                        <SheetDescription>
                            Informasi lengkap petugas
                        </SheetDescription>
                    </SheetHeader>
                    {detailSheet && (
                        <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                    <User className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {detailSheet.nama}
                                    </h3>
                                    <Badge
                                        className={
                                            detailSheet.status_aktif
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }
                                    >
                                        {detailSheet.status_aktif
                                            ? 'Aktif'
                                            : 'Nonaktif'}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Kontak
                                    </p>
                                    <p className="font-medium">
                                        {detailSheet.kontak}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Mitra
                                    </p>
                                    <p className="font-medium">
                                        {detailSheet.mitra?.nama}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Saldo Hutang
                                    </p>
                                    <p
                                        className={`text-lg font-semibold ${detailSheet.saldo_hutang > 0 ? 'text-red-600' : ''}`}
                                    >
                                        {formatCurrency(detailSheet.saldo_hutang)}
                                    </p>
                                </div>
                            </div>

                            {/* Armada Info */}
                            <Separator />
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Armada
                                </h4>
                                {detailSheet.armada ? (
                                    <div className="flex items-center gap-3 rounded-lg border p-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <Truck className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {detailSheet.armada.plat_nomor}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Kapasitas: {detailSheet.armada.kapasitas} m³
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Belum ada armada yang di-assign
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button className="flex-1" asChild>
                                    <Link
                                        href={`/admin/master/petugas/${detailSheet.id}/edit`}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                                {detailSheet.saldo_hutang > 0 && (
                                    <Button variant="outline" asChild>
                                        <Link href="/admin/kasir">
                                            <Wallet className="mr-2 h-4 w-4" />
                                            Terima Setoran
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteConfirm}
                onOpenChange={() => setDeleteConfirm(null)}
                title="Hapus Petugas"
                description={`Apakah Anda yakin ingin menghapus petugas "${deleteConfirm?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
}
