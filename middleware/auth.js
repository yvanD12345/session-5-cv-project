function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){

        return next()
    }
    res.redirect('connexion')
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        //checknot good
   return res.redirect('/')
    }
    next()
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
};