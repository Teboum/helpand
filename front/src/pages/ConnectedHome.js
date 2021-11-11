import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import HomeHelper from "./HomeHelper";

import HomeUser from "./HomeUser";
function ConnectedHome() {
  const userInfo = useSelector((state) => state.auth);
  const user = userInfo.user;
  useEffect(() => {
    console.log(user, userInfo);
    return () => {};
  }, []);
  return (
    <div>
      {" "}
      {user === "User" ? <HomeUser /> : user === "Helper" ? <HomeHelper /> : ""}
    </div>
  );
}

export default ConnectedHome;
