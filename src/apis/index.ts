import { getLocalStorageItem, StorageKeys } from '@/utils/storage';

export const defaultFetch = (
  input: string | URL | globalThis.Request,
  init: RequestInit,
) => {
  const accessToken = getLocalStorageItem(StorageKeys.ACCESS_TOKEN);

  return fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-type': 'application/json',
    },
  });
};
