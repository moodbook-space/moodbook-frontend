import { requestVerifyEmail } from '@/apis/user';
import { Paths } from '@/routes/routes';
import { Button, message, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import styled from 'styled-components';

export const VerifyEmail = () => {
  const [searchParams, _] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();

  const [isVerifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      console.log("페이지 마운트됨");
      console.log("searchParams:", searchParams.toString());
      console.log("token:", token);
      const response = await requestVerifyEmail(token);
      const json = await response.json();
      if (response.status === 200) {
        setVerifySuccess(true);
      } else {
        message.error(JSON.stringify(json));
        console.error(JSON.stringify(json));
        setVerifySuccess(false);
      }
    };
    verifyEmail();
  }, []);

  return (
    <Container>
      {!isVerifySuccess && '이메일 인증 대기 중'}
      {isVerifySuccess && (
        <>
          <Typography.Paragraph>
            이메일 인증이 완료되었니니다.
          </Typography.Paragraph>
          <Button type='link' onClick={() => navigate(Paths.SIGN_IN)}>
            로그인 페이지로 이동
          </Button>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  row-gap: 20px;
`;
