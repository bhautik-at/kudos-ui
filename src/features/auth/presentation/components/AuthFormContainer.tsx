import { useAuth } from '../contexts/AuthContext';
import { SignupForm } from './SignupForm';
import { LoginForm } from './LoginForm';
import { OtpVerificationForm } from './OtpVerificationForm';

interface AuthFormContainerProps {
  initialForm: 'signup' | 'login';
}

export const AuthFormContainer = ({ initialForm }: AuthFormContainerProps) => {
  const { awaitingOtpVerification } = useAuth();

  // Show OTP verification form if we're awaiting OTP verification
  if (awaitingOtpVerification) {
    return <OtpVerificationForm />;
  }

  // Show either login or signup form based on the initialForm prop
  return initialForm === 'signup' ? <SignupForm /> : <LoginForm />;
};
