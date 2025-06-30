import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/auth';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.target);
    const credentials = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      await authAPI.login(credentials);
      navigate('/dashboard/my-chatbots');
    } catch (err) {
      console.error('Login failed:', err);

      if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Login failed. Please check your credentials or try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10 animate__animated animate__fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-xl mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">ChatSass</h1>
        <p className="text-black  text-lg">for testing </p>
        <p className="text-black text-lg">Email: <span className='text-red-400 '>test@gmail.com </span></p>
        <p className="text-black  text-lg">Password:<span className='text-red-400 '> 123456</span>  </p>
        <p className="text-gray-400 text-lg">Sign in to your account</p>
      </div>

      <div className="bg-neutral-800 rounded-2xl shadow-2xl p-8 w-full max-w-md animate__animated animate__fadeInUp">
        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243" />
                  ) : (
                    <>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>

          <Button text="Sign In" isLoading={isLoading} />

          <div className="text-center text-sm text-gray-400 mt-4">
            Don’t have an account?{' '}
            <a href="/signup" className="text-teal-400 hover:text-teal-300 font-medium">
              Sign up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
