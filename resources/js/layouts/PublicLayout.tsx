import { Link, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Menu,
    User,
} from 'lucide-react';
import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/', label: 'Beranda' },
    { href: '/order', label: 'Pesan' },
    { href: '/tracking', label: 'Lacak' },
];

const dashboardRoutes: Record<string, string> = {
    admin: '/admin',
    driver: '/app/tugas',
    auditor: '/audit',
    customer: '/customer',
};

function UserInitials({ name }: { name: string }) {
    const initials = name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {initials}
        </div>
    );
}

export default function PublicLayout({ children }: PropsWithChildren) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage().props;
    const user = auth?.user;
    const isCustomer = user?.role === 'customer';

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-sm font-bold">
                                PD
                            </span>
                        </div>
                        <span className="font-semibold">
                            SIM-PALD
                        </span>
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
                                        : 'text-muted-foreground',
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="gap-2 px-2"
                                    >
                                        <UserInitials
                                            name={user.name}
                                        />
                                        <span className="text-sm font-medium">
                                            {user.name}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-48"
                                >
                                    {isCustomer ? (
                                        <>
                                            <DropdownMenuItem
                                                asChild
                                            >
                                                <Link href="/customer">
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    Dashboard
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                asChild
                                            >
                                                <Link href="/customer/orders">
                                                    <ClipboardList className="mr-2 h-4 w-4" />
                                                    Pesanan
                                                    Saya
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                asChild
                                            >
                                                <Link href="/customer/profile">
                                                    <User className="mr-2 h-4 w-4" />
                                                    Profil
                                                </Link>
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem
                                            asChild
                                        >
                                            <Link
                                                href={
                                                    dashboardRoutes[
                                                        user.role
                                                    ] ?? '/'
                                                }
                                            >
                                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                                Dashboard
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className="w-full"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            Keluar
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Masuk
                                </Link>
                                <Button asChild size="sm">
                                    <Link href="/register">
                                        Daftar
                                    </Link>
                                </Button>
                            </div>
                        )}
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
            <Sheet
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
            >
                <SheetContent side="right" className="w-72">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <span className="text-sm font-bold">
                                    PD
                                </span>
                            </div>
                            <span>SIM-PALD</span>
                        </SheetTitle>
                    </SheetHeader>
                    <nav className="mt-6 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() =>
                                    setMobileMenuOpen(false)
                                }
                                className={cn(
                                    'px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                    isCurrentUrl(item.href)
                                        ? 'bg-primary/10 text-primary font-semibold'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {user ? (
                            <>
                                <div className="my-3 border-t" />
                                <div className="mb-2 flex items-center gap-2 px-3">
                                    <UserInitials
                                        name={user.name}
                                    />
                                    <span className="text-sm font-medium">
                                        {user.name}
                                    </span>
                                </div>
                                {isCustomer ? (
                                    <>
                                        <Link
                                            href="/customer"
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                            }
                                            className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/customer/orders"
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                            }
                                            className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        >
                                            Pesanan Saya
                                        </Link>
                                        <Link
                                            href="/customer/profile"
                                            onClick={() =>
                                                setMobileMenuOpen(
                                                    false,
                                                )
                                            }
                                            className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        >
                                            Profil
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={
                                            dashboardRoutes[
                                                user.role
                                            ] ?? '/'
                                        }
                                        onClick={() =>
                                            setMobileMenuOpen(
                                                false,
                                            )
                                        }
                                        className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="mt-2 px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-destructive/10"
                                >
                                    Keluar
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="mt-4 bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() =>
                                        setMobileMenuOpen(false)
                                    }
                                    className="mt-1 border border-primary px-3 py-2.5 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </nav>
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="border-t bg-muted/50 py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} PD.
                        Kebersihan Tapis Berseri Kota Bandar
                        Lampung
                    </p>
                    <p className="mt-1">
                        Sistem Informasi Manajemen Pengelolaan
                        Air Limbah Domestik
                    </p>
                </div>
            </footer>
        </div>
    );
}
