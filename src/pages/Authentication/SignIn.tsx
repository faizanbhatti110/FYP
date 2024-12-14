import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig'; // Ensure the correct path to firebaseConfig
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import LogoDark from '../../images/logo/logo-dark.svg';
import Logo from '../../images/logo/logo.svg';

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
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData?.role;

        // Navigate based on role
        if (role === 'admin') {
          navigate('/tables'); // Redirect Admin to /tables
        } else if (role === 'cashier') {
          navigate('/forms/form-elements'); // Redirect Cashier to /forms/form-elements
        } else {
          setError('Invalid role'); // Handle unexpected roles
        }
      } else {
        setError('User role not found');
      }
    } catch (err) {
      console.error('Error signing in:', err);
      setError('Invalid email or password'); // Display error message
    }
  };

  return (
    <>
      <Breadcrumb pageName="Sign In" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex flex-wrap items-center">
          <div className="hidden w-full xl:block xl:w-1/2">
            <div className="py-17.5 px-26 text-center">
              <Link className="mb-5.5 inline-block" to="/">
                <img className="hidden dark:block" src={Logo} alt="Logo" />
                <img className="dark:hidden" src={LogoDark} alt="Logo" />
              </Link>
              <p className="2xl:px-20">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit suspendisse.
              </p>
            </div>
          </div>

          <div className="w-full xl:w-1/2">
            <div className="p-10">
              <h3 className="mb-6 text-center text-xl font-bold">Sign In</h3>
              <form onSubmit={handleSignIn}>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="mb-4 text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
