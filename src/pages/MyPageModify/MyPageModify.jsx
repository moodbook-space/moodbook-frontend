import { useState } from 'react';
import {
  Container,
  Wrapper,
  Left,
  Right,
  ProfileImage,
} from './MyPageModify.styles.js';

export const MyPageModifyPage = () => {
  const [form, setForm] = useState({
    name: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Container>
      <Wrapper>
        {/* 왼쪽: 프로필 이미지 업로드 */}
        <Left>
          <ProfileImage src='/default-profile.jpg' alt='profile' />
          <UploadLabel htmlFor='image-upload'>사진 업로드</UploadLabel>
          <input type='file' id='image-upload' style={{ display: 'none' }} />
        </Left>

        {/* 오른쪽: 입력 폼 */}
        <Right>
          <FormRow>
            <Label>이름 :</Label>
            <Input name='name' value={form.name} onChange={handleChange} />
          </FormRow>

          <FormRow>
            <Label>비밀번호 :</Label>
            <Input
              type='password'
              name='password'
              value={form.password}
              onChange={handleChange}
            />
          </FormRow>

          <FormRow>
            <Label>비밀번호 확인 :</Label>
            <Input
              type='password'
              name='confirmPassword'
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </FormRow>

          <FormRow>
            <Label>닉네임 :</Label>
            <Input
              name='nickname'
              value={form.nickname}
              onChange={handleChange}
            />
          </FormRow>

          <FormRow>
            <Label>핸드폰 번호 :</Label>
            <Input name='phone' value={form.phone} onChange={handleChange} />
          </FormRow>

          <FormRow>
            <Label>주소 :</Label>
            <Input
              name='address'
              value={form.address}
              onChange={handleChange}
            />
          </FormRow>

          {/* 버튼 영역 */}
          <ButtonWrapper>
            <SubmitButton>수정 완료</SubmitButton>
            <WithdrawButton>회원 탈퇴</WithdrawButton>
          </ButtonWrapper>
        </Right>
      </Wrapper>
    </Container>
  );
};
