


const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const alert = require("alert-node");
const mongodb = require('connect-mongodb-session')(session);
const userModel = require("./models/user");
const app = express();
const port = 3000


userCurrentlyLogged = null;
const methodeOverride = require('method-override')
const {
    checkAuthenticated,
    checkNotAuthenticated,
}= require("./middleware/auth");

const flash = require("express-flash")

const titreSite = "Intellijob"
const User = require("./models/user")
const Cv = require("./models/cv")
const bcrypt = require('bcryptjs')

const passport = require('passport')
const initializePassport = require('./config-passport');
const user = require('./models/user')
const createdPdf = null

initializePassport(passport,
      async (email) => { 
const userFound = User.findOne({email});
return userFound;

}, async(id) => {
    const userFound = User.findOne({_id: id});
return userFound;
});
const mongoURL = 'mongodb://localhost:27017';
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

app.post("/creationcv",checkAuthenticated,
async(req,res) =>{
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
app.get("/creationcv",checkAuthenticated,(req,res)=>{
    res.render("creationcv",{
        titreSite: titreSite,
        titrePage:"creation de cv",
    });
});

app.get("/homepage",checkAuthenticated,(req,res)=>{
    Cv.find({user_id:userCurrentlyLogged._id},function(err,Cvs){
        if(Cvs == null){
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
    else{
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
    successRedirect:'/homepage',
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
async function createCv(res,req){
const thecv = cv.findOne({user_id : userCurrentlyLogged._id});

if(thecv){
    // Create a document
const doc = new PDFDocument();
  
// Saving the pdf file in root directory.
doc.pipe(fs.createWriteStream('example.pdf'));
  
// Adding functionality
doc
   
  .fontSize(27)
  .text('name : '+thecv.first_name+'/n', 100, 100);
doc
  .fontSize(27)
  .text('email:'+thecv.email,100,100);

  
// Adding an image in the pdf.
  
  /*doc.image('download3.jpg', {
    fit: [300, 300],
    align: 'center',
    valign: 'center'
  });
  */
  doc
  .addPage()
  .fontSize(15)
  .text('Generating PDF with the help of pdfkit', 100, 100);
   
  
   
// Apply some transforms and render an SVG path with the 
// 'even-odd' fill rule
doc
  .scale(0.6)
  .translate(470, -380)
  .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
  .fill('red', 'even-odd')
  .restore();
   
// Add some text with annotations
doc
  .addPage()
  .fillColor('blue')
  .text('The link for GeeksforGeeks website', 100, 100)
    
  .link(100, 100, 160, 27, 'https://www.geeksforgeeks.org/');
   
// Finalize PDF file
doc.end();
createdPdf = doc;
}

}

app.delete("/logout", (req, res) => {
    userCurrentlyLogged = null;
    req.logout(req.user, err => {
      if(err) return next(err);
      res.redirect("/");

    });
  });

//connection mongodb
app.listen(port, () => {

    console.log(`Server's on localhost:${port}`)

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
