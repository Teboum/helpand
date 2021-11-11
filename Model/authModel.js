const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {MONGODB_URL} = require("../config.js");
console.log(MONGODB_URL,"model");
 
const userValidationSchema = mongoose.Schema({
  //expireAt: { type: Date, default: Date.now, index: { expires: "10m" } },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },

  pwd: { type: String, required: true },

  departement: { type: Number, required: true },
  phoneValidation: { type: Boolean, default: false },
});
exports.UserRegistration = mongoose.model(
  "userValidation",
  userValidationSchema
);

const helperValidationSchema = mongoose.Schema({
  //expireAt: { type: Date, default: Date.now, index: { expires: "10m" } },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true },

  pwd: { type: String, required: true },

  departement: { type: Number, required: true },
  phoneValidation: { type: Boolean, default: false },
});
exports.HelperRegistration = mongoose.model(
  "helperValidation",
  helperValidationSchema
);

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  departement: { type: Number, required: true },
});
exports.User = mongoose.model("user", userSchema);

const helperSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pwd: { type: String, required: true },
  phone: { type: Number, required: true, unique: true },
  departement: { type: Number, required: true },
});
exports.Helper = mongoose.model("helper", helperSchema);

const EmailCodeSchemaHelper = mongoose.Schema({
  code: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  //expireAt: { type: Date, default: Date.now, index: { expires: "5m" } },
});
exports.EmailCodeHelper = mongoose.model(
  "emailCodeHelper",
  EmailCodeSchemaHelper
);

const EmailCodeSchema = mongoose.Schema({
  code: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number, required: true },
  //expireAt: { type: Date, default: Date.now, index: { expires: "5m" } },
});
exports.EmailCode = mongoose.model("emailCode", EmailCodeSchema);

exports.createValidation = (userData, UserModel, Registration) => {
  userData;
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://admin:Nic5EbGYQdKW1elb@cluster0-shard-00-00.1zmow.mongodb.net:27017,cluster0-shard-00-01.1zmow.mongodb.net:27017,cluster0-shard-00-02.1zmow.mongodb.net:27017/helpandconnect?ssl=true&replicaSet=atlas-99qvgc-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        return UserModel.findOne({
          $or: [{ email: userData.email }, { phone: userData.phone }],
        });
      })
      .then((user) => {
        if (user) {
          mongoose.disconnect();
         console.log( user, 1);
          reject({
            error: "utilisateurInscrit",
            message: "Numéro de téléphone ou email déja inscrit connectez-vous",
          });
        } else {
          console.log(user, 22, userData);

          return Registration.findOne({
            $and: [{ email: userData.email }, { phone: userData.phone }],
          });
        }
      })
      .then((user) => {
        if (user) {
         console.log( user, 3);
          if (user.phoneValidation === false) {
            mongoose.disconnect();
            reject({
              error: "phoneValidation",
              message: "Utilisateur inscrit validez le numéro de téléphone",
            });
          } else {
            mongoose.disconnect();
            reject({
              error: "emailValidation",
              message: "Utilisateur existant validez votre email",
            });
          }
        } else {
          return bcrypt.hash(userData.pwd, 10);
        }
      })
      .then((hashed) => {
        userData.pwd = hashed;
        let user = new Registration({
          ...userData,
        });
        return user.save();
      })
      .then(() => {
        mongoose.disconnect();
        resolve("Utilisateur enregistrer avec succes");
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.setEmailCode = (code, email, Registration, EmailCode, phone) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://admin:Nic5EbGYQdKW1elb@cluster0-shard-00-00.1zmow.mongodb.net:27017,cluster0-shard-00-01.1zmow.mongodb.net:27017,cluster0-shard-00-02.1zmow.mongodb.net:27017/helpandconnect?ssl=true&replicaSet=atlas-99qvgc-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })

      .then(async () => {
        await Registration.updateOne(
          { $and: [{ phone: phone }, { email: email }] },
          { phoneValidation: true }
        );
        return bcrypt.hash(code, 10);
      })
      .then(async (hashed) => {
        //
        //
        try {
          const update = EmailCode.updateOne(
            { $and: [{ email: email }, { phone: phone }] },
            { code: hashed }
          );

          if (update._executionCount === 0) {
            let emailCode = new EmailCode({
              code: hashed,
              email: email,
              phone: phone,
            });
            return emailCode.save();
          }
        } catch (err) {
          mongoose.disconnect();
          reject(err);
        }
      })

      .then(() => {
        mongoose.disconnect();
        resolve();
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};

exports.checkEmailCode = (data, EmailCode, Registration, User) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://admin:Nic5EbGYQdKW1elb@cluster0-shard-00-00.1zmow.mongodb.net:27017,cluster0-shard-00-01.1zmow.mongodb.net:27017,cluster0-shard-00-02.1zmow.mongodb.net:27017/helpandconnect?ssl=true&replicaSet=atlas-99qvgc-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then(() => {
        return;
      })
      .then(async () => {
        try {
          const emailCode = await EmailCode.findOne({
            $and: [
              {
                email: data.email,
              },
              { phone: data.num },
            ],
          });
          console.log(data);

          emailCode.remove();

          return bcrypt.compare(data.code, emailCode.code);
        } catch (err) {
          mongoose.disconnect();

          reject(err);
        }
      })
      .then((same) => {
        if (same) {
          
          return Registration.findOne({
            $and: [{ email: data.email }, { phone: data.num }],
          });
        } else {
          console.log(+data.num);
          mongoose.disconnect();
          reject("Vous n'avez pas le droit");
        }
      })
      .then((user) => {
        let userCopy = user.toJSON();
        delete userCopy.phoneValidation;
        delete userCopy._id;
        delete userCopy.expireAt;
        delete userCopy.__v;
        user.remove();
        const USER = new User(userCopy);

        return USER.save();
      })
      .then((user) => {
        user = user.toJSON();

        delete user.pwd;
        delete user._id;
        delete user.__v;
        console.log(user, 2);
        mongoose.disconnect();
        resolve(user);
      })
      .catch((err) => {
        mongoose.disconnect();
        reject({ err: err });
      });
  });
};

exports.userLogin = (data, User) => {
  return new Promise((resolve, reject) => {
    mongoose
      .connect("mongodb://admin:Nic5EbGYQdKW1elb@cluster0-shard-00-00.1zmow.mongodb.net:27017,cluster0-shard-00-01.1zmow.mongodb.net:27017,cluster0-shard-00-02.1zmow.mongodb.net:27017/helpandconnect?ssl=true&replicaSet=atlas-99qvgc-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    
      })
      .then(() => {
        return User.findOne({ email: data.email });
      })
      .then((user) => {
        if (user) {
          console.log(user);
          bcrypt.compare(data.password, user.pwd).then((same) => {
            console.log(same);
            if (same) {
              mongoose.disconnect();
              user = user.toJSON();
              delete user.pwd;
              delete user._id;
              delete user.__v;
              resolve(user);
            } else {
              mongoose.disconnect();
              reject({
                error: "InvalidPassword",
                message: "Mot de passe incorrect",
              });
            }
          });
        } else {
          mongoose.disconnect();
          reject({ error: "InvalidEmail", message: "Email non inscrit" });
        }
      })
      .catch((err) => {
        mongoose.disconnect();
        reject(err);
      });
  });
};
