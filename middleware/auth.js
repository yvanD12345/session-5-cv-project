//FONCTION POUR AUTHENTIFER L'UTILISATEUR

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){

        return next()
    }
    res.redirect('connexion')
}
function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        //checknot good
   return res.redirect('/homepage')
    }
    next()
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
};