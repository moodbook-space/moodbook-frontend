import { Form as AntdForm } from 'antd';
import styled from 'styled-components';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
  height: 100%;
  background-color: #f2f2f2;
`;

// 로그인 버튼
export const SubmitButton = styled.button`
  all: unset;
  width: 100%;
  height: 44px;
  background-color: #1677ff; /* antd primary */
  color: white;
  border-radius: 6px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: #0958d9;
  }
`;

export const LogoImg = styled.img`
  width: 121px;
  height: 121px;

  background: #333;

  border-radius: 6px;
  cursor: pointer;
`;

export const Form = styled(AntdForm)<any>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 20px;
  width: 340px;
`;

export const FormItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

export const FormItem = styled(Form.Item)`
  margin-bottom: 0px;
`;

// 소셜 로그인 버튼 컨테이너
export const SocialLoginGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
`;

export const SocialLoginButton = styled.button`
  all: unset;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 24px;
    height: 24px;
  }

  &:hover {
    transform: scale(1.05);
  }

  cursor: pointer;
`;
