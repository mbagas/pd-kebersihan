import { Head } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { EmptyState } from '@/components/shared';
import DriverLayout from '@/layouts/DriverLayout';

export default function TugasIndex() {
    return (
        <DriverLayout>
            <Head title="Tugas Saya" />

            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Tugas Hari Ini</h1>

                <EmptyState
                    icon={ClipboardList}
                    title="Tidak ada tugas"
                    description="Belum ada tugas yang ditugaskan kepada Anda"
                />
            </div>
        </DriverLayout>
    );
}
