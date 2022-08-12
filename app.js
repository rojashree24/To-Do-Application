const express=require('express')
const bodyParser=require('body-parser');
// const date=require(__dirname+'/date.js')
const mongoose=require("mongoose")
const _=require("lodash")
// console.log(date()); //print current day,date,month like friday,july 15

const app=express()

//imp to type under app... it's a must write code for ejs..basic code for ejs
//tell the app to use ejs
app.set('view engine', 'ejs');


// var items=[];
// const workItems=[];



app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb+srv://RojashreeV:test123@todolist.tnw2pqh.mongodb.net/todolistDB");

const itemSchema=new mongoose.Schema({
    name:String //field
});

const Item=mongoose.model("Item",itemSchema);

const items1=new Item({
    name:"Welcome to your TODOLIST"
});

const items2=new Item({
    name:"Hit the + button to add a new item"
});

const items3=new Item({
    name:"<-- Hit this to delete an item"
});

const defaultItems=[items1,items2,items3];

const listSchema={
    name:String,
    items:[itemSchema]
};

const List=mongoose.model("List",listSchema);






app.get("/",function(req,res){

    //logic
    // var today=new Date();
    // //to convert date to one format like  thursday,july 14
    // var options={
    //     weekday:"long",
    //     day:"numeric",
    //     month:"long"
    // };
    // var day=today.toLocaleDateString("en-US",options);
        
        // res.sendFile(__dirname+"/weekend.html");
         
        // day="weekday"
        // res.sendFile(__dirname+"/weekday.html")
        // res.render("list",{kindOfDay:day });

    // let day=date.getDate();
        
    //list -> list.ejs



    Item.find({},function(err,foundItems){ //{}-> find all

        if(foundItems.length===0){
            Item.insertMany(defaultItems,function(err){
    if(err){
        console.log(err)
    }
    else{
        console.log("Successfully saved default items to DB")
    }
    
});
      res.redirect("/")  
        }
        else{
    res.render("list",{listTitle:"Today", newListItems: foundItems });
  
        }
    })

});

app.post('/',function(req,res){
    // res.redirect('/')
   const itemName=req.body.newItem;
   const listName=req.body.list;

//    if(req.body.list==="work"){
//    workItems.push(item);
//    res.redirect("/work")
//    }else{
//     items.push(item);
//     res.redirect("/")
//    }

    //document
    const item=new Item({
        name:itemName
    });

    if(listName==="Today"){

    item.save();

    res.redirect("/")
    }else{
        List.findOne({name:listName},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+listName);
        })
    }

//    console.log(req.body);
//    console.log(item);

})

app.post("/delete",function(req,res){
   const checkedItemId= req.body.checkBox;
   const listName=req.body.listName;

    if(listName==="Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(!err){
            console.log("Successfully deleted");
        }
        res.redirect("/")
    });
    }else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function(err){
            if(!err){
                res.redirect("/"+listName)
            }
        })

    }
    
    
})

// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"work List",newListItems:workItems})
// })

//express routing
app.get("/:customListName",function(req,res){
    // res.send(req.params)
    const customListName= _.capitalize(req.params.customListName);


    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //create a new list
                const list=new List({
                 name:customListName,
                items:defaultItems
                });

                list.save();
                res.redirect("/"+customListName)
            }else{
                //show an existing list

    res.render("list",{listTitle:foundList.name, newListItems: foundList.items });
            }
        }
    })

})

app.post("/work",function(req,res){
    let item=req.body.newItem;
    workItems.push(item);
    res.redirect("/work")
})

app.get("/about",function(req,res){
    res.render("about")
})


let port=process.env.PORT;
if(port==null||port==""){
    port=3000;
}


app.listen(port,function(){
    console.log('server started');
});