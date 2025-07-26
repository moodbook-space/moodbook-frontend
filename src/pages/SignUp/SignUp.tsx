import { useNavigate } from 'react-router';
import styles from './SignUp.module.css';
import moodBookLogo from '@/assets/moodbook_logo.png';
import { Button, Card, Form, Input, message, Radio, Typography } from 'antd';
import {
  Genders,
  requestTempSignUp,
  RequestTempSignUpInput,
} from '@/apis/user';
import { Paths } from '@/routes/routes';

interface FormValues extends RequestTempSignUpInput {
  passwordConfirm: string;
}

export const SignUp = () => {
  const navigate = useNavigate();

  const formItemStyle = {
    marginBottom: 0,
  };

  const onSignUpSubmit = async (values: FormValues) => {
    const {
      email,
      password,
      passwordConfirm,
      contact,
      name,
      gender,
      nickname,
      address,
    } = values;

    if (password !== passwordConfirm) {
      message.error('비밀번호가 서로 다릅니다.');
      return;
    }

    const response = await requestTempSignUp({
      email,
      password,
      contact,
      gender,
      name,
      address,
      nickname,
    });
    if (response.status === 200) {
      // ? 회원가입 후 이메일이 오지 않는다.
      alert('가입에 성공했습니다. 이메일 인증을 해 주세요.');
      // 서버에서 주는 redirect 주소랑 프론트 구현 주소랑 달라 임의 navigate 처리
      navigate('/sign-in');
    } else if (response.status === 302) {
      alert('이미 가입한 회원입니다.');
    } else {
      message.error('가입 요청 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className={styles.container}>
      <img
        className={styles.logo}
        src={moodBookLogo}
        alt='MoodBook Logo'
        onClick={() => navigate(Paths.SIGN_IN)}
      />
      <Card>
        <Form id='signUp' className={styles.inner} onFinish={onSignUpSubmit}>
          <div className={styles.formItemContainer}>
            <Typography.Text>이메일</Typography.Text>
            <Form.Item name='email' style={formItemStyle}>
              <Input required type='email' />
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>비밀번호</Typography.Text>
            <Form.Item name='password' style={formItemStyle}>
              <Input required type='password' />
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>비밀번호 확인</Typography.Text>
            <Form.Item name='passwordConfirm' style={formItemStyle}>
              <Input required type='password' />
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>이름</Typography.Text>
            <Form.Item name='name' style={formItemStyle}>
              <Input required type='text' />
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>닉네임</Typography.Text>
            <Form.Item name='nickname' style={formItemStyle}>
              <Input required type='text' />
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>전화번호</Typography.Text>
            <Form.Item name='contact' style={formItemStyle}>
              <Input required type='tel' />
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>성별</Typography.Text>
            <Form.Item name='gender' style={formItemStyle}>
              <Radio.Group>
                <Radio value={Genders.MALE}>남성</Radio>
                <Radio value={Genders.FEMALE}>여성</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
          <div className={styles.formItemContainer}>
            <Typography.Text>주소</Typography.Text>
            <Form.Item name='address' style={formItemStyle}>
              <Input required type='text' />
            </Form.Item>
          </div>
          <Button type='default' size='large' htmlType='submit' key='submit'>
            회원가입
          </Button>
        </Form>
      </Card>
    </section>
  );
};
