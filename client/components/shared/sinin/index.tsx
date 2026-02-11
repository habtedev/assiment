// index.tsx
// Example usage of SignIn component and useSignIn hook
import React from 'react';
import { useSignIn } from './useSignIn';
import SignIn from './SignIn';
const SignInContainer: React.FC = () => {
  const { loading, error, signIn, resetPassword } = useSignIn();

  return (
    <div>
      <SignIn
        onSignIn={signIn}
        onResetPassword={resetPassword}
      />
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SignInContainer;
