import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Building, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog, DataTable, PageHeader } from '@/components/shared';
import type { Column, PaginationConfig } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import type { BreadcrumbItem, Mitra, PaginatedResponse } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Mitra', href: '/admin/master/mitra' },
];

interface Props {
    mitra: PaginatedResponse<Mitra>;
    filters: {
        search: string;
    };
}

const TIPE_LABELS: Record<string, string> = {
    internal: 'Internal',
    external: 'External',
};

const TIPE_COLORS: Record<string, string> = {
    internal: 'bg-blue-100 text-blue-800',
    external: 'bg-green-100 text-green-800',
};

export default function MitraIndex({ mitra, filters }: Props) {
    const [search, setSearch] = useState(filters.search);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingMitra, setEditingMitra] = useState<Mitra | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Mitra | null>(null);

    const form = useForm({
        nama: '',
        tipe: 'internal' as 'internal' | 'external',
        kontak: '',
        alamat: '',
    });

    const handleSearch = () => {
        router.get(
            '/admin/master/mitra',
            { search, page: 1 },
            { preserveState: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/master/mitra',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    const openCreateModal = () => {
        setEditingMitra(null);
        form.reset();
        setModalOpen(true);
    };

    const openEditModal = (item: Mitra) => {
        setEditingMitra(item);
        form.setData({
            nama: item.nama,
            tipe: item.tipe,
            kontak: item.kontak,
            alamat: item.alamat || '',
        });
        setModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMitra) {
            form.put(`/admin/master/mitra/${editingMitra.id}`, {
                onSuccess: () => {
                    setModalOpen(false);
                    toast.success('Mitra berhasil diperbarui');
                },
            });
        } else {
            form.post('/admin/master/mitra', {
                onSuccess: () => {
                    setModalOpen(false);
                    toast.success('Mitra berhasil ditambahkan');
                },
            });
        }
    };

    const handleDelete = () => {
        if (!deleteConfirm) return;
        router.delete(`/admin/master/mitra/${deleteConfirm.id}`, {
            onSuccess: () => {
                setDeleteConfirm(null);
                toast.success('Mitra berhasil dihapus');
            },
        });
    };

    const columns: Column<Mitra>[] = [
        {
            key: 'nama',
            header: 'Nama Mitra',
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Building className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">{item.nama}</p>
                        <p className="text-xs text-muted-foreground">
                            {item.alamat || '-'}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'tipe',
            header: 'Tipe',
            render: (item) => (
                <Badge className={TIPE_COLORS[item.tipe]}>
                    {TIPE_LABELS[item.tipe]}
                </Badge>
            ),
        },
        {
            key: 'kontak',
            header: 'Kontak',
            render: (item) => <span className="text-sm">{item.kontak}</span>,
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
        currentPage: mitra.meta.current_page,
        totalPages: mitra.meta.last_page,
        totalItems: mitra.meta.total,
        perPage: mitra.meta.per_page,
        onPageChange: handlePageChange,
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Mitra" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Mitra"
                    description="Kelola data mitra/partner"
                    actions={
                        <Button onClick={openCreateModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah Mitra
                        </Button>
                    }
                />

                {/* Search */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Cari mitra..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Button variant="outline" onClick={handleSearch}>
                                Cari
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <DataTable
                    data={mitra.data}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    pagination={pagination}
                    emptyTitle="Belum ada data mitra"
                    emptyDescription="Tambahkan mitra baru untuk memulai"
                />
            </div>

            {/* Create/Edit Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingMitra ? 'Edit Mitra' : 'Tambah Mitra'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMitra
                                ? 'Perbarui informasi mitra'
                                : 'Masukkan informasi mitra baru'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nama Mitra</Label>
                                <Input
                                    value={form.data.nama}
                                    onChange={(e) =>
                                        form.setData('nama', e.target.value)
                                    }
                                    placeholder="Masukkan nama mitra"
                                />
                                {form.errors.nama && (
                                    <p className="text-sm text-red-500">
                                        {form.errors.nama}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Tipe</Label>
                                <Select
                                    value={form.data.tipe}
                                    onValueChange={(v) =>
                                        form.setData(
                                            'tipe',
                                            v as 'internal' | 'external',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="internal">
                                            Internal
                                        </SelectItem>
                                        <SelectItem value="external">
                                            External
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Kontak</Label>
                                <Input
                                    value={form.data.kontak}
                                    onChange={(e) =>
                                        form.setData('kontak', e.target.value)
                                    }
                                    placeholder="Nomor telepon"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Alamat (Opsional)</Label>
                                <Input
                                    value={form.data.alamat}
                                    onChange={(e) =>
                                        form.setData('alamat', e.target.value)
                                    }
                                    placeholder="Alamat mitra"
                                />
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
                                    : editingMitra
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
                title="Hapus Mitra"
                description={`Apakah Anda yakin ingin menghapus mitra "${deleteConfirm?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </AdminLayout>
    );
}
