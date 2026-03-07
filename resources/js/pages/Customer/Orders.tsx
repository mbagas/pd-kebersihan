import { Head } from '@inertiajs/react';
import { ClipboardList, Loader2, Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CustomerOrderCard } from '@/components/customer/CustomerOrderCard';
import { EmptyState } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
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

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

export default function Orders({ orders }: Props) {
    const [activeTab, setActiveTab] = useState<TabKey>('active');
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] =
        useState(ITEMS_PER_PAGE);

    const debouncedSearch = useDebounce(search, 300);

    const { containerRef, isPulling, isRefreshing, pullDistance } =
        usePullToRefresh({
            onRefresh: async () => {
                // In prototype, just simulate a reload delay
                await new Promise((resolve) =>
                    setTimeout(resolve, 800),
                );
            },
        });

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
        if (debouncedSearch.trim()) {
            const q = debouncedSearch.toLowerCase();
            result = result.filter(
                (o) =>
                    o.ticket_number
                        .toLowerCase()
                        .includes(q) ||
                    o.customer_address
                        .toLowerCase()
                        .includes(q),
            );
        }

        return result;
    }, [orders, activeTab, debouncedSearch]);

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

            <div ref={containerRef} className="space-y-4 p-4">
                {/* Pull to Refresh Indicator */}
                {(isPulling || isRefreshing) && (
                    <div
                        className="flex items-center justify-center overflow-hidden transition-all"
                        style={{
                            height: isRefreshing
                                ? 40
                                : pullDistance * 0.5,
                        }}
                    >
                        <Loader2
                            className={cn(
                                'h-5 w-5 text-primary',
                                isRefreshing && 'animate-spin',
                            )}
                        />
                        <span className="ml-2 text-sm text-muted-foreground">
                            {isRefreshing
                                ? 'Memuat ulang...'
                                : 'Tarik untuk memuat ulang'}
                        </span>
                    </div>
                )}

                <h1 className="text-xl font-bold">
                    Pesanan Saya
                </h1>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Cari tiket atau alamat..."
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
                        {debouncedSearch &&
                            ` untuk "${debouncedSearch}"`}
                    </p>
                )}

                {/* Order Cards */}
                {visibleOrders.length > 0 ? (
                    <div className="space-y-3">
                        {visibleOrders.map((order) => (
                            <CustomerOrderCard
                                key={order.id}
                                order={order}
                            />
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
                            debouncedSearch
                                ? `Tidak ditemukan pesanan untuk "${debouncedSearch}"`
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
