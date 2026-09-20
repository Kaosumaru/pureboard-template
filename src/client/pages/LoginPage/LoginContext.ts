import { createContext, useContext } from 'react';

export type GlobalContent = {
  logout: () => void;
  userId: string;
};

export const LoginContext = createContext<GlobalContent>({
  logout: () => {
    // do nothing
  },
  userId: '',
});

export const useLoginContext = () => useContext(LoginContext);
