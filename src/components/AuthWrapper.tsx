'use client';

import { useUserStore } from '@/stores/useUserStore';
import axios from 'axios';
import { useEffect } from 'react';

export const AuthWrapper = () => {
  const setUser = useUserStore(state => state.setUser);

  useEffect(() => {
    axios
      .get('http://localhost:3001/getUser', { withCredentials: true })
      .then((res) => {
        if (res.data?.username) {
          setUser({ username: res.data.username });
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [setUser]);

  return null;
};
