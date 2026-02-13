import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Truck, ClipboardList, Receipt, FileText, Users, Building, DollarSign, Map, History } from 'lucide-react';
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
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

// Navigation items based on user role
const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin', icon: LayoutGrid },
    { title: 'Dispatch', href: '/admin/dispatch', icon: Truck },
    { title: 'Kasir', href: '/admin/kasir', icon: Receipt },
    { title: 'Laporan', href: '/admin/laporan', icon: FileText },
    { title: 'Mitra', href: '/admin/master/mitra', icon: Building },
    { title: 'Armada', href: '/admin/master/armada', icon: Truck },
    { title: 'Tarif', href: '/admin/master/tarif', icon: DollarSign },
    { title: 'Petugas', href: '/admin/master/petugas', icon: Users },
];

const auditorNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/audit', icon: LayoutGrid },
    { title: 'Peta Sebaran', href: '/audit/peta', icon: Map },
    { title: 'Keuangan', href: '/audit/keuangan', icon: Receipt },
    { title: 'Audit Trail', href: '/audit/trail', icon: History },
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

    // Select nav items based on role
    const mainNavItems = userRole === 'auditor' ? auditorNavItems : adminNavItems;
    const homeUrl = userRole === 'auditor' ? '/audit' : '/admin';

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
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
