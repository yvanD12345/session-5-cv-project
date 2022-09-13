/* DÉCLARATION DES MODULES, VARIABLES ET MODÈLES */
const app = express();
const port = 3000
const flash = require("express-flash")
//FRAMEWORK EXPRESS 
const express = require('express');
//IMPORT DU MODULE POUR LA BASE DE DONNÉES
const mongoose = require('mongoose');
//IMPORT DU MODULE POUR LA GESTION DE SESSIONS
const session = require("express-session");
const alert = require("alert-node");
//MODÈLES
const User = require("./models/user")
const Cv = require("./models/cv")

const methodeOverride = require('method-override')
const flash = require("express-flash")
const bcrypt = require('bcryptjs')
const passport = require('passport')
const initializePassport = require('./config-passport');

//URL pour l'accès à la base de données
const mongoURL = 'mongodb://localhost:27017';
require("dotenv").config();



//PERMET DE VÉRIFIER SI L'UTILISATEUR EST AUTHENTIFIÉ
const {
    checkAuthenticated,
    checkNotAuthenticated,
} = require("./middleware/auth");
//LE PASSPORT SERT À GÉRER L'AUTHENTIFICATION DES UTILISATEURS SELON LE FRAMEWORK EXPRESS
initializePassport(passport,
    async (email) => {
        const userFound = User.findOne({ email });
        return userFound;

    }, async (id) => {
        const userFound = User.findOne({ _id: id });
        return userFound;
    });

//VARIABLES GLOBALES
const titreSite = "Intellijob"
userCurrentlyLogged = null;
const createdPdf = null

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
//GESTION DE SESSIONS
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

/* DÉBUT DES REQUÊTES SERVEUR */

//ACCUEIL
app.get("/", checkAuthenticated, (req, res) => {
    res.render("homepage", { name: req.user.first_name });
});

app.get("/homepage", checkAuthenticated, (req, res) => {
    Cv.find({ user_id: userCurrentlyLogged._id }, function (err, Cvs) {
        if (Cvs == null) {
            const checkifCvsIsNull = true;
            res.render("homepage", {
                titrePage: titreSite,
                titreSite: titreSite,
                name: userCurrentlyLogged.first_name +
                    " " +
                    userCurrentlyLogged.last_name,
                ConnectedUser: userCurrentlyLogged,
                user_Cvs: Cvs,
                checkCvs: checkifCvsIsNull,
            });
        }
        else {
            const checkifCvsIsNull = false;
            res.render("homepage", {
                titrePage: titreSite,
                titreSite: titreSite,
                name: userCurrentlyLogged.first_name +
                    " " +
                    userCurrentlyLogged.last_name,
                ConnectedUser: userCurrentlyLogged,
                user_Cvs: Cvs,
                checkCvs: checkifCvsIsNull,
            });
        }
    });
});
//INSCRIPTION

//Accès à la page inscription
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

//Récupérer les données saisies de la page inscription POST
app.post("/inscription", checkNotAuthenticated, //checkNotAuthenticated
    async (req, res) => {
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

//CONNEXION 

//Accès à la page de connexion
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
//Récupérer les données saisies de la page connexion POST
app.post('/connexion', saveUserLogged, checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/connexion',
    failureFlash: true,
}), async (req, res) => { }

);

//CHANGEMENT DE MOT DE PASSE

//Accès à la page de changement de mot de passe
app.get("/changerPassword", checkAuthenticated, (req, res) => {
    res.render("changerPassword", {
        titrePage: "changerPassword",
        titreSite: titreSite,
    });
})

//Récupérer les inforamations saisies pour le changement de mot de passe
app.post("/changerPassword", checkAuthenticated, async (req, res) => {
    console.log(userCurrentlyLogged.email);
    console.log(userCurrentlyLogged.password);
    if (req.body.newpsw != req.body.confirmnewpsw) {

        alert("the content of new password field and confirm new password doesn't match");
    } else {
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


//CRÉATION DU CV

//Accès à la page de création du CV
app.get("/creationcv", checkAuthenticated, (req, res) => {
    res.render("creationcv", {
        titreSite: titreSite,
        titrePage: "creation de cv",
    });
});

//Récupérer les informations du CV POST
app.post("/creationcv", checkAuthenticated,
    async (req, res) => {
        const newCv = new Cv({
            first_name: req.body.firstname,
            last_name: req.body.lastname,
            email: req.body.email,
            user_id: userCurrentlyLogged._id,
            title: req.body.title,
        });
        await newCv.save();
        res.redirect("/homepage");
    });


//DÉCONNEXION
app.delete("/logout", (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");

    });
});
//FONCTIONS
async function saveUserLogged(req, res, next) {
    const userFound = await User.findOne({ email: req.body.email });
    console.log(userFound.email);
    console.log(userFound.password);

    if (userFound) {
        userCurrentlyLogged = userFound;

    } else {
        console.log("email incorrect");
    }
    next();
}








app.listen(port, () => {
    console.log(`Server is on localhost:${port}`)
})

// Connexion à MongoDB
mongoose
    .connect("mongodb://localhost:27017/Calibre", {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => {

app.listen(3000, () => {
            console.log("listening on port 3000");
        });
    });
