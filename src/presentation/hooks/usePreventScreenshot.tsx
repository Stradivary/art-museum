import { useEffect } from 'react';

// Helper to prevent PrintScreen (not foolproof)
export function usePreventScreenshot() {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            // Block PrintScreen key
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                // Optionally, clear clipboard (not always possible)
                if (navigator.clipboard) {
                    navigator.clipboard.writeText('Screenshots are disabled.');
                }
            }
            // Block Ctrl+P (print)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
}
