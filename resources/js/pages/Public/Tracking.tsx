import { Head, Link } from '@inertiajs/react';
import {
    CheckCircle2,
    Circle,
    Clock,
    MapPin,
    Phone,
    Search,
    Truck,
    Upload,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { PhotoUploader } from '@/components/forms';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import PublicLayout from '@/layouts/PublicLayout';
import { cn } from '@/lib/utils';

// Mock data untuk demo
const MOCK_ORDERS = [
    {
        ticket: 'TKT-2026-0001',
        phone: '081234567890',
        customerName: 'Budi Santoso',
        customerType: 'household',
        address: 'Jl. Raden Intan No. 45, Tanjung Karang',
        status: 'done',
        paymentMethod: 'cod',
        paymentStatus: 'paid',
        estimatedPrice: 150000,
        finalPrice: 150000,
        createdAt: '2026-02-13T08:00:00',
        assignedAt: '2026-02-13T09:00:00',
        processedAt: '2026-02-13T10:30:00',
        completedAt: '2026-02-13T12:00:00',
        officer: {
            name: 'Ahmad Supardi',
            phone: '081298765432',
        },
    },
    {
        ticket: 'TKT-2026-0002',
        phone: '081298765432',
        customerName: 'PT. Maju Jaya',
        customerType: 'institution',
        address: 'Jl. Kartini No. 88, Pahoman',
        status: 'processing',
        paymentMethod: 'transfer',
        paymentStatus: 'pending',
        estimatedPrice: 600000,
        finalPrice: null,
        createdAt: '2026-02-14T10:00:00',
        assignedAt: '2026-02-14T11:00:00',
        processedAt: '2026-02-15T08:00:00',
        completedAt: null,
        officer: {
            name: 'Dedi Kurniawan',
            phone: '081387654321',
        },
    },
    {
        ticket: 'TKT-2026-0003',
        phone: '081345678901',
        customerName: 'Siti Aminah',
        customerType: 'household',
        address: 'Jl. Teuku Umar No. 12, Kedaton',
        status: 'assigned',
        paymentMethod: 'transfer',
        paymentStatus: 'pending',
        estimatedPrice: 150000,
        finalPrice: null,
        createdAt: '2026-02-15T07:00:00',
        assignedAt: '2026-02-15T08:30:00',
        processedAt: null,
        completedAt: null,
        officer: {
            name: 'Rudi Hartono',
            phone: '081376543210',
        },
    },
    {
        ticket: 'TKT-2026-0004',
        phone: '081456789012',
        customerName: 'Agus Wijaya',
        customerType: 'household',
        address: 'Jl. Diponegoro No. 33, Teluk Betung',
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        estimatedPrice: 150000,
        finalPrice: null,
        createdAt: '2026-02-15T09:00:00',
        assignedAt: null,
        processedAt: null,
        completedAt: null,
        officer: null,
    },
];

type OrderStatus = 'pending' | 'assigned' | 'processing' | 'done';

const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bgColor: string }
> = {
    pending: {
        label: 'Menunggu',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
    },
    assigned: {
        label: 'Ditugaskan',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
    },
    processing: {
        label: 'Diproses',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
    },
    done: {
        label: 'Selesai',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
    },
};

const TIMELINE_STEPS: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
    { key: 'pending', label: 'Pesanan Diterima', icon: Clock },
    { key: 'assigned', label: 'Petugas Ditugaskan', icon: User },
    { key: 'processing', label: 'Sedang Diproses', icon: Truck },
    { key: 'done', label: 'Selesai', icon: CheckCircle2 },
];

function getStatusIndex(status: OrderStatus): number {
    return TIMELINE_STEPS.findIndex((s) => s.key === status);
}

