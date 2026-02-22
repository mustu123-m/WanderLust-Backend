module.exports.isAuthenticated=(req,resp,next)=>{
    if(!req.isAuthenticated())
 {
       req.session.redirectUrl=req.originalUrl;
        resp.json({
            success:false,
            message:"You need to signup or login"
        })
 }
 else next();
}
module.exports.saveRedirectUrl=(req,resp,next)=>{
    if(req.session.redirectUrl)
    {
     resp.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}