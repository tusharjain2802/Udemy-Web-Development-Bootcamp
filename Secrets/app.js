//jshint esversion:6
require('dotenv').config();
//specify .env in the .gitignore file so that.env file is not published as it contains all the keys and passwords...secrets.
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")

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
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});
// add the encrypt package as a plugin to the schema before declaring the collection.And we need to encrypt just the password so add it in a array
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
    const newUser = new User({
        email:req.body.username,
        password: req.body.password
    });
    //mongoose-encrypt will automatically store the encrypted form of the password
    newUser.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render("secrets")
        }
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
                if(foundUser.password === password){
                    //mongoose-encrypt will automatically encrypt and match the encrypted form from the db.
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, function(){
console.log("Server started on port 3000");
});
