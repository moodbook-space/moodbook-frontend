import { requestMe, RequestMeResponse } from '@/apis/user';
import { useUserStore } from '@/stores/user';
import { useEffect } from 'react';

export const useFetchMeAndSetStore = () => {
  const { setId, setRole } = useUserStore();

  useEffect(() => {
    const requestMeAndSetToStore = async () => {
      const meResponse = await requestMe();
      const meData: RequestMeResponse = await meResponse.json();
      setId(meData.id);
      setRole(meData.role);
    };
    requestMeAndSetToStore();
  }, []);
};
