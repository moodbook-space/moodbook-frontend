export const StorageKeys = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
} as const;
export type StorageKey = keyof typeof StorageKeys;

export const getLocalStorageItem = (key: StorageKey) => {
  try {
    const value = localStorage.getItem(key) ?? '{}';
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const setLocalStorageItem = <T = any>(key: StorageKey, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorageItem = (key: StorageKey) => {
  localStorage.removeItem(key);
};
