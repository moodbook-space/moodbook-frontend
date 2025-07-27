import {Envs} from '@/utils/env';
import {defaultFetch} from '.';

export interface RequestGetProfileResponse {
  myImage: string;
  name: string;
  nickname: string;
  email: string;
  contact: string;
}

export interface PasswordFields {
  password: string;
  confirmPassword: string;
}

// ! modify API에 데이터가 더 많아서, 이걸로 그냥 사용함
/** @return RequestGetProfileResponse */
export const requestGetProfile = () => {
  return defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/mypage/modify`, {
    method: 'GET',
  });
};

export interface ModifyProfileRequest {
  name: string;
  password: string;
  nickname: string;
  contact: string;
  address: string;
}

// Modify를 위한 데이터를 저장하는 Reuqest
export const requestModifyProfile = (request: ModifyProfileRequest) => {

  return defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/mypage/modify`, {
    method: 'POST',
    body: JSON.stringify({request})
  })
}

export const patchProfile = async (payload: ModifyProfileRequest) => {
  const response = await defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/mypage/modify`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('프로필 수정에 실패했습니다');
  }

  return await response.json(); // 필요 시 수정
};

export const patchImage = async (payload: FormData) => {
  const response = await defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/mypage/modify/image`, {
    method: 'PATCH',
    body: payload
  })

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패하였습니다');
  }

  return await response.json();
}