import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import { useAuthentication } from "../../libs";
import { validateEmail, validatePassword } from "../../utils/helper";
import { FiUser, FiMail, FiUserPlus } from "react-icons/fi";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { register } = useAuthentication();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name) {
      setError("Please enter your full name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with uppercase, lowercase, number, and special character"
      );
      return;
    }
    setError("");

    const success = await register(name, email, password);

    if (success) {
      navigate("/");
    } else {
      setError("An unexpected error occurred. Please try again later");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl shadow-lg mb-4 transform hover:scale-110 transition-transform duration-300">
            <FiUserPlus className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Join NotesApp</h1>
          <p className="text-white/80">Create an account to get started</p>
        </div>

        {/* SignUp Card */}
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="input-label">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="input-box pl-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

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
                placeholder="Create a strong password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button type="submit" className="btn-primary">
              <span className="flex items-center justify-center gap-2">
                <FiUserPlus />
                Create Account
              </span>
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-primary font-semibold hover:text-secondary transition-colors duration-200 inline-flex items-center gap-1"
            >
              Sign in here
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-8">
          By signing up, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;
