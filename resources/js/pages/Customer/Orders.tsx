import { Head, Link } from '@inertiajs/react';
import { ClipboardList, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
    EmptyState,
    PaymentBadge,
    StatusBadge,
} from '@/components/shared';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CustomerLayout from '@/layouts/CustomerLayout';
import { cn } from '@/lib/utils';
import type { CustomerOrder } from '@/types/customer';
import type { OrderStatus } from '@/types/order';

interface Props {
    orders: CustomerOrder[];
}

type TabKey = 'active' | 'completed' | 'all';

const tabs: { key: TabKey; label: string }[] = [
    { key: 'active', label: 'Aktif' },
    { key: 'completed', label: 'Selesai' },
    { key: 'all', label: 'Semua' },
];

const ACTIVE_STATUSES: OrderStatus[] = [
    'pending',
    'assigned',
    'on_the_way',
    'arrived',
    'processing',
];

const ITEMS_PER_PAGE = 10;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatCurrency(amount: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

export default function Orders({ orders }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('active');
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] =
        useState(ITEMS_PER_PAGE);

    const filteredOrders = useMemo(() => {
        let result = orders;

        // Filter by tab
        if (activeTab === 'active') {
            result = result.filter((o) =>
                ACTIVE_STATUSES.includes(o.status),
            );
        } else if (activeTab === 'completed') {
            result = result.filter(
                (o) => o.status === 'done',
            );
        }

        // Filter by search
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (o) =>
                    o.ticket_number
                        .toLowerCase()
                        .includes(q) ||
                    o.customer_address
                        .toLowerCase()
                        .includes(q) ||
                    formatDate(o.created_at)
                        .toLowerCase()
                        .includes(q),
            );
        }

        return result;
    }, [orders, activeTab, search]);

    const visibleOrders = filteredOrders.slice(
        0,
        visibleCount,
    );
    const hasMore = visibleCount < filteredOrders.length;

    const handleTabChange = (tab: TabKey) => {
        setActiveTab(tab);
        setVisibleCount(ITEMS_PER_PAGE);
    };

    return (
        <CustomerLayout>
            <Head title="Pesanan Saya" />

            <div className="space-y-4 p-4">
                <h1 className="text-xl font-bold">
                    Pesanan Saya
                </h1>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari tiket, alamat, tanggal..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setVisibleCount(ITEMS_PER_PAGE);
                        }}
                        className="pl-9 pr-9"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                    {tabs.map((tab) => (
                        <Button
                            key={tab.key}
                            variant="ghost"
                            size="sm"
                            className={cn(
                                'h-8 flex-1 text-xs',
                                activeTab === tab.key &&
                                    'bg-background shadow-sm',
                            )}
                            onClick={() =>
                                handleTabChange(tab.key)
                            }
                        >
                            {tab.label}
                        </Button>
                    ))}
                </div>

                {/* Order count */}
                {filteredOrders.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                        {filteredOrders.length} pesanan
                        {search && ` untuk "${search}"`}
                    </p>
                )}

                {/* Order Cards */}
                {visibleOrders.length > 0 ? (
                    <div className="space-y-3">
                        {visibleOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/customer/orders/${order.id}`}
                            >
                                <Card className="mb-3 transition-shadow hover:shadow-md">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">
                                                    {
                                                        order.ticket_number
                                                    }
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <StatusBadge
                                                status={
                                                    order.status
                                                }
                                            />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <p className="line-clamp-1 text-sm text-muted-foreground">
                                            {
                                                order.customer_address
                                            }
                                        </p>
                                        {order.volume_estimate && (
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Volume:{' '}
                                                {
                                                    order.volume_estimate
                                                }{' '}
                                                m³
                                            </p>
                                        )}
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between border-t pt-3">
                                        <PaymentBadge
                                            status={
                                                order.payment_status
                                            }
                                        />
                                        <span className="font-semibold text-primary">
                                            {formatCurrency(
                                                order.total_price,
                                            )}
                                        </span>
                                    </CardFooter>
                                </Card>
                            </Link>
                        ))}

                        {/* Load More */}
                        {hasMore && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    setVisibleCount(
                                        (prev) =>
                                            prev +
                                            ITEMS_PER_PAGE,
                                    )
                                }
                            >
                                Muat Lebih Banyak
                            </Button>
                        )}
                    </div>
                ) : (
                    <EmptyState
                        icon={ClipboardList}
                        title="Tidak ada pesanan"
                        description={
                            search
                                ? `Tidak ditemukan pesanan untuk "${search}"`
                                : activeTab === 'active'
                                  ? 'Belum ada pesanan aktif'
                                  : activeTab === 'completed'
                                    ? 'Belum ada pesanan selesai'
                                    : 'Belum ada pesanan'
                        }
                    />
                )}
            </div>
        </CustomerLayout>
    );
}