export default function Tracking() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'ticket' | 'phone'>('ticket');
    const [order, setOrder] = useState<(typeof MOCK_ORDERS)[0] | null>(null);
    const [notFound, setNotFound] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File[]>([]);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setNotFound(false);

        // Simulate API call
        setTimeout(() => {
            const found = MOCK_ORDERS.find((o) =>
                searchType === 'ticket'
                    ? o.ticket.toLowerCase() === searchQuery.toLowerCase()
                    : o.phone === searchQuery.replace(/\D/g, ''),
            );

            if (found) {
                setOrder(found);
                setNotFound(false);
            } else {
                setOrder(null);
                setNotFound(true);
            }
            setIsSearching(false);
        }, 500);
    };

    const handleUploadProof = () => {
        // Simulate upload
        alert('Bukti pembayaran berhasil diunggah! (Demo)');
        setPaymentProof([]);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return '-';
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    return (
        <PublicLayout>
            <Head title="Lacak Pesanan" />

            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    title="Lacak Pesanan"
                    description="Masukkan nomor tiket atau nomor HP untuk melacak pesanan Anda"
                    breadcrumbs={[
                        { label: 'Beranda', href: '/' },
                        { label: 'Lacak Pesanan' },
                    ]}
                />

                {/* Search Form */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Cari Pesanan</CardTitle>
                        <CardDescription>
                            Masukkan nomor tiket atau nomor HP yang terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Search Type Toggle */}
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant={
                                    searchType === 'ticket'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => {
                                    setSearchType('ticket');
                                    setSearchQuery('');
                                }}
                            >
                                Nomor Tiket
                            </Button>
                            <Button
                                type="button"
                                variant={
                                    searchType === 'phone'
                                        ? 'default'
                                        : 'outline'
                                }
                                size="sm"
                                onClick={() => {
                                    setSearchType('phone');
                                    setSearchQuery('');
                                }}
                            >
                                Nomor HP
                            </Button>
                        </div>

                        {/* Search Input */}
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={
                                        searchType === 'ticket'
                                            ? 'Contoh: TKT-2026-0001'
                                            : 'Contoh: 081234567890'
                                    }
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    onKeyDown={(e) =>
                                        e.key === 'Enter' && handleSearch()
                                    }
                                    className="pl-9"
                                />
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching || !searchQuery.trim()}
                            >
                                {isSearching ? 'Mencari...' : 'Cari'}
                            </Button>
                        </div>

                        {/* Demo hint */}
                        <p className="text-xs text-muted-foreground">
                            Demo: Coba cari TKT-2026-0001, TKT-2026-0002,
                            TKT-2026-0003, atau TKT-2026-0004
                        </p>
                    </CardContent>
                </Card>

                {/* Not Found */}
                {notFound && (
                    <Card className="mt-6 border-destructive/50">
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">
                                Pesanan tidak ditemukan. Pastikan nomor tiket
                                atau nomor HP yang Anda masukkan benar.
                            </p>
                            <Button asChild variant="link" className="mt-2">
                                <Link href="/order">Buat Pesanan Baru</Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Order Result */}
                {order && (
                    <div className="mt-6 space-y-6">
                        {/* Order Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {order.ticket}
                                        </CardTitle>
                                        <CardDescription>
                                            {order.customerName}
                                        </CardDescription>
                                    </div>
                                    <span
                                        className={cn(
                                            'inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium',
                                            STATUS_CONFIG[
                                                order.status as OrderStatus
                                            ].bgColor,
                                            STATUS_CONFIG[
                                                order.status as OrderStatus
                                            ].color,
                                        )}
                                    >
                                        {
                                            STATUS_CONFIG[
                                                order.status as OrderStatus
                                            ].label
                                        }
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start gap-2">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Alamat
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.address}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                Telepon
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid gap-4 text-sm sm:grid-cols-3">
                                    <div>
                                        <p className="text-muted-foreground">
                                            Estimasi Biaya
                                        </p>
                                        <p className="font-medium">
                                            {formatCurrency(order.estimatedPrice)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Biaya Final
                                        </p>
                                        <p className="font-medium">
                                            {formatCurrency(order.finalPrice)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">
                                            Metode Bayar
                                        </p>
                                        <p className="font-medium">
                                            {order.paymentMethod === 'cod'
                                                ? 'Bayar di Tempat (COD)'
                                                : 'Transfer Bank'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Timeline */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    Status Pesanan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    {TIMELINE_STEPS.map((step, index) => {
                                        const currentIndex = getStatusIndex(
                                            order.status as OrderStatus,
                                        );
                                        const isCompleted = index <= currentIndex;
                                        const isCurrent = index === currentIndex;
                                        const Icon = step.icon;

                                        let timestamp: string | null = null;
                                        if (step.key === 'pending')
                                            timestamp = order.createdAt;
                                        if (step.key === 'assigned')
                                            timestamp = order.assignedAt;
                                        if (step.key === 'processing')
                                            timestamp = order.processedAt;
                                        if (step.key === 'done')
                                            timestamp = order.completedAt;

                                        return (
                                            <div
                                                key={step.key}
                                                className="relative flex gap-4 pb-8 last:pb-0"
                                            >
                                                {/* Line */}
                                                {index <
                                                    TIMELINE_STEPS.length - 1 && (
                                                    <div
                                                        className={cn(
                                                            'absolute top-8 left-4 h-full w-0.5 -translate-x-1/2',
                                                            isCompleted &&
                                                                index <
                                                                    currentIndex
                                                                ? 'bg-primary'
                                                                : 'bg-muted',
                                                        )}
                                                    />
                                                )}

                                                {/* Icon */}
                                                <div
                                                    className={cn(
                                                        'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                                        isCompleted
                                                            ? 'bg-primary text-primary-foreground'
                                                            : 'bg-muted text-muted-foreground',
                                                        isCurrent &&
                                                            'ring-4 ring-primary/20',
                                                    )}
                                                >
                                                    {isCompleted ? (
                                                        <Icon className="h-4 w-4" />
                                                    ) : (
                                                        <Circle className="h-4 w-4" />
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 pt-1">
                                                    <p
                                                        className={cn(
                                                            'font-medium',
                                                            !isCompleted &&
                                                                'text-muted-foreground',
                                                        )}
                                                    >
                                                        {step.label}
                                                    </p>
                                                    {timestamp && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {formatDate(timestamp)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Officer Info */}
                        {order.officer && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        Petugas
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <User className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {order.officer.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Petugas Lapangan
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Payment Proof Upload (for Transfer) */}
                        {order.paymentMethod === 'transfer' &&
                            order.paymentStatus === 'pending' &&
                            order.status !== 'done' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <Upload className="h-5 w-5" />
                                            Upload Bukti Pembayaran
                                        </CardTitle>
                                        <CardDescription>
                                            Silakan transfer ke rekening berikut
                                            dan upload bukti pembayaran
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="rounded-lg bg-muted p-4">
                                            <p className="text-sm font-medium">
                                                Bank BRI
                                            </p>
                                            <p className="font-mono text-lg">
                                                1234-5678-9012-3456
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                a.n. PD. Kebersihan Tapis Berseri
                                            </p>
                                        </div>

                                        <PhotoUploader
                                            value={paymentProof}
                                            onChange={setPaymentProof}
                                            maxFiles={1}
                                            showCamera={true}
                                        />

                                        {paymentProof.length > 0 && (
                                            <Button
                                                onClick={handleUploadProof}
                                                className="w-full"
                                            >
                                                Kirim Bukti Pembayaran
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
