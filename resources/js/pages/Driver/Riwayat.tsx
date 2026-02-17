import { Head, router } from '@inertiajs/react';
import { Calendar, History, Package, Wallet } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import DriverLayout from '@/layouts/DriverLayout';
import { PAYMENT_METHOD_LABELS } from '@/types/admin';
import type { DriverTask, RiwayatSummary } from '@/types/driver';
import { CUSTOMER_TYPE_LABELS } from '@/types/order';

interface Props {
    riwayat: DriverTask[];
    summary: RiwayatSummary;
    dateFilter: string | null;
}

export default function Riwayat({ riwayat, summary, dateFilter }: Props) {
    const [date, setDate] = useState(dateFilter || '');

    const handleDateFilter = () => {
        router.get('/app/riwayat', { date }, { preserveState: true });
    };

    const clearFilter = () => {
        setDate('');
        router.get('/app/riwayat', {}, { preserveState: true });
    };

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <DriverLayout>
            <Head title="Riwayat Tugas" />

            <div className="p-4 space-y-4">
                <h1 className="text-xl font-bold">Riwayat</h1>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <Card>
                        <CardContent className="p-3 text-center">
                            <Package className="h-5 w-5 mx-auto mb-1 text-primary" />
                            <p className="text-2xl font-bold">{summary.total_order}</p>
                            <p className="text-xs text-muted-foreground">Order</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-3 text-center">
                            <History className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                            <p className="text-2xl font-bold">{summary.total_volume}</p>
                            <p className="text-xs text-muted-foreground">m³</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-3 text-center">
                            <Wallet className="h-5 w-5 mx-auto mb-1 text-green-600" />
                            <p className="text-lg font-bold">
                                {formatCurrency(summary.total_cod).replace('Rp', '')}
                            </p>
                            <p className="text-xs text-muted-foreground">COD</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Date Filter */}
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Button variant="outline" onClick={handleDateFilter}>
                        Filter
                    </Button>
                    {dateFilter && (
                        <Button variant="ghost" onClick={clearFilter}>
                            Reset
                        </Button>
                    )}
                </div>

                {/* Riwayat List */}
                {riwayat.length > 0 ? (
                    <div className="space-y-3">
                        {riwayat.map((task) => (
                            <Card key={task.id}>
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-muted-foreground">
                                                    {task.order_number}
                                                </span>
                                                <Badge variant="outline" className="text-xs px-1.5 py-0">
                                                    {CUSTOMER_TYPE_LABELS[task.customer_type]}
                                                </Badge>
                                            </div>
                                            <h3 className="font-semibold truncate">
                                                {task.customer_name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">
                                                {task.customer_address}
                                            </p>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                                                <span>
                                                    {task.volume_actual} m³
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {PAYMENT_METHOD_LABELS[task.payment_method]}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {task.completed_at &&
                                                        new Date(task.completed_at).toLocaleDateString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-semibold text-primary">
                                                {formatCurrency(task.total_amount)}
                                            </p>
                                            <Badge className="mt-1 bg-green-100 text-green-800 text-xs">
                                                Selesai
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={History}
                        title="Belum ada riwayat"
                        description={
                            dateFilter
                                ? 'Tidak ada tugas selesai pada tanggal ini'
                                : 'Riwayat tugas yang sudah selesai akan muncul di sini'
                        }
                    />
                )}
            </div>
        </DriverLayout>
    );
}
