import { Button, Divider, Modal, Typography } from 'antd';
import { useProfile } from './hooks/useProfile.ts';
import {
  Container,
  ImageContainer,
  ProfileImage,
  ProfileSection,
  ProfileTexts,
} from './MyPage.styles';
import { BookmarkSection } from './components/BookmarkSection';
import { useNavigate } from 'react-router';

// MyPage() => {} 구문은 화살표 함수라고 하며, const(변수)를 함수처럼 사용할 수 있게 한다
// 덕분에 MyPage()는 변수이면서, 사용했을 때 함수처럼 return을 줌
export const MyPage = () => {

  // 객체에서 값을 꺼내기 위해 중괄호로 profile을 묶은 것이다.
  // useProfile이 객체를 반환한다고 생각하면, 그 중에 profile 이라는 값만 꺼낼 수 있게 함
  // const profile = useProfile().profile; 과 같은 동작을 한다.
  const { profile } = useProfile();

  if (!profile) {
    return <></>;
  }
  return (
    <>
      <Container>
        <ProfileSection>
          <ImageContainer>
            <ProfileImage src={profile.myImage} alt='profileImage' />
            <Button type='default' onClick={onEditProfileClick} size='small'>
              프로필 수정
            </Button>
          </ImageContainer>
          <ProfileTexts>
            <Typography.Title
              level={3}
            >{`${profile.name}님, 오늘도 편안한 독서 되세요.`}</Typography.Title>
            {/* 가입일? 데이터 없음 */}
            {/* <Typography.Paragraph>
            오늘은 Mookbook과 함께한지 ?일 되는 날이예요.
          </Typography.Paragraph> */}
          </ProfileTexts>
        </ProfileSection>
        <Divider />
        <BookmarkSection />
      </Container>
      <Modal open={isEditModalShown} onCancel={() => setEditModalShown(false)}>
      </Modal>
    </>
  );
};
