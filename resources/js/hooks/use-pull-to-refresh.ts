import { router } from '@inertiajs/react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UsePullToRefreshOptions {
    threshold?: number;
    onRefresh?: () => Promise<void>;
}

interface UsePullToRefreshReturn {
    containerRef: React.RefObject<HTMLDivElement | null>;
    isPulling: boolean;
    isRefreshing: boolean;
    pullDistance: number;
}

export function usePullToRefresh(
    options: UsePullToRefreshOptions = {},
): UsePullToRefreshReturn {
    const { threshold = 80, onRefresh } = options;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPulling, setIsPulling] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const startY = useRef(0);
    const currentY = useRef(0);

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        try {
            if (onRefresh) {
                await onRefresh();
            } else {
                router.reload();
            }
        } finally {
            setTimeout(() => {
                setIsRefreshing(false);
                setPullDistance(0);
            }, 500);
        }
    }, [onRefresh]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleTouchStart = (e: TouchEvent) => {
            if (container.scrollTop === 0 && !isRefreshing) {
                startY.current = e.touches[0].clientY;
                setIsPulling(true);
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!isPulling || isRefreshing) return;

            currentY.current = e.touches[0].clientY;
            const distance = Math.max(0, currentY.current - startY.current);

            if (distance > 0 && container.scrollTop === 0) {
                e.preventDefault();
                setPullDistance(Math.min(distance * 0.5, threshold * 1.5));
            }
        };

        const handleTouchEnd = () => {
            if (!isPulling) return;

            setIsPulling(false);

            if (pullDistance >= threshold && !isRefreshing) {
                handleRefresh();
            } else {
                setPullDistance(0);
            }
        };

        container.addEventListener('touchstart', handleTouchStart, {
            passive: true,
        });
        container.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });
        container.addEventListener('touchend', handleTouchEnd, {
            passive: true,
        });

        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [isPulling, isRefreshing, pullDistance, threshold, handleRefresh]);

    return {
        containerRef,
        isPulling,
        isRefreshing,
        pullDistance,
    };
}
