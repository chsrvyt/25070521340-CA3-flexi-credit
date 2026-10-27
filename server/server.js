// Made by SARVESH CHONDE

const path = require("path");
const express = require("express");
const {MongoClient,ObjectId} = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------- settings ----------

// load the settings from server/.env (copy .env.example to .env and fill it in)
try {
    process.loadEnvFile(path.join(__dirname, ".env"));
} catch (error) {
    console.log("No server/.env file found, using the environment variables only");
}

const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME || "todoDb";
const jwtSecret = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;

if( !uri || !jwtSecret ){

    console.log("Please set MONGO_URI and JWT_SECRET in server/.env (see server/.env.example)");
    process.exit(1);
}


const app = express();
app.use(cors());
app.use(express.json());
const client = new MongoClient(uri);

const PRIORITIES = ["Low","Medium","High"];
const CATEGORIES = ["Personal","Work","Study","Shopping","Other"];


async function connectToMongoDb(){

    try {

        await client.connect();
        console.log("Connection successfully done with mongodb, database : " + dbName);

        // one account per email
        await myDb.collection("users").createIndex({email : 1},{unique : true});

        app.listen(port,()=>{

            console.log("Server started at port : " + port);
        })

    } catch (error) {

        console.log("Connection failed to mongodb : " + error);
        process.exit(1);
    }

}

const myDb = client.db(dbName);

connectToMongoDb();

// ---------- helpers ----------

