import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from 'axios';

function Login() {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await axios.post('http://localhost:5000/verify_token', { idToken });
      if (response.data.status === 'success') {
        // User is authenticated and allowed
        console.log('User authenticated and allowed');
        // Here you would typically update your app's state or redirect the user
      }
    } catch (error) {
      console.error('Error during authentication:', error);
    }
  };

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  );
}

export default Login;