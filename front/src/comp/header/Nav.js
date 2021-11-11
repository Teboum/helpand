import { React } from "react";
import { Link } from "react-router-dom";
import DropDown from "./DropDown";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "./Header.css";
import Button from "@material-ui/core/Button";
import { disconnect } from "../../Action/LoginAction";

function Nav(props) {
  const userInfo = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const history = useHistory();
  const logout = async () => {
    await dispatch(disconnect(userInfo));
    history.push("/");
  };
  return (
    <nav
      className={props.dispNav ? "header-nav header-nav-active" : "header-nav"}
    >
      <Link to="/" className={window.location.pathname === "/" && "active"}>
        Demander-un-Service
      </Link>
      <Link
        to="/events"
        className={window.location.pathname === "/events" && "active"}
      >
        Demander-un-Helper
      </Link>
      {!userInfo ? (
        <>
          <DropDown style={{ border: "none" }} inscription="Connexion" />
          <DropDown inscription="Inscription" />
        </>
      ) : (
        <Button variant="contained" color="secondary" onClick={logout}>
          Déconnexion
        </Button>
      )}
    </nav>
  );
}

export default Nav;
