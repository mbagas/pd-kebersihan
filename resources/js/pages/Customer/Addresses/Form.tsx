import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { MapPicker } from '@/components/forms';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import CustomerLayout from '@/layouts/CustomerLayout';
import { cn } from '@/lib/utils';
import type { CustomerAddress } from '@/types/customer';

interface Props {
    address: CustomerAddress | null;
}

const LABEL_PRESETS = ['Rumah', 'Kantor', 'Kos'];

export default function AddressForm({ address }: Props) {
    const isEditing = address !== null;

    const { data, setData, post, put, processing, errors } =
        useForm({
            label: address?.label ?? '',
            address: address?.address ?? '',
            lat: address?.lat ?? 0,
            lng: address?.lng ?? 0,
            notes: address?.notes ?? '',
            is_default: address?.is_default ?? false,
        });

    const handleMapChange = (location: {
        lat: number;
        lng: number;
        address?: string;
    }) => {
        setData((prev) => ({
            ...prev,
            lat: location.lat,
            lng: location.lng,
            address: location.address ?? prev.address,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            put(`/customer/addresses/${address.id}`);
        } else {
            post('/customer/addresses');
        }
    };

    const handleLabelPreset = (label: string) => {
        setData('label', label);
    };

    const isCustomLabel =
        data.label !== '' && !LABEL_PRESETS.includes(data.label);

    return (
        <CustomerLayout>
            <Head
                title={
                    isEditing
                        ? 'Edit Alamat'
                        : 'Tambah Alamat'
                }
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-4 p-4"
            >
                {/* Back button */}
                <Link
                    href="/customer/addresses"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                </Link>

                <h1 className="text-xl font-bold">
                    {isEditing
                        ? 'Edit Alamat'
                        : 'Tambah Alamat'}
                </h1>

                {/* Label */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Label
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {LABEL_PRESETS.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() =>
                                        handleLabelPreset(
                                            preset,
                                        )
                                    }
                                    className={cn(
                                        'rounded-full border px-3 py-1.5 text-sm transition-colors',
                                        data.label === preset
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-muted hover:border-muted-foreground/30',
                                    )}
                                >
                                    {preset}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={() =>
                                    setData('label', '')
                                }
                                className={cn(
                                    'rounded-full border px-3 py-1.5 text-sm transition-colors',
                                    isCustomLabel
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-muted hover:border-muted-foreground/30',
                                )}
                            >
                                Lainnya
                            </button>
                        </div>
                        {(isCustomLabel ||
                            (!LABEL_PRESETS.includes(
                                data.label,
                            ) &&
                                data.label === '')) && (
                            <Input
                                placeholder="Masukkan label..."
                                value={
                                    isCustomLabel
                                        ? data.label
                                        : ''
                                }
                                onChange={(e) =>
                                    setData(
                                        'label',
                                        e.target.value,
                                    )
                                }
                                autoFocus
                            />
                        )}
                        {errors.label && (
                            <p className="text-xs text-destructive">
                                {errors.label}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Address + Map */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Lokasi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <Label htmlFor="address">
                                Alamat Lengkap
                            </Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData(
                                        'address',
                                        e.target.value,
                                    )
                                }
                                placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan"
                                rows={2}
                            />
                            {errors.address && (
                                <p className="text-xs text-destructive">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Pilih Lokasi di Peta
                            </Label>
                            <MapPicker
                                value={
                                    data.lat && data.lng
                                        ? {
                                              lat: data.lat,
                                              lng: data.lng,
                                              address:
                                                  data.address,
                                          }
                                        : undefined
                                }
                                onChange={handleMapChange}
                                className="h-[250px]"
                            />
                            {(errors.lat || errors.lng) && (
                                <p className="text-xs text-destructive">
                                    Pilih lokasi di peta
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">
                            Catatan (Opsional)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            value={data.notes}
                            onChange={(e) =>
                                setData(
                                    'notes',
                                    e.target.value,
                                )
                            }
                            placeholder="Patokan, warna rumah, akses jalan..."
                            rows={2}
                        />
                        {errors.notes && (
                            <p className="text-xs text-destructive">
                                {errors.notes}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Default checkbox */}
                <div className="flex items-center gap-2 rounded-lg border p-4">
                    <Checkbox
                        id="is_default"
                        checked={data.is_default}
                        onCheckedChange={(checked) =>
                            setData(
                                'is_default',
                                checked === true,
                            )
                        }
                    />
                    <Label
                        htmlFor="is_default"
                        className="text-sm"
                    >
                        Jadikan alamat default
                    </Label>
                </div>

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={processing}
                >
                    {processing
                        ? 'Menyimpan...'
                        : isEditing
                          ? 'Simpan Perubahan'
                          : 'Tambah Alamat'}
                </Button>
            </form>
        </CustomerLayout>
    );
}
