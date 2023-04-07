import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { signup, userDataSelect } from "../features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Signin = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(userDataSelect);

  const googleAuth = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(signup(tokenResponse.access_token));
    },
  });

  // protect route
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="signin">
      <div className="signin__header">Todo List App | Expectoo</div>
      <div>
        <button
          onClick={() => {
            googleAuth();
          }}
        >
          Signin with Google
        </button>
      </div>
    </div>
  );
};

export default Signin;
