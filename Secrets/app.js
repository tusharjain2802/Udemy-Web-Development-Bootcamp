//jshint esversion:6
require('dotenv').config();
//specify .env in the .gitignore file so that.env file is not published as it contains all the keys and passwords...secrets.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrupt = require("bcrypt");
const saltRounds = 10;

console.log(process.env.API_KEY);

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema =new mongoose.Schema({
    email: String,
    password: String
});
// const secret = "thisisourlittlesecret.";
// cut it and put in in .env file

var secret = process.env.SECRET;

const User = new mongoose.model("User",userSchema);

app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login")
});

app.get("/register", function(req,res){
    res.render("register")
});

app.post("/register", function(req,res){ 
    bcrupt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email:req.body.username,
            password: hash
        });
        newUser.save(function(err){
            if(err){
                console.log(err);
            }else{
                res.render("secrets")
            }
        });
    });
});

app.post("/login", function(req,res){
    const username = req.body.username;
    const password= req.body.password;
    User.findOne({email:username}, function(err, foundUser){
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                    bcrupt.compare(password, foundUser.password,function(err,result){
                        if(result == true){ // it means password matched
                            res.render("secrets");
                        }
                    });
            }
        }
    });
});

app.listen(3000, function(){
console.log("Server started on port 3000");
});
