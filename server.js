const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const alert = require("alert-node");
const mongodb = require('connect-mongodb-session')(session);
const userModel = require("./models/user");
const app = express();
userCurrentlyLogged = null;
const methodeOverride = require('method-override')
const {
    checkAuthenticated,
    checkNotAuthenticated,
}= require("./middleware/auth");

const flash = require("express-flash")

const titreSite = "Intellijob"
const User = require("./models/user")
const bcrypt = require('bcryptjs')

const passport = require('passport')
const initializePassport = require('./config-passport');
const user = require('./models/user')

initializePassport(passport,
      async (email) => { 
const userFound = User.findOne({email});
return userFound;

}, async(id) => {
    const userFound = User.findOne({_id: id});
return userFound;
});
const mongoURL = 'mongodb+srv://jobcv:jobcv12345@cluster0.ea82ykn.mongodb.net/?retryWrites=true&w=majority';
require("dotenv").config();



// pour activer le module ejs
app.set("view engine", "ejs");

// pour permettre le parsing des URLs
app.use(express.urlencoded({ extended: true }));

// pour l'acces au dossier "public"
app.use(express.static("public"));

// pour l'acces au dossier "images"
app.use(express.static("images"));

// pour activer le module express-flash
app.use(flash());

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUnitialized: false,
    })
)
app.use(passport.initialize())

app.use(passport.session())
app.use(methodeOverride('_method'))

app.get("/", checkAuthenticated, (req, res) => {

res.render("homepage", {name : req.user.first_name});
});

app.post("/changerPassword",checkAuthenticated, async (req,res) => {
console.log(userCurrentlyLogged.email);
console.log(userCurrentlyLogged.password);
 if(req.body.newpsw != req.body.confirmnewpsw){
    
    alert("the content of new password field and confirm new password doesn't match");
 } else{
    if (
        await bcrypt.compare(
            req.body.oldpsw,
            userCurrentlyLogged.password
        )
    ) {
        console.log("tkt");
        const hashednewPsw = await bcrypt.hash(req.body.newpsw, 10);

        userCurrentlyLogged.password = hashednewPsw;
        User.findOneAndUpdate
			const temp = await User.findOneAndUpdate(
				{ _id: userCurrentlyLogged._id },
				{ password: hashednewPsw }
			);
    }
    res.redirect('/homepage');
   

 
 }
});
app.get("/homepage",checkAuthenticated,(req,res)=>{
app.res.render("homepage", {
        titrePage: titreSite,
        titreSite: titreSite,
        name: userCurrentlyLogged.first_name +
            " " +
            userCurrentlyLogged.last_name,
        ConnectedUser: currentlyConnectedUser,
})
});

app.get("/changerPassword",checkAuthenticated,(req,res)=> {
    res.render("changerPassword",{
     titrePage : "changerPassword",
     titreSite : titreSite,
    });
})

// pour charger la page de connexion
app.get("/connexion", checkNotAuthenticated, (req, res) => {
    res.render("connexion", {
        titrePage: "Connexion",
        titreSite: titreSite
     //   ConnectedUser: currentlyConnectedUser,
    });
  /*  if (checkNotAuthenticated) {
        currentlyConnectedUser = null;
    }
    /** */
});
async function saveUserLogged(req,res,next){
 const userFound = await User.findOne({email:req.body.email});
 console.log(userFound.email);
 console.log(userFound.password);

 if(userFound) {
    userCurrentlyLogged = userFound;

 } else{
    console.log("email incorrect");
 }
 next();
}
app.get("/inscription", checkNotAuthenticated, (req, res) => {
    res.render("inscription", {
        titrePage: "inscription",
        titreSite: titreSite
     //   ConnectedUser: currentlyConnectedUser,
    });
  /*  if (checkNotAuthenticated) {
        currentlyConnectedUser = null;
    }
    /** */
});
app.post('/connexion', saveUserLogged,checkNotAuthenticated, passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect: '/connexion',
    failureFlash: true,
}),async (req, res) => {} 

);
// pour faire l'inscription
app.post("/inscription",checkNotAuthenticated, //checkNotAuthenticated
 async(req, res) => {
   
    var userExist = await User.findOne({ email: req.body.email });

    if (userExist) {
        req.flash(
            "error",
            "Il existe déjà un utilisateur avec cette adresse courriel."
        );
        res.redirect("/inscription");
    } else {
        try {
            const hashedPsw = await bcrypt.hash(req.body.password, 12);
            const user = new User({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                email: req.body.email,
                password: hashedPsw,
                user_type: "client",
            });

            await user.save();
            res.redirect("/connexion");
        } catch (error) {
            console.log(error);
            res.redirect("/inscription");
        }
    }
})

app.delete("/logout", (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");

    });
  });

//connection mongodb
mongoose
    .connect(mongoURL, {
        useUnifiedTopology: true,
        useNewUrlParser: true,

    })
    
    .then(() => {
        app.listen(3000, () => {
            console.log("listening on port 3000");
        });
    });
