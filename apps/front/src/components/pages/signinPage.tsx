import { useAuth0 } from '../../auth0';
import { SigninTemplate } from '../templates';

export const SigninPage = (): JSX.Element => {
  const { signIn } = useAuth0();

  return <SigninTemplate signIn={signIn} />;
};
