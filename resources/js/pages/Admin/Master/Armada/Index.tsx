import { Head, Link } from '@inertiajs/react';
import { Plus, Truck } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Armada', href: '/admin/master/armada' },
];

export default function ArmadaIndex() {
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Armada" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Armada"
                    description="Kelola data armada/kendaraan"
                    actions={
                        <Button asChild>
                            <Link href="/admin/master/armada/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Armada
                            </Link>
                        </Button>
                    }
                />

                <EmptyState
                    icon={Truck}
                    title="Belum ada data armada"
                    description="Tambahkan armada baru untuk memulai"
                />
            </div>
        </AdminLayout>
    );
}
