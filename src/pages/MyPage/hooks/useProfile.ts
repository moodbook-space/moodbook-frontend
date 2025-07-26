import { requestGetProfile, RequestGetProfileResponse } from '@/apis/profile';
import { useEffect, useState } from 'react';

export const useProfile = () => {
  const [profile, setProfile] = useState<RequestGetProfileResponse>();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await requestGetProfile();
      const json = await response.json();

      setProfile(json);
    };

    fetchProfile();
  }, []);

  return { profile };
};
