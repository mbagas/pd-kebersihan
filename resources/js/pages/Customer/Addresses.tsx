import { Head } from '@inertiajs/react';
import { MapPin, MoreVertical, Plus, Star } from 'lucide-react';
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
    const canAdd = addresses.length < MAX_ADDRESSES;

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
                        <Button size="sm" className="gap-1">
                            <Plus className="h-4 w-4" />
                            Tambah
                        </Button>
                    )}
                </div>

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
                                            <DropdownMenuItem>
                                                Edit
                                            </DropdownMenuItem>
                                            {!address.is_default && (
                                                <DropdownMenuItem>
                                                    Jadikan
                                                    Default
                                                </DropdownMenuItem>
                                            )}
                                            <DropdownMenuItem className="text-destructive">
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
