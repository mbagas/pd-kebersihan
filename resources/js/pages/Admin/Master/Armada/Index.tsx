import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Filter, Plus, Search, Trash2, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog, DataTable, PageHeader } from '@/components/shared';
import type { Column, PaginationConfig } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AdminLayout from '@/layouts/AdminLayout';
import type { Armada, BreadcrumbItem, Mitra, PaginatedResponse } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Armada', href: '/admin/master/armada' },
];

interface Props {
    armada: PaginatedResponse<Armada>;
    mitra: Mitra[];
    filters: {
        search: string;
        status: string;
    };
}

const STATUS_LABELS: Record<string, string> = {
    available: 'Tersedia',
    in_use: 'Digunakan',
    maintenance: 'Maintenance',
};

const STATUS_COLORS: Record<string, string> = {
    available: 'bg-green-100 text-green-800',
    in_use: 'bg-blue-100 text-blue-800',
    maintenance: 'bg-yellow-100 text-yellow-800',
};

export default function ArmadaIndex({ armada, mitra, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingArmada, setEditingArmada] = useState<Armada | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Armada | null>(null);

    const form = useForm({
        plat_nomor: '',
        kapasitas: 6,
        status: 'available' as 'available' | 'in_use' | 'maintenance',
        mitra_id: '',
    });

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/admin/master/armada',
            { ...filters, [key]: value, page: 1 },
            { preserveState: true },
        );
    };

    const handleSearch = () => {
        router.get(
            '/admin/master/armada',
            { ...filters, search, page: 1 },
            { preserveState: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/master/armada',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openCreateModal = () => {
        setEditingArmada(null);
        form.reset();
        setModalOpen(true);
    };

    const openEditModal = (item: Armada) => {
        setEditingArmada(item);
        form.setData({
            plat_nomor: item.plat_nomor,
            kapasitas: item.kapasitas,
            status: item.status,
            mitra_id: item.mitra_id?.toString() || '',
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingArmada) {
            form.put(`/admin/master/armada/${editingArmada.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    toast.success('Armada berhasil diperbarui');
                },
            });
        } else {
            form.post('/admin/master/armada', {
                onSuccess: () => {
                    setModalOpen(false);
                    toast.success('Armada berhasil ditambahkan');
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        router.delete(`/admin/master/armada/${deleteConfirm.id}`, {
            onSuccess: () => {
                setDeleteConfirm(null);
                toast.success('Armada berhasil dihapus');
            },
        });
    };

    const columns: Column<Armada>[] = [
        {
            key: 'plat_nomor',
            header: 'Plat Nomor',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Truck className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-mono font-medium">
                        {item.plat_nomor}
                    </span>
                </div>
            ),
        },
        {
            key: 'kapasitas',
            header: 'Kapasitas',
            render: (item) => <span>{item.kapasitas} m³</span>,
        },
        {
            key: 'mitra',
            header: 'Mitra',
            render: (item) => (
                <span className="text-sm">
                    {item.mitra?.nama || '-'}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (item) => (
                <Badge className={STATUS_COLORS[item.status]}>
                    {STATUS_LABELS[item.status]}
                </Badge>
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
                        onClick={() => openEditModal(item)}
                    >
                        <Edit className="h-4 w-4" />
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
        currentPage: armada.meta.current_page,
        totalPages: armada.meta.last_page,
        totalItems: armada.meta.total,
        perPage: armada.meta.per_page,
        onPageChange: handlePageChange,
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Armada" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Armada"
                    description="Kelola data armada/kendaraan"
                    actions={
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Armada
                        </Button>
                    }
                />

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
                                    placeholder="Cari plat nomor..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Select
                                value={filters.status}
                                onValueChange={(v) =>
                                    handleFilterChange('status', v)
                                }
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="available">
                                        Tersedia
                                    </SelectItem>
                                    <SelectItem value="in_use">
                                        Digunakan
                                    </SelectItem>
                                    <SelectItem value="maintenance">
                                        Maintenance
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
                    data={armada.data}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    pagination={pagination}
                    emptyTitle="Belum ada data armada"
                    emptyDescription="Tambahkan armada baru untuk memulai"
                />
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingArmada ? 'Edit Armada' : 'Tambah Armada'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingArmada
                                ? 'Perbarui informasi armada'
                                : 'Masukkan informasi armada baru'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Plat Nomor</Label>
                                <Input
                                    value={form.data.plat_nomor}
                                    onChange={(e) =>
                                        form.setData(
                                            'plat_nomor',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="B 1234 ABC"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Kapasitas (m³)</Label>
                                <Input
                                    type="number"
                                    value={form.data.kapasitas}
                                    onChange={(e) =>
                                        form.setData(
                                            'kapasitas',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    min={1}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Mitra</Label>
                                <Select
                                    value={form.data.mitra_id}
                                    onValueChange={(v) =>
                                        form.setData('mitra_id', v)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih mitra" />
                                    </SelectTrigger>
                                    <SelectContent>
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
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={form.data.status}
                                    onValueChange={(v) =>
                                        form.setData(
                                            'status',
                                            v as
                                                | 'available'
                                                | 'in_use'
                                                | 'maintenance',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">
                                            Tersedia
                                        </SelectItem>
                                        <SelectItem value="in_use">
                                            Digunakan
                                        </SelectItem>
                                        <SelectItem value="maintenance">
                                            Maintenance
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setModalOpen(false)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing
                                    ? 'Menyimpan...'
                                    : editingArmada
                                      ? 'Simpan'
                                      : 'Tambah'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!deleteConfirm}
                onOpenChange={() => setDeleteConfirm(null)}
                title="Hapus Armada"
                description={`Apakah Anda yakin ingin menghapus armada "${deleteConfirm?.plat_nomor}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
}
