import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '@/hooks/use-install-prompt';

export function InstallBanner() {
    const { isVisible, install, dismiss } = useInstallPrompt();

    if (!isVisible) return null;

    return (
        <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/10 px-4 py-2.5">
            <Download className="h-5 w-5 shrink-0 text-primary" />
            <p className="min-w-0 flex-1 text-sm">
                Tambahkan ke layar utama untuk pengalaman lebih baik
            </p>
            <button
                onClick={install}
                className="shrink-0 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
            >
                Pasang
            </button>
            <button
                onClick={dismiss}
                className="shrink-0 p-1 text-muted-foreground hover:text-foreground"
                aria-label="Tutup"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
