import { Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router';
import { LogoutButton, ProfileImage } from './ProfileIcon.styles';
import { removeLocalStorageItem, StorageKeys } from '@/utils/storage';
import profileImage from '@/assets/profile.png';
import { Paths } from '@/routes/routes';

export const ProfileIcon = () => {
  const navigate = useNavigate();

  const onLogoutClick = () => {
    alert('TODO: 로그아웃 처리');

    removeLocalStorageItem(StorageKeys.ACCESS_TOKEN);
    removeLocalStorageItem(StorageKeys.REFRESH_TOKEN);

    navigate(Paths.SIGN_IN);
  };
  return (
    <Dropdown
      menu={{
        items: [
          { key: 'admin', label: <Link to='/me'>마이페이지</Link> },
          {
            key: 'logout',
            label: (
              <LogoutButton type='button' onClick={onLogoutClick}>
                로그아웃
              </LogoutButton>
            ),
          },
          {
            key: 'me',
            label: <Link to='/admin'>관리자 페이지</Link>,
          },
        ],
      }}
    >
      <ProfileImage src={profileImage} alt='profile image' />
    </Dropdown>
  );
};
