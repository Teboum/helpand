import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../axios";
import LoadingScreen from "react-loading-screen";
import Spinner from "react-bootstrap/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Action/LoginAction";

function ConfirmEmail() {
  const history = useHistory();
  const dispatch = useDispatch();
  const query = history.location.search;
  const code = query.substr(6, 6);
  const num = query.substr(17, 9);
  const email = query.substring(33);
  console.log(1);
  useEffect(() => {
    const checkUser = history.location.pathname.includes("helper");
    console.log(checkUser);
    (async () => {
      try {
        let { data } = await axios.get("/auth");

        const token = data.token;
        await console.log(console.log(email, num, code));
        data = await axios.post(
          `/auth/register/emailconfirmation${checkUser ? "helper" : ""}`,
          {
            code: code,
            num: num,
            email: email,
            _csrf: token,
          }
        );

        console.log(data);
        if (data.data.success) {
          console.log(data.data);
          await dispatch(login(data.data.userInfo));
          console.log(data.data.success);
          history.push("/");
        }
      } catch (err) {
        console.log(err);
      }
    })();

    return async () => {};
  }, []);
  return (
    <div>
      {" "}
      <LoadingScreen
        loading={true}
        bgColor="#f1f1f1"
        spinnerColor="#9ee5f8"
        textColor="#676767"
        logoSrc="https://media.giphy.com/media/cnzP4cmBsiOrccg20V/giphy.gif"
        text="Veuillez vous connectez"
      >
        // ... // here loadable content // for example, async data //
      </LoadingScreen>
      <Spinner animation="border" />
    </div>
  );
}

export default ConfirmEmail;
