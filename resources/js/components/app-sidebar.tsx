import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Building,
    DollarSign,
    Eye,
    FileText,
    Folder,
    History,
    LayoutGrid,
    Map,
    Receipt,
    Truck,
    Users,
    BarChart3,
} from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

// Admin navigation groups
const adminNavGroups = [
    {
        label: 'Operasional',
        items: [
            { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
            { title: 'Dispatch', href: '/admin/dispatch', icon: Truck },
            { title: 'Kasir', href: '/admin/kasir', icon: Receipt },
            { title: 'Laporan', href: '/admin/laporan', icon: FileText },
        ] as NavItem[],
    },
    {
        label: 'Master Data',
        items: [
            { title: 'Mitra', href: '/admin/master/mitra', icon: Building },
            { title: 'Armada', href: '/admin/master/armada', icon: Truck },
            { title: 'Tarif', href: '/admin/master/tarif', icon: DollarSign },
            { title: 'Petugas', href: '/admin/master/petugas', icon: Users },
        ] as NavItem[],
    },
    {
        label: 'Statistik',
        items: [
            { title: 'Dashboard Statistik', href: '/audit', icon: BarChart3 },
            { title: 'Peta Sebaran', href: '/audit/peta', icon: Map },
            { title: 'Keuangan', href: '/audit/keuangan', icon: Receipt },
            { title: 'Audit Trail', href: '/audit/trail', icon: History },
        ] as NavItem[],
    },
];

// Auditor only sees Statistik section
const auditorNavGroups = [
    {
        label: 'Statistik',
        items: [
            { title: 'Dashboard', href: '/audit', icon: BarChart3 },
            { title: 'Peta Sebaran', href: '/audit/peta', icon: Map },
            { title: 'Keuangan', href: '/audit/keuangan', icon: Receipt },
            { title: 'Audit Trail', href: '/audit/trail', icon: History },
        ] as NavItem[],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/mbagas/pd-kebersihan',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth?.user?.role;

    const isAuditor = userRole === 'auditor';
    const navGroups = isAuditor ? auditorNavGroups : adminNavGroups;
    const homeUrl = isAuditor ? '/audit' : '/admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={homeUrl} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    {isAuditor && (
                        <SidebarMenuItem>
                            <Badge variant="secondary" className="mx-2 gap-1.5">
                                <Eye className="h-3 w-3" />
                                <span className="group-data-[collapsible=icon]:hidden">
                                    Read-Only
                                </span>
                            </Badge>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
