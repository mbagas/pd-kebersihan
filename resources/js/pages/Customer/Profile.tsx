import { Head, useForm, usePage } from '@inertiajs/react';
import { Building2, Home, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CustomerLayout from '@/layouts/CustomerLayout';
import { cn } from '@/lib/utils';
import type { CustomerProfile as CustomerProfileType } from '@/types/customer';

interface Props {
    profile: CustomerProfileType;
}

export default function Profile({ profile }: Props) {
    const { auth } = usePage().props;
    const user = auth.user;

    const { data, setData, put, processing } = useForm({
        name: user.name,
        phone: user.phone ?? '',
        customer_type: profile.customer_type,
        company_name: profile.company_name ?? '',
        npwp: profile.npwp ?? '',
        pic_name: profile.pic_name ?? '',
        business_type: profile.business_type ?? '',
    });

    const isInstitution = data.customer_type === 'institution';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/customer/profile');
    };

    return (
        <CustomerLayout>
            <Head title="Profil Saya" />

            <form
                onSubmit={handleSubmit}
                className="space-y-4 p-4"
            >
                <h1 className="text-xl font-bold">
                    Profil Saya
                </h1>

                {/* Personal Info */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Informasi Pribadi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData(
                                        'name',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">
                                No. WhatsApp
                            </Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) =>
                                    setData(
                                        'phone',
                                        e.target.value,
                                    )
                                }
                                placeholder="081234567890"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Customer Type */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Tipe Pelanggan
                        </CardTitle>
                        <CardDescription>
                            Pilih sesuai kebutuhan layanan
                            Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'customer_type',
                                        'household',
                                    )
                                }
                                className={cn(
                                    'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                                    !isInstitution
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted hover:border-muted-foreground/30',
                                )}
                            >
                                <Home
                                    className={cn(
                                        'h-6 w-6',
                                        !isInstitution
                                            ? 'text-primary'
                                            : 'text-muted-foreground',
                                    )}
                                />
                                <span className="text-sm font-medium">
                                    Rumah Tangga
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'customer_type',
                                        'institution',
                                    )
                                }
                                className={cn(
                                    'flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors',
                                    isInstitution
                                        ? 'border-primary bg-primary/5'
                                        : 'border-muted hover:border-muted-foreground/30',
                                )}
                            >
                                <Building2
                                    className={cn(
                                        'h-6 w-6',
                                        isInstitution
                                            ? 'text-primary'
                                            : 'text-muted-foreground',
                                    )}
                                />
                                <span className="text-sm font-medium">
                                    Instansi
                                </span>
                            </button>
                        </div>

                        {/* Institution fields */}
                        {isInstitution && (
                            <>
                                <Separator />
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="company_name">
                                            Nama Instansi
                                        </Label>
                                        <Input
                                            id="company_name"
                                            value={
                                                data.company_name
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'company_name',
                                                    e.target
                                                        .value,
                                                )
                                            }
                                            placeholder="PT. Contoh Usaha"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="npwp">
                                            NPWP
                                        </Label>
                                        <Input
                                            id="npwp"
                                            value={
                                                data.npwp
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'npwp',
                                                    e.target
                                                        .value,
                                                )
                                            }
                                            placeholder="12.345.678.9-012.345"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pic_name">
                                            Nama PIC
                                        </Label>
                                        <Input
                                            id="pic_name"
                                            value={
                                                data.pic_name
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'pic_name',
                                                    e.target
                                                        .value,
                                                )
                                            }
                                            placeholder="Nama penanggung jawab"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="business_type">
                                            Jenis Usaha
                                        </Label>
                                        <Input
                                            id="business_type"
                                            value={
                                                data.business_type
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    'business_type',
                                                    e.target
                                                        .value,
                                                )
                                            }
                                            placeholder="Hotel, Restoran, dll."
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Password Link */}
                <Card>
                    <CardContent className="p-4">
                        <a
                            href="/settings/password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Ubah Password →
                        </a>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <Button
                    type="submit"
                    className="w-full gap-2"
                    disabled={processing}
                >
                    <Save className="h-4 w-4" />
                    Simpan Perubahan
                </Button>
            </form>
        </CustomerLayout>
    );
}
