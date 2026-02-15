import { Head } from '@inertiajs/react';
import { History } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import DriverLayout from '@/layouts/DriverLayout';

export default function Riwayat() {
    return (
        <DriverLayout>
            <Head title="Riwayat Tugas" />

            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Riwayat Tugas</h1>

                <EmptyState
                    icon={History}
                    title="Belum ada riwayat"
                    description="Riwayat tugas yang sudah selesai akan muncul di sini"
                />
            </div>
        </DriverLayout>
    );
}
