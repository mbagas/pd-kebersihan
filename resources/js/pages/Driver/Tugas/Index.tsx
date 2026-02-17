import { Head, router } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import { TaskCard } from '@/components/driver';
import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import DriverLayout from '@/layouts/DriverLayout';
import { cn } from '@/lib/utils';
import type { DriverTask, TaskFilter } from '@/types/driver';

interface Props {
    tasks: DriverTask[];
    filter: TaskFilter;
}

export default function TugasIndex({ tasks, filter }: Props) {
    const handleFilterChange = (newFilter: TaskFilter) => {
        router.get(
            '/app/tugas',
            { filter: newFilter },
            { preserveState: true },
        );
    };

    return (
        <DriverLayout>
            <Head title="Tugas Saya" />

            <div className="p-4 space-y-4">
                {/* Header with filter */}
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Tugas</h1>
                    <div className="flex gap-1 p-1 bg-muted rounded-lg">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-8 px-3 text-xs',
                                filter === 'today' &&
                                    'bg-background shadow-sm',
                            )}
                            onClick={() => handleFilterChange('today')}
                        >
                            Hari Ini
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-8 px-3 text-xs',
                                filter === 'all' && 'bg-background shadow-sm',
                            )}
                            onClick={() => handleFilterChange('all')}
                        >
                            Semua
                        </Button>
                    </div>
                </div>

                {/* Task count */}
                {tasks.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {tasks.length} tugas{' '}
                        {filter === 'today' ? 'hari ini' : 'aktif'}
                    </p>
                )}

                {/* Task list */}
                {tasks.length > 0 ? (
                    <div className="space-y-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={ClipboardList}
                        title="Tidak ada tugas"
                        description={
                            filter === 'today'
                                ? 'Belum ada tugas untuk hari ini'
                                : 'Belum ada tugas yang ditugaskan kepada Anda'
                        }
                    />
                )}
            </div>
        </DriverLayout>
    );
}
