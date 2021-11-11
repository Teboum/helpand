const router = require("express").Router();
const bodyParser = require("body-parser");
const {
  signup,
  phoneValidation,
  confirmEmail,
  login,
} = require("../Controllers/authControler");
const { a, b } = { a: 1, b: 2 };
const {
  User,
  UserRegistration,
  Helper,
  HelperRegistration,
  EmailCodeHelper,
  EmailCode,
} = require("../Model/authModel");
const check = require("express-validator").check;
const validationResult = require("express-validator").validationResult;
const authGuard = require("./guard/authGuard");

router.get("/", (req, res) => {
  const token = req.csrfToken();
  console.log(token, 12);
 
  res.json({ token: token });
});
router.post(
  "/register/demandeur",
 
bodyParser.urlencoded({ extended: true }),
check("firstName")
    .not()
    .isEmpty()
    .withMessage("Prénom obligatoire")
    .isLength({ min: 2 })
    .isAlpha()
    .withMessage("prénom contient que des lettres"),
  check("lastName")
    .not()
    .isEmpty()
    .withMessage("Nom Obligatoire")
    .isLength({ min: 2 })
    .isAlpha()
    .withMessage("Le nom ne contient que des lettres"),
  check("gender")
    .not()
    .isEmpty()
    .withMessage("Sexe Obligatoire")
    .custom((value, { req }) => {
      if (req.body.gender === ("male" || "female")) return true;
      else throw "Sexe invalide";
    }),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email Obligatoire")
    .isEmail()
    .withMessage("Email format invalid"),
  check("pwd")
    .not()
    .isEmpty()
    .withMessage("Mot de passe obligatoire")
    .isLength({ min: 8 })
    .withMessage("Mode passe doit contenir 8 lettres min"),

  check("confirmPwd")
    .not()
    .isEmpty()
    .withMessage("confirmation Mot de passe obligatoire")
    .custom((value, { req }) => {
      if (req.body.pwd === req.body.confirmPwd) return true;
      else throw "Mots de passes ne correspendent pas";
    }),
  check("phone")
    .not()
    .isEmpty()
    .withMessage("Téléphone Obligatoire")
    .custom((val, { req }) => {
      if (req.body.phone.match(/^((\+||00)33|0)[1-9](\d{2}){4}$/g)) return true;
      else throw "Numéro de téléphone invalide";
    }),
  check("departement")
    .not()
    .isEmpty()
    .withMessage("Département Obligatoire")
    .custom((value, { req }) => {
      if (+req.body.departement > 0 && +req.body.departement < 96) return true;
      else throw "Département invalide";
    }),
  signup(User, UserRegistration, "registerCode", "tentative", "email", "phone")
);

router.post(
  "/register/helper",
  check("firstName")
    .not()
    .isEmpty()
    .withMessage("Prénom obligatoire")
    .isLength({ min: 2 })
    .isAlpha()
    .withMessage("prénom contient que des lettres"),
  check("lastName")
    .not()
    .isEmpty()
    .withMessage("Nom Obligatoire")
    .isLength({ min: 2 })
    .isAlpha()
    .withMessage("Le nom ne contient que des lettres"),
  check("gender")
    .not()
    .isEmpty()
    .withMessage("Sexe Obligatoire")
    .custom((value, { req }) => {
      if (req.body.gender === ("male" || "female")) return true;
      else throw "Sexe invalide";
    }),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Email Obligatoire")
    .isEmail()
    .withMessage("Email format invalid"),
  check("pwd")
    .not()
    .isEmpty()
    .withMessage("Mot de passe obligatoire")
    .isLength({ min: 8 })
    .withMessage("Mot de passe doit contenir 8 lettres min"),

  check("confirmPwd")
    .not()
    .isEmpty()
    .withMessage("confirmation Mot de passe obligatoire")
    .custom((value, { req }) => {
      if (req.body.pwd === req.body.confirmPwd) return true;
      else throw "Mots de passes ne correspendent pas";
    }),
  check("phone")
    .not()
    .isEmpty()
    .withMessage("Téléphone Obligatoire")
    .custom((val, { req }) => {
      if (req.body.phone.match(/^((\+||00)33|0)[1-9](\d{2}){4}$/g)) return true;
      else throw "Numéro de téléphone invalide";
    }),
  check("departement")
    .not()
    .isEmpty()
    .withMessage("Département Obligatoire")
    .custom((value, { req }) => {
      if (+req.body.departement > 0 && +req.body.departement < 96) return true;
      else throw "Département invalide";
    }),
  signup(
    Helper,
    HelperRegistration,
    "registerCodeHelper",
    "tentativeHelper",
    "emailHelper",
    "phoneHelper"
  )
);

router.post(
  "/register/code-demandeur",
  authGuard.notAuth,
  authGuard.registerPhone,
  bodyParser.urlencoded({ extended: true }),

  check("code")
    .not()
    .isEmpty()
    .isLength(6)
    .withMessage("Code contient 6 chiffres au minimum")
    .isInt()
    .withMessage("Le code est composé de chiffres"),
  phoneValidation(
    "email",
    UserRegistration,
    EmailCode,
    "registerCode",
    "tentative",
    "phone"
  )
);

router.post(
  "/register/code-helper",
  authGuard.notAuth,
  authGuard.registerPhoneHelper,
  bodyParser.urlencoded({ extended: true }),

  check("code")
    .not()
    .isEmpty()
    .isLength(6)
    .withMessage("Code contient 6 chiffres au minimum")
    .isInt()
    .withMessage("Le code est composé de chiffres"),
  phoneValidation(
    "emailHelper",
    HelperRegistration,
    EmailCodeHelper,
    "registerCodeHelper",
    "tentativeHelper",
    "phoneHelper"
  )
);

router.post(
  "/register/emailconfirmation",
  confirmEmail(EmailCode, UserRegistration, User)
);
router.post(
  "/register/emailconfirmationhelper",
  authGuard.notAuth,
  confirmEmail(EmailCodeHelper, HelperRegistration, Helper)
);

router.get("/disconnect", (req, res) => {
  console.log(req.session);
  req.session.destroy();
  console.log(req.session);
  res.status(200).json({ success: "Utilisateur déconnecter" });
});

router.post("/login", login);
module.exports = router;
