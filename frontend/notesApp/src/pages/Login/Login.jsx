import React from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import Navbar from "../../components/Navbar/Navbar";
import { useAuthentication } from "../../libs";
import { validateEmail } from "../../utils/helper";

const Login = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const { login } = useAuthentication();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("please enter a valid email");
      return;
    }
    if (!password) {
      setError("please enter a password");
      return;
    }
    setError("");

    const success = await login(email, password);

    if (success) {
      navigate("/");
    } else {
      setError("Incorrect password. Please try again later");
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className=" w-96 border rounded bg-white px-7 py-10 ">
          <form onSubmit={handleLogin}>
            <h1 className="text-2xl mb-7">Login</h1>

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-xl pb-1">{error}</p>}
            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not Registered yet?{" "}
              <Link to="/signup" className="font-medium text-primary underline">
                Create an account here.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
