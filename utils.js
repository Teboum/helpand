const jwt  =require('jsonwebtoken')
const config =require("./config") 
const getToken=(user)=>jwt.sign({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,

}, config.JWT_SECRET,{
  expiresIn:'48h'
})

const isAuth = (req,res,next)=>{
  const token = req.headers.authorization;
  console.log(token);
  if(token){

    const onlyToken =token.slice(7,token.length)
    jwt.verify(onlyToken,config.JWT_SECRET,(err,decode)=>{
      if(err){
        return res.status(401).send({msg:'invalid Token'})
      }
      req.user = decode;
      next();
      return
    })
  }
  return res.status(401).send({msg:'Token is not supplied'})
}
  
const isAdmin = (req,res,next)=>{
  if(req.user&&req.user.isAdmin){
    return next();
  }
  return res.status(401).send({msg:'Admin Token is invalid'})
}
module.exports= {
  getToken , isAuth , isAdmin
}








// export const isAuth = (req, res, next) => {
//   if (req.session.user) next();
//   else {
//     return res.status(401).send({ msg: "you are not connect" });
//   }
// };
// export const isAdmin = (req, res, next) => {
//   if (req.session.isAdmin) {
//     return next();
//   }
//   return res.status(401).send({ msg: "you are not admin" });
// };
