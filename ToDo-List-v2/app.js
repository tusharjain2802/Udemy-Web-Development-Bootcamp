const express = require("express");
const app = express();
const date = require(__dirname+"/views/date.js")
const mongoose  = require("mongoose");
const _ = require("lodash");

let bodyParser = require("body-parser");
// var items =["Buy Food", "Cook Food", "Eat Food"];
// let workItems = [];

mongoose.connect("mongodb+srv://admin-tushar:****HIDDEN PASSWORD****@cluster0.lngsx.mongodb.net/toDoListDB",{UseNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var itemSchema = {
    name: String
};
const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your to-do-list"
});
const item2 = new Item({
    name: "Hit the + to add a new item"
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

var listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);


app.post("/", function(req,res){
    let itemname = req.body.newItem;
    let listName = req.body.list;
    let day = date.getDate();
    
    const item = new Item({
        name: itemname
    });
    if(listName === day){
    item.save(); 
    //it renders the added item to home route
    // if(req.body.list === "Work List"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }
    // else{
    //     items.push(item);
    //     res.redirect("/");
    // }
    res.redirect("/");
    }
    else{
        List.findOne({name:listName}, function(err, foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
    
});

app.post("/delete",function(req,res){
    const checkedBodyItem =req.body.checkbox;
    const listName = req.body.listName;

    let day = date.getDate();
    if(listName=== day){
    Item.findByIdAndRemove(checkedBodyItem,function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("Deleted Checked Item");
        }
    });
    res.redirect("/");
}
else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedBodyItem}}}, function(err,foundList){
        if(!err){
            res.redirect("/"+listName); 
        }
    });
}
});

app.get("/",function (req, res){
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
        Item.insertMany(defaultItems, function(err){
            if(err){
            console.log(err);
            }
        });
        res.redirect("/");
        }
        else{
        let day = date.getDate();
        res.render("list",{listTitle:day,newListItems:foundItems});
        }
    });
});

app.get("/:customListName", function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name:customListName}, function(err, foundList){
        if(err){
            console.log(err);
        }
        else{
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save(); 
                res.redirect("/"+ customListName);
            }
            else{
                res.render("list",{listTitle:foundList.name,newListItems:foundList.items});
            }
        }
    });
});

app.get("/about",function (req, res){
    res.render("about");
});

app.listen(process.env.PORT, function(){
console.log("Server started on port 3000");
});
