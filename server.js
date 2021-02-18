const express = require("express"); 
const path = require ("path");
const fs = require ("fs"); 
const util = require("util");

//read and write files
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

//How to set up Express 

const app = express();
const PORT = process.env.PORT || 8080; 

//Middleware set up

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));



//ROUTES 

//homepage
app.get("/", function (req,res){
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//notes

app.get("/notes", function (req,res){
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//api GET - request from server without sending data


app.get("/api/notes", async function (req,res){
    const noteInput = await getNotes();
    return res.status(200).json(noteInput);
});

//api POST - makes request and sends data through the body

app.post("/api/notes", async function (req,res){
    let postedNOte = req.body;
    const noteInput = await getNotes();

    gotNotes.push({
        ...postedNOte,
        id: noteInput.length + 1 
    });
    await writeIt(noteInput);
    return res.sendStatus(200);
});

//api DELETE - deletes specific resource 

app.delete("/api/notes/:id", async function (req,res){
    let noteId = Number(req,params.id);
    const noteInput = await getNotes();

    const postedNOtes = noteInput.reduce((accumlator, currentValue) => {
        if(currentValue.id !== noteId) accumlator.push(curr);
        return acc
    }, []);

    await writeIt(postedNOtes)
    return res.sendStatus(200);
});


//functin to read 

const getNotes = async () =>{
    try{
        const data = await readFile(path.join(__dirname, './db/db.json'),'utf8');
        return JSON.parse(data);
    } catch (err){
        console.error(err);
        return err;
    }
};

//write function 

const writeIt = async (data) => {
   try {
        const refresh = await writeFile(
            path.join(__dirname, './db/db.json'),
            JSON.stringify(data)
        );
        return refresh;
    } catch (err){
        console.error(err);
        return err;
    }
};

//listener to start server 

app.listen(PORT, function (){
    console.log("App is listening on PORT: " + PORT);
});