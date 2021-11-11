import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import CancelIcon from "@material-ui/icons/Cancel";
import "./inscription-demandeur.css";
import { Link } from "react-router-dom";
import Cookie from "js-cookie";
import axios from "../../axios";
import { useHistory } from "react-router-dom";

import isEmail from "validator/lib/isEmail";
import isAlpha from "validator/lib/isAlpha";
import isInt from "validator/lib/isInt";

export default function InscriptionHelper(props) {
  const [token, setToken] = useState(null);

  const history = useHistory();
  const inscriptionCoockie =
    Cookie.getJSON("inscription") === false
      ? Cookie.getJSON("inscription")
      : true;
  const phoneValidationCoockie = Cookie.getJSON("phoneValidation") || false;
  const emailValidationCoockie = Cookie.getJSON("emailValidation") || false;
  const { register, handleSubmit, errors, watch } = useForm();
  const [inscription, setInscription] = useState(inscriptionCoockie);
  const [disable, setDisable] = useState(false);
  const [phoneValidation, setPhoneValidation] = useState(
    phoneValidationCoockie
  );
  const [emailValidation, setEmailValidation] = useState(
    emailValidationCoockie
  );
  const [inscriptionError, setInscriptionError] = useState({});
  const [code, setCode] = useState(false);
  const errorsKey = Object.keys(errors);
  console.log(errors);
  const password = useRef({});
  password.current = watch("pwd", "");
  useEffect(() => {
    axios
      .get("/auth")
      .then(({ data }) => {

        setToken(data.token);
        console.log(data.token,'token');
      })
      .catch((err) => {
        console.log(err.message);
      });
    return () => {};
  }, []);
  const setCookie = (inscription1, phone1, email1) => {
    setInscription(inscription1);
    Cookie.set("inscription", JSON.stringify(inscription1));
    setPhoneValidation(phone1);
    Cookie.set("phoneValidation", JSON.stringify(phone1));
    setEmailValidation(email1);
    Cookie.set("emailValidation", JSON.stringify(email1));
  };
  const onSubmit = (data) => {
    data._csrf = token;
    console.log(data,"dataaaa");
    setDisable(true);
    axios
      .post("auth/register/"+props.link, data)
    
      .then(({ response, data }) => {
        console.log(data, response);
        if (!data.error) {
          console.log(data);
          setCookie(false, true, false);
          setCode(data.code);
          setDisable(false);
        } else if (data.error === "phoneValidation") {
          console.log(data.error);
          setCode(data.code);
          setDisable(false);
          setCookie(false, data.error, false);
        } else if (data.error === "emailValidation") {
          setCookie(false, false, data.error);
          setTimeout(() => {
            setCookie(true, false, false);
            history.push("/");
          }, 4000);
        } else if (data.error === "utilisateurInscrit") {
          setInscriptionError(data);
          setDisable(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const requireError =
    errors[errorsKey.find((e) => errors[e].type === "required")];
  const validateError =
    errors[errorsKey.find((e) => errors[e].type === "validate")];
  const minLengthError =
    errors[errorsKey.find((e) => errors[e].type === "minLength")];
  const maxLengthError =
    errors[errorsKey.find((e) => errors[e].type === "maxLength")];

  const codeSubmit = (data) => {
    data._csrf = token;
    setDisable(true);
    console.log(data);
    axios
      .post("auth/register/code-"+props.link, data)
      .then(({ data }) => {
        console.log(data, 2);
        if (data.emailValidation) {
          setCookie(false, false, data.emailValidation);
          setTimeout(() => {
            setCookie(true, false, false);
            history.push("/");
          }, 4000);
        } else if (data.error === "phoneValidation") {
          setDisable(false);
          setInscriptionError(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(inscriptionError);
  return (
    <div className="inscription">
      {" "}
      <Link to="/">
        <CancelIcon
          style={{
            fontSize: "3.2rem",
            display: "inline-block",
            color: "white",
            position: "absolute",
            top: "5%",
            right: "5%",
            zIndex: "2",
          }}
        />
      </Link>
      <div>
        {inscription && (
          <>
            <h2>Inscription-{props.link.charAt(0).toUpperCase()+props.link.slice(1)}</h2>
            <form
              className="inscription-form-demandeur"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="left-signup-form">
                <label htmlFor="">Prénom : </label>
                <input
                  name="firstName"
                  ref={register({
                    required: "Le prénom est obligatoire",
                    minLength: 2,
                    validate: (val) =>
                      isAlpha(val)
                        ? true
                        : "le Prénom ne doit contenir que des lettres",
                  })}
                  type="text"
                />
              </div>
              <div className="left-signup-form">
                <label htmlFor="">Nom : </label>
                <input
                  name="lastName"
                  type="text"
                  ref={register({
                    required: "Le Nom est obligatoire",
                    minLength: 2,
                    validate: (val) =>
                      isAlpha(val)
                        ? true
                        : "le Nom ne doit contenir que des lettres",
                  })}
                />
              </div>
              <div className="left-signup-form select">
                <label htmlFor="">Sexe : </label>
                <select
                  name="gender"
                  ref={register({
                    required: true,
                    validate: (val) =>
                      val === ("male" || "female")
                        ? true
                        : "Sexe incorrecte revérifiez",
                  })}
                  id="selectGender"
                >
                  <option value="male">male</option>
                  <option value="female">female</option>
                </select>
              </div>
              <div className="left-signup-form">
                <label htmlFor="">E-mail : </label>
                <input
                  name="email"
                  type="email"
                  ref={register({
                    required: "email est obligatoire",
                    validate: (val) =>
                      isEmail(val) ? true : "Format d'Email invalid",
                  })}
                />
              </div>
              <div className="left-signup-form">
                <label htmlFor=""> Mot de passe : </label>
                <input
                  name="pwd"
                  type="password"
                  ref={register({
                    required: "Mot de passe 8 caracteres minimum",
                    minLength: {
                      value: 8,
                      message: "Le mot de passe doit contenir 8 lettre min",
                    },
                  })}
                  placeholder="8 caracteres min"
                  value="123123123"
                />
              </div>
              <div className="left-signup-form">
                <label htmlFor="">Répetez Mot de passe : </label>
                <input
                  name="confirmPwd"
                  type="password"
                  ref={register({
                    required: "Mot de passe 8 caracteres minimum",
                    minLength: {
                      value: 8,
                      message: "Le mot de passe doit contenir 8 lettre min",
                    },
                    validate: (val) =>
                      val === password.current ||
                      "Mots de passes ne correspondent pas",
                  })}
                  value="123123123"
                />
              </div>
              <div className="left-signup-form">
                <label htmlFor="">Numéro de telephone : </label>
                <input name="phone" type="text" ref={register()} />
              </div>
              <div className="left-signup-form">
                <label htmlFor="">Département : </label>
                <input
                  name="departement"
                  type="number"
                  ref={register({
                    required: "Département est obligatoire",
                    validate: (val) =>
                      +val > 0 && +val < 96 ? true : "Département invalid",
                  })}
                  value="2"
                />
              </div>
              <div>
                {(requireError && <span>{requireError.message}</span>) ||
                  (minLengthError && <span>{minLengthError.message}</span>) ||
                  (validateError && <span>{validateError.message}</span>) ||
                  (inscriptionError.error === "utilisateurInscrit" && (
                    <span>{inscriptionError.message}</span>
                  ))}

                <input
                  ref={register}
                  name="submit"
                  type="submit"
                  value="inscription"
                  disabled={disable}
                />
              </div>
            </form>
          </>
        )}
        {phoneValidation && (
          <>
            <h2>Confirmation Numéro de téléphone</h2>

            <form onSubmit={handleSubmit(codeSubmit)}>
              <div className="left-signup-form">
                <label htmlFor="">Vérifiez Vos SMS et entrez le code : </label>
                <input
                  name="code"
                  type="number"
                  ref={register({
                    required: "Code doit avoir 6 Chiffre",

                    minLength: {
                      value: 6,
                      message: "Le code contient 6 chiffres",
                    },
                    maxLength: {
                      value: 6,
                      message: "Le code contient 6 chiffres",
                    },
                    validate: (val) =>
                      isInt(val)
                        ? true
                        : "Le code ne contient que des chiffres",
                  })}
                />
                <br />
                <br />
                <span>Votre code est : {code}</span>

                <input type="submit" disabled={disable} />
              </div>
              {validateError && <span>{validateError.message}</span>}
              {requireError && <span>{requireError.message}</span>}
              {minLengthError && <span>{minLengthError.message}</span>}
              {maxLengthError && <span>{maxLengthError.message}</span>}
              {inscriptionError.error === "phoneValidation" && (
                <span>{inscriptionError.message}</span>
              )}
            </form>
          </>
        )}
        {emailValidation && (
          <>
            {" "}
            {emailValidation === "emailValidation" && (
              <h2>Vous etes déja inscrit</h2>
            )}{" "}
            <h2>Vérifiez votre email et connectez vous</h2>
          </>
        )}
      </div>
    </div>
  );
}
