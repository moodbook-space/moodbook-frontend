import { Envs } from '@/utils/env';
import { defaultFetch } from '.';

export interface RequestGetProfileResponse {
  myImage: string;
  name: string;
  nickname: string;
  email: string;
  contact: string;
}

// ! modify API에 데이터가 더 많아서, 이걸로 그냥 사용함
/** @return RequestGetProfileResponse */
export const requestGetProfile = () => {
  return defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/mypage/modify`, {
    method: 'GET',
  });
};
