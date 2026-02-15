import { Head, Link } from '@inertiajs/react';
import { Plus, Users } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Petugas', href: '/admin/master/petugas' },
];

export default function PetugasIndex() {
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

                <EmptyState
                    icon={Users}
                    title="Belum ada data petugas"
                    description="Tambahkan petugas baru untuk memulai"
                />
            </div>
        </AdminLayout>
    );
}
