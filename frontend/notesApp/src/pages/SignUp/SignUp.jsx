import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/input/PasswordInput";
import Navbar from "../../components/Navbar/Navbar";
import { useAuthentication } from "../../libs";
import { validateEmail, validatePassword } from "../../utils/helper";

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
      setError("please enter a name");
      return;
    }
    if (!validateEmail(email)) {
      setError("please enter a email");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "please enter a strong password with minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
      return;
    }
    setError("");

    const success = await register(name, email, password);

    if (success) {
      navigate("/");
    } else {
      setError("An unexpected error occured. Please try again later");
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center mt-28">
        <div className=" w-96 border rounded bg-white px-7 py-10 ">
          <form onSubmit={handleSignUp}>
            <h1 className="text-2xl mb-7">SignUp</h1>

            <input
              type="text"
              placeholder="Name "
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
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
              Sign Up
            </button>

            <p className="text-sm text-center mt-4">
              Already have an account{" "}
              <Link to="/login" className="font-medium text-primary underline">
                Login here.
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
