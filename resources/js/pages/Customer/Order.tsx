import { Head } from '@inertiajs/react';
import { OrderForm } from '@/components/forms';
import CustomerLayout from '@/layouts/CustomerLayout';
import type { CustomerAddress, CustomerProfile } from '@/types/customer';
import type { OrderFormPrefill } from '@/types/order';

interface OrderPageProps {
    tariff?: {
        household: number;
        institution: number;
    };
    addresses?: CustomerAddress[];
    profile?: CustomerProfile | null;
    prefill?: OrderFormPrefill;
}

export default function Order({
    tariff,
    addresses,
    profile,
    prefill,
}: OrderPageProps) {
    return (
        <CustomerLayout>
            <Head title="Pesan Layanan" />

            <div className="space-y-4 p-4">
                <div>
                    <h1 className="text-xl font-bold">
                        Pesan Layanan Sedot Tinja
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Isi formulir di bawah untuk memesan layanan
                    </p>
                </div>

                <OrderForm
                    tariff={tariff}
                    submitUrl="/customer/order"
                    addresses={addresses}
                    profile={profile}
                    prefill={prefill}
                />
            </div>
        </CustomerLayout>
    );
}
