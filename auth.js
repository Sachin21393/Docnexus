let secretkey="secretkey";
const jwt= require("jsonwebtoken");
const verifyToken=(req,res,next)=>{

    const bear=req.headers['authorization']
    if(typeof bear !== 'undefined'){
    const token=bear.split(" ");
    const finaltoken=token[1]
    req.token=finaltoken
    next();
    }else{
      res.status(401).json({
        message:"Invalid token"
      })
    }
    }
module.exports.verifyToken = verifyToken
    