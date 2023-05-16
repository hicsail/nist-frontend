import { createContext } from 'react';

type AuthContext = {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  token: string | null;
  setToken: (token: string) => void;
};

export const AuthContext = createContext({} as AuthContext);
