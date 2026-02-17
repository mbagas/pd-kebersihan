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
import type { BreadcrumbItem, Mitra } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Petugas', href: '/admin/master/petugas' },
    { title: 'Tambah', href: '/admin/master/petugas/create' },
];

interface Props {
    mitra: Mitra[];
}

export default function PetugasCreate({ mitra }: Props) {
    const form = useForm({
        nama: '',
        kontak: '',
        mitra_id: '',
        status_aktif: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/master/petugas', {
            onSuccess: () => {
                toast.success('Petugas berhasil ditambahkan');
            },
        });
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Petugas" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Tambah Petugas"
                    description="Masukkan informasi petugas baru"
                    actions={
                        <Button variant="outline" asChild>
                            <Link href="/admin/master/petugas">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali
                            </Link>
                        </Button>
                    }
                />

                <Card className="max-w-2xl">
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
                                        form.setData('kontak', e.target.value)
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
                                        : 'Simpan'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/admin/master/petugas">
                                        Batal
                                    </Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
