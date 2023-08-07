import { createContext, ReactNode, FC, useEffect, useState } from 'react';
import { useGetMeQuery, useUpdateUserMutation } from '../graphql/user/user';
import { UserModel } from '../graphql/graphql';

export const UserContext = createContext<UserModel | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | undefined>();
  const { data } = useGetMeQuery({});
  const [updateUser] = useUpdateUserMutation({});

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  useEffect(() => {
    if (user && user.fullname && user.email) {
      updateUser({
        variables: {
          fullname: user.fullname,
          email: user.email,
        }
      });
    }
  }, [user]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
