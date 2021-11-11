import axios from "../axios";
import Cookie from "js-cookie";

const { LOGIN, DISCONNECT } = require("../Var/authVar");

export const login = (data) => async (dispatch) => {
  console.log(data);

  await dispatch({ type: LOGIN, data: { ...data } });
  Cookie.set("userInfo", JSON.stringify(data));
};

export const disconnect = (userInfo) => async (dispatch) => {
  console.log(userInfo);

  await axios.get("/auth/disconnect");
  dispatch({ type: DISCONNECT });
  Cookie.remove("userInfo");
};
