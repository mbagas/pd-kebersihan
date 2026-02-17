import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Banknote,
    Check,
    CreditCard,
    Eye,
    History,
    Image,
    Receipt,
    User,
    X,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog, DataTable, PageHeader } from '@/components/shared';
import type { Column } from '@/components/shared/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem, DispatchOrder, Petugas } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Kasir', href: '/admin/kasir' },
];

interface CashByPetugas {
    petugas: Petugas;
    orders: DispatchOrder[];
    total_amount: number;
}

interface SetoranHistory {
    id: number;
    petugas_id: number;
    petugas: Petugas;
    jumlah: number;
    tanggal: string;
    keterangan: string;
    order_count: number;
    created_at: string;
}

interface Props {
    transferOrders: DispatchOrder[];
    cashByPetugas: CashByPetugas[];
    setoranHistory: SetoranHistory[];
    summary: {
        pending_transfer_count: number;
        pending_transfer_amount: number;
        pending_cash_count: number;
        pending_cash_amount: number;
    };
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function Kasir({
    transferOrders,
    cashByPetugas,
    setoranHistory,
    summary,
}: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [confirmApprove, setConfirmApprove] = useState<DispatchOrder | null>(
        null,
    );
    const [confirmReject, setConfirmReject] = useState<DispatchOrder | null>(
        null,
    );
    const [confirmSetoran, setConfirmSetoran] = useState<CashByPetugas | null>(
        null,
    );
    const [processing, setProcessing] = useState(false);

    const handleApprove = () => {
        if (!confirmApprove) return;
        setProcessing(true);
        setTimeout(() => {
            toast.success(
                `Transfer ${confirmApprove.order_number} berhasil diverifikasi`,
            );
            setProcessing(false);
            setConfirmApprove(null);
        }, 1000);
    };

    const handleReject = () => {
        if (!confirmReject) return;
        setProcessing(true);
        setTimeout(() => {
            toast.error(`Transfer ${confirmReject.order_number} ditolak`);
            setProcessing(false);
            setConfirmReject(null);
        }, 1000);
    };

    const handleSetoran = () => {
        if (!confirmSetoran) return;
        setProcessing(true);
        setTimeout(() => {
            toast.success(
                `Setoran ${formatCurrency(confirmSetoran.total_amount)} dari ${confirmSetoran.petugas.nama} berhasil diterima (${confirmSetoran.orders.length} order)`,
            );
            setProcessing(false);
            setConfirmSetoran(null);
        }, 1000);
    };

    const transferColumns: Column<DispatchOrder>[] = [
        {
            key: 'order_number',
            header: 'No. Order',
            render: (order) => (
                <span className="font-mono text-sm font-medium">
                    {order.order_number}
                </span>
            ),
        },
        {
            key: 'customer_name',
            header: 'Pelanggan',
            render: (order) => (
                <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                        {order.customer_phone}
                    </p>
                </div>
            ),
        },
        {
            key: 'total_amount',
            header: 'Jumlah',
            render: (order) => (
                <span className="font-medium">
                    {formatCurrency(order.total_amount)}
                </span>
            ),
        },
        {
            key: 'bukti_transfer',
            header: 'Bukti',
            render: (order) =>
                order.bukti_transfer ? (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewImage(order.bukti_transfer!)}
                    >
                        <Image className="mr-1 h-4 w-4" />
                        Lihat
                    </Button>
                ) : (
                    <span className="text-muted-foreground">-</span>
                ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (order) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => setConfirmApprove(order)}
                    >
                        <Check className="mr-1 h-4 w-4" />
                        Approve
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => setConfirmReject(order)}
                    >
                        <X className="mr-1 h-4 w-4" />
                        Reject
                    </Button>
                </div>
            ),
        },
    ];

    const historyColumns: Column<SetoranHistory>[] = [
        {
            key: 'tanggal',
            header: 'Tanggal',
            render: (setoran) => (
                <span className="text-sm">{formatDate(setoran.created_at)}</span>
            ),
        },
        {
            key: 'petugas',
            header: 'Petugas',
            render: (setoran) => (
                <div>
                    <p className="font-medium">{setoran.petugas?.nama}</p>
                    <p className="text-xs text-muted-foreground">
                        {setoran.petugas?.mitra?.nama}
                    </p>
                </div>
            ),
        },
        {
            key: 'order_count',
            header: 'Jumlah Order',
            render: (setoran) => (
                <Badge variant="secondary">{setoran.order_count} order</Badge>
            ),
        },
        {
            key: 'jumlah',
            header: 'Total',
            render: (setoran) => (
                <span className="font-medium text-green-600">
                    {formatCurrency(setoran.jumlah)}
                </span>
            ),
        },
        {
            key: 'keterangan',
            header: 'Keterangan',
            render: (setoran) => (
                <span className="text-sm text-muted-foreground">
                    {setoran.keterangan || '-'}
                </span>
            ),
        },
    ];

    const cashColumns: Column<CashByPetugas>[] = [
        {
            key: 'petugas',
            header: 'Petugas',
            render: (item) => (
                <span className="font-medium">{item.petugas.nama}</span>
            ),
        },
        {
            key: 'mitra',
            header: 'Mitra',
            render: (item) => (
                <span className="text-muted-foreground">
                    {item.petugas.mitra?.nama || '-'}
                </span>
            ),
        },
        {
            key: 'order_count',
            header: 'Jumlah Order',
            render: (item) => (
                <Badge variant="secondary">{item.orders.length} order</Badge>
            ),
        },
        {
            key: 'total_amount',
            header: 'Total',
            render: (item) => (
                <span className="font-medium text-orange-600">
                    {formatCurrency(item.total_amount)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (item) => (
                <div className="flex justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmSetoran(item)}
                    >
                        <Eye className="mr-1 h-4 w-4" />
                        Detail & Setor
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kasir" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Kasir / Settlement"
                    description="Verifikasi pembayaran transfer dan terima setoran tunai dari petugas"
                />

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Transfer Pending
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {summary.pending_transfer_count}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatCurrency(summary.pending_transfer_amount)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Cash Belum Disetor
                            </CardTitle>
                            <Banknote className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-orange-600">
                                {summary.pending_cash_count}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formatCurrency(summary.pending_cash_amount)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Petugas dengan Cash
                            </CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {cashByPetugas.length}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                perlu setor
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Pending
                            </CardTitle>
                            <Receipt className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(
                                    summary.pending_transfer_amount +
                                        summary.pending_cash_amount,
                                )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                belum masuk kas
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="transfer">
                    <TabsList>
                        <TabsTrigger value="transfer" className="gap-2">
                            <CreditCard className="h-4 w-4" />
                            Verifikasi Transfer
                            {transferOrders.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {transferOrders.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="cash" className="gap-2">
                            <Banknote className="h-4 w-4" />
                            Setoran Tunai
                            {cashByPetugas.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {cashByPetugas.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-4 w-4" />
                            Riwayat
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transfer" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Transfer Menunggu Verifikasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={transferOrders}
                                    columns={transferColumns}
                                    keyExtractor={(order) => order.id}
                                    emptyTitle="Tidak ada transfer pending"
                                    emptyDescription="Semua transfer sudah diverifikasi"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="cash" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Cash yang Perlu Disetor
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={cashByPetugas}
                                    columns={cashColumns}
                                    keyExtractor={(item) => item.petugas.id}
                                    emptyTitle="Tidak ada cash yang perlu disetor"
                                    emptyDescription="Semua setoran tunai sudah diterima"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Riwayat Setoran
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <DataTable
                                    data={setoranHistory}
                                    columns={historyColumns}
                                    keyExtractor={(setoran) => setoran.id}
                                    emptyTitle="Belum ada riwayat"
                                    emptyDescription="Belum ada setoran yang tercatat"
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Image Preview Dialog */}
            <Dialog
                open={!!previewImage}
                onOpenChange={() => setPreviewImage(null)}
            >
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Bukti Transfer</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                        {previewImage && (
                            <div className="text-center">
                                <div className="mb-4 flex h-64 w-full items-center justify-center rounded-lg bg-muted-foreground/10">
                                    <Image className="h-16 w-16 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Preview: {previewImage}
                                </p>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Approve Confirmation */}
            <ConfirmDialog
                open={!!confirmApprove}
                onOpenChange={() => setConfirmApprove(null)}
                title="Verifikasi Transfer"
                description={`Apakah Anda yakin transfer untuk order ${confirmApprove?.order_number} sebesar ${confirmApprove ? formatCurrency(confirmApprove.total_amount) : ''} sudah valid?`}
                confirmLabel="Approve"
                onConfirm={handleApprove}
                loading={processing}
            />

            {/* Reject Confirmation */}
            <ConfirmDialog
                open={!!confirmReject}
                onOpenChange={() => setConfirmReject(null)}
                title="Tolak Transfer"
                description={`Apakah Anda yakin ingin menolak transfer untuk order ${confirmReject?.order_number}? Customer akan diminta upload ulang bukti transfer.`}
                confirmLabel="Tolak"
                variant="destructive"
                onConfirm={handleReject}
                loading={processing}
            />

            {/* Setoran Confirmation */}
            <Dialog
                open={!!confirmSetoran}
                onOpenChange={() => setConfirmSetoran(null)}
            >
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Konfirmasi Setoran</DialogTitle>
                        <DialogDescription>
                            Pastikan Anda sudah menerima uang tunai dari petugas
                        </DialogDescription>
                    </DialogHeader>
                    {confirmSetoran && (
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-3 rounded-lg bg-muted p-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                                    <User className="h-6 w-6 text-orange-600" />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {confirmSetoran.petugas.nama}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {confirmSetoran.petugas.mitra?.nama}
                                    </p>
                                </div>
                            </div>
                            <div className="rounded-lg border">
                                <div className="border-b p-3">
                                    <p className="text-sm font-medium">
                                        Detail Order ({confirmSetoran.orders.length})
                                    </p>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {confirmSetoran.orders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between border-b p-3 last:border-b-0"
                                        >
                                            <div>
                                                <p className="font-mono text-sm">
                                                    {order.order_number}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {order.customer_name}
                                                </p>
                                            </div>
                                            <p className="font-medium">
                                                {formatCurrency(order.total_amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between p-3">
                                    <span className="font-medium">Total Setoran</span>
                                    <span className="text-lg font-bold text-green-600">
                                        {formatCurrency(confirmSetoran.total_amount)}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Dengan menekan tombol konfirmasi, Anda menyatakan
                                telah menerima uang tunai sebesar{' '}
                                <span className="font-medium">
                                    {formatCurrency(confirmSetoran.total_amount)}
                                </span>{' '}
                                dari {confirmSetoran.petugas.nama}.
                            </p>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmSetoran(null)}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSetoran} disabled={processing}>
                            {processing ? 'Memproses...' : 'Konfirmasi Terima'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
