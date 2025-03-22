import { useEffect, useState } from 'react';

export const useDebounce = <T,>(value: T, delay = 250):T => {
    const [debounceValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timeout)
    }, [value, delay]);

    return debounceValue;
}