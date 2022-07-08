const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const app = express();
const https = require("https");
const { post } = require("request");
app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));
// We use express.static to send all the other css and image files along with the HTML file to the server (public folder will act as root directory)


app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");    
})

app.post("/",function(req,res){
    const Firstname = req.body.Firstname;
    const LastName = req.body.Lastname;
    const Email = req.body.Email;

    const data = {
        members:[
            {
                email_address: Email,
                status:"subscribed",
                merge_fields:{
                    FNAME: Firstname,
                    LNAME: LastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us8.api.mailchimp.com/3.0/lists//*hidden audience ID*/";
    const options={
        method:"POST",
        auth:"tushar:/* API KEY*/"
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode== 200){
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        // The MailChimp API only accepts data in the JSON format so we need to convert the data
    })
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.listen(process.env.PORT ||3000,function(){
    console.log("Listening to server 3000");
})
