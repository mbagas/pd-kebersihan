import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/shared';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import PublicLayout from '@/layouts/PublicLayout';

export default function Tracking() {
    return (
        <PublicLayout>
            <Head title="Lacak Pesanan" />

            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    title="Lacak Pesanan"
                    description="Masukkan nomor tiket atau nomor HP untuk melacak pesanan Anda"
                    breadcrumbs={[
                        { label: 'Beranda', href: '/' },
                        { label: 'Lacak Pesanan' },
                    ]}
                />

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Cari Pesanan</CardTitle>
                        <CardDescription>
                            Masukkan nomor tiket atau nomor HP yang terdaftar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* TODO: Implement tracking form */}
                        <p className="text-muted-foreground">
                            Form pelacakan akan diimplementasikan di issue
                            berikutnya.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
