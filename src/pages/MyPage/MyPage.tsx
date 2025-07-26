import { Button, Divider, Modal, Typography } from 'antd';
import { useProfile } from './hooks/useProfile';
import {
  Container,
  ImageContainer,
  ProfileImage,
  ProfileSection,
  ProfileTexts,
} from './MyPage.styles';
import { BookmarkSection } from './components/BookmarkSection';
import { useState } from 'react';

export const MyPage = () => {
  const { profile } = useProfile();
  const [isEditModalShown, setEditModalShown] = useState(false);

  const onEditProfileClick = () => {
    setEditModalShown(!isEditModalShown);
  };

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
        프로필 수정 영역
      </Modal>
    </>
  );
};
