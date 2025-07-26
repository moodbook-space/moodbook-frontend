import { Paths } from '@/routes/routes';
import { getLocalStorageItem, StorageKeys } from '@/utils/storage';

export const defaultFetch = async (
  input: string | URL | globalThis.Request,
  init: RequestInit,
) => {
  const accessToken = getLocalStorageItem(StorageKeys.ACCESS_TOKEN);

  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'Content-type': 'application/json',
    },
  });

  if (response.status === 401) {
    const json = await response.json();
    alert(json.message);
    console.error(input, json.message);
    location.href = Paths.SIGN_IN;
  }

  return response;
};
