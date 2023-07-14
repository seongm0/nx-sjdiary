/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-shadow */
import { Auth0Error, Auth0UserProfile, WebAuth } from 'auth0-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../config';
import { ROUTES } from '../constant';
import { useCheckAuthLocalStorage } from '../hooks';

export type Auth0Context = {
  user?: Auth0UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (o: SignInOptions) => void;
  signOut: () => void;
  getToken: () => Promise<string | undefined>;
  getAuth0UserProfile: () => Promise<Auth0UserProfile | undefined>;
};

type AnyObject = Record<string, any>;

type SessionData = {
  accessToken?: string;
  expiresIn?: number;
  profile?: AnyObject;
};

export type SignInOptions = {
  type: 'google' | 'apple';
};

const auth0Context = createContext<Auth0Context>({
  user: undefined,
  isAuthenticated: false,
  isLoading: true,
  signIn: (): Promise<void> => Promise.resolve(),
  signOut: () => {},
  getToken: (): Promise<string | undefined> => Promise.resolve(undefined),
  getAuth0UserProfile: (): Promise<Auth0UserProfile | undefined> =>
    Promise.resolve(undefined),
});

auth0Context.displayName = 'Auth0Context';
const Auth0Provider = auth0Context.Provider;

const AUTH_SCOPE = 'openid profile email';

export const useAuth0 = (): Auth0Context => useContext(auth0Context);

