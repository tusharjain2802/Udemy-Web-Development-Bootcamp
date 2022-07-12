//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose  = require("mongoose");
mongoose.connect("mongodb+srv://admin-tushar:<HIDDEN PASSWORD>@cluster0.lngsx.mongodb.net/blogDB",{UseNewUrlParser:true});

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "⦾ Clearly Communicate Your Value Proposition. ⦾Curate the Hero Section of Your About Me Page. ⦾Tell a Compelling Story (Not Your Entire Life's History). ⦾ Use Your About Page to Sell Yourself to Readers. ⦾Nail Your Calls-to-Action on Your About Me Page.";
const contactContent = "🙌 Contact me at: Email:tjain2_be20@thapar.edu 🙌 LinkedIn: https://www.linkedin.com/in/tushar-jain-94a6a2194/ 🙌 GitHub: http://github.com/tusharjain2802 🙌 PortFolio Website: https://tusharjain2802.github.io/portfolio/Portfolio.html";

var postSchema = {
  postTitle: String,
  postBody: String
};

const Post = mongoose.model("Post", postSchema);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  Post.find({}, function(err, posts){
  res.render("home",{startingContent:homeStartingContent,allPosts:posts});
});
});

app.get("/about",function(req,res){
  res.render("about",{contentAbout:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{contentContact:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.get("/posts/:postId", function(req,res){
  const topicEnteredId = req.params.postId;
  Post.findOne({_id:topicEnteredId},function(err,post){
    //const requestedTitle = lodash.lowerCase(req.param.postName)
      res.render("post",{
        title : post.postTitle,
        content: post.postBody
      });
    })
  });



app.post("/compose", function(req,res){
  const post = new Post({
    postTitle : req.body.postTitle,
    postBody : req.body.postBody
  });
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.listen(process.env.PORT, function() {
  console.log("Server started");
});
