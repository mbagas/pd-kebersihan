import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-bold">PD</span>
                        </div>
                        <span className="font-semibold">SIM-PALD</span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Beranda
                        </Link>
                        <Link href="/order" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Pesan
                        </Link>
                        <Link href="/tracking" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                            Lacak
                        </Link>
                        <Link href="/login" className="text-sm font-medium text-primary hover:underline">
                            Masuk
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-muted/50 py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} PD. Kebersihan Tapis Berseri Kota Bandar Lampung</p>
                    <p className="mt-1">Sistem Informasi Manajemen Pengelolaan Air Limbah Domestik</p>
                </div>
            </footer>
        </div>
    );
}
