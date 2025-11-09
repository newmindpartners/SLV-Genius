import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { useSelector } from 'react-redux';
import { UserConnectResponse } from '~/redux/api/core';
import { getConnectUserCache, getUser } from '~/redux/selector/user';

type UserHook = {
  user: UserConnectResponse | undefined;
  isLoading: boolean;
  isFetchQueryFulfilled: boolean;
};

export const useUser = (): UserHook => {
  const { isLoading, status } = useSelector(getConnectUserCache);
  const isFetchQueryFulfilled = status === QueryStatus.fulfilled;
  const user = useSelector(getUser);

  return {
    user,
    isLoading,
    isFetchQueryFulfilled,
  };
};
