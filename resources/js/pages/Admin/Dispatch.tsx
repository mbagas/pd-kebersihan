import { Head, router } from '@inertiajs/react';
import {
    Banknote,
    CreditCard,
    ExternalLink,
    Eye,
    Filter,
    MapPin,
    Navigation,
    Phone,
    Search,
    Truck,
    User,
    UserPlus,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DataTable, PageHeader } from '@/components/shared';
import type { Column, PaginationConfig } from '@/components/shared/DataTable';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import AdminLayout from '@/layouts/AdminLayout';
import type { DispatchOrder, PaginatedResponse, Petugas } from '@/types';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/admin' },
    { title: 'Dispatch', href: '/admin/dispatch' },
];

interface Props {
    orders: PaginatedResponse<DispatchOrder>;
    petugas: Petugas[];
    filters: {
        status: string;
        customer_type: string;
        date: string;
    };
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Ditugaskan',
    processing: 'Diproses',
    done: 'Selesai',
    cancelled: 'Dibatalkan',
};

const CUSTOMER_TYPE_LABELS: Record<string, string> = {
    household: 'Rumah Tangga',
    institution: 'Instansi',
};

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

function getGoogleMapsUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

// Get payment settlement status badge
function getPaymentSettlementBadge(order: DispatchOrder) {
    if (order.payment_method === 'transfer') {
        // Transfer flow
        if (order.payment_status === 'paid') {
            return (
                <Badge className="bg-green-100 text-green-800">
                    <CreditCard className="mr-1 h-3 w-3" />
                    Terverifikasi
                </Badge>
            );
        }
        if (order.payment_status === 'pending_verification') {
            return (
                <Badge className="bg-yellow-100 text-yellow-800">
                    <CreditCard className="mr-1 h-3 w-3" />
                    Menunggu Verifikasi
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-100 text-gray-800">
                <CreditCard className="mr-1 h-3 w-3" />
                Belum Bayar
            </Badge>
        );
    } else {
        // Cash flow
        if (order.cash_collection_status === 'deposited') {
            return (
                <Badge className="bg-green-100 text-green-800">
                    <Banknote className="mr-1 h-3 w-3" />
                    Sudah Disetor
                </Badge>
            );
        }
        if (order.cash_collection_status === 'collected') {
            return (
                <Badge className="bg-orange-100 text-orange-800">
                    <Banknote className="mr-1 h-3 w-3" />
                    Belum Disetor
                </Badge>
            );
        }
        return (
            <Badge className="bg-gray-100 text-gray-800">
                <Banknote className="mr-1 h-3 w-3" />
                Belum Ditagih
            </Badge>
        );
    }
}

// Mini Map Component for Sheet
function MiniMap({ lat, lng }: { lat: number; lng: number }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Dynamic import Leaflet
        import('leaflet').then((L) => {
            import('leaflet/dist/leaflet.css');

            if (!mapRef.current) return;

            const map = L.map(mapRef.current).setView([lat, lng], 15);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
            }).addTo(map);

            // Custom marker icon
            const icon = L.icon({
                iconUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                iconRetinaUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                shadowUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });

            L.marker([lat, lng], { icon }).addTo(map);

            mapInstanceRef.current = map;
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng]);

    return (
        <div
            ref={mapRef}
            className="h-48 w-full rounded-lg border"
            style={{ zIndex: 0 }}
        />
    );
}

