import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';

interface NavGroupProps {
    label: string;
    items: NavItem[];
}

export function NavMain({ items = [], groups = [] }: { items?: NavItem[]; groups?: NavGroupProps[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    const renderItems = (navItems: NavItem[]) => (
        <SidebarMenu>
            {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl(item.href)}
                        tooltip={{ children: item.title }}
                    >
                        <Link href={item.href} prefetch>
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );

    // If groups provided, render grouped navigation
    if (groups.length > 0) {
        return (
            <>
                {groups.map((group) => (
                    <SidebarGroup key={group.label} className="px-2 py-0">
                        <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        {renderItems(group.items)}
                    </SidebarGroup>
                ))}
            </>
        );
    }

    // Fallback to flat items
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            {renderItems(items)}
        </SidebarGroup>
    );
}
