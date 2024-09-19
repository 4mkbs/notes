import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Authenticated } from "./components/Authenticated";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        index
        exact
        element={
          <Authenticated>
            <Home />
          </Authenticated>
        }
      />
      <Route
        path="/login"
        exact
        element={
          <Authenticated revert>
            <Login />
          </Authenticated>
        }
      />
      <Route
        path="/signup"
        exact
        element={
          <Authenticated revert>
            <SignUp />
          </Authenticated>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
