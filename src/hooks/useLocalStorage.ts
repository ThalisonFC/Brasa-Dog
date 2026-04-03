import { useCallback, useEffect, useState } from 'react';
import { storageService } from '@/services/storage.service';

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const s = storageService.get<T>(key);
    return s ?? initial;
  });

  useEffect(() => {
    const s = storageService.get<T>(key);
    if (s !== null) setValue(s);
  }, [key]);

  const setStored = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const v = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
        storageService.set(key, v);
        return v;
      });
    },
    [key]
  );

  return [value, setStored] as const;
}
