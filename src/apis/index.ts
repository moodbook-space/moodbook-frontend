import { Paths } from '@/routes/routes';
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  StorageKeys,
} from '@/utils/storage';
import { message } from 'antd';

export const defaultFetch = async (
    input: string | URL | globalThis.Request,
    init: RequestInit,
) => {
  const accessToken = getLocalStorageItem(StorageKeys.ACCESS_TOKEN);

  const isFormData = init.body instanceof FormData;

  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      // 만약 내용이 form-data면, 헤더타입 쓰지 않도록 함
      ...(isFormData) ? {} : {
        'Content-type': 'application/json',
      }
    },
  });

  if (response.status === 401) {
    message.error('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
    console.error(401);
    location.href = Paths.SIGN_IN;
    removeLocalStorageItem(StorageKeys.ACCESS_TOKEN);
    removeLocalStorageItem(StorageKeys.REFRESH_TOKEN);
  }

  if (!response.ok) {
    const json = await response.json();
    message.error(JSON.stringify(json));
    console.error(input, JSON.stringify(json));
  }

  return response;
};
