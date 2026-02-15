import { Link } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useCurrentUrl } from '@/hooks/use-current-url';

const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/order', label: 'Pesan' },
    { href: '/tracking', label: 'Lacak' },
];

export default function PublicLayout({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isCurrentUrl } = useCurrentUrl();

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

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center gap-6 md:flex">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-foreground',
                                    isCurrentUrl(item.href)
                                        ? 'text-foreground'
                                        : 'text-muted-foreground'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Masuk
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </div>
            </header>

            {/* Mobile Navigation Sheet */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent side="right" className="w-72">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-sm font-bold">PD</span>
                            </div>
                            <span>SIM-PALD</span>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="mt-6 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isCurrentUrl(item.href)
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="mt-4 rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Masuk
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-muted/50 py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} PD. Kebersihan Tapis
                        Berseri Kota Bandar Lampung
                    </p>
                    <p className="mt-1">
                        Sistem Informasi Manajemen Pengelolaan Air Limbah
                        Domestik
                    </p>
                </div>
            </footer>
        </div>
    );
}
