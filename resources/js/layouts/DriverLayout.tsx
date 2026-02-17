import { Link, usePage } from '@inertiajs/react';
import {
    ClipboardList,
    History,
    LogOut,
    User,
    Wifi,
    WifiOff,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useOnlineStatus } from '@/hooks/use-online-status';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/app/tugas', label: 'Tugas', icon: ClipboardList },
    { href: '/app/riwayat', label: 'Riwayat', icon: History },
    { href: '/app/profil', label: 'Profil', icon: User },
];

export default function DriverLayout({ children }: PropsWithChildren) {
    const { auth } = usePage().props;
    const { isCurrentUrl } = useCurrentUrl();
    const isOnline = useOnlineStatus();

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header with safe area */}
            <header
                className="sticky top-0 z-50 border-b bg-primary text-primary-foreground"
                style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
            >
                <div className="flex h-14 items-center justify-between px-4">
                    <span className="font-semibold">SIM-PALD Driver</span>
                    <div className="flex items-center gap-3">
                        {/* Online/Offline Status */}
                        <div
                            className={cn(
                                'flex items-center gap-1.5 rounded-full px-2 py-1 text-xs',
                                isOnline
                                    ? 'bg-green-500/20 text-green-100'
                                    : 'bg-red-500/20 text-red-100',
                            )}
                        >
                            {isOnline ? (
                                <>
                                    <Wifi className="h-3 w-3" />
                                    <span>Online</span>
                                </>
                            ) : (
                                <>
                                    <WifiOff className="h-3 w-3" />
                                    <span>Offline</span>
                                </>
                            )}
                        </div>
                        <span className="text-sm opacity-90">
                            {auth.user?.name}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main Content - uses native scroll */}
            <main>{children}</main>

            {/* Bottom Navigation with safe area */}
            <nav
                className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background"
                style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
            >
                <div className="flex h-16 items-center justify-around">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isCurrentUrl(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-4 py-2 transition-colors',
                                    isActive
                                        ? 'text-primary'
                                        : 'text-muted-foreground',
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
                        className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 px-4 py-2 text-muted-foreground transition-colors hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="text-xs">Keluar</span>
                    </Link>
                </div>
            </nav>
        </div>
    );
}
