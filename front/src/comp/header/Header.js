import React, { useEffect, useRef, useState } from "react";
import ReactTypingEffect from "react-typing-effect";
import OutsideClickHandler from "react-outside-click-handler";
import MenuIcon from "@material-ui/icons/Menu";
import "./Header.css";
import Nav from "./Nav";
//import { useHistory } from "react-router-dom";
//*const history = useHistory();*/

function Header() {
  const [inputText, setInputText] = useState("");
  const [animation, setAnimation] = useState(true);
  const [dispNav, setDispNav] = useState(false);
  const [dispMenuIcon, setDispMenuIcon] = useState(false);
  const example = ["Plombier", "chauffeur", "babysitter", "Cours de soutiens"];
  const reference = useRef(null);

  useEffect(() => {
    if (window.innerWidth < 1153) {
      setDispMenuIcon(true);
    } else {
      setDispMenuIcon(false);
    }
    window.addEventListener("resize", (a, b) => {
      if (window.innerWidth < 1153) {
        setDispMenuIcon(true);
      } else {
        setDispMenuIcon(false);
      }
    });
    return window.removeEventListener("resize", () => {});
  }, []);
  console.log(dispNav, dispMenuIcon);
  return (
    <div className={`header ${dispNav ? "active-color" : ""}`}>
      <img src="images/logo.png" alt="" className="logo" />
      <div className="form__group field">
        <input
          ref={reference}
          type="input"
          className="form__field"
          placeholder="Name"
          name="name"
          id="name"
          required
          value={inputText}
          onFocus={() => setAnimation(false)}
          onBlur={(e) => e.target.value === "" && setAnimation(true)}
          onChange={(e) => setInputText(e.target.value)}
        />
        {animation && (
          <div
            onClick={(e) => {
              reference.current.focus();
              setAnimation(false);
            }}
          >
            {" "}
            <ReactTypingEffect text={example} id="animation" speed={100} />
          </div>
        )}
        <label htmlFor="name" className="form__label">
          Rechercher Des Services
        </label>
      </div>

      {dispNav ? (
        <>
          {dispMenuIcon && (
            <MenuIcon
              style={{
                fontSize: "5rem ",
                paddingLeft: "2rem",
              }}
              id="menu-icon"
            />
          )}
          <div id="nav-responsive-wrapper">
            <OutsideClickHandler
              onOutsideClick={() => {
                setDispNav(false);
              }}
            >
              <Nav dispNav={dispNav} />
            </OutsideClickHandler>
          </div>
        </>
      ) : (
        <>
          <Nav dispNav={dispNav} />
          {dispMenuIcon && (
            <MenuIcon
              style={{
                fontSize: "5rem ",
                paddingLeft: "2rem",
                color: "#991616",
              }}
              onClick={(e) => setDispNav(true)}
            />
          )}
        </>
      )}
      <div></div>
    </div>
  );
}

export default Header;