export default function Dispatch({ orders, petugas, filters }: Props) {
    const [search, setSearch] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<DispatchOrder | null>(
        null,
    );
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [detailSheetOpen, setDetailSheetOpen] = useState(false);
    const [selectedPetugas, setSelectedPetugas] = useState<string>('');
    const [assigning, setAssigning] = useState(false);

    // Filter handlers
    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/admin/dispatch',
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, preserveScroll: true },
        );
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/admin/dispatch',
            { ...filters, page },
            { preserveState: true, preserveScroll: true },
        );
    };

    // Get selected petugas data
    const getSelectedPetugasData = () => {
        return petugas.find((p) => p.id.toString() === selectedPetugas);
    };

    // Assign handler
    const handleAssign = () => {
        if (!selectedOrder || !selectedPetugas) {
            toast.error('Pilih petugas');
            return;
        }

        const petugasData = getSelectedPetugasData();
        if (!petugasData) return;

        setAssigning(true);
        // Simulate API call
        setTimeout(() => {
            toast.success(
                `Order ${selectedOrder.order_number} berhasil ditugaskan ke ${petugasData.nama}`,
            );
            setAssigning(false);
            setAssignModalOpen(false);
            setSelectedPetugas('');
            // In real app, would refresh data here
        }, 1000);
    };

    // Open assign modal
    const openAssignModal = (order: DispatchOrder) => {
        setSelectedOrder(order);
        setAssignModalOpen(true);
    };

    // Open detail sheet
    const openDetailSheet = (order: DispatchOrder) => {
        setSelectedOrder(order);
        setDetailSheetOpen(true);
    };

    // Filter orders by search
    const filteredOrders = orders.data.filter(
        (order) =>
            order.order_number.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_address.toLowerCase().includes(search.toLowerCase()),
    );

    const columns: Column<DispatchOrder>[] = [
        {
            key: 'order_number',
            header: 'No. Order',
            sortable: true,
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
                        {CUSTOMER_TYPE_LABELS[order.customer_type]}
                    </p>
                </div>
            ),
        },
        {
            key: 'volume',
            header: 'Volume',
            render: (order) => <span>{order.volume} m³</span>,
        },
        {
            key: 'scheduled_at',
            header: 'Jadwal',
            render: (order) => (
                <span className="text-sm">
                    {order.scheduled_at ? formatDate(order.scheduled_at) : '-'}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (order) => (
                <Badge className={STATUS_COLORS[order.status]}>
                    {STATUS_LABELS[order.status]}
                </Badge>
            ),
        },
        {
            key: 'payment_settlement',
            header: 'Pembayaran',
            render: (order) => getPaymentSettlementBadge(order),
        },
        {
            key: 'petugas',
            header: 'Petugas & Armada',
            render: (order) =>
                order.petugas ? (
                    <div className="text-sm">
                        <p className="font-medium">{order.petugas.nama}</p>
                        <p className="text-xs text-muted-foreground">
                            {order.armada?.plat_nomor} •{' '}
                            {order.petugas.mitra?.nama}
                        </p>
                    </div>
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
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            openDetailSheet(order);
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    {order.status === 'pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                openAssignModal(order);
                            }}
                        >
                            <UserPlus className="mr-1 h-4 w-4" />
                            Assign
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    const pagination: PaginationConfig = {
        currentPage: orders.meta.current_page,
        totalPages: orders.meta.last_page,
        totalItems: orders.meta.total,
        perPage: orders.meta.per_page,
        onPageChange: handlePageChange,
    };

    const selectedPetugasData = getSelectedPetugasData();

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Dispatch Console" />

            <div className="flex flex-col gap-6 p-6">
                <PageHeader
                    title="Dispatch Console"
                    description="Kelola dan assign order ke petugas"
                />

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="min-w-[200px] flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        placeholder="Cari order..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <Select
                                value={filters.status}
                                onValueChange={(v) =>
                                    handleFilterChange('status', v)
                                }
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="assigned">
                                        Ditugaskan
                                    </SelectItem>
                                    <SelectItem value="processing">
                                        Diproses
                                    </SelectItem>
                                    <SelectItem value="done">Selesai</SelectItem>
                                    <SelectItem value="cancelled">
                                        Dibatalkan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select
                                value={filters.customer_type}
                                onValueChange={(v) =>
                                    handleFilterChange('customer_type', v)
                                }
                            >
                                <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Tipe Customer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Tipe
                                    </SelectItem>
                                    <SelectItem value="household">
                                        Rumah Tangga
                                    </SelectItem>
                                    <SelectItem value="institution">
                                        Instansi
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                value={filters.date}
                                onChange={(e) =>
                                    handleFilterChange('date', e.target.value)
                                }
                                className="w-[160px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <DataTable
                    data={filteredOrders}
                    columns={columns}
                    keyExtractor={(order) => order.id}
                    pagination={pagination}
                    emptyTitle="Tidak ada order"
                    emptyDescription="Belum ada order yang sesuai dengan filter"
                />
            </div>

            {/* Assign Modal - Simplified (only select petugas) */}
            <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Order</DialogTitle>
                        <DialogDescription>
                            Tugaskan order {selectedOrder?.order_number} ke
                            petugas
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedOrder && (
                            <div className="rounded-lg bg-muted p-4">
                                <p className="font-medium">
                                    {selectedOrder.customer_name}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {selectedOrder.customer_address}
                                </p>
                                <p className="mt-2 text-sm">
                                    Volume: {selectedOrder.volume} m³ •{' '}
                                    {formatCurrency(selectedOrder.total_amount)}
                                </p>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Pilih Petugas</Label>
                            <Select
                                value={selectedPetugas}
                                onValueChange={setSelectedPetugas}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih petugas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {petugas.map((p) => (
                                        <SelectItem
                                            key={p.id}
                                            value={p.id.toString()}
                                        >
                                            <div className="flex flex-col">
                                                <span>
                                                    {p.nama} - {p.mitra?.nama}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {p.armada?.plat_nomor} (
                                                    {p.armada?.kapasitas} m³)
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Show selected petugas & armada info */}
                        {selectedPetugasData && (
                            <div className="rounded-lg border p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium">
                                            {selectedPetugasData.nama}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedPetugasData.mitra?.nama}
                                        </p>
                                    </div>
                                </div>
                                {selectedPetugasData.armada && (
                                    <div className="mt-3 flex items-center gap-3 rounded-md bg-muted p-2">
                                        <Truck className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {
                                                    selectedPetugasData.armada
                                                        .plat_nomor
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Kapasitas:{' '}
                                                {
                                                    selectedPetugasData.armada
                                                        .kapasitas
                                                }{' '}
                                                m³
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAssignModalOpen(false)}
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleAssign}
                            disabled={assigning || !selectedPetugas}
                        >
                            {assigning ? 'Menyimpan...' : 'Assign'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Detail Sheet - Improved with padding and map */}
            <Sheet open={detailSheetOpen} onOpenChange={setDetailSheetOpen}>
                <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
                    <SheetHeader className="px-1">
                        <SheetTitle>Detail Order</SheetTitle>
                        <SheetDescription>
                            {selectedOrder?.order_number}
                        </SheetDescription>
                    </SheetHeader>
                    {selectedOrder && (
                        <div className="mt-6 space-y-6 px-1">
                            {/* Status & Date */}
                            <div className="flex items-center justify-between">
                                <Badge
                                    className={
                                        STATUS_COLORS[selectedOrder.status]
                                    }
                                >
                                    {STATUS_LABELS[selectedOrder.status]}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    {formatDate(selectedOrder.created_at)}
                                </span>
                            </div>

                            <Separator />

                            {/* Customer Info */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Informasi Pelanggan
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {selectedOrder.customer_name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {
                                                    CUSTOMER_TYPE_LABELS[
                                                        selectedOrder
                                                            .customer_type
                                                    ]
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {selectedOrder.customer_phone}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Telepon
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {selectedOrder.customer_address}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Alamat
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map */}
                            {selectedOrder.latitude &&
                                selectedOrder.longitude && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                            Lokasi
                                        </h4>
                                        <MiniMap
                                            lat={selectedOrder.latitude}
                                            lng={selectedOrder.longitude}
                                        />
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <a
                                                href={getGoogleMapsUrl(
                                                    selectedOrder.latitude,
                                                    selectedOrder.longitude,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <Navigation className="mr-2 h-4 w-4" />
                                                Buka di Google Maps
                                                <ExternalLink className="ml-2 h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                )}

                            <Separator />

                            {/* Order Details */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Detail Order
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-muted p-3">
                                        <p className="text-sm text-muted-foreground">
                                            Volume
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {selectedOrder.volume} m³
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3">
                                        <p className="text-sm text-muted-foreground">
                                            Total
                                        </p>
                                        <p className="text-lg font-semibold text-green-600">
                                            {formatCurrency(
                                                selectedOrder.total_amount,
                                            )}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-muted p-3">
                                        <p className="text-sm text-muted-foreground">
                                            Jadwal
                                        </p>
                                        <p className="font-medium">
                                            {selectedOrder.scheduled_at
                                                ? formatDate(
                                                      selectedOrder.scheduled_at,
                                                  )
                                                : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Settlement Status */}
                            <Separator />
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                    Status Pembayaran
                                </h4>
                                <div className="rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Metode Pembayaran
                                            </p>
                                            <p className="font-medium">
                                                {selectedOrder.payment_method === 'transfer' ? 'Transfer' : 'Tunai'}
                                            </p>
                                        </div>
                                        {getPaymentSettlementBadge(selectedOrder)}
                                    </div>
                                </div>
                            </div>

                            {/* Assignment Info */}
                            {selectedOrder.petugas && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                            Penugasan
                                        </h4>
                                        <div className="rounded-lg border p-4">
                                            <div className="flex items-start gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            selectedOrder
                                                                .petugas.nama
                                                        }
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            selectedOrder
                                                                .petugas.mitra
                                                                ?.nama
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            {selectedOrder.armada && (
                                                <div className="mt-3 flex items-center gap-3 rounded-md bg-muted p-3">
                                                    <Truck className="h-5 w-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                selectedOrder
                                                                    .armada
                                                                    .plat_nomor
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Kapasitas:{' '}
                                                            {
                                                                selectedOrder
                                                                    .armada
                                                                    .kapasitas
                                                            }{' '}
                                                            m³
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <>
                                    <Separator />
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                                            Catatan
                                        </h4>
                                        <p className="rounded-lg bg-muted p-3 text-sm">
                                            {selectedOrder.notes}
                                        </p>
                                    </div>
                                </>
                            )}

                            {/* Actions */}
                            {selectedOrder.status === 'pending' && (
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        setDetailSheetOpen(false);
                                        openAssignModal(selectedOrder);
                                    }}
                                >
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Assign Petugas
                                </Button>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </AdminLayout>
    );
}
