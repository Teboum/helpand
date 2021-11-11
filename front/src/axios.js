import axios from "axios";

const instance = axios.create({
  
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
instance.interceptors.response.use(null, function (error) {
  console.log(error);
  return error;
});
export default instance;
