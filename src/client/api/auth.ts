import { useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { CookieSetOptions } from 'universal-cookie';

export function useUserIdCookie(): [string, (value: string, options?: CookieSetOptions) => void, () => void] {
  const key = 'userId';
  const [cookie, setCookie, removeCookie] = useCookies([key]);

  const userIdCookieValue = cookie[key] as string;
  const setUserIdCookie = useCallback(
    (value: string, options?: CookieSetOptions) => {
      setCookie(key, value, options);
    },
    [setCookie]
  );
  const removeUserIdCookie = useCallback(() => {
    removeCookie(key);
  }, [removeCookie]);

  return [userIdCookieValue, setUserIdCookie, removeUserIdCookie];
}
