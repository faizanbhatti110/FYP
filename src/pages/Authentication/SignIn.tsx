import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import Logo from '../../images/logo/logo.png';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData?.role;
        // Navigate based on role
        if (role === 'admin') {
          navigate('/ECommerce');
        } else if (role === 'Cashier') {
          navigate('/user/cashier');
        } else {
          setError('Invalid role');
        }
      } else {
        setError('User role not found');
      }
    } catch (error) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <img src={Logo} alt="Logo" className="mx-auto h-12 w-auto" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Or{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              sign up for a new account
            </Link>
          </p>
        </div>
        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
              Forgot your password?
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
