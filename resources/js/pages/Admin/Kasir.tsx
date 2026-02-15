import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Check,
    CreditCard,
    Eye,
    History,
    Image,
    User,
    Wallet,
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminLayout from '@/layouts/AdminLayout';
import type { BreadcrumbItem, DispatchOrder, Petugas, Setoran } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Kasir', href: '/admin/kasir' },
];

interface Props {
    transferOrders: DispatchOrder[];
    petugasWithDebt: Petugas[];
    setoranHistory: Setoran[];
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
    petugasWithDebt,
    setoranHistory,
}: Props) {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [confirmApprove, setConfirmApprove] = useState<DispatchOrder | null>(
        null,
    );
    const [confirmReject, setConfirmReject] = useState<DispatchOrder | null>(
        null,
    );
    const [setoranModal, setSetoranModal] = useState<Petugas | null>(null);
    const [setoranAmount, setSetoranAmount] = useState('');
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
        if (!setoranModal || !setoranAmount) return;
        const amount = parseInt(setoranAmount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('Masukkan jumlah yang valid');
            return;
        }
        if (amount > setoranModal.saldo_hutang) {
            toast.error('Jumlah melebihi saldo hutang');
            return;
        }
        setProcessing(true);
        setTimeout(() => {
            toast.success(
                `Setoran ${formatCurrency(amount)} dari ${setoranModal.nama} berhasil diterima`,
            );
            setProcessing(false);
            setSetoranModal(null);
            setSetoranAmount('');
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

    const petugasColumns: Column<Petugas>[] = [
        {
            key: 'nama',
            header: 'Petugas',
            render: (petugas) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="font-medium">{petugas.nama}</p>
                        <p className="text-xs text-muted-foreground">
                            {petugas.mitra?.nama}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: 'kontak',
            header: 'Kontak',
            render: (petugas) => (
                <span className="text-sm">{petugas.kontak}</span>
            ),
        },
        {
            key: 'saldo_hutang',
            header: 'Saldo Hutang',
            render: (petugas) => (
                <span className="font-medium text-red-600">
                    {formatCurrency(petugas.saldo_hutang)}
                </span>
            ),
        },
        {
            key: 'actions',
            header: 'Aksi',
            className: 'text-right',
            render: (petugas) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSetoranModal(petugas)}
                >
                    <Wallet className="mr-1 h-4 w-4" />
                    Terima Setoran
                </Button>
            ),
        },
    ];

    const historyColumns: Column<Setoran>[] = [
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
            key: 'jumlah',
            header: 'Jumlah',
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

    const totalDebt = petugasWithDebt.reduce((sum, p) => sum + p.saldo_hutang, 0);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Kasir" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Kasir / Settlement"
                    description="Verifikasi pembayaran dan kelola setoran petugas"
                />

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Transfer Pending
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {transferOrders.length}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Hutang Petugas
                            </CardTitle>
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(totalDebt)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Petugas dengan Hutang
                            </CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {petugasWithDebt.length}
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
                        <TabsTrigger value="setoran" className="gap-2">
                            <Wallet className="h-4 w-4" />
                            Setoran Tunai
                            {petugasWithDebt.length > 0 && (
                                <Badge variant="secondary" className="ml-1">
                                    {petugasWithDebt.length}
                                </Badge>
                            )}
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <History className="h-4 w-4" />
                            Riwayat
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transfer" className="mt-4">
                        <DataTable
                            data={transferOrders}
                            columns={transferColumns}
                            keyExtractor={(order) => order.id}
                            emptyTitle="Tidak ada transfer pending"
                            emptyDescription="Semua transfer sudah diverifikasi"
                        />
                    </TabsContent>

                    <TabsContent value="setoran" className="mt-4">
                        <DataTable
                            data={petugasWithDebt}
                            columns={petugasColumns}
                            keyExtractor={(petugas) => petugas.id}
                            emptyTitle="Tidak ada hutang"
                            emptyDescription="Semua petugas tidak memiliki saldo hutang"
                        />
                    </TabsContent>

                    <TabsContent value="history" className="mt-4">
                        <DataTable
                            data={setoranHistory}
                            columns={historyColumns}
                            keyExtractor={(setoran) => setoran.id}
                            emptyTitle="Belum ada riwayat"
                            emptyDescription="Belum ada setoran yang tercatat"
                        />
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
                description={`Apakah Anda yakin ingin memverifikasi transfer untuk order ${confirmApprove?.order_number}?`}
                confirmLabel="Approve"
                onConfirm={handleApprove}
                loading={processing}
            />

            {/* Reject Confirmation */}
            <ConfirmDialog
                open={!!confirmReject}
                onOpenChange={() => setConfirmReject(null)}
                title="Tolak Transfer"
                description={`Apakah Anda yakin ingin menolak transfer untuk order ${confirmReject?.order_number}?`}
                confirmLabel="Tolak"
                variant="destructive"
                onConfirm={handleReject}
                loading={processing}
            />

            {/* Setoran Modal */}
            <Dialog
                open={!!setoranModal}
                onOpenChange={() => {
                    setSetoranModal(null);
                    setSetoranAmount('');
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Terima Setoran</DialogTitle>
                        <DialogDescription>
                            Masukkan jumlah setoran dari {setoranModal?.nama}
                        </DialogDescription>
                    </DialogHeader>
                    {setoranModal && (
                        <div className="space-y-4 py-4">
                            <div className="rounded-lg bg-muted p-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        Saldo Hutang
                                    </span>
                                    <span className="font-medium text-red-600">
                                        {formatCurrency(setoranModal.saldo_hutang)}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Jumlah Setoran</Label>
                                <Input
                                    type="number"
                                    placeholder="Masukkan jumlah"
                                    value={setoranAmount}
                                    onChange={(e) =>
                                        setSetoranAmount(e.target.value)
                                    }
                                    max={setoranModal.saldo_hutang}
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setSetoranAmount(
                                        setoranModal.saldo_hutang.toString(),
                                    )
                                }
                            >
                                Lunas Semua
                            </Button>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSetoranModal(null);
                                setSetoranAmount('');
                            }}
                        >
                            Batal
                        </Button>
                        <Button onClick={handleSetoran} disabled={processing}>
                            {processing ? 'Memproses...' : 'Terima Setoran'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
