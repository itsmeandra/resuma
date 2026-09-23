'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Sinkronisasi state React <-> localStorage dengan useSyncExternalStore
 * (pola yang direkomendasikan React untuk data eksternal seperti localStorage —
 * aman dari hydration mismatch dan tidak memicu cascading render di effect).
 */
const cache = new Map<string, { raw: string | null; value: unknown }>();
const listeners = new Map<string, Set<() => void>>();

function emit(key: string) {
    listeners.get(key)?.forEach((cb) => cb());
}

function parseSnapshot<T>(raw: string | null, fallback: T): T {
    if (raw === null) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        // Legacy value mentah tanpa JSON.stringify (mis. "id" / "en" lama)
        return raw as unknown as T;
    }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    const readSnapshot = useCallback((): T => {
        let raw: string | null = null;
        try {
            raw = localStorage.getItem(key);
        } catch {
            return initialValue;
        }
        const cached = cache.get(key);
        if (cached && cached.raw === raw) return cached.value as T;
        const value = parseSnapshot(raw, initialValue);
        cache.set(key, { raw, value });
        return value;
    }, [key, initialValue]);

    const subscribe = useCallback(
        (onChange: () => void) => {
            let set = listeners.get(key);
            if (!set) {
                set = new Set();
                listeners.set(key, set);
            }
            set.add(onChange);
            return () => {
                set?.delete(onChange);
            };
        },
        [key]
    );

    const getServerSnapshot = useCallback(() => initialValue, [initialValue]);

    const value = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);

    const setValue = useCallback(
        (next: T | ((prev: T) => T)) => {
            const prev = readSnapshot();
            const newValue = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
            try {
                localStorage.setItem(key, JSON.stringify(newValue));
            } catch {
                // Storage penuh/nonaktif — tetap update state lokal via emit
            }
            cache.set(key, { raw: JSON.stringify(newValue), value: newValue });
            emit(key);
        },
        [key, readSnapshot]
    );

    return [value, setValue] as const;
}
