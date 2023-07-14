import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth0 } from './auth0';
import { MainPage, NotFoundPage, SigninPage } from './components/pages';
import { LoadingTemplate } from './components/templates';
import { ROUTES } from './constant';
import { useCreateUserMutation } from './graphQL/mutations';
import { VERIFY_USER } from './graphQL/queries';
import { Test } from './test/test';

export const MainRouter = (): JSX.Element => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    getAuth0UserProfile,
  } = useAuth0();

  const {
    createUser,
    loading: loadingCreateUser,
    error: errorCreateUser,
  } = useCreateUserMutation();

  const requestCreateUser = async () => {
    const auth0UserProfile = await getAuth0UserProfile();
    if (auth0UserProfile) {
      createUser({
        email: auth0UserProfile.email ?? '',
        name: auth0UserProfile.name ?? '',
        profileImageUrl: auth0UserProfile.picture ?? '',
      });
    }
  };

  const {
    data: dataVerifyUser,
    loading: loadingVerifyUser,
    error: errorVerifyUser,
  } = useQuery<{ verifyUser: boolean }>(VERIFY_USER, {
    fetchPolicy: 'network-only',
    skip: !isAuthenticated,
  });

  const isVerifyUser: boolean | undefined = useMemo(
    () => dataVerifyUser?.verifyUser ?? undefined,
    [dataVerifyUser],
  );

  const isMember = useMemo(
    () => isAuthenticated && isVerifyUser,
    [isAuthenticated, isVerifyUser],
  );

  useEffect(() => {
    if (isAuthenticated && isVerifyUser !== undefined && !isVerifyUser) {
      requestCreateUser();
    }
  }, [isAuthenticated, isVerifyUser]);

  const isLoading = useMemo(
    () => isAuthLoading || loadingVerifyUser || loadingCreateUser,
    [isAuthLoading, loadingVerifyUser, loadingCreateUser],
  );

  if (errorVerifyUser || errorCreateUser) {
    // TODO Error Page 작업
    if (process.env.REACT_APP_MODE === 'local') {
      console.log({ errorVerifyUser });
    }
  }

  return (
    <>
      {isLoading && <LoadingTemplate />}
      <Routes>
        {/* main */}
        <Route
          path={ROUTES.MAIN}
          element={isMember ? <MainPage /> : <Navigate to={ROUTES.SIGNIN} />}
        />

        {/* Sign In */}
        <Route
          path={ROUTES.SIGNIN}
          element={isMember ? <Navigate to={ROUTES.MAIN} /> : <SigninPage />}
        />

        {/* Test */}
        <Route path="/test" element={<Test />} />

        {/* Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};
