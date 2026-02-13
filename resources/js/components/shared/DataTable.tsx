import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from './EmptyState';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
    key: string;
    header: string;
    sortable?: boolean;
    className?: string;
    render?: (item: T) => React.ReactNode;
}

export interface SortConfig {
    key: string;
    direction: 'asc' | 'desc';
}

export interface PaginationConfig {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    perPage: number;
    onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    sortConfig?: SortConfig;
    onSort?: (key: string) => void;
    pagination?: PaginationConfig;
    className?: string;
    onRowClick?: (item: T) => void;
}

function SortIcon({ sortKey, sortConfig }: { sortKey: string; sortConfig?: SortConfig }) {
    if (!sortConfig || sortConfig.key !== sortKey) {
        return <ArrowUpDown className="ml-1 h-4 w-4" />;
    }
    return sortConfig.direction === 'asc' ? <ArrowUp className="ml-1 h-4 w-4" /> : <ArrowDown className="ml-1 h-4 w-4" />;
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    loading = false,
    emptyTitle = 'Tidak ada data',
    emptyDescription,
    sortConfig,
    onSort,
    pagination,
    className,
    onRowClick,
}: DataTableProps<T>) {
    if (loading) {
        return (
            <div className={cn('rounded-md border', className)}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key} className={col.className}>
                                    {col.header}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                                {columns.map((col) => (
                                    <TableCell key={col.key}>
                                        <Skeleton className="h-5 w-full" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    }

    if (data.length === 0) {
        return <EmptyState title={emptyTitle} description={emptyDescription} className={className} />;
    }

    return (
        <div className={cn('space-y-4', className)}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((col) => (
                                <TableHead key={col.key} className={col.className}>
                                    {col.sortable && onSort ? (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="-ml-3 h-8 hover:bg-transparent"
                                            onClick={() => onSort(col.key)}
                                        >
                                            {col.header}
                                            <SortIcon sortKey={col.key} sortConfig={sortConfig} />
                                        </Button>
                                    ) : (
                                        col.header
                                    )}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow
                                key={keyExtractor(item)}
                                className={cn(onRowClick && 'cursor-pointer hover:bg-muted/50')}
                                onClick={() => onRowClick?.(item)}
                            >
                                {columns.map((col) => (
                                    <TableCell key={col.key} className={col.className}>
                                        {col.render ? col.render(item) : (item as Record<string, unknown>)[col.key]?.toString()}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Menampilkan {(pagination.currentPage - 1) * pagination.perPage + 1} -{' '}
                        {Math.min(pagination.currentPage * pagination.perPage, pagination.totalItems)} dari {pagination.totalItems} data
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span className="sr-only">Halaman sebelumnya</span>
                        </Button>
                        <span className="text-sm">
                            {pagination.currentPage} / {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                            <span className="sr-only">Halaman berikutnya</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
