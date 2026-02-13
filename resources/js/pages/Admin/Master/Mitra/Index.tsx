import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { PageHeader, EmptyState } from '@/components/shared';
import { Plus, Building } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Master Data', href: '#' },
    { title: 'Mitra', href: '/admin/master/mitra' },
];

export default function MitraIndex() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Master Mitra" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Data Mitra"
                    description="Kelola data mitra/partner"
                    actions={
                        <Button asChild>
                            <Link href="/admin/master/mitra/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Tambah Mitra
                            </Link>
                        </Button>
                    }
                />

                <EmptyState icon={Building} title="Belum ada data mitra" description="Tambahkan mitra baru untuk memulai" />
            </div>
        </AppLayout>
    );
}
