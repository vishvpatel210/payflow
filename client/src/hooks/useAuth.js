import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { signInWithGoogle } from '../firebase';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.loginUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      return data;
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.registerUser(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      return data;
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const googleUser = await signInWithGoogle();
      const data = await authService.googleLogin(googleUser.email, googleUser.uid);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
      return { data, googleUser };
    } catch (err) {
      const message = err.response?.data?.msg || err.message || 'Google sign-in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, googleAuth, loading, error, setError };
};

export default useAuth;
