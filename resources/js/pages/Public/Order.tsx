import { Head } from '@inertiajs/react';
import { OrderForm } from '@/components/forms';
import { PageHeader } from '@/components/shared';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/PublicLayout';

interface OrderPageProps {
    tariff?: {
        household: number;
        institution: number;
    };
}

export default function Order({ tariff }: OrderPageProps) {
    return (
        <PublicLayout>
            <Head title="Pesan Layanan" />

            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    title="Pesan Layanan Sedot Tinja"
                    description="Isi formulir di bawah untuk memesan layanan"
                    breadcrumbs={[
                        { label: 'Beranda', href: '/' },
                        { label: 'Pesan Layanan' },
                    ]}
                />

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Formulir Pemesanan</CardTitle>
                        <CardDescription>
                            Lengkapi data di bawah ini untuk melakukan pemesanan
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrderForm tariff={tariff} submitUrl="/order" />
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
