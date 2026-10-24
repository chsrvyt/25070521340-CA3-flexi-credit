const express = require("express");
const {MongoClient,ObjectId} = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(bodyparser.json());
const uri = "mongodb://localhost:27017"
const client = new MongoClient(uri);
const port = 5000;


async function connectToMongoDb(){

    try {

        await client.connect();
        console.log("Connection successfully done with mongodb");

        app.listen(port,()=>{

            console.log("Server started at port : " + port);
        })

    } catch (error) {

        console.log("Connection failed to mongodb : " + error);
    }

}

connectToMongoDb();

const myDb = client.db("todoDb");

// ---------- todos ----------

app.get("/getall",async(req,res)=>{

    let data = await myDb.collection("todos").find().sort({createdAt : -1}).toArray();

    res.send( data );

});

app.get("/get/:id",async(req,res)=>{

    const id = req.params.id;

    const todo = await myDb.collection("todos").findOne({_id : new ObjectId(id)});

    if( todo != null ){

        res.send( todo );
    }
    else{

        res.status(404).send({msg : "Task not found"});
    }

});

app.post("/create",async(req,res)=>{

    const {title,priority,dueDate,notes} = req.body;

    const response = await myDb.collection("todos").insertOne({
        title : title,
        priority : priority || "Medium",
        dueDate : dueDate || "",
        notes : notes || "",
        done : false,
        createdAt : new Date()
    });

    res.send(response);

});

app.put("/update/:id",async(req,res)=>{

    const id = req.params.id;

    const {title,done,priority,dueDate,notes} = req.body;

    const changes = {};
    if( title !== undefined ) changes.title = title;
    if( done !== undefined ) changes.done = done;
    if( priority !== undefined ) changes.priority = priority;
    if( dueDate !== undefined ) changes.dueDate = dueDate;
    if( notes !== undefined ) changes.notes = notes;

    const response = await myDb.collection("todos").updateOne({_id: new ObjectId(id)},{$set:changes});

    res.send(response);

});

app.delete("/delete/:id",async(req,res)=>{

    const id = req.params.id;

    const response = await myDb.collection("todos").deleteOne({_id:new ObjectId(id)});

    res.send(response);

});

// ---------- contact messages ----------

app.get("/messages",async(req,res)=>{

    let data = await myDb.collection("messages").find().sort({createdAt : -1}).toArray();

    res.send( data );

});

app.post("/contact",async(req,res)=>{

    const {name,email,message} = req.body;

    const response = await myDb.collection("messages").insertOne({name : name, email : email, message : message, createdAt : new Date()});

    res.send(response);

});

app.delete("/messages/:id",async(req,res)=>{

    const id = req.params.id;

    const response = await myDb.collection("messages").deleteOne({_id:new ObjectId(id)});

    res.send(response);

});
