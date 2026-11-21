import { useCallback, useEffect, useMemo, useState } from 'react';
import { StoreContext } from './StoreContext';

const STORAGE_KEY = 'spa-routing-state';

function readStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        console.warn('Повреждённые данные в localStorage, игнорируем:', e);
        return {};
    }
}

export function StoreProvider({ children }) {
    const [json, setJson] = useState(readStorage);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(json));
        } catch (e) {
            console.warn('Не удалось сохранить состояние:', e);
        }
    }, [json]);

    const set = useCallback((key, value) => {
        setJson((prev) => ({ ...prev, [key]: value }));
    }, []);

    const value = useMemo(() => ({ json, set }), [json, set]);

    return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
