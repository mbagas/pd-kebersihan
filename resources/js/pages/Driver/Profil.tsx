import { Head, usePage } from '@inertiajs/react';
import DriverLayout from '@/layouts/DriverLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Profil() {
    const { auth } = usePage().props;
    const user = auth.user;

    const initials = user?.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <DriverLayout>
            <Head title="Profil Saya" />

            <div className="p-4">
                <h1 className="mb-4 text-xl font-bold">Profil Saya</h1>

                <Card>
                    <CardHeader className="items-center">
                        <Avatar className="h-20 w-20">
                            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                        </Avatar>
                        <CardTitle className="mt-4">{user?.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Role</span>
                                <span className="font-medium capitalize">{user?.role}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DriverLayout>
    );
}
