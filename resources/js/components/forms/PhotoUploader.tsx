import imageCompression from 'browser-image-compression';
import { Camera, ImagePlus, Trash2, Upload, X } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PhotoFile {
    id: string;
    file: File;
    preview: string;
    isCompressing?: boolean;
}

interface PhotoUploaderProps {
    value?: File[];
    onChange?: (files: File[]) => void;
    maxFiles?: number;
    maxSizeKB?: number;
    accept?: string;
    className?: string;
    disabled?: boolean;
    showCamera?: boolean;
}

const COMPRESSION_OPTIONS = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 1920,
    useWebWorker: true,
};

export function PhotoUploader({
    value = [],
    onChange,
    maxFiles = 5,
    maxSizeKB = 500,
    accept = 'image/*',
    className,
    disabled,
    showCamera = true,
}: PhotoUploaderProps) {
    const [photos, setPhotos] = useState<PhotoFile[]>(() =>
        value.map((file) => ({
            id: crypto.randomUUID(),
            file,
            preview: URL.createObjectURL(file),
        })),
    );
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    const compressAndAddFiles = useCallback(
        async (files: FileList | File[]) => {
            setError(null);
            const fileArray = Array.from(files);

            // Check max files
            if (photos.length + fileArray.length > maxFiles) {
                setError(`Maksimal ${maxFiles} foto`);
                return;
            }

            // Filter only images
            const imageFiles = fileArray.filter((f) =>
                f.type.startsWith('image/'),
            );

            if (imageFiles.length === 0) {
                setError('Hanya file gambar yang diperbolehkan');
                return;
            }

            // Add placeholder entries
            const newPhotos: PhotoFile[] = imageFiles.map((file) => ({
                id: crypto.randomUUID(),
                file,
                preview: URL.createObjectURL(file),
                isCompressing: file.size > maxSizeKB * 1024,
            }));

            setPhotos((prev) => [...prev, ...newPhotos]);

            // Compress files that exceed size limit
            const compressedPhotos = await Promise.all(
                newPhotos.map(async (photo) => {
                    if (photo.file.size <= maxSizeKB * 1024) {
                        return photo;
                    }

                    try {
                        const compressed = await imageCompression(
                            photo.file,
                            COMPRESSION_OPTIONS,
                        );
                        URL.revokeObjectURL(photo.preview);
                        return {
                            ...photo,
                            file: compressed,
                            preview: URL.createObjectURL(compressed),
                            isCompressing: false,
                        };
                    } catch {
                        return { ...photo, isCompressing: false };
                    }
                }),
            );

            setPhotos((prev) => {
                const updated = prev.map((p) => {
                    const compressed = compressedPhotos.find(
                        (cp) => cp.id === p.id,
                    );
                    return compressed || p;
                });

                // Notify parent
                onChange?.(updated.map((p) => p.file));
                return updated;
            });
        },
        [photos.length, maxFiles, maxSizeKB, onChange],
    );

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            compressAndAddFiles(e.target.files);
        }
        // Reset input
        e.target.value = '';
    };

    const handleDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        if (e.dataTransfer.files?.length) {
            compressAndAddFiles(e.dataTransfer.files);
        }
    };

    const handleRemove = (id: string) => {
        setPhotos((prev) => {
            const photo = prev.find((p) => p.id === id);
            if (photo) {
                URL.revokeObjectURL(photo.preview);
            }
            const updated = prev.filter((p) => p.id !== id);
            onChange?.(updated.map((p) => p.file));
            return updated;
        });
    };

    const handleClearAll = () => {
        photos.forEach((p) => URL.revokeObjectURL(p.preview));
        setPhotos([]);
        onChange?.([]);
    };

    const canAddMore = photos.length < maxFiles;

    return (
        <div className={cn('space-y-3', className)}>
            {/* Drop zone */}
            {canAddMore && (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'relative flex min-h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-muted-foreground/25',
                        disabled && 'cursor-not-allowed opacity-50',
                    )}
                >
                    <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-center text-sm text-muted-foreground">
                        Drag & drop foto di sini, atau
                    </p>
                    <div className="mt-3 flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={disabled}
                        >
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Pilih File
                        </Button>
                        {showCamera && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => cameraInputRef.current?.click()}
                                disabled={disabled}
                            >
                                <Camera className="mr-2 h-4 w-4" />
                                Kamera
                            </Button>
                        )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                        Maks {maxFiles} foto, otomatis dikompres ke {maxSizeKB}
                        KB
                    </p>

                    {/* Hidden inputs */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={disabled}
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={disabled}
                    />
                </div>
            )}

            {/* Error */}
            {error && <p className="text-sm text-destructive">{error}</p>}

            {/* Preview grid */}
            {photos.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                            {photos.length} dari {maxFiles} foto
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleClearAll}
                            disabled={disabled}
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Hapus Semua
                        </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative aspect-square overflow-hidden rounded-lg border"
                            >
                                <img
                                    src={photo.preview}
                                    alt="Preview"
                                    className={cn(
                                        'h-full w-full object-cover',
                                        photo.isCompressing && 'opacity-50',
                                    )}
                                />
                                {photo.isCompressing && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemove(photo.id)}
                                    className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                    disabled={disabled}
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
