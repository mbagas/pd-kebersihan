import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    MapPin,
    MoreVertical,
    Plus,
    Star,
} from 'lucide-react';
import { EmptyState } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CustomerLayout from '@/layouts/CustomerLayout';
import type { CustomerAddress } from '@/types/customer';

interface Props {
    addresses: CustomerAddress[];
}

const MAX_ADDRESSES = 5;

export default function Addresses({ addresses }: Props) {
    const { flash } = usePage<{
        flash?: { success?: string };
    }>().props;
    const canAdd = addresses.length < MAX_ADDRESSES;

    const handleSetDefault = (id: number) => {
        router.put(`/customer/addresses/${id}/default`);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus alamat ini?')) {
            router.delete(`/customer/addresses/${id}`);
        }
    };

    return (
        <CustomerLayout>
            <Head title="Alamat Saya" />

            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            Alamat Saya
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {addresses.length}/{MAX_ADDRESSES}{' '}
                            alamat tersimpan
                        </p>
                    </div>
                    {canAdd && (
                        <Button
                            asChild
                            size="sm"
                            className="gap-1"
                        >
                            <Link href="/customer/addresses/create">
                                <Plus className="h-4 w-4" />
                                Tambah
                            </Link>
                        </Button>
                    )}
                </div>

                {/* Success Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {addresses.length > 0 ? (
                    <div className="space-y-3">
                        {addresses.map((address) => (
                            <Card key={address.id}>
                                <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className="text-xs"
                                        >
                                            {address.label}
                                        </Badge>
                                        {address.is_default && (
                                            <Badge
                                                variant="outline"
                                                className="gap-1 border-primary/30 bg-primary/10 text-xs text-primary"
                                            >
                                                <Star className="h-3 w-3" />
                                                Default
                                            </Badge>
                                        )}
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            asChild
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                asChild
                                            >
                                                <Link
                                                    href={`/customer/addresses/${address.id}/edit`}
                                                >
                                                    Edit
                                                </Link>
                                            </DropdownMenuItem>
                                            {!address.is_default && (
                                                <DropdownMenuItem
                                                    onClick={() =>
                                                        handleSetDefault(
                                                            address.id,
                                                        )
                                                    }
                                                >
                                                    Jadikan
                                                    Default
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() =>
                                                    handleDelete(
                                                        address.id,
                                                    )
                                                }
                                            >
                                                Hapus
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span>
                                            {address.address}
                                        </span>
                                    </div>
                                    {address.notes && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {address.notes}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={MapPin}
                        title="Belum ada alamat"
                        description="Tambahkan alamat untuk mempercepat pemesanan"
                    />
                )}

                {!canAdd && (
                    <p className="text-center text-sm text-muted-foreground">
                        Maksimum {MAX_ADDRESSES} alamat. Hapus
                        alamat lama untuk menambahkan yang baru.
                    </p>
                )}
            </div>
        </CustomerLayout>
    );
}
