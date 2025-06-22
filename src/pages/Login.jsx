const Login = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-10 animate__animated animate__fadeInDown">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-500 rounded-xl mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            ></path>
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2">ChatSass</h1>
        <p className="text-gray-400 text-lg">Sign in to your account</p>
      </div>

      {/* Login Form Container */}
      <div className="bg-neutral-800 rounded-2xl shadow-2xl p-8 sm:p-10 md:p-12 w-full max-w-md animate__animated animate__fadeInUp">
        <form id="loginForm" className="space-y-7">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-base"
                placeholder="Enter your email"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  ></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 text-base"
                placeholder="Enter your password"
              />
              <button
                type="button"
                id="togglePassword"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <svg
                  id="eyeIcon"
                  className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 text-teal-500 bg-neutral-700 border-neutral-600 rounded focus:ring-teal-500 focus:ring-2"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <a
              href="#forgot-password"
              className="text-sm text-teal-400 hover:text-teal-300 transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3.5 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-neutral-800 text-lg mt-8"
          >
            <span id="loginButtonText">Sign In</span>
            <svg
              id="loginSpinner"
              className="hidden animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </button>

          {/* Or continue with divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-neutral-800 text-gray-400 animate__animated animate__fadeInUp">
                Or continue with
              </span>
            </div>
          </div>
        </form>

        {/* Sign Up Link */}
        <div className="mt-7 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Security Message */}
      <div className="mt-8 text-center animate__animated animate__fadeInUp animate__delay-1s">
        <p className="text-xs text-gray-500">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
};

export default Login;