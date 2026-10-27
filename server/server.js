// Made by SARVESH CHONDE

const express = require("express");
const {MongoClient,ObjectId} = require("mongodb");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());
const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);
const port = process.env.PORT || 5000;

const PRIORITIES = ["Low","Medium","High"];
const CATEGORIES = ["Personal","Work","Study","Shopping","Other"];


async function connectToMongoDb(){

    try {

        await client.connect();
        console.log("Connection successfully done with mongodb");

        app.listen(port,()=>{

            console.log("Server started at port : " + port);
        })

    } catch (error) {

        console.log("Connection failed to mongodb : " + error);
        process.exit(1);
    }

}

connectToMongoDb();

const myDb = client.db("todoDb");

// ---------- helpers ----------

// returns null instead of throwing when the id is not a valid ObjectId
function toObjectId(id){

    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function isText(value){

    return typeof value === "string" && value.trim() !== "";
}

// checks the task fields that were sent and returns an error message, or null if they are fine
function checkTodo(body){

    if( body.title !== undefined && !isText(body.title) ) return "Title is required";
    if( body.priority !== undefined && !PRIORITIES.includes(body.priority) ) return "Priority must be Low, Medium or High";
    if( body.category !== undefined && !CATEGORIES.includes(body.category) ) return "Unknown category";
    if( body.done !== undefined && typeof body.done !== "boolean" ) return "Done must be true or false";

    return null;
}

// ---------- todos ----------

app.get("/getall",async(req,res)=>{

    let data = await myDb.collection("todos").find().sort({createdAt : -1}).toArray();

    res.send( data );

});

app.get("/get/:id",async(req,res)=>{

    const id = toObjectId(req.params.id);

    const todo = id && await myDb.collection("todos").findOne({_id : id});

    if( todo ){

        res.send( todo );
    }
    else{

        res.status(404).send({msg : "Task not found"});
    }

});

app.post("/create",async(req,res)=>{

    const {title,priority,dueDate,notes,category} = req.body;

    if( !isText(title) ) return res.status(400).send({msg : "Title is required"});

    const error = checkTodo(req.body);
    if( error ) return res.status(400).send({msg : error});

    const response = await myDb.collection("todos").insertOne({
        title : title.trim(),
        priority : priority || "Medium",
        dueDate : dueDate || "",
        notes : notes || "",
        category : category || "Personal",
        done : false,
        createdAt : new Date()
    });

    res.send(response);

});

app.put("/update/:id",async(req,res)=>{

    const id = toObjectId(req.params.id);
    if( !id ) return res.status(404).send({msg : "Task not found"});

    const error = checkTodo(req.body);
    if( error ) return res.status(400).send({msg : error});

    const {title,done,priority,dueDate,notes,category} = req.body;

    const changes = {};
    if( title !== undefined ) changes.title = title.trim();
    if( done !== undefined ) changes.done = done;
    if( priority !== undefined ) changes.priority = priority;
    if( dueDate !== undefined ) changes.dueDate = dueDate;
    if( notes !== undefined ) changes.notes = notes;
    if( category !== undefined ) changes.category = category;

    const response = await myDb.collection("todos").updateOne({_id: id},{$set:changes});

    if( response.matchedCount === 0 ) return res.status(404).send({msg : "Task not found"});

    res.send(response);

});

app.delete("/delete/:id",async(req,res)=>{

    const id = toObjectId(req.params.id);

    const response = id && await myDb.collection("todos").deleteOne({_id: id});

    if( !response || response.deletedCount === 0 ) return res.status(404).send({msg : "Task not found"});

    res.send(response);

});

app.delete("/deleteCompleted",async(req,res)=>{

    const response = await myDb.collection("todos").deleteMany({done : true});

    res.send(response);

});

// ---------- notes ----------

app.get("/notes",async(req,res)=>{

    let data = await myDb.collection("notes").find().sort({createdAt : -1}).toArray();

    res.send( data );

});

app.post("/notes",async(req,res)=>{

    const {title,text} = req.body;

    if( !isText(title) ) return res.status(400).send({msg : "Title is required"});

    const response = await myDb.collection("notes").insertOne({title : title.trim(), text : text || "", createdAt : new Date()});

    res.send(response);

});

app.put("/notes/:id",async(req,res)=>{

    const id = toObjectId(req.params.id);
    if( !id ) return res.status(404).send({msg : "Note not found"});

    const {title,text} = req.body;

    if( !isText(title) ) return res.status(400).send({msg : "Title is required"});

    const response = await myDb.collection("notes").updateOne({_id: id},{$set:{title : title.trim(), text : text || ""}});

    if( response.matchedCount === 0 ) return res.status(404).send({msg : "Note not found"});

    res.send(response);

});

app.delete("/notes/:id",async(req,res)=>{

    const id = toObjectId(req.params.id);

    const response = id && await myDb.collection("notes").deleteOne({_id: id});

    if( !response || response.deletedCount === 0 ) return res.status(404).send({msg : "Note not found"});

    res.send(response);

});

// ---------- contact messages ----------

app.get("/messages",async(req,res)=>{

    let data = await myDb.collection("messages").find().sort({createdAt : -1}).toArray();

    res.send( data );

});

app.post("/contact",async(req,res)=>{

    const {name,email,message} = req.body;

    if( !isText(name) || !isText(email) || !isText(message) ) return res.status(400).send({msg : "Please fill all fields"});

    if( !/^\S+@\S+\.\S+$/.test(email.trim()) ) return res.status(400).send({msg : "Please enter a valid email"});

    const response = await myDb.collection("messages").insertOne({name : name.trim(), email : email.trim(), message : message.trim(), createdAt : new Date()});

    res.send(response);

});

app.delete("/messages/:id",async(req,res)=>{

    const id = toObjectId(req.params.id);

    const response = id && await myDb.collection("messages").deleteOne({_id: id});

    if( !response || response.deletedCount === 0 ) return res.status(404).send({msg : "Message not found"});

    res.send(response);

});

// ---------- errors ----------

// any error thrown above (bad JSON, database down, ...) ends up here instead of an HTML stack trace
app.use((error,req,res,next)=>{

    console.log("Request failed : " + error);

    const status = error.status || 500;

    res.status(status).send({msg : status < 500 ? "Invalid request" : "Something went wrong"});

});
