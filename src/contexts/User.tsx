import { createContext, ReactNode, FC, useEffect, useState } from 'react';
import { useGetMeQuery, useUpdateUserMutation } from '../graphql/user/user';
import { UserModel } from '../graphql/graphql';
import React from 'react';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextProps {
  user: UserModel | undefined;
  setUser: React.Dispatch<React.SetStateAction<UserModel | undefined>>;
  updateError: boolean;
  updateSuccess: boolean;
  updateErrorMessage: string;
  setUpdateError: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  setUpdateErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  updating: boolean;
}

export const UserContext = createContext<UserContextProps>({
  user: undefined,
  setUser: () => {},
  updateError: false,
  updateSuccess: false,
  updateErrorMessage: '',
  setUpdateError: () => {},
  setUpdateSuccess: () => {},
  setUpdateErrorMessage: () => {},
  updating: false
});

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | undefined>();
  const { data } = useGetMeQuery({});
  const [updateUser, { loading: updating }] = useUpdateUserMutation({});
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<boolean>(false);
  const [updateErrorMessage, setUpdateErrorMessage] = useState<string>('');

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
          setUpdateSuccess(true);
        },
        onError: (error) => {
          setUpdateError(true);
          setUpdateErrorMessage(error.message);
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
    updateError,
    updateSuccess,
    updateErrorMessage,
    setUpdateError,
    setUpdateSuccess,
    setUpdateErrorMessage,
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
