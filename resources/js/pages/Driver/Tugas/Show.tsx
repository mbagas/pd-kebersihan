import { Head, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Camera,
    CheckCircle,
    Clock,
    CreditCard,
    MapPin,
    Navigation,
    Phone,
    Play,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PhotoUploader, VolumeInput } from '@/components/forms';
import { getGoogleMapsDirectionUrl } from '@/components/forms/MapPicker';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import DriverLayout from '@/layouts/DriverLayout';
import { cn } from '@/lib/utils';
import { PAYMENT_METHOD_LABELS } from '@/types/admin';
import type { DriverTask, GpsInvalidReason } from '@/types/driver';
import {
    DRIVER_ORDER_STATUS,
    DRIVER_ORDER_STATUS_COLORS,
    DRIVER_ORDER_STATUS_LABELS,
    GPS_INVALID_REASON_LABELS,
    GPS_INVALID_REASONS,
} from '@/types/driver';
import { CUSTOMER_TYPE_LABELS } from '@/types/order';


interface Props {
    task: DriverTask;
    tarif: number;
    armadaKapasitas: number;
}

export default function TugasShow({ task, tarif, armadaKapasitas }: Props) {
    const [gpsModalOpen, setGpsModalOpen] = useState(false);
    const [isCheckingGps, setIsCheckingGps] = useState(false);
    const [gpsResult, setGpsResult] = useState<{
        valid: boolean;
        distance?: number;
    } | null>(null);

    const form = useForm({
        foto_sebelum: [] as File[],
        foto_sesudah: [] as File[],
        volume_actual: task.volume_actual || task.volume_estimate,
        gps_invalid_reason: '' as GpsInvalidReason | '',
        gps_invalid_note: '',
    });

    const calculatedTotal = form.data.volume_actual * tarif;

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);

    const handleStatusUpdate = (newStatus: string) => {
        if (newStatus === DRIVER_ORDER_STATUS.ARRIVED) {
            // Trigger GPS check
            setGpsModalOpen(true);
            checkGpsLocation();
        } else {
            router.post(
                `/app/tugas/${task.id}/status`,
                { status: newStatus },
                {
                    onSuccess: () => toast.success('Status berhasil diperbarui'),
                },
            );
        }
    };

    const checkGpsLocation = () => {
        setIsCheckingGps(true);
        // Mock GPS check - in real implementation would use navigator.geolocation
        setTimeout(() => {
            // Simulate random result for demo
            const isValid = Math.random() > 0.3;
            const distance = isValid
                ? Math.floor(Math.random() * 400)
                : Math.floor(Math.random() * 500) + 500;
            setGpsResult({ valid: isValid, distance });
            setIsCheckingGps(false);
        }, 2000);
    };

    const handleGpsConfirm = () => {
        router.post(
            `/app/tugas/${task.id}/status`,
            {
                status: DRIVER_ORDER_STATUS.ARRIVED,
                gps_valid: gpsResult?.valid,
                gps_invalid_reason: form.data.gps_invalid_reason,
                gps_invalid_note: form.data.gps_invalid_note,
            },
            {
                onSuccess: () => {
                    setGpsModalOpen(false);
                    toast.success('Sampai di lokasi dikonfirmasi');
                },
            },
        );
    };

    const handleComplete = () => {
        if (form.data.foto_sebelum.length === 0) {
            toast.error('Foto sebelum wajib diupload');
            return;
        }
        if (form.data.foto_sesudah.length === 0) {
            toast.error('Foto sesudah wajib diupload');
            return;
        }
        if (form.data.volume_actual > armadaKapasitas) {
            toast.error(`Volume tidak boleh melebihi kapasitas armada (${armadaKapasitas} m³)`);
            return;
        }

        router.post(`/app/tugas/${task.id}/complete`, form.data, {
            onSuccess: () => toast.success('Tugas berhasil diselesaikan'),
        });
    };

    const openNavigation = () => {
        if (task.latitude && task.longitude) {
            window.open(
                getGoogleMapsDirectionUrl(task.latitude, task.longitude),
                '_blank',
            );
        }
    };

    const renderActionButton = () => {
        switch (task.status) {
            case DRIVER_ORDER_STATUS.ASSIGNED:
                return (
                    <Button
                        className="w-full h-14 text-base font-semibold"
                        onClick={() => handleStatusUpdate(DRIVER_ORDER_STATUS.ON_THE_WAY)}
                    >
                        <Play className="mr-2 h-5 w-5" />
                        Mulai Perjalanan
                    </Button>
                );
            case DRIVER_ORDER_STATUS.ON_THE_WAY:
                return (
                    <Button
                        className="w-full h-14 text-base font-semibold"
                        onClick={() => handleStatusUpdate(DRIVER_ORDER_STATUS.ARRIVED)}
                    >
                        <MapPin className="mr-2 h-5 w-5" />
                        Sampai di Lokasi
                    </Button>
                );
            case DRIVER_ORDER_STATUS.ARRIVED:
            case DRIVER_ORDER_STATUS.PROCESSING:
                return null; // Form pengerjaan shown instead
            default:
                return null;
        }
    };

    const showWorkForm =
        task.status === DRIVER_ORDER_STATUS.ARRIVED ||
        task.status === DRIVER_ORDER_STATUS.PROCESSING;

    return (
        <DriverLayout>
            <Head title={`Tugas ${task.order_number}`} />

            <div className="flex flex-col min-h-full">
                {/* Header - Compact for mobile */}
                <div className="sticky top-14 z-40 bg-background border-b">
                    <div className="flex items-center gap-3 px-4 py-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 shrink-0 -ml-2"
                            onClick={() => router.visit('/app/tugas')}
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <Badge
                                    className={cn(
                                        'text-xs',
                                        DRIVER_ORDER_STATUS_COLORS[task.status],
                                    )}
                                >
                                    {DRIVER_ORDER_STATUS_LABELS[task.status]}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                    {task.order_number}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content - Better spacing for mobile */}
                <div className="flex-1 px-4 py-4 space-y-4 pb-36">
                    {/* Customer Info Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 pt-4 px-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4" />
                                Informasi Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 space-y-4">
                            {/* Customer name & type */}
                            <div className="flex items-start justify-between gap-2">
                                <h2 className="font-semibold text-lg leading-tight">
                                    {task.customer_name}
                                </h2>
                                <Badge variant="outline" className="shrink-0 text-xs">
                                    {CUSTOMER_TYPE_LABELS[task.customer_type]}
                                </Badge>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-0.5">Alamat</p>
                                    <p className="text-sm leading-snug">{task.customer_address}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-3">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground mb-0.5">Telepon</p>
                                    <a
                                        href={`tel:${task.customer_phone}`}
                                        className="text-sm text-primary font-medium"
                                    >
                                        {task.customer_phone}
                                    </a>
                                </div>
                            </div>

                            {/* Notes */}
                            {task.notes && (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                    <p className="text-xs font-medium text-amber-800 mb-1">📝 Catatan</p>
                                    <p className="text-sm text-amber-700">{task.notes}</p>
                                </div>
                            )}

                            {/* Navigation button */}
                            {task.latitude && task.longitude && (
                                <Button
                                    variant="outline"
                                    className="w-full h-11"
                                    onClick={openNavigation}
                                >
                                    <Navigation className="mr-2 h-4 w-4" />
                                    Navigasi ke Lokasi
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Info Card */}
                    <Card className="overflow-hidden">
                        <CardHeader className="pb-3 pt-4 px-4">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                <CreditCard className="h-4 w-4" />
                                Detail Order
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Volume</p>
                                    <p className="font-semibold">{task.volume_estimate} m³</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Pembayaran</p>
                                    <p className="font-semibold">{PAYMENT_METHOD_LABELS[task.payment_method]}</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-xs text-muted-foreground mb-1">Armada</p>
                                    <p className="font-semibold text-sm">{task.armada?.plat_nomor}</p>
                                    <p className="text-xs text-muted-foreground">{task.armada?.kapasitas} m³</p>
                                </div>
                                {task.scheduled_at && (
                                    <div className="p-3 bg-muted/50 rounded-lg">
                                        <p className="text-xs text-muted-foreground mb-1">Jadwal</p>
                                        <p className="font-semibold text-sm">
                                            {new Date(task.scheduled_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(task.scheduled_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Work Form - shown when arrived or processing */}
                    {showWorkForm && (
                        <Card className="overflow-hidden">
                            <CardHeader className="pb-3 pt-4 px-4">
                                <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                                    <Camera className="h-4 w-4" />
                                    Form Pengerjaan
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4 space-y-5">
                                {/* Foto Sebelum */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Foto Sebelum <span className="text-destructive">*</span>
                                    </Label>
                                    <PhotoUploader
                                        value={form.data.foto_sebelum}
                                        onChange={(files) =>
                                            form.setData('foto_sebelum', files)
                                        }
                                        maxFiles={3}
                                        showCamera
                                    />
                                </div>

                                <Separator />

                                {/* Foto Sesudah */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Foto Sesudah <span className="text-destructive">*</span>
                                    </Label>
                                    <PhotoUploader
                                        value={form.data.foto_sesudah}
                                        onChange={(files) =>
                                            form.setData('foto_sesudah', files)
                                        }
                                        maxFiles={3}
                                        showCamera
                                    />
                                </div>

                                <Separator />

                                {/* Volume Realisasi */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Volume Realisasi
                                    </Label>
                                    <VolumeInput
                                        value={form.data.volume_actual.toString()}
                                        onChange={(val) =>
                                            form.setData('volume_actual', val)
                                        }
                                        maxVolume={armadaKapasitas}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Maks: {armadaKapasitas} m³ (kapasitas armada)
                                    </p>
                                </div>

                                {/* Kalkulasi Total */}
                                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Volume × Tarif</span>
                                        <span>
                                            {form.data.volume_actual} m³ × {formatCurrency(tarif)}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Tagihan</span>
                                        <span className="text-xl font-bold text-primary">
                                            {formatCurrency(calculatedTotal)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Fixed Bottom Action - Better mobile spacing */}
                <div
                    className="fixed bottom-16 left-0 right-0 bg-background border-t shadow-lg"
                    style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
                >
                    <div className="p-4">
                        {renderActionButton()}

                        {showWorkForm && (
                            <div className="space-y-3">
                                {task.payment_method === 'cash' ? (
                                    <Button
                                        className="w-full h-14 text-base bg-green-600 hover:bg-green-700 font-semibold"
                                        onClick={handleComplete}
                                        disabled={form.processing}
                                    >
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Terima Tunai {formatCurrency(calculatedTotal)}
                                    </Button>
                                ) : (
                                    <>
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center text-sm text-yellow-800">
                                            <Clock className="h-4 w-4 inline mr-1.5" />
                                            Pembayaran Transfer - Menunggu verifikasi admin
                                        </div>
                                        <Button
                                            className="w-full h-14 text-base font-semibold"
                                            onClick={handleComplete}
                                            disabled={form.processing}
                                        >
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Selesaikan Tugas
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {task.status === DRIVER_ORDER_STATUS.DONE && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-800">
                                <CheckCircle className="h-5 w-5 inline mr-2" />
                                <span className="font-medium">Tugas sudah selesai</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* GPS Validation Modal */}
                <Dialog open={gpsModalOpen} onOpenChange={setGpsModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Validasi Lokasi</DialogTitle>
                            <DialogDescription>
                                Memverifikasi posisi Anda dengan lokasi order
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            {isCheckingGps ? (
                                <div className="text-center py-8">
                                    <div className="h-8 w-8 mx-auto mb-3 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                    <p className="text-sm text-muted-foreground">
                                        Memeriksa lokasi GPS...
                                    </p>
                                </div>
                            ) : gpsResult ? (
                                <div className="space-y-4">
                                    {gpsResult.valid ? (
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                                            <p className="font-medium text-green-800">
                                                Lokasi Valid
                                            </p>
                                            <p className="text-sm text-green-600">
                                                Jarak: {gpsResult.distance}m dari lokasi order
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-center">
                                                <MapPin className="h-8 w-8 mx-auto mb-2 text-red-600" />
                                                <p className="font-medium text-red-800">
                                                    Lokasi Tidak Valid
                                                </p>
                                                <p className="text-sm text-red-600">
                                                    Jarak: {gpsResult.distance}m (maks 500m)
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Alasan</Label>
                                                <Select
                                                    value={form.data.gps_invalid_reason}
                                                    onValueChange={(v) =>
                                                        form.setData(
                                                            'gps_invalid_reason',
                                                            v as GpsInvalidReason,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih alasan" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.entries(GPS_INVALID_REASON_LABELS).map(
                                                            ([key, label]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    {label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {form.data.gps_invalid_reason === GPS_INVALID_REASONS.OTHER && (
                                                <div className="space-y-2">
                                                    <Label>Keterangan</Label>
                                                    <Textarea
                                                        value={form.data.gps_invalid_note}
                                                        onChange={(e) =>
                                                            form.setData('gps_invalid_note', e.target.value)
                                                        }
                                                        placeholder="Jelaskan alasan..."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={() => setGpsModalOpen(false)}>
                                Batal
                            </Button>
                            <Button
                                onClick={handleGpsConfirm}
                                disabled={
                                    isCheckingGps ||
                                    (!gpsResult?.valid && !form.data.gps_invalid_reason)
                                }
                            >
                                Konfirmasi
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </DriverLayout>
    );
}
