//jshint esversion:6
require('dotenv').config();
//specify .env in the .gitignore file so that.env file is not published as it contains all the keys and passwords...secrets.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");


app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

app.use(session({
    secret: "Our little Secret.",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());
  
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema =new mongoose.Schema({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login")
});

app.get("/register", function(req,res){
    res.render("register")
});
app.get("/submit", function(req,res){
    res.render("submit")
});

app.get("/secrets", function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    } else{
        res.redirect("/login");
    }
    // You can directly revisit /secrets page after registering or login but after clearing cookies you can't
});

app.get("/logout",function(req,res){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
});

app.post("/register", function(req,res){ 
    User.register({username:req.body.username},req.body.password, function(err,user){
        //the register function of passport will automatically change the password into md5 and salt and save it into mongoDB db.
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("/secrets");
                // Earlier we never let out user users visit the secret route. we just used to render the secrets page on current route. But now we have authenticated user who has registered.
            });
        }
    });
});

app.post("/login", function(req,res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res, function(){
                //this will send a cookie and authenticate the user.
                res.redirect("/secrets");
                
            });
        }
    });
});

app.listen(3000, function(){
console.log("Server started on port 3000");
});
