import { createContext, ReactNode, FC, useEffect, useState } from 'react';
import { useGetMeQuery } from '../graphql/user/user';
import { UserModel } from '../graphql/graphql';

export const UserContext = createContext<UserModel | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserModel | undefined>();
  const { data } = useGetMeQuery({});

  useEffect(() => {
    if (data?.me) {
      setUser(data.me);
    }
  }, [data]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
