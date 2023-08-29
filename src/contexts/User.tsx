import { createContext, ReactNode, FC, useEffect, useState } from 'react';
import { useGetMeQuery, useUpdateUserMutation } from '../graphql/user/user';
import { UserModel } from '../graphql/graphql';
import React from 'react';
import { useSnackbar } from './snackbar.context';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextProps {
  user: UserModel | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>;
  updating: boolean;
}

export const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => {},
  updating: false
});

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | undefined>();
  const { data } = useGetMeQuery({});
  const [updateUser, { loading: updating }] = useUpdateUserMutation({});
  const { pushMessage } = useSnackbar();

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  useEffect(() => {
    if (user && user.fullname && user.email && (data?.me.fullname !== user.fullname || data?.me.email !== user.email)) {
      updateUser({
        variables: {
          fullname: user.fullname,
          email: user.email
        },
        onCompleted: () => {
          pushMessage('Successfully updated user', 'success');
        },
        onError: (error) => {
          pushMessage(error.message, 'error');
          setUser({
            ...user,
            fullname: data?.me?.fullname,
            email: data?.me?.email
          });
        }
      });
    }
  }, [user]);

  const value = {
    user,
    setUser,
    updating
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