// returns null instead of throwing when the id is not a valid ObjectId
function toObjectId(id){

    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

function isText(value){

    return typeof value === "string" && value.trim() !== "";
}

function isEmail(value){

    return /^\S+@\S+\.\S+$/.test(value.trim());
}

// checks the task fields that were sent and returns an error message, or null if they are fine
function checkTodo(body){

    if( body.title !== undefined && !isText(body.title) ) return "Title is required";
    if( body.priority !== undefined && !PRIORITIES.includes(body.priority) ) return "Priority must be Low, Medium or High";
    if( body.category !== undefined && !CATEGORIES.includes(body.category) ) return "Unknown category";
    if( body.done !== undefined && typeof body.done !== "boolean" ) return "Done must be true or false";

    return null;
}

// ---------- login ----------

function makeToken(userId){

    return jwt.sign({userId : userId.toString()}, jwtSecret, {expiresIn : "7d"});
}

// the user details that are safe to send back (never the password hash)
function publicUser(user){

    return {_id : user._id, name : user.name, email : user.email};
}

// only lets the request through with a valid login token, and puts the user's id in req.userId
function requireLogin(req,res,next){

    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    let payload;
    try {

        payload = jwt.verify(token, jwtSecret, {algorithms : ["HS256"]});

    } catch (error) {

        return res.status(401).send({msg : "Please log in"});
    }

    req.userId = new ObjectId(payload.userId);
    next();
}

// ---------- users ----------

app.post("/signup",async(req,res)=>{

    const {name,email,password} = req.body;

    if( !isText(name) || !isText(email) || !isText(password) ) return res.status(400).send({msg : "Please fill all fields"});
    if( !isEmail(email) ) return res.status(400).send({msg : "Please enter a valid email"});
    if( password.length < 6 ) return res.status(400).send({msg : "Password must be at least 6 characters"});
    if( Buffer.byteLength(password) > 72 ) return res.status(400).send({msg : "Password is too long"});

    const cleanEmail = email.trim().toLowerCase();

    const existing = await myDb.collection("users").findOne({email : cleanEmail});
    if( existing ) return res.status(409).send({msg : "An account with this email already exists"});

    const user = {
        name : name.trim(),
        email : cleanEmail,
        passwordHash : await bcrypt.hash(password, 10),
        createdAt : new Date()
    };

    const response = await myDb.collection("users").insertOne(user);
    user._id = response.insertedId;

    res.status(201).send({token : makeToken(user._id), user : publicUser(user)});

});

app.post("/login",async(req,res)=>{

    const {email,password} = req.body;

    const user = isText(email) && await myDb.collection("users").findOne({email : email.trim().toLowerCase()});
    const correct = user && typeof password === "string" && await bcrypt.compare(password, user.passwordHash);

    if( !correct ) return res.status(401).send({msg : "Wrong email or password"});

    res.send({token : makeToken(user._id), user : publicUser(user)});

});

// who is logged in - the client uses this to check a saved login is still valid
app.get("/me",requireLogin,async(req,res)=>{

    const user = await myDb.collection("users").findOne({_id : req.userId});

    if( !user ) return res.status(401).send({msg : "Please log in"});

    res.send( publicUser(user) );

});

// ---------- todos (each user only sees their own) ----------

app.get("/getall",requireLogin,async(req,res)=>{

    let data = await myDb.collection("todos").find({userId : req.userId}).sort({createdAt : -1}).toArray();

    res.send( data );

});

app.get("/get/:id",requireLogin,async(req,res)=>{

    const id = toObjectId(req.params.id);

    const todo = id && await myDb.collection("todos").findOne({_id : id, userId : req.userId});

    if( todo ){

        res.send( todo );
    }
    else{

        res.status(404).send({msg : "Task not found"});
    }

});

app.post("/create",requireLogin,async(req,res)=>{

    const {title,priority,dueDate,notes,category} = req.body;

    if( !isText(title) ) return res.status(400).send({msg : "Title is required"});

    const error = checkTodo(req.body);
    if( error ) return res.status(400).send({msg : error});

    const response = await myDb.collection("todos").insertOne({
        userId : req.userId,
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

app.put("/update/:id",requireLogin,async(req,res)=>{

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

    const response = await myDb.collection("todos").updateOne({_id: id, userId : req.userId},{$set:changes});

    if( response.matchedCount === 0 ) return res.status(404).send({msg : "Task not found"});

    res.send(response);

});

app.delete("/delete/:id",requireLogin,async(req,res)=>{

    const id = toObjectId(req.params.id);

    const response = id && await myDb.collection("todos").deleteOne({_id: id, userId : req.userId});

    if( !response || response.deletedCount === 0 ) return res.status(404).send({msg : "Task not found"});

    res.send(response);

});

app.delete("/deleteCompleted",requireLogin,async(req,res)=>{

    const response = await myDb.collection("todos").deleteMany({done : true, userId : req.userId});

    res.send(response);

});

// ---------- notes (each user only sees their own) ----------

app.get("/notes",requireLogin,async(req,res)=>{

    let data = await myDb.collection("notes").find({userId : req.userId}).sort({createdAt : -1}).toArray();

    res.send( data );

});

app.post("/notes",requireLogin,async(req,res)=>{

    const {title,text} = req.body;

    if( !isText(title) ) return res.status(400).send({msg : "Title is required"});

    const response = await myDb.collection("notes").insertOne({userId : req.userId, title : title.trim(), text : text || "", createdAt : new Date()});

    res.send(response);

});

app.put("/notes/:id",requireLogin,async(req,res)=>{

    const id = toObjectId(req.params.id);
    if( !id ) return res.status(404).send({msg : "Note not found"});

    const {title,text} = req.body;

    if( !isText(title) ) return res.status(400).send({msg : "Title is required"});

    const response = await myDb.collection("notes").updateOne({_id: id, userId : req.userId},{$set:{title : title.trim(), text : text || ""}});

    if( response.matchedCount === 0 ) return res.status(404).send({msg : "Note not found"});

    res.send(response);

});

app.delete("/notes/:id",requireLogin,async(req,res)=>{

    const id = toObjectId(req.params.id);

    const response = id && await myDb.collection("notes").deleteOne({_id: id, userId : req.userId});

    if( !response || response.deletedCount === 0 ) return res.status(404).send({msg : "Note not found"});

    res.send(response);

});

// ---------- contact messages ----------

// anyone can send a message, only logged in users can read and delete them

app.get("/messages",requireLogin,async(req,res)=>{

    let data = await myDb.collection("messages").find().sort({createdAt : -1}).toArray();

    res.send( data );

});

app.post("/contact",async(req,res)=>{

    const {name,email,message} = req.body;

    if( !isText(name) || !isText(email) || !isText(message) ) return res.status(400).send({msg : "Please fill all fields"});

    if( !isEmail(email) ) return res.status(400).send({msg : "Please enter a valid email"});

    const response = await myDb.collection("messages").insertOne({name : name.trim(), email : email.trim(), message : message.trim(), createdAt : new Date()});

    res.send(response);

});

app.delete("/messages/:id",requireLogin,async(req,res)=>{

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
