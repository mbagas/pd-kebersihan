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
    
    // Use refs to avoid re-attaching event listeners
    const startY = useRef(0);
    const isPullingRef = useRef(false);
    const isRefreshingRef = useRef(false);
    const pullDistanceRef = useRef(0);

    // Keep refs in sync with state
    isPullingRef.current = isPulling;
    isRefreshingRef.current = isRefreshing;
    pullDistanceRef.current = pullDistance;

    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true);
        isRefreshingRef.current = true;
        try {
            if (onRefresh) {
                await onRefresh();
            } else {
                router.reload();
            }
        } finally {
            setTimeout(() => {
                setIsRefreshing(false);
                isRefreshingRef.current = false;
                setPullDistance(0);
                pullDistanceRef.current = 0;
            }, 500);
        }
    }, [onRefresh]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let canPull = false;

        const handleTouchStart = (e: TouchEvent) => {
            // Only enable pull if we're at the very top
            if (container.scrollTop <= 0 && !isRefreshingRef.current) {
                startY.current = e.touches[0].clientY;
                canPull = true;
            } else {
                canPull = false;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (!canPull || isRefreshingRef.current) return;

            const currentY = e.touches[0].clientY;
            const distance = currentY - startY.current;

            // Only activate pull-to-refresh if pulling down AND at top
            if (distance > 0 && container.scrollTop <= 0) {
                // Start pulling
                if (!isPullingRef.current) {
                    setIsPulling(true);
                    isPullingRef.current = true;
                }
                
                const newPullDistance = Math.min(distance * 0.5, threshold * 1.5);
                setPullDistance(newPullDistance);
                pullDistanceRef.current = newPullDistance;
                
                // Prevent scroll only when actively pulling down
                if (e.cancelable && newPullDistance > 5) {
                    e.preventDefault();
                }
            } else {
                // User is scrolling up or container is not at top - disable pull
                if (isPullingRef.current) {
                    setIsPulling(false);
                    isPullingRef.current = false;
                    setPullDistance(0);
                    pullDistanceRef.current = 0;
                }
                canPull = false;
            }
        };

        const handleTouchEnd = () => {
            if (!isPullingRef.current) return;

            setIsPulling(false);
            isPullingRef.current = false;

            if (pullDistanceRef.current >= threshold && !isRefreshingRef.current) {
                handleRefresh();
            } else {
                setPullDistance(0);
                pullDistanceRef.current = 0;
            }
            
            canPull = false;
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
    }, [threshold, handleRefresh]);

    return {
        containerRef,
        isPulling,
        isRefreshing,
        pullDistance,
    };
}
