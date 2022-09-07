const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const mongodb = require('connect-mongodb-session')(session);
const userModel = require("./models/user");
const app = express();
const flash = require("express-flash");
const titreSite = "Intellijob";
const User = require("./models/user");
const bcrypt = require('bcryptjs');
const mongoURL = 'mongodb://localhost:27017/jobapp';
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
);
app.get("/", (req, res) => {

res.redirect("/connexion");
});


// pour charger la page de connexion
app.get("/connexion",  (req, res) => {
    res.render("connexion", {
        titrePage: "Connexion",
        titreSite: titreSite,
     //   ConnectedUser: currentlyConnectedUser,
    });
  /*  if (checkNotAuthenticated) {
        currentlyConnectedUser = null;
    }
    /** */
});
app.get("/inscription",  (req, res) => {
    res.render("inscription", {
        titrePage: "inscription",
        titreSite: titreSite,
     //   ConnectedUser: currentlyConnectedUser,
    });
  /*  if (checkNotAuthenticated) {
        currentlyConnectedUser = null;
    }
    /** */
});

// pour faire l'inscription
app.post("/inscription", //checkNotAuthenticated
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
