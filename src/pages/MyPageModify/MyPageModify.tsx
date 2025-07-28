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
import {
  reqeustPatchProfile,
  requestPatchImage,
  requestWithdraw
} from '@/apis/profile.ts';
import { useNavigate } from "react-router-dom";
import {message} from "antd";
import { useUserStore } from '@/stores/user.ts';
import { removeLocalStorageItem, StorageKeys } from '@/utils/storage.ts';
import { Paths } from '@/routes/routes.ts';
import { PasswordFields, ModifyProfileRequest } from "@/apis/mypageModify.ts";
export const MyPageModify =  () => {
  const navigate = useNavigate();
  const { id } = useUserStore();

  const { profile, setProfile } =  useProfile();

  // 비밀번호 관련 값을 담기 위한 passwords 선언
  const [passwords, setPasswords] = useState<PasswordFields>({
    password: '',
    confirmPassword: '',
  });

  // 사진 파일값을 담아두기 위한 파일 선언
  const [imageFile, setImageFile] = useState<File | null>(null);

  // 값이 null이거나 undefined이거나, 공백만 있으면 true 반환
  const isEmpty = (value: string | null | undefined): boolean => {
    return !value || value.trim() === '';
  };

  // 각각의 입력 필드에 대해 값을 확인한다.
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

      // 이전 값이 NUll이 아니라면, name에 해당하는 값만 바꿔서 setProfile 수행
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
      // 이전 값이 NUll이 아니라면, name 해당하는 값만 바꿔서 setPaswords 수행
      return {
        ...prev, [name]: value
      };
    });
  };

  // 사진 변경 시에 발생할 이벤트
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // imageFile값을 변경해둔다!
    setImageFile(file);

    const imageUrl = URL.createObjectURL(file); // 브라우저에서 미리 보기 URL 생성
    setProfile((prev) => ({
      ...prev!,
      myImage: imageUrl, // 임시로 보여주기 (업로드 전 미리보기 용)
    }));
  };

  // 탈퇴 눌렀을 시에 발생할 이벤트
  const handleWithdraw = async() => {

    // 탈퇴 요청
    const response = await requestWithdraw(id)

    // 탈퇴가 잘 되었다면, 로그 모두 삭제
    if (response.status === 200) {
      message.info("회원 탈퇴가 완료되었습니다.")
      removeLocalStorageItem(StorageKeys.ACCESS_TOKEN);
      removeLocalStorageItem(StorageKeys.REFRESH_TOKEN);

      // 로그인 페이지로 돌려보내기
      navigate(Paths.SIGN_IN);
    } else {
      // 아니라면, 메세지 출력
      message.error(JSON.stringify(response.json()))
    }
  }

  // 정보 수정 버튼 눌렀을 시에 발생할 이벤트
  const submitProfile = async () => {

    // ModifyProfileRequest 생성
    const request: ModifyProfileRequest = {
      name: profile?.name ?? '',
      password: passwords.password,
      nickname: profile?.nickname ?? '',
      contact: profile?.contact ?? '',
      address: profile?.address ?? '',
    };

    // 비밀번호 서로 다른지 체크
    if (passwords.password != passwords.confirmPassword) {
      message.warning("비밀번호가 서로 다릅니다.");
      return;
    }

    // 값이 모두 유효한지 체크!
    const error = validateModifyProfileRequest(request);
    if (error) {
      message.warning(error);
      return;
    }

    try {
      // 데이터 업데이트!
      await reqeustPatchProfile(request);

      // 사진 변경이 있었다면, 사진도 업데이트
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        // 실제 서버 업로드 수행
        await requestPatchImage(formData);
      }
      message.success('프로필이 수정되었습니다.');
      navigate(Paths.MYPAGE); // 마이페이지로 돌려보내기
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

              <FormRow>
                <Label>주소 :</Label>
                <Input
                    name='address'
                    value={profile.address}
                    onChange={handleChange}/>
              </FormRow>

              {/* 버튼 영역 */}
              <ButtonWrapper>
                <SubmitButton onClick={() => submitProfile()}>수정 완료</SubmitButton>
                <WithdrawButton onClick={() => handleWithdraw()}>회원 탈퇴</WithdrawButton>
              </ButtonWrapper>
            </Right>
          </Wrapper>
        </Container>
    );
};