export const Auth0Wrapper = ({
  children,
}: {
  children: JSX.Element | undefined;
}): JSX.Element => {
  const [auth0Client, setAuth0Client] = useState<WebAuth | undefined>(
    undefined,
  );
  const [auth0UserData, setAuth0UserData] = useState<any | undefined>(
    undefined,
  );

  const { checkAuth, setCheckAuth } = useCheckAuthLocalStorage();
  const [isLoading, setIsLoading] = useState<boolean>(checkAuth);

  const isAuthenticated = useMemo((): boolean => {
    if (auth0UserData?.profile !== undefined) {
      return true;
    }
    return false;
  }, [auth0UserData]);

  const signIn = ({ type = 'google' }: SignInOptions) => {
    if (auth0Client) {
      const redirectUri = `${window.location.origin}${ROUTES.MAIN}`;
      try {
        setCheckAuth(true);

        if (type === 'apple') {
          auth0Client.authorize({
            connection: 'apple',
            redirectUri,
          });
          return;
        }

        if (type === 'google') {
          auth0Client.authorize({
            connection: 'google-oauth2',
            redirectUri,
          });
          return;
        }
      } catch (err) {
        console.error('Auth0Wrapper: SignIn error');
        console.error(err);
        alert('로그인 에러 발생');
        setCheckAuth(false);
      }
    }
  };

  const signOut = (): boolean => {
    if (auth0Client) {
      auth0Client.logout({
        returnTo: `${window.location.origin}${ROUTES.SIGNIN}`,
        clientID: AUTH0_CLIENT_ID,
      });
      setCheckAuth(false);
      return true;
    }
    console.log('auth0Client is not set');
    alert('로그인 에러 발생');
    return false;
  };

  /**
   * Receive new token from auth0 server
   */
  const fetchToken = useCallback(async (): Promise<{
    err: unknown;
    result: SessionData | undefined;
  }> => {
    if (auth0Client) {
      const {
        err,
        result,
      }: {
        err: unknown;
        result?: SessionData & { idTokenPayload?: AnyObject };
      } = await new Promise((resolve) => {
        auth0Client.checkSession(
          {
            audience: AUTH0_AUDIENCE,
            scope: AUTH_SCOPE,
          },
          (
            err: unknown,
            result?: SessionData & { idTokenPayload?: AnyObject },
          ) => {
            resolve({
              err,
              result: {
                accessToken: result?.accessToken,
                profile: result?.idTokenPayload,
                expiresIn: result?.expiresIn,
              },
            });
          },
        );
      });
      return { err, result };
    }

    return { err: undefined, result: undefined };
  }, [auth0Client]);

  /**
   * Check time and call fetchtoken if needed.
   *
   * Token that are to be expired in 10 min will be refetched by setTimeout in useEffet hook below
   */
  const getToken = useCallback(async (): Promise<string | undefined> => {
    if (!isAuthenticated) {
      return undefined;
    }

    if (auth0Client && auth0UserData !== undefined) {
      const utcTimeTenMinFromNow = Math.floor(+new Date() / 1000) + 600;
      const tokenExists = !!auth0UserData.accessToken;
      const tokenExpired = auth0UserData.profile.exp <= utcTimeTenMinFromNow;

      if (tokenExists && !tokenExpired) {
        // * if token exists and not expired yet, return token
        return auth0UserData.accessToken;
      }
      // * if token already expired, call fetchToken and return the result

      const { result } = await fetchToken();
      setAuth0UserData({
        ...result,
        profile: result?.profile,
      });

      return result?.accessToken;
    }

    return undefined;
  }, [auth0UserData, auth0Client, fetchToken]);

  type IAuth0UserInfoResult = {
    profile: Auth0UserProfile | undefined;
    error: Auth0Error | null;
  };

  const fetchUserProfile = useCallback(
    async (accessToken: string): Promise<IAuth0UserInfoResult> => {
      if (auth0Client) {
        const { profile, error } = await new Promise<IAuth0UserInfoResult>(
          (resolve) => {
            auth0Client.client.userInfo(accessToken, (_error, _profile) => {
              resolve({ profile: _profile, error: _error });
            });
          },
        );

        return { profile, error };
      }

      return { profile: undefined, error: { error: 'auth0Client is not set' } };
    },
    [auth0Client],
  );

  const getAuth0UserProfile = useCallback(async (): Promise<
    Auth0UserProfile | undefined
  > => {
    if (auth0UserData?.profile !== undefined) {
      return auth0UserData.profile;
    }

    if (auth0UserData) {
      const { profile } = await fetchUserProfile(auth0UserData?.accessToken);
      return profile;
    }

    return undefined;
  }, [auth0UserData, fetchUserProfile]);

  useEffect(() => {
    const webAuth = new WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: AUTH0_CLIENT_ID,
      audience: AUTH0_AUDIENCE,
      redirectUri: window.location.origin,
      responseType: 'code token id_token',
      scope: AUTH_SCOPE,
    });
    setAuth0Client(webAuth);

    if (!checkAuth) {
      return;
    }

    setIsLoading(true);

    // call checkSession() to get if logged in
    webAuth.checkSession(
      {
        audience: AUTH0_AUDIENCE,
        scope: AUTH_SCOPE,
      },
      (err: unknown, result?: SessionData & { idTokenPayload?: AnyObject }) => {
        if (err) {
          console.error(err);
        }

        if (process.env.REACT_APP_MODE === 'local') {
          console.log('============accessToken============');
          console.log(result?.accessToken);
          console.log('============accessToken============');
        }

        if (result !== undefined) {
          setAuth0UserData({
            accessToken: result?.accessToken,
            profile: result?.idTokenPayload ? result.idTokenPayload : undefined, // auth0UserData.profile.exp
            expiresIn: result?.expiresIn, // ? 7200 seconds
          });
        }
        setIsLoading(false);
      },
    );
  }, [checkAuth]);

  // call refreshToken every 600 sec
  useEffect(() => {
    let tokenTimer: undefined | NodeJS.Timeout;

    const refreshToken = () => {
      getToken();
      tokenTimer = setTimeout(() => {
        refreshToken();
        // time config 분리
      }, 600000);
    };

    refreshToken();

    return () => {
      if (tokenTimer !== undefined) {
        clearTimeout(tokenTimer);
      }
    };
  }, [getToken]);

  return (
    <Auth0Provider
      value={{
        user: auth0UserData?.profile,
        isAuthenticated,
        isLoading,
        signIn,
        signOut,
        getToken,
        getAuth0UserProfile,
      }}
    >
      {children}
    </Auth0Provider>
  );
};
