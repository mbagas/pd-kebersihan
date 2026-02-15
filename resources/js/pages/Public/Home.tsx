import { Head, Link } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    ClipboardList,
    Clock,
    CreditCard,
    Home as HomeIcon,
    Mail,
    MapPin,
    Phone,
    Truck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/PublicLayout';

export default function Home() {
    const features = [
        {
            icon: Truck,
            title: 'Layanan Sedot Tinja',
            description: 'Layanan profesional untuk rumah tangga dan instansi',
        },
        {
            icon: MapPin,
            title: 'Jangkauan Luas',
            description: 'Melayani seluruh wilayah Kota Bandar Lampung',
        },
        {
            icon: CreditCard,
            title: 'Pembayaran Mudah',
            description: 'Tunai atau transfer, sesuai kebutuhan Anda',
        },
        {
            icon: Clock,
            title: 'Lacak Pesanan',
            description: 'Pantau status pesanan Anda secara real-time',
        },
    ];

    const steps = [
        {
            number: 1,
            title: 'Pilih Tipe Pelanggan',
            description: 'Rumah Tangga atau Instansi/Niaga',
            icon: HomeIcon,
        },
        {
            number: 2,
            title: 'Isi Data & Lokasi',
            description: 'Lengkapi formulir dan tentukan lokasi di peta',
            icon: ClipboardList,
        },
        {
            number: 3,
            title: 'Konfirmasi Pesanan',
            description: 'Review data dan dapatkan nomor tiket',
            icon: CheckCircle2,
        },
        {
            number: 4,
            title: 'Tunggu Petugas',
            description: 'Lacak status dan tunggu kedatangan petugas',
            icon: Truck,
        },
    ];

    const services = [
        {
            icon: HomeIcon,
            title: 'Rumah Tangga',
            description: 'Layanan penyedotan untuk rumah pribadi',
            price: 'Mulai Rp 150.000/m³',
            features: [
                'Proses cepat',
                'Pembayaran COD',
                'Petugas profesional',
            ],
        },
        {
            icon: Building2,
            title: 'Instansi / Niaga',
            description: 'Hotel, restoran, rumah sakit, perkantoran',
            price: 'Mulai Rp 200.000/m³',
            features: [
                'Volume besar',
                'Faktur pajak tersedia',
                'Kontrak berkala',
            ],
        },
    ];

    return (
        <PublicLayout>
            <Head title="Beranda">
                <meta
                    name="description"
                    content="PD. Kebersihan Tapis Berseri - Layanan sedot tinja profesional untuk rumah tangga dan instansi di Kota Bandar Lampung"
                />
            </Head>

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Layanan Sedot Tinja
                        <span className="block text-primary">
                            Terpercaya & Profesional
                        </span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground sm:text-lg">
                        PD. Kebersihan Tapis Berseri melayani kebutuhan
                        pengelolaan air limbah domestik untuk rumah tangga dan
                        instansi di Kota Bandar Lampung.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                        <Button asChild size="lg" className="w-full sm:w-auto">
                            <Link href="/order">Pesan Sekarang</Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto"
                        >
                            <Link href="/tracking">Lacak Pesanan</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-xl font-bold sm:text-2xl">
                        Mengapa Memilih Kami?
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={feature.title}>
                                    <CardHeader className="pb-2">
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
                                            <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
                                        </div>
                                        <CardTitle className="text-base sm:text-lg">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-sm">
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="bg-muted/30 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-center text-xl font-bold sm:text-2xl">
                        Layanan Kami
                    </h2>
                    <p className="mb-8 text-center text-sm text-muted-foreground sm:text-base">
                        Pilih layanan sesuai kebutuhan Anda
                    </p>
                    <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
                        {services.map((service) => {
                            const Icon = service.icon;
                            return (
                                <Card
                                    key={service.title}
                                    className="relative overflow-hidden"
                                >
                                    <CardHeader>
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle>{service.title}</CardTitle>
                                        <CardDescription>
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <p className="text-lg font-semibold text-primary">
                                            {service.price}
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            {service.features.map((f) => (
                                                <li
                                                    key={f}
                                                    className="flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How to Order Section */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-center text-xl font-bold sm:text-2xl">
                        Cara Pemesanan
                    </h2>
                    <p className="mb-8 text-center text-sm text-muted-foreground sm:text-base">
                        Pesan layanan dalam 4 langkah mudah
                    </p>
                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.number}
                                        className="relative flex flex-col items-center text-center"
                                    >
                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground sm:h-16 sm:w-16">
                                            {step.number}
                                        </div>
                                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                            <Icon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <h3 className="mb-1 font-semibold">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 text-center">
                            <Button asChild size="lg">
                                <Link href="/order">Mulai Pesan</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-muted/30 py-12 md:py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-2 text-center text-xl font-bold sm:text-2xl">
                        Hubungi Kami
                    </h2>
                    <p className="mb-8 text-center text-sm text-muted-foreground sm:text-base">
                        Butuh bantuan? Tim kami siap melayani
                    </p>
                    <div className="mx-auto max-w-2xl">
                        <Card>
                            <CardContent className="grid gap-6 p-6 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                        <div>
                                            <p className="font-medium">Alamat</p>
                                            <p className="text-sm text-muted-foreground">
                                                Jl. Way Pengubuan No. 1
                                                <br />
                                                Pahoman, Bandar Lampung
                                                <br />
                                                Lampung 35214
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                        <div>
                                            <p className="font-medium">
                                                Jam Operasional
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Senin - Jumat: 08.00 - 16.00
                                                <br />
                                                Sabtu: 08.00 - 12.00
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Phone className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                        <div>
                                            <p className="font-medium">Telepon</p>
                                            <p className="text-sm text-muted-foreground">
                                                (0721) 123-456
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                WhatsApp: 0812-3456-7890
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Mail className="mt-1 h-5 w-5 shrink-0 text-primary" />
                                        <div>
                                            <p className="font-medium">Email</p>
                                            <p className="text-sm text-muted-foreground">
                                                info@pdkebersihan.go.id
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
