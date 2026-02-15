import { useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { CUSTOMER_TYPE } from '@/types/order';
import type { CustomerType } from '@/types/order';
import { AddressInput } from './AddressInput';
import { CustomerTypeSelector } from './CustomerTypeSelector';
import { FormField } from './FormField';
import { FormSection } from './FormSection';
import { MapPicker } from './MapPicker';
import { NPWPInput } from './NPWPInput';
import { PhoneInput } from './PhoneInput';
import { VolumeInput } from './VolumeInput';

interface MapLocation {
    lat: number;
    lng: number;
    address?: string;
}

interface OrderFormData {
    customer_type: CustomerType;
    name: string;
    phone: string;
    address: string;
    location: MapLocation | null;
    company_name: string;
    npwp: string;
    pic_name: string;
    business_type: string;
    estimated_volume: number;
    has_grease_trap: boolean;
    notes: string;
}

interface Tariff {
    household: number;
    institution: number;
}

interface OrderFormProps {
    tariff?: Tariff;
    onSuccess?: () => void;
    submitUrl?: string;
}

const DEFAULT_TARIFF: Tariff = {
    household: 150000,
    institution: 200000,
};

export function OrderForm({
    tariff = DEFAULT_TARIFF,
    onSuccess,
    submitUrl = '/order',
}: OrderFormProps) {
    const [customerType, setCustomerType] = useState<CustomerType>(
        CUSTOMER_TYPE.HOUSEHOLD,
    );
    const form = useForm<OrderFormData>({
        customer_type: CUSTOMER_TYPE.HOUSEHOLD,
        name: '',
        phone: '',
        address: '',
        location: null,
        company_name: '',
        npwp: '',
        pic_name: '',
        business_type: '',
        estimated_volume: 0,
        has_grease_trap: false,
        notes: '',
    });

    const isInstitution = customerType === CUSTOMER_TYPE.INSTITUTION;
    const estimatedPrice = useMemo(() => {
        const basePrice = isInstitution ? tariff.institution : tariff.household;
        const volume = form.data.estimated_volume || 1;
        return basePrice * volume;
    }, [isInstitution, tariff, form.data.estimated_volume]);

    const handleCustomerTypeChange = (type: CustomerType) => {
        setCustomerType(type);
        form.setData('customer_type', type);
    };

    const handleLocationChange = (location: MapLocation) => {
        form.setData('location', location);
        if (location?.address && !form.data.address) {
            form.setData('address', location.address);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        form.post(submitUrl, {
            onSuccess: () => {
                form.reset();
                setCustomerType(CUSTOMER_TYPE.HOUSEHOLD);
                onSuccess?.();
            },
            forceFormData: true,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <FormSection
                title="Tipe Pelanggan"
                description="Pilih kategori pelanggan untuk menentukan tarif"
            >
                <CustomerTypeSelector
                    value={customerType}
                    onChange={handleCustomerTypeChange}
                    disabled={form.processing}
                />
            </FormSection>

            <FormSection
                title="Data Pelanggan"
                description={
                    isInstitution
                        ? 'Lengkapi data instansi/perusahaan'
                        : 'Lengkapi data diri Anda'
                }
            >
                {isInstitution ? (
                    <>
                        <FormField
                            label="Nama Instansi/Perusahaan"
                            htmlFor="company_name"
                            error={form.errors.company_name}
                            required
                        >
                            <Input
                                id="company_name"
                                value={form.data.company_name}
                                onChange={(e) =>
                                    form.setData('company_name', e.target.value)
                                }
                                placeholder="PT. Contoh Perusahaan"
                                disabled={form.processing}
                            />
                        </FormField>
                        <FormField
                            label="NPWP"
                            htmlFor="npwp"
                            error={form.errors.npwp}
                            description="Nomor Pokok Wajib Pajak (15 digit)"
                        >
                            <NPWPInput
                                id="npwp"
                                onChange={(value) =>
                                    form.setData('npwp', value)
                                }
                                disabled={form.processing}
                            />
                        </FormField>
                        <FormField
                            label="Jenis Usaha"
                            htmlFor="business_type"
                            error={form.errors.business_type}
                            required
                        >
                            <Input
                                id="business_type"
                                value={form.data.business_type}
                                onChange={(e) =>
                                    form.setData(
                                        'business_type',
                                        e.target.value,
                                    )
                                }
                                placeholder="Hotel, Restoran, Rumah Sakit, dll"
                                disabled={form.processing}
                            />
                        </FormField>
                        <FormField
                            label="Nama PIC (Person In Charge)"
                            htmlFor="pic_name"
                            error={form.errors.pic_name}
                            required
                        >
                            <Input
                                id="pic_name"
                                value={form.data.pic_name}
                                onChange={(e) =>
                                    form.setData('pic_name', e.target.value)
                                }
                                placeholder="Nama penanggung jawab"
                                disabled={form.processing}
                            />
                        </FormField>
                    </>
                ) : (
                    <FormField
                        label="Nama Lengkap"
                        htmlFor="name"
                        error={form.errors.name}
                        required
                    >
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                            placeholder="Nama lengkap Anda"
                            disabled={form.processing}
                        />
                    </FormField>
                )}
                <FormField
                    label="Nomor WhatsApp"
                    htmlFor="phone"
                    error={form.errors.phone}
                    required
                    description="Kami akan menghubungi Anda via WhatsApp"
                >
                    <PhoneInput
                        id="phone"
                        onChange={(value) => form.setData('phone', value)}
                        disabled={form.processing}
                    />
                </FormField>
            </FormSection>

            <FormSection
                title="Lokasi Penyedotan"
                description="Tentukan lokasi yang akan dikunjungi petugas"
            >
                <FormField
                    label="Pilih Lokasi di Peta"
                    error={form.errors.location as string}
                    required
                >
                    <MapPicker
                        value={form.data.location ?? undefined}
                        onChange={handleLocationChange}
                    />
                </FormField>
                <FormField
                    label="Alamat Lengkap"
                    htmlFor="address"
                    error={form.errors.address}
                    required
                    description="Sertakan patokan jika perlu"
                >
                    <AddressInput
                        id="address"
                        value={form.data.address}
                        onChange={(value) => form.setData('address', value)}
                        disabled={form.processing}
                    />
                </FormField>
            </FormSection>

            {isInstitution && (
                <FormSection
                    title="Informasi Teknis"
                    description="Data untuk estimasi kebutuhan armada"
                >
                    <FormField
                        label="Estimasi Volume"
                        htmlFor="estimated_volume"
                        error={form.errors.estimated_volume}
                        description="Perkiraan volume limbah dalam meter kubik"
                    >
                        <VolumeInput
                            id="estimated_volume"
                            onChange={(value) =>
                                form.setData('estimated_volume', value)
                            }
                            maxVolume={50}
                            disabled={form.processing}
                        />
                    </FormField>
                    <FormField label="Grease Trap" htmlFor="has_grease_trap">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="has_grease_trap"
                                checked={form.data.has_grease_trap}
                                onChange={(e) =>
                                    form.setData(
                                        'has_grease_trap',
                                        e.target.checked,
                                    )
                                }
                                disabled={form.processing}
                                className="h-4 w-4 rounded border-gray-300"
                            />
                            <span className="text-sm">
                                Lokasi memiliki grease trap (penangkap lemak)
                            </span>
                        </label>
                    </FormField>
                </FormSection>
            )}

            <FormSection title="Catatan Tambahan">
                <FormField
                    label="Catatan"
                    htmlFor="notes"
                    error={form.errors.notes}
                    description="Informasi tambahan untuk petugas (opsional)"
                >
                    <AddressInput
                        id="notes"
                        value={form.data.notes}
                        onChange={(value) => form.setData('notes', value)}
                        maxLength={300}
                        placeholder="Contoh: Akses jalan sempit, parkir di depan warung..."
                        disabled={form.processing}
                    />
                </FormField>
            </FormSection>

            <div className="rounded-lg border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Estimasi Biaya</p>
                        <p className="text-xs text-muted-foreground">
                            {isInstitution
                                ? `Rp ${tariff.institution.toLocaleString('id-ID')}/m³ × ${form.data.estimated_volume || 1} m³`
                                : 'Tarif Rumah Tangga'}
                        </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                        Rp {estimatedPrice.toLocaleString('id-ID')}
                    </p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                    * Biaya final akan dihitung berdasarkan volume aktual saat
                    pengerjaan
                </p>
            </div>

            {form.hasErrors && (
                <InputError message="Mohon periksa kembali data yang diisi" />
            )}

            <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={form.processing}
            >
                {form.processing && <Spinner className="mr-2" />}
                {form.processing ? 'Mengirim Pesanan...' : 'Kirim Pesanan'}
            </Button>
        </form>
    );
}
