function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const storageService = {
  get<T>(key: string): T | null {
    if (!canUseStorage()) return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!canUseStorage()) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* silencioso */
    }
  },

  remove(key: string): void {
    if (!canUseStorage()) return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* silencioso */
    }
  },

  clear(): void {
    if (!canUseStorage()) return;
    try {
      window.localStorage.clear();
    } catch {
      /* silencioso */
    }
  },
};
