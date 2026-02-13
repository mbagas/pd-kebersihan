import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ClipboardList, History, User, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DriverLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    const navItems = [
        { href: '/app/tugas', label: 'Tugas', icon: ClipboardList },
        { href: '/app/riwayat', label: 'Riwayat', icon: History },
        { href: '/app/profil', label: 'Profil', icon: User },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground">
                <div className="flex h-14 items-center justify-between px-4">
                    <span className="font-semibold">SIM-PALD Driver</span>
                    <span className="text-sm opacity-90">{auth.user?.name}</span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pb-16">{children}</main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
                <div className="flex h-16 items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentUrl?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex flex-col items-center gap-1 px-4 py-2',
                                    isActive ? 'text-primary' : 'text-muted-foreground',
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        );
                    })}
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex flex-col items-center gap-1 px-4 py-2 text-muted-foreground"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-xs">Keluar</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
