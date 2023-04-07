import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { fetchTodos, userDataSelect } from "../features/userSlice";

const Layout = () => {
  const dispatch = useDispatch();
  const { token } = useSelector(userDataSelect);

  useEffect(() => {
    if (token) {
      dispatch(fetchTodos());
    }
  }, [dispatch, token]);
  return <Outlet />;
};

export default Layout;
