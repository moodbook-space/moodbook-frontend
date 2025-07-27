// 상수 객체이다. 세 개의 key-value 쌍을 가진 Map으로 봐도 될 듯
// as const를 붙인 이유는, readonly로 만들기 위함이다. 해당 값 내부는 절대 수정 못 함
export const StorageKeys = {
  ACCESS_TOKEN: 'ACCESS_TOKEN',
  REFRESH_TOKEN: 'REFRESH_TOKEN',
  MOOD_KEYS: 'MOOD_KEYS'
} as const;

// StorageKeys 객체의 key 이름들(ACCESS_TOKEN, REFRESH_TOKEN, MOOD_KEYS)을 모아 새로운 타입으로 만든다.
export type StorageKey =
  // 'typeof StorageKeys'로 객체 타입을 가져오고, 'keyof'를 통해 키 이름들만 추출한다.
  keyof typeof StorageKeys;

export const getLocalStorageItem = (key: StorageKey) => {
  try {
    // a ?? b => a가 null/undefined라면 b를 반환
    const value = localStorage.getItem(key) ?? '"null"';
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
