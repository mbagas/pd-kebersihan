import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Building2,
    CheckCircle,
    LogOut,
    Mail,
    Phone,
    Truck,
    Wallet,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DriverLayout from '@/layouts/DriverLayout';
import type { DriverProfile } from '@/types/driver';

interface Props {
    profile: DriverProfile;
}

export default function Profil({ profile }: Props) {
    const initials = profile.nama
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    return (
        <DriverLayout>
            <Head title="Profil Saya" />

            <div className="p-4 space-y-4">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="h-20 w-20 mb-3">
                                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <h2 className="text-xl font-bold">{profile.nama}</h2>
                            <p className="text-sm text-muted-foreground">
                                {profile.mitra?.nama}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* COD Balance Alert */}
                {profile.saldo_hutang > 0 && (
                    <Card className="border-yellow-300 bg-yellow-50">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-yellow-800">
                                        Saldo Hutang COD
                                    </p>
                                    <p className="text-2xl font-bold text-yellow-900 mt-1">
                                        {formatCurrency(profile.saldo_hutang)}
                                    </p>
                                    <p className="text-xs text-yellow-700 mt-1">
                                        Segera setor ke kasir
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                            <p className="text-2xl font-bold">
                                {profile.total_tugas_selesai}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Tugas Selesai
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <Wallet className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                            <p className="text-2xl font-bold">
                                {profile.total_volume}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Total m³
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Contact Info */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Informasi Kontak</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{profile.kontak}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{profile.email}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Mitra & Armada */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Mitra & Armada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    {profile.mitra?.nama}
                                </p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {profile.mitra?.tipe}
                                </p>
                            </div>
                        </div>
                        {profile.armada && (
                            <div className="flex items-center gap-3">
                                <Truck className="h-4 w-4 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">
                                        {profile.armada.plat_nomor}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Kapasitas: {profile.armada.kapasitas} m³
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Logout Button */}
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full"
                >
                    <Button variant="destructive" className="w-full h-12">
                        <LogOut className="mr-2 h-5 w-5" />
                        Keluar
                    </Button>
                </Link>
            </div>
        </DriverLayout>
    );
}
