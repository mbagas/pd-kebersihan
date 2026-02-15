import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DriverLayout from '@/layouts/DriverLayout';

interface Props {
    id: string;
}

export default function TugasShow({ id }: Props) {
    return (
        <DriverLayout>
            <Head title={`Detail Tugas #${id}`} />

            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Detail Tugas #{id}</h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Informasi Order</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">
                            Detail tugas akan ditampilkan di sini.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DriverLayout>
    );
}
