// Modify를 위한 데이터를 저장하는 Reuqest
import {defaultFetch} from "@/apis/index.ts";
import { Envs } from "@/utils/env";

export interface PasswordFields {
  password: string;
  confirmPassword: string;
}

export interface ModifyProfileRequest {
  name: string;
  password: string;
  nickname: string;
  contact: string;
  address: string;
}

// 개인정보 변경 시에 실행될 함수
export const reqeustPatchProfile = async (payload: ModifyProfileRequest) => {
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

// 이미지 변경 시에 사용하는 함수
export const requestPatchImage = async (payload: FormData) => {
  const response = await defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/mypage/modify/image`, {
    method: 'PATCH',
    body: payload
  })

  if (!response.ok) {
    throw new Error('이미지 업로드에 실패하였습니다');
  }

  return await response.json();
}

// 회원 탈퇴 시에 사용하는 함수
export const requestWithdraw = async (id: number) => {
  return defaultFetch(`${Envs.VITE_API_ENDPOINT}/api/oauth/deactivate/${id}`, {
    method: 'PATCH'
  });
}