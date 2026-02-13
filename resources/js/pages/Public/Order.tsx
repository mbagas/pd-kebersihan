import PublicLayout from '@/layouts/PublicLayout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared';

export default function Order() {
    return (
        <PublicLayout>
            <Head title="Pesan Layanan" />

            <div className="container mx-auto px-4 py-8">
                <PageHeader
                    title="Pesan Layanan Sedot Tinja"
                    description="Isi formulir di bawah untuk memesan layanan"
                    breadcrumbs={[{ label: 'Beranda', href: '/' }, { label: 'Pesan Layanan' }]}
                />

                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Formulir Pemesanan</CardTitle>
                        <CardDescription>Lengkapi data di bawah ini untuk melakukan pemesanan</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* TODO: Implement order form */}
                        <p className="text-muted-foreground">Form pemesanan akan diimplementasikan di issue berikutnya.</p>
                    </CardContent>
                </Card>
            </div>
        </PublicLayout>
    );
}
