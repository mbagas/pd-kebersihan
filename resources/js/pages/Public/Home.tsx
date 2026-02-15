import { Head, Link } from '@inertiajs/react';
import { Truck, MapPin, CreditCard, Phone } from 'lucide-react';
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
            icon: Phone,
            title: 'Lacak Pesanan',
            description: 'Pantau status pesanan Anda secara real-time',
        },
    ];

    return (
        <PublicLayout>
            <Head title="Beranda" />

            {/* Hero Section */}
            <section className="bg-gradient-to-b from-primary/10 to-background py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
                        Layanan Sedot Tinja
                        <span className="block text-primary">
                            Terpercaya & Profesional
                        </span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
                        PD. Kebersihan Tapis Berseri melayani kebutuhan
                        pengelolaan air limbah domestik untuk rumah tangga dan
                        instansi di Kota Bandar Lampung.
                    </p>
                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Button asChild size="lg">
                            <Link href="/order">Pesan Sekarang</Link>
                        </Button>
                        <Button asChild variant="outline" size="lg">
                            <Link href="/tracking">Lacak Pesanan</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-2xl font-bold">
                        Mengapa Memilih Kami?
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <Card key={feature.title}>
                                    <CardHeader>
                                        <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg">
                                            {feature.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>
                                            {feature.description}
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
