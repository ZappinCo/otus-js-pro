import { useContext } from "react";
import { StoreContext } from "./StoreContext"
import { useCallback } from "react";

export default function useLocalStorage(key, defaultValue = '') {
    const ctx = useContext(StoreContext);
    if (!ctx) {
        throw new Error('useLocalStorage must be used within <StoreProvider>');
    }

    const { json, set } = ctx;

    const setValue = useCallback(
        (newValue) => {
            set(
                key,
                typeof newValue === 'function' ? newValue(json[key] ?? defaultValue) : newValue
            );
        },
        [key, json, set, defaultValue]
    );

    return [json[key] ?? defaultValue, setValue];
}