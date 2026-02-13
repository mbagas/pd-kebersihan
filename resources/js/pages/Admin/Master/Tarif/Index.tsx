import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PageHeader, EmptyState } from '@/components/shared';
import { Plus, Receipt } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Tarif', href: '/admin/master/tarif' },
];

export default function TarifIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Tarif" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Tarif"
                    description="Kelola tarif layanan"
                    actions={
                        <Button asChild>
                            <Link href="/admin/master/tarif/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Tarif
                            </Link>
                        </Button>
                    }
                />

                <EmptyState icon={Receipt} title="Belum ada data tarif" description="Tambahkan tarif baru untuk memulai" />
            </div>
        </AppLayout>
    );
}
