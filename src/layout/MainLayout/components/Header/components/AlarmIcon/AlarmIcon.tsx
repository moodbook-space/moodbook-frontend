import { Dropdown } from 'antd';
import { AlarmImage } from './AlarmIcon.styles';
import alarmImage from '@/assets/alarm.png';
import { useState } from 'react';
import {
  Notification,
  requestNotifications,
  RequestNotificationsResponse,
} from '@/apis/user';
import { useUserStore } from '@/stores/user';

export const AlarmIcon = () => {
  const { id } = useUserStore();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const onDropdownOpened = async () => {
    const response = await requestNotifications(id);
    const data: RequestNotificationsResponse = await response.json();

    setNotifications(data);
  };

  return (
    <Dropdown
      onOpenChange={(open) => open && onDropdownOpened()}
      menu={{
        items: notifications.map((item) => ({
          key: item.id,
          label: item.content,
        })),
      }}
    >
      <AlarmImage src={alarmImage} alt='profile image' />
    </Dropdown>
  );
};
