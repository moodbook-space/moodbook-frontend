import {useProfile} from '../MyPage/hooks/useProfile'
import {
  Container,
  Wrapper,
  Left,
  Right,
  ProfileImage,
  UploadLabel,
  FormRow,
  Label,
  Input,
  ButtonWrapper,
  SubmitButton,
  WithdrawButton
} from './MyPageModify.styles';
import { useState} from "react";
import {ModifyProfileRequest, patchProfile, PasswordFields, patchImage} from "@/apis/profile.ts";
import { useNavigate } from "react-router-dom";
import {message} from "antd";

export const MyPageModify =  () => {
  const navigate = useNavigate();
  const { profile, setProfile } =  useProfile();
  const [passwords, setPasswords] = useState<PasswordFields>({
    password: '',
    confirmPassword: '',
  });

  const isEmpty = (value: string | null | undefined): boolean => {
    return !value || value.trim() === '';
  };

  const validateModifyProfileRequest = (request: ModifyProfileRequest): string | null => {
    if (isEmpty(request.name)) return '이름을 입력해주세요.';
    if (isEmpty(request.password)) return '비밀번호를 입력해주세요.';
    if (isEmpty(request.nickname)) return '닉네임을 입력해주세요.';
    if (isEmpty(request.contact)) return '연락처를 입력해주세요.';
    if (isEmpty(request.address)) return '주소를 입력해주세요.';

    return null; // 모든 필드가 유효한 경우
  };

  // 폼에 값을 입력헀을 때 폼이 변하게 하기 위함
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 기본적으로 name, value를 target에서 받는다
    const {name, value} = e.target;
    setProfile((prev) => {
      if (!prev) return;

      // 이전 값이 NUll이 아니라면, name에 해당하는 값만 바꿔서 setProfile 다시 하기
      return {
        ...prev, [name]: value
      };
    });
  };

  // 비밀번호 값 변경 감지
  const handlePasswordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 기본적으로 name, value를 target에서 받는다
    const {name, value} = e.target;
    setPasswords((prev) => {
      // 이전 값이 NUll이 아니라면, name에 해당하는 값만 바꿔서 setProfile 다시 하기
      return {
        ...prev, [name]: value
      };
    });
  };

  // 사진 변경 감지
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    console.log("업로드된 파일", file);
    console.log("전돨된 Formdata", formData);

    const imageUrl = URL.createObjectURL(file); // 브라우저에서 미리 보기 URL 생성
    setProfile((prev) => ({
      ...prev!,
      myImage: imageUrl, // 임시로 보여주기 (업로드 전 미리보기 용)
    }));

    // 실제 서버 업로드는 아래처럼 비동기 함수로 구현 가능
    await patchImage(formData);
    navigate('/mypage')
  };

  const submitProfile = async () => {

    const request: ModifyProfileRequest = {
      name: profile?.name ?? '',
      password: passwords.password,
      nickname: profile?.nickname ?? '',
      contact: profile?.contact ?? '',
      address: "주소모름"
    };

    // 비밀번호 서로 다른지 체크
    if (passwords.password != passwords.confirmPassword) {
      message.warning("비밀번호가 서로 다릅니다.");
      return;
    }

    const error = validateModifyProfileRequest(request);
    if (error) {
      message.warning(error);
      return;
    }

    try {
      await patchProfile(request);
      message.success('프로필이 수정되었습니다.');
      navigate('/mypage'); // 또는 다른 경로로 이동
    } catch (error) {
      message.error('프로필 수정에 실패했습니다.' + error);
    }
  }

  if (profile)
    return (
        <Container>
          <Wrapper>
            {/* 왼쪽: 프로필 이미지 업로드 */}
            <Left>
              <ProfileImage src={profile.myImage} alt='profile'/>
              <UploadLabel htmlFor='image-upload'>사진 업로드</UploadLabel>
              <input
                  type='file'
                  id='image-upload'
                  style={{display: 'none'}}
                  onChange={handleImageUpload}
              />
            </Left>

            {/* 오른쪽: 입력 폼 */}
            <Right>
              <FormRow>
                <Label>이름 :</Label>
                <Input name='name'
                       value={profile.name}
                       onChange={handleChange}/>
              </FormRow>

              <FormRow>
                <Label>비밀번호 :</Label>
                <Input
                    type='password'
                    name='password'
                    value={passwords.password}
                    onChange={handlePasswordsChange}
                />
              </FormRow>

              <FormRow>
                <Label>비밀번호 확인 :</Label>
                <Input
                    type='password'
                    name='confirmPassword'
                    value={passwords.confirmPassword}
                    onChange={handlePasswordsChange}
                />
              </FormRow>

              <FormRow>
                <Label>닉네임 :</Label>
                <Input
                    name='nickname'
                    value={profile.nickname}
                    onChange={handleChange}
                />
              </FormRow>

              <FormRow>
                <Label>핸드폰 번호 :</Label>
                <Input
                    name='contact'
                    value={profile.contact}
                    onChange={handleChange}/>
              </FormRow>

              {/* 버튼 영역 */}
              <ButtonWrapper>
                <SubmitButton onClick={() => submitProfile()}>수정 완료</SubmitButton>
                <WithdrawButton>회원 탈퇴</WithdrawButton>
              </ButtonWrapper>
            </Right>
          </Wrapper>
        </Container>
    );
};
