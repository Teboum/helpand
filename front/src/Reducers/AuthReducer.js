const { LOGIN, DISCONNECT } = require("../Var/authVar");

const loginReducer = (state = null, action) => {
  switch (action.type) {
    case LOGIN:
      console.log(action.data);
      return { ...action.data };
    case DISCONNECT:
      return null;
    default:
      return state;
  }
};
export default loginReducer