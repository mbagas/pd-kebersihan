import type * as LeafletType from 'leaflet';
import { MapPin, Navigation, Search, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Lazy load Leaflet untuk menghindari SSR issues
let L: typeof LeafletType | null = null;

interface MapLocation {
    lat: number;
    lng: number;
    address?: string;
}

interface MapPickerProps {
    value?: MapLocation;
    onChange?: (location: MapLocation) => void;
    className?: string;
    defaultCenter?: [number, number];
    defaultZoom?: number;
    placeholder?: string;
}

// Default center: Bandar Lampung
const DEFAULT_CENTER: [number, number] = [-5.4295, 105.2619];
const DEFAULT_ZOOM = 13;

export function MapPicker({
    value,
    onChange,
    className,
    defaultCenter = DEFAULT_CENTER,
    defaultZoom = DEFAULT_ZOOM,
    placeholder = 'Cari alamat...',
}: MapPickerProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<LeafletType.Map | null>(null);
    const markerRef = useRef<LeafletType.Marker | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [isMapReady, setIsMapReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Store onChange in ref to avoid dependency issues
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    const handleMarkerDrag = useCallback(async () => {
        if (!markerRef.current) return;

        const pos = markerRef.current.getLatLng();
        const address = await reverseGeocode(pos.lat, pos.lng);

        onChangeRef.current?.({
            lat: pos.lat,
            lng: pos.lng,
            address,
        });
    }, []);

    const handleMapClick = useCallback(
        async (e: LeafletType.LeafletMouseEvent) => {
            if (!L || !mapInstanceRef.current) return;

            const { lat, lng } = e.latlng;

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                markerRef.current = L.marker([lat, lng], {
                    draggable: true,
                }).addTo(mapInstanceRef.current);
                markerRef.current.on('dragend', handleMarkerDrag);
            }

            const address = await reverseGeocode(lat, lng);
            onChangeRef.current?.({ lat, lng, address });
        },
        [handleMarkerDrag],
    );

    // Initialize map
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const initMap = async () => {
            // Dynamic import Leaflet
            if (!L) {
                L = await import('leaflet');
                // Import CSS
                await import('leaflet/dist/leaflet.css');
            }

            // Fix default marker icon
            delete (
                L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown }
            )._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl:
                    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            const initialCenter = value
                ? [value.lat, value.lng]
                : defaultCenter;

            const map = L.map(mapRef.current!, {
                center: initialCenter as [number, number],
                zoom: defaultZoom,
            });

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(map);

            // Add marker if value exists
            if (value) {
                markerRef.current = L.marker([value.lat, value.lng], {
                    draggable: true,
                }).addTo(map);

                markerRef.current.on('dragend', handleMarkerDrag);
            }

            // Click to place marker
            map.on('click', handleMapClick);

            mapInstanceRef.current = map;
            setIsMapReady(true);
        };

        initMap();

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update marker when value changes externally
    useEffect(() => {
        if (!isMapReady || !L || !mapInstanceRef.current) return;

        if (value) {
            if (markerRef.current) {
                markerRef.current.setLatLng([value.lat, value.lng]);
            } else {
                markerRef.current = L.marker([value.lat, value.lng], {
                    draggable: true,
                }).addTo(mapInstanceRef.current);
                markerRef.current.on('dragend', handleMarkerDrag);
            }
            mapInstanceRef.current.setView([value.lat, value.lng]);
        }
    }, [value, isMapReady, handleMarkerDrag]);

    // Search address using Nominatim
    const handleSearch = async () => {
        if (!searchQuery.trim() || !mapInstanceRef.current || !L) return;

        setIsSearching(true);
        setError(null);

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const latNum = parseFloat(lat);
                const lngNum = parseFloat(lon);

                mapInstanceRef.current.setView([latNum, lngNum], 16);

                if (markerRef.current) {
                    markerRef.current.setLatLng([latNum, lngNum]);
                } else {
                    markerRef.current = L.marker([latNum, lngNum], {
                        draggable: true,
                    }).addTo(mapInstanceRef.current);
                    markerRef.current.on('dragend', handleMarkerDrag);
                }

                onChangeRef.current?.({
                    lat: latNum,
                    lng: lngNum,
                    address: display_name,
                });
            } else {
                setError('Alamat tidak ditemukan');
            }
        } catch {
            setError('Gagal mencari alamat');
        } finally {
            setIsSearching(false);
        }
    };

    // Get current location
    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError('Browser tidak mendukung geolokasi');
            return;
        }

        setIsLocating(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                if (mapInstanceRef.current && L) {
                    mapInstanceRef.current.setView([latitude, longitude], 16);

                    if (markerRef.current) {
                        markerRef.current.setLatLng([latitude, longitude]);
                    } else {
                        markerRef.current = L.marker([latitude, longitude], {
                            draggable: true,
                        }).addTo(mapInstanceRef.current);
                        markerRef.current.on('dragend', handleMarkerDrag);
                    }

                    const address = await reverseGeocode(latitude, longitude);
                    onChangeRef.current?.({
                        lat: latitude,
                        lng: longitude,
                        address,
                    });
                }

                setIsLocating(false);
            },
            () => {
                setError('Gagal mendapatkan lokasi. Pastikan GPS aktif.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    // Clear marker
    const handleClear = () => {
        if (markerRef.current && mapInstanceRef.current) {
            mapInstanceRef.current.removeLayer(markerRef.current);
            markerRef.current = null;
        }
        onChangeRef.current?.(undefined as unknown as MapLocation);
    };

    return (
        <div className={cn('space-y-3', className)}>
            {/* Search bar */}
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder={placeholder}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="pl-9"
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleSearch}
                    disabled={isSearching}
                >
                    {isSearching ? 'Mencari...' : 'Cari'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    title="Gunakan lokasi saat ini"
                >
                    <Navigation
                        className={cn('h-4 w-4', isLocating && 'animate-pulse')}
                    />
                </Button>
            </div>

            {/* Error message */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Map container */}
            <div
                ref={mapRef}
                className="h-64 w-full rounded-lg border sm:h-80"
                style={{ zIndex: 0 }}
            />

            {/* Selected location info */}
            {value && (
                <div className="flex items-start gap-2 rounded-lg bg-muted p-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">Lokasi Terpilih</p>
                        <p className="truncate text-xs text-muted-foreground">
                            {value.address ||
                                `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Koordinat: {value.lat.toFixed(6)},{' '}
                            {value.lng.toFixed(6)}
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 shrink-0"
                        onClick={handleClear}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}

// Reverse geocode using Nominatim
async function reverseGeocode(lat: number, lng: number): Promise<string> {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
        );
        const data = await response.json();
        return data.display_name || '';
    } catch {
        return '';
    }
}

// Helper to generate Google Maps direction URL
export function getGoogleMapsDirectionUrl(lat: number, lng: number): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
