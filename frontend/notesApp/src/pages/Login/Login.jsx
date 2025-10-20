import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { useAuthentication } from "../../libs";
import { validateEmail } from "../../utils/helper";
import { FiMail, FiLogIn } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const { login } = useAuthentication();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
            <FiLogIn className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-white/80">Sign in to continue to your notes</p>
        </div>

        {/* Login Card */}
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-box pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button type="submit" className="btn-primary">
              <span className="flex items-center justify-center gap-2">
                <FiLogIn />
                Sign In
              </span>
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">New to Notes?</span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/signup"
              className="text-primary font-semibold hover:text-secondary transition-colors duration-200 inline-flex items-center gap-1"
            >
              Create an account
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-8">
          © 2025 NotesApp. Secure & Beautiful.
        </p>
      </div>
    </div>
  );
};

export default Login;
