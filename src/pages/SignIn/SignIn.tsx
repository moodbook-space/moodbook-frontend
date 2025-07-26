import {
  requestSignIn,
  RequestLoginInput,
  RequestLoginResponse,
  requestMe,
  RequestMeResponse,
} from '@/apis/user';
import {
  Container,
  Form,
  FormItem,
  FormItemWrapper,
  LogoImg,
  SocialLoginButton,
} from './SignIn.styles';
import { Button, Card, Input, message, Typography } from 'antd';
import { setLocalStorageItem, StorageKeys } from '@/utils/storage';
import moodBookLogo from '@/assets/moodbook_logo.png';
import { useNavigate } from 'react-router';
import { useUserStore } from '@/stores/user';
import { Paths } from '@/routes/routes';
import { SignUpButton } from '../SignUp/SignUp.styles';
import KakaoLoginImage from '@/assets/kakao_login_small.png';

type FormValues = RequestLoginInput;

export const SignIn = () => {
  const navigate = useNavigate();
  const { setId } = useUserStore();

  const onSignInSubmit = async (values: FormValues) => {
    const { email, password } = values;

    try {
      const loginResponse = await requestSignIn({ email, password });

      if (loginResponse.status === 200) {
        const loginData: RequestLoginResponse = await loginResponse.json();
        const { accessToken, refreshToken } = loginData;
        setLocalStorageItem(StorageKeys.ACCESS_TOKEN, accessToken);
        setLocalStorageItem(StorageKeys.REFRESH_TOKEN, refreshToken);

        const meResponse = await requestMe();
        const meData: RequestMeResponse = await meResponse.json();

        setId(meData.id);

        navigate(Paths.MAIN);
      } else if (loginResponse.status === 404) {
        message.error('가입되지 않은 계정입니다.');
      }
    } catch (err) {
      const error = err as Error;
      message.error(error.message);
    }
  };

  const onSignUpClick = () => {
    navigate(Paths.SIGN_UP);
  };

  const onSocialLoginClick = () => {
    alert('TODO');
  };

  return (
    <Container>
      <LogoImg
        src={moodBookLogo}
        alt='MoodBook Logo'
        onClick={() => navigate(Paths.SIGN_IN)}
      />
      <Card>
        <Form id='signIn' onFinish={onSignInSubmit}>
          <FormItemWrapper>
            <Typography.Text>이메일</Typography.Text>
            <FormItem name='email'>
              <Input required type='email' />
            </FormItem>
          </FormItemWrapper>
          <FormItemWrapper>
            <Typography.Text>비밀번호</Typography.Text>
            <FormItem name='password'>
              <Input required type='password' />
            </FormItem>
          </FormItemWrapper>
          <Button type='default' size='large' htmlType='submit' key='submit'>
            로그인
          </Button>
        </Form>
        <SocialLoginButton onClick={onSocialLoginClick}>
          <img src={KakaoLoginImage} />
        </SocialLoginButton>
        <SignUpButton
          type='link'
          size='middle'
          htmlType='button'
          onClick={onSignUpClick}
        >
          회원가입
        </SignUpButton>
      </Card>
    </Container>
  );
};
