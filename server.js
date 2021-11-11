const express = require("express");
const csurf = require("csurf");
const authRouter = require("./Routes/authRoute");
const cors = require("cors");
const {MONGODB_URL} = require("./config.js");

const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
var cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();

// const corsOpts = {
//   origin: 'http://localhost:5001',
//   credentials: true,
//   methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
//   allowedHeaders: ['Content-Type'],
//   exposedHeaders: ['Content-Type']
// };
var whitelist = ["https://hungry-wright-93e349.netlify.app"] //'https://hungry-wright-93e349.netlify.app'
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },credentials: true,
//     methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
//      allowedHeaders: ['Content-Type'],
//     exposedHeaders: ['Content-Type']

// }
// app.use(cors(corsOptions));


const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  
};

app.use(flash());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const SessionStore = new MongoStore({
  uri: MONGODB_URL,
  collection: "sessions",
});

app.use(
  session({
    name: "SESSION",
    secret: "secret some",
    resave: false,
    saveUninitialized: false,

    store: SessionStore,
    cookie: {
      sameSite: false,
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);
app.use(csurf({ cookie: true, httpOnly:true,secure:true }));

app.use(function (err, req, res, next) {
  console.log(req.body,"yes");
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  else if (req.session.userId){
   
    next()}
  // handle CSRF token errors here
 
  res.status(403).send({message:req.body,...err});
});
app.use("/auth", authRouter);
if(process.env.NODE_ENV==="production"){
  app.use(express.static("front/build"))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"front","build","index.html"))
  })
}
const PORT=process.env.PORT || 5000
app.listen(PORT ,()=>{
  console.log("Server On port "+(PORT));
});
