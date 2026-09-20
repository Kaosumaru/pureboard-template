import './LoginPage.css';
import { Stack } from '@mui/material';
import { JSX, useCallback, useState } from 'react';
import { useUserIdCookie } from '@client/api/auth';
import { Login } from '../GamePage/Components/Login';
import { LoginContext } from './LoginContext.js';

export interface LoginProps {
  children?: JSX.Element | JSX.Element[];
}

function LoginPage(props: LoginProps) {
  const [userIdCookieValue, setUserIdCookie, removeUserIdCookie] = useUserIdCookie();
  const [error, SetError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(userIdCookieValue));
  const [userId, setUserId] = useState(() => userIdCookieValue);

  const handleLogin = useCallback(
    (username: string) => {
      setIsLoading(true);

      if (username.length < 3) {
        SetError('Username must be at least 3 characters long');
        setIsLoading(false);
        return;
      }

      setUserIdCookie(username);
      setUserId(username);
      SetError(undefined);

      setIsLoggedIn(true);
      setIsLoading(false);
    },
    [setUserIdCookie]
  );

  if (!isLoggedIn) {
    return (
      <Stack>
        <Login isLoading={isLoading} onLogin={handleLogin} error={error} />
      </Stack>
    );
  }

  const logout = () => {
    removeUserIdCookie();
    setIsLoggedIn(false);
    setIsLoading(false);
  };

  return <LoginContext.Provider value={{ logout, userId }}>{props.children}</LoginContext.Provider>;
}

export default LoginPage;
