import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Filter, MapPin, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { PageHeader } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { MapOrder, PetaFilters } from '@/types/audit';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Statistik', href: '/audit' },
    { title: 'Peta Sebaran', href: '/audit/peta' },
];

interface Props {
    orders: MapOrder[];
    filters: PetaFilters;
}

const STATUS_COLORS: Record<string, string> = {
    pending: '#eab308',
    assigned: '#3b82f6',
    on_the_way: '#8b5cf6',
    arrived: '#6366f1',
    processing: '#a855f7',
    done: '#22c55e',
    cancelled: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    assigned: 'Ditugaskan',
    on_the_way: 'Dalam Perjalanan',
    arrived: 'Tiba di Lokasi',
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

// Map Component with Clustering
function OrderMap({ orders }: { orders: MapOrder[] }) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const markersRef = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current) return;

        let cancelled = false;

        // Dynamic import Leaflet first, then MarkerCluster
        const initMap = async () => {
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            // Set Leaflet to window for markercluster plugin
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any).L = L.default || L;

            await import('leaflet.markercluster');
            await import('leaflet.markercluster/dist/MarkerCluster.css');
            await import('leaflet.markercluster/dist/MarkerCluster.Default.css');

            if (cancelled || !mapRef.current) return;

            // Clean up any existing map on this container
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersRef.current = null;
            }

            const leaflet = L.default || L;

            // Initialize map centered on Jakarta area
            const map = leaflet.map(mapRef.current).setView([-6.2, 106.8], 11);

            leaflet
                .tileLayer(
                    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        attribution: '© OpenStreetMap contributors',
                    },
                )
                .addTo(map);

            // Create marker cluster group
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const markers = (leaflet as any).markerClusterGroup({
                chunkedLoading: true,
                maxClusterRadius: 50,
                spiderfyOnMaxZoom: true,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
            });

            // Add markers for each order
            orders.forEach((order) => {
                const color = STATUS_COLORS[order.status] || '#6b7280';

                // Create custom icon with status color
                const icon = leaflet.divIcon({
                    className: 'custom-marker',
                    html: `
                        <div style="
                            background-color: ${color};
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            border: 3px solid white;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                        "></div>
                    `,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12],
                });

                const marker = leaflet.marker(
                    [order.latitude, order.longitude],
                    { icon },
                );

                // Popup content
                const popupContent = `
                    <div style="min-width: 200px; font-family: system-ui, sans-serif;">
                        <div style="font-weight: 600; font-size: 14px; margin-bottom: 8px;">
                            ${order.order_number}
                        </div>
                        <div style="font-size: 13px; color: #374151; margin-bottom: 4px;">
                            <strong>${order.customer_name}</strong>
                        </div>
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                            ${CUSTOMER_TYPE_LABELS[order.customer_type]}
                        </div>
                        <div style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
                            ${order.customer_address}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
                            <span>Volume: <strong>${order.volume} m³</strong></span>
                            <span style="color: #059669; font-weight: 600;">
                                ${formatCurrency(order.total_amount)}
                            </span>
                        </div>
                        <div style="margin-top: 8px;">
                            <span style="
                                display: inline-block;
                                padding: 2px 8px;
                                border-radius: 9999px;
                                font-size: 11px;
                                font-weight: 500;
                                background-color: ${color}20;
                                color: ${color};
                            ">
                                ${STATUS_LABELS[order.status]}
                            </span>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent);
                markers.addLayer(marker);
            });

            map.addLayer(markers);
            mapInstanceRef.current = map;
            markersRef.current = markers;

            // Fit bounds if there are orders
            if (orders.length > 0) {
                const bounds = markers.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50] });
                }
            }
        };

        initMap();

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersRef.current = null;
            }
        };
    }, [orders]);

    return (
        <div
            ref={mapRef}
            className="h-full w-full rounded-lg"
            style={{ minHeight: '500px' }}
        />
    );
}

export default function Peta({ orders, filters }: Props) {
    const { auth } = usePage().props;
    const isAuditor = auth.user?.role === 'auditor';

    const [localFilters, setLocalFilters] = useState(filters);

    const handleFilterChange = (key: keyof PetaFilters, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        router.get('/audit/peta', localFilters as unknown as Record<string, string>, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const defaultFilters = {
            start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
            end_date: new Date().toISOString().split('T')[0],
            status: 'all',
            customer_type: 'all',
        };
        setLocalFilters(defaultFilters);
        router.get('/audit/peta', defaultFilters, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Stats summary
    const totalOrders = orders.length;
    const householdCount = orders.filter(
        (o) => o.customer_type === 'household',
    ).length;
    const institutionCount = orders.filter(
        (o) => o.customer_type === 'institution',
    ).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Peta Sebaran" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <PageHeader
                        title="Peta Sebaran Order"
                        description="Visualisasi lokasi order di peta"
                    />
                    {isAuditor && (
                        <Badge variant="secondary" className="gap-1.5">
                            <Eye className="h-3 w-3" />
                            Mode Auditor
                        </Badge>
                    )}
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="h-4 w-4" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Label>Tanggal Mulai</Label>
                                <Input
                                    type="date"
                                    value={localFilters.start_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'start_date',
                                            e.target.value,
                                        )
                                    }
                                    className="w-[160px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tanggal Akhir</Label>
                                <Input
                                    type="date"
                                    value={localFilters.end_date}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            'end_date',
                                            e.target.value,
                                        )
                                    }
                                    className="w-[160px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select
                                    value={localFilters.status}
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
                                        <SelectItem value="on_the_way">
                                            Dalam Perjalanan
                                        </SelectItem>
                                        <SelectItem value="arrived">
                                            Tiba di Lokasi
                                        </SelectItem>
                                        <SelectItem value="processing">
                                            Diproses
                                        </SelectItem>
                                        <SelectItem value="done">
                                            Selesai
                                        </SelectItem>
                                        <SelectItem value="cancelled">
                                            Dibatalkan
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Tipe Customer</Label>
                                <Select
                                    value={localFilters.customer_type}
                                    onValueChange={(v) =>
                                        handleFilterChange('customer_type', v)
                                    }
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <SelectValue placeholder="Tipe" />
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
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={applyFilters}>
                                    <Search className="mr-2 h-4 w-4" />
                                    Terapkan
                                </Button>
                                <Button variant="outline" onClick={resetFilters}>
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-lg bg-blue-50 p-3">
                                <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Lokasi
                                </p>
                                <p className="text-2xl font-bold">
                                    {totalOrders}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-lg bg-green-50 p-3">
                                <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Rumah Tangga
                                </p>
                                <p className="text-2xl font-bold">
                                    {householdCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-lg bg-purple-50 p-3">
                                <MapPin className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Instansi
                                </p>
                                <p className="text-2xl font-bold">
                                    {institutionCount}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Map */}
                <Card className="overflow-hidden">
                    <CardContent className="p-0">
                        <OrderMap orders={orders} />
                    </CardContent>
                </Card>

                {/* Legend */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Legenda Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {Object.entries(STATUS_LABELS).map(
                                ([status, label]) => (
                                    <div
                                        key={status}
                                        className="flex items-center gap-2"
                                    >
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{
                                                backgroundColor:
                                                    STATUS_COLORS[status],
                                            }}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {label}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
