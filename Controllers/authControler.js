const {
  createValidation,
  setEmailCode,
  checkEmailCode,
  User,
  Helper,
  userLogin,
} = require("../Model/authModel");
var nodemailer = require("nodemailer");
const session = require("express-session");
const {getToken}=require("../utils")
var messagebird = require("messagebird")("7VMrVnIngntUpZj79jDDWfJSW"); //Fvr8FVt5OESdbIP6UkKtrkpXv

const signup = (
  User,
  Registration,
  sessionRegisterCode,
  sessionTentative,
  sessionEmail,
  sessionPhone
) => {
  
  return (req, res, next) => {
    let phone = "" + req.body.phone;
    phone = phone.substring(phone.length - 9);
    req.body.phone = phone;
    console.log( req.body,"eeeeeee");
    createValidation(req.body, User, Registration)
      .then((success) => {
        const random = Math.floor(100000 + Math.random() * 900000);
        messagebird.messages.create(
          {
            originator: "Tewfik",
            recipients: ["213" + "775224258"],
            body: "Votre code de validation est" + random,
          },
          (err, response) => {
            if (err) {
              console.log("ereur messagebird",err);
            } else {
              console.log(response,req.body.email,sessionEmail,"emaillll");
              const token = req.csrfToken();
              console.log(random);
              req.session[sessionRegisterCode] = random;
              req.session[sessionTentative] = 0;
              req.session[sessionEmail] = req.body.email;
              req.session[sessionPhone] = phone;
              console.log(req.session, 2);
              res.json({ success: success, token: token, code: random });
            }
          }
        );
      })
      .catch((err) => {
        if (err.error === "phoneValidation") {
          const random = Math.floor(100000 + Math.random() * 900000);
          console.log(random);
          messagebird.messages.create(
            {
              originator: "Tewfik",
              recipients: ["213" + phone],
              body: "Votre code de validation est" + random,
            },
            (error, response) => {
              if (error) {
                signup(
                  User,
                  Registration,
                  sessionRegisterCode,
                  sessionTentative,
                  sessionEmail,
                  sessionPhone
                );
              } else {
                const token = req.csrfToken();
                req.session[sessionRegisterCode] = random;
                req.session[sessionTentative] = 0;
                req.session[sessionEmail] = req.body.email;
                req.session[sessionPhone] = phone;
                console.log(req.session, 1);
                res.json({ ...err, token: token, code: random });
                console.log(req.session, 1);
              }
            }
          );
        } else if (err.error === "emailValidation") {
          req.session[sessionPhone] = phone;
          req.session.destroy();
          res.json({ ...err });
        } else {
          const token = req.csrfToken();
          res.json({ ...err, token: token });
        }
      });
  };
};

const phoneValidation = (
  sessionEmail,
  Registration,
  EmailCode,
  registerCode,
  tentative,
  phone
) => {
  return (req, res, next) => {
    if (+req.body.code === req.session[registerCode],req.session[sessionEmail]) {
      let random = "" + Math.floor(100000 + Math.random() * 900000);
      console.log(phone,'phone',req.session);
      setEmailCode(
        random,
        req.session[sessionEmail],
        Registration,
        EmailCode,
        req.session[phone]
      )
        //phoneValidation("emailHelper",HelperRegistration,EmailCodeHelper,"registerCodeHelper","tentativeHelper")
        //phoneValidation("email",UserRegistration,EmailCode,"registerCode","tentative")
        .then(() => {
          console.log(req.session[sessionEmail],"email phone validarion");
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "nodemail311@gmail.com",
              pass: "6QFxNM2XpD97gjg",
            },
          });

          // send mail with defined transport object
          var mailOptions = {
            from: "Tewfik Boumazza",
            to: req.session[sessionEmail],
            subject: "Sending Email using Node.js",

            html:
              '<a href="https://hungry-wright-93e349.netlify.app/auth/register/emailconfirmation' +
              (sessionEmail === "email" ? "" : "/helper") +
              "?code=" +
              random +
              "&num=" +
              req.session[phone] +
              "&email=" +
              req.session[sessionEmail] +
              '">Clickez ici pour valider votre email et vous connecter</a>',
          };
          transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
              console.log(error,"sendMail");
            } else {
              await console.log("Email sent: " + info.response,req.session)
              req.session.destroy();
              console.log(info.response, req.session);
              return res.json({ emailValidation: true });
            }
          });
        })
        .catch((err) => console.log(err, 555555));
    } else {
      const token = req.csrfToken();
      res.json({
        error: "phoneValidation",
        message: "Code erroné",
        token: token,
      });
    }
  };
};

const confirmEmail = (EmailCode, Registration, User) => {
  return (req, res, next) => {
    console.log(req.app, "app");
    console.log(req.body, 1);
    
    checkEmailCode(req.body, EmailCode, Registration, User) //confirmEmail("phone",EmailCode,Registration,User)
      //confirmEmail("phoneHelper",EmailCodeHelper,HelperRegistration,Helper)
      .then((user) => {
        req.session.userId = user;
        console.log(req.session);
        res.json({
          success: "success",
          userInfo: {
            ...user,
            user: req.route.path.includes("helper") ? "Helper" : "User",
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.json({ error: err });
      });
  };
};

const login = (req, res, next) => {
  const Models = req.query.helper ? Helper : User;
  console.log(req.body, req.query, Models);
  userLogin(req.body, Models)
    .then((user) => {
      req.session.userId = user;
      console.log(user, "user");
      res.json({
        success: "Connecter",
        userInfo: { ...user, user: req.query.helper ? "Helper" : "User",token: getToken(data) },
      });
    })
    .catch((err) => {
      console.log(err,'dgfdfgdfg');
      res.status(402).json(err);
    });
};
module.exports = { confirmEmail, phoneValidation, signup, login };
