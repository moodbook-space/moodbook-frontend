import { Dropdown, message } from 'antd';
import { Link, useNavigate } from 'react-router';
import { LogoutButton, ProfileImage } from './ProfileIcon.styles';
import { removeLocalStorageItem, StorageKeys } from '@/utils/storage';
import profileImage from '@/assets/profile.png';
import { Paths } from '@/routes/routes';
import { requestLogout, Roles } from '@/apis/user';
import { useUserStore } from '@/stores/user';
import { ItemType } from 'antd/es/menu/interface';

export const ProfileIcon = () => {
  const navigate = useNavigate();
  const { id, role } = useUserStore();

  const onLogoutClick = async () => {
    const response = await requestLogout(id);

    if (response.status === 200) {
      message.info('로그아웃되었습니다.');
      removeLocalStorageItem(StorageKeys.ACCESS_TOKEN);
      removeLocalStorageItem(StorageKeys.REFRESH_TOKEN);

      setTimeout(() => {
        navigate(Paths.SIGN_IN);
      }, 1500);
    } else {
      const json = await response.json();
      message.error(JSON.stringify(json));
    }
  };

  const dropdownItems: ItemType[] = [
    { key: 'admin', label: <Link to='/me'>마이페이지</Link> },
    {
      key: 'logout',
      label: (
        <LogoutButton type='button' onClick={onLogoutClick}>
          로그아웃
        </LogoutButton>
      ),
    },
  ];

  if (role === Roles.ADMIN) {
    dropdownItems.push({
      key: 'me',
      label: (
        <Link to='/admin' target='_blank'>
          관리자 페이지
        </Link>
      ),
    });
  }

  return (
    <Dropdown menu={{ items: dropdownItems }}>
      <ProfileImage src={profileImage} alt='profile image' />
    </Dropdown>
  );
};
