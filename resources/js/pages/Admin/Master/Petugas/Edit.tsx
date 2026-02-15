import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import type { BreadcrumbItem, Mitra, Petugas } from '@/types';

interface Props {
    petugas: Petugas;
    mitra: Mitra[];
}

export default function PetugasEdit({ petugas, mitra }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/admin' },
        { title: 'Master Data', href: '#' },
        { title: 'Petugas', href: '/admin/master/petugas' },
        { title: petugas.nama, href: `/admin/master/petugas/${petugas.id}/edit` },
    ];

    const form = useForm({
        nama: petugas.nama,
        kontak: petugas.kontak,
        mitra_id: petugas.mitra_id.toString(),
        status_aktif: petugas.status_aktif,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(`/admin/master/petugas/${petugas.id}`, {
            onSuccess: () => {
                toast.success('Petugas berhasil diperbarui');
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${petugas.nama}`} />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Edit Petugas"
                    description={`Perbarui informasi ${petugas.nama}`}
                    actions={
                        <Button variant="outline" asChild>
                            <Link href="/admin/master/petugas">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    }
                />

                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Petugas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nama">Nama Lengkap</Label>
                                    <Input
                                        id="nama"
                                        value={form.data.nama}
                                        onChange={(e) =>
                                            form.setData('nama', e.target.value)
                                        }
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {form.errors.nama && (
                                        <p className="text-sm text-red-500">
                                            {form.errors.nama}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kontak">Nomor Telepon</Label>
                                    <Input
                                        id="kontak"
                                        value={form.data.kontak}
                                        onChange={(e) =>
                                            form.setData(
                                                'kontak',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    {form.errors.kontak && (
                                        <p className="text-sm text-red-500">
                                            {form.errors.kontak}
                                        </p>
                                    )}
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
                                    {form.errors.mitra_id && (
                                        <p className="text-sm text-red-500">
                                            {form.errors.mitra_id}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="status_aktif"
                                        checked={form.data.status_aktif}
                                        onCheckedChange={(checked) =>
                                            form.setData(
                                                'status_aktif',
                                                checked as boolean,
                                            )
                                        }
                                    />
                                    <Label htmlFor="status_aktif">
                                        Status Aktif
                                    </Label>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={form.processing}
                                    >
                                        {form.processing
                                            ? 'Menyimpan...'
                                            : 'Simpan Perubahan'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        asChild
                                    >
                                        <Link href="/admin/master/petugas">
                                            Batal
                                        </Link>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi Keuangan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Saldo Hutang
                                </p>
                                <p
                                    className={`text-2xl font-bold ${petugas.saldo_hutang > 0 ? 'text-red-600' : ''}`}
                                >
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0,
                                    }).format(petugas.saldo_hutang)}
                                </p>
                            </div>
                            {petugas.saldo_hutang > 0 && (
                                <Button variant="outline" asChild>
                                    <Link href="/admin/kasir">
                                        Terima Setoran
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
