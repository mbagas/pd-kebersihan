import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Edit, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { DataTable, PageHeader } from '@/components/shared';
import type { Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem, Tarif } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Tarif', href: '/admin/master/tarif' },
];

interface Props {
    tarif: Tarif[];
}

const TIPE_LABELS: Record<string, string> = {
    household: 'Rumah Tangga',
    institution: 'Instansi',
};

const TIPE_COLORS: Record<string, string> = {
    household: 'bg-blue-100 text-blue-800',
    institution: 'bg-purple-100 text-purple-800',
};

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function TarifIndex({ tarif }: Props) {
    const [editingTarif, setEditingTarif] = useState<Tarif | null>(null);

    const form = useForm({
        harga_per_m3: 0,
        keterangan: '',
    });

    const openEditModal = (item: Tarif) => {
        setEditingTarif(item);
        form.setData({
            harga_per_m3: item.harga_per_m3,
            keterangan: item.keterangan || '',
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTarif) return;
        form.put(`/admin/master/tarif/${editingTarif.id}`, {
            onSuccess: () => {
                setEditingTarif(null);
                toast.success('Tarif berhasil diperbarui');
            },
        });
    };

    const columns: Column<Tarif>[] = [
        {
            key: 'tipe_customer',
            header: 'Tipe Customer',
            render: (item) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Badge className={TIPE_COLORS[item.tipe_customer]}>
                        {TIPE_LABELS[item.tipe_customer]}
                    </Badge>
                </div>
            ),
        },
        {
            key: 'harga_per_m3',
            header: 'Harga per m³',
            render: (item) => (
                <span className="text-lg font-semibold text-green-600">
                    {formatCurrency(item.harga_per_m3)}
                </span>
            ),
        },
        {
            key: 'keterangan',
            header: 'Keterangan',
            render: (item) => (
                <span className="text-sm text-muted-foreground">
                    {item.keterangan || '-'}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (item) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(item)}
                >
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Tarif" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Tarif"
                    description="Kelola tarif layanan per tipe customer"
                />

                {/* Table */}
                <DataTable
                    data={tarif}
                    columns={columns}
                    keyExtractor={(item) => item.id}
                    emptyTitle="Belum ada data tarif"
                    emptyDescription="Data tarif belum tersedia"
                />
            </div>

            {/* Edit Modal */}
            <Dialog
                open={!!editingTarif}
                onOpenChange={() => setEditingTarif(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Tarif</DialogTitle>
                        <DialogDescription>
                            Perbarui tarif untuk{' '}
                            {editingTarif &&
                                TIPE_LABELS[editingTarif.tipe_customer]}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Harga per m³</Label>
                                <Input
                                    type="number"
                                    value={form.data.harga_per_m3}
                                    onChange={(e) =>
                                        form.setData(
                                            'harga_per_m3',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    min={0}
                                    step={1000}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Keterangan (Opsional)</Label>
                                <Input
                                    value={form.data.keterangan}
                                    onChange={(e) =>
                                        form.setData(
                                            'keterangan',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Keterangan tarif"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setEditingTarif(null)}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
