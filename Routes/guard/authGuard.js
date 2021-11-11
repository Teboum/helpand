exports.notAuth = (req, res, next) => {
  console.log(req.session);
  if (!req.session.userId) next();
  else res.send({ error: "Vous etes déja inscrit et connécter" });
};

exports.registerPhone = (req, res, next) => {
  if (req.session.registerCode) next();
  else res.send({ error: "vous n'etes pas autoriser2" });
};
exports.registerPhoneHelper = (req, res, next) => {
  if (req.session.registerCodeHelper) next();
  else res.send({ error: "vous n'etes pas autoriser" });
};
