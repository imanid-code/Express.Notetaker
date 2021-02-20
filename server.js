const express = require("express");
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const fs = require("fs");
//fs file system , lets you work with files in your cpu

//How to set up Express 

const app = express();
//Heroku doesn't work on port number so you have to use process.env.PORT
const PORT = process.env.PORT || 8080;

//Middleware set up
//built in mothod in express that recognizes incoming request object as JSON object
app.use(express.json());

//????built in method in express to recognize incoming request object as strings or array
app.use(express.urlencoded({ extended: true }));

//files that clients downloas from server 
//serves static files such as images, css and js by using dirname 
app.use(express.static(__dirname + '/public'));



//ROUTES 

//homepage
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

//notes

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});


//api GET - request from server without sending data


app.get("/api/notes", function (req, res) {
    fs.readFile(path.join(__dirname, './db/db.json'), function (error, data) {
        if (error) {
            console.log(error)
        }
        let jsonParse = JSON.parse(data)
        return res.json(jsonParse);

    });
})

    app.get('/api/notes/:/id', (req, res) => {
        fs.readFile(path.join(__dirname, './db/db.json'), function (error, data) {
            if (error) {
                console.log(error)
            }
            let jsonParse = JSON.parse(data)
            return res.json(jsonParse[req.params.id]);
        })
    })



    //api POST - makes request and sends data through the body

    app.post("/api/notes", function (req, res) {
        let { title, text } = req.body;
        let postedNOte = {
            title, text, id: uuidv4()
        }

        fs.readFile(path.join(__dirname, './db/db.json'), function (error, data) {
            if (error) {
                console.log(error)
            }
            let currentNotes = JSON.parse(data)
            console.log(currentNotes, postedNOte);
            currentNotes.push(postedNOte);
            currentNotes = JSON.stringify(currentNotes);
            fs.writeFile(path.join(__dirname, './db/db.json'), currentNotes, function (error) {
                if (error) {
                    console.log(error);

                }
                console.log("Note successfully added to db");
            })
            return res.json(postedNOte);
            //always send back new note after created(with post)
        })


    });

    //api DELETE - deletes specific resource 
    //:id is dynamically being defined as a variable 
    app.delete("/api/notes/:id", function (req, res) {

        fs.readFile(path.join(__dirname, './db/db.json'), function (error, data) {
            if (error) {
                console.log(error)
            }
            let jsonParse = JSON.parse(data)
            let parse = jsonParse.filter(note => {
                return (note.id !== req.params.id)

            })
            fs.writeFile(path.join(__dirname, './db/db.json'), parse, function (error) {
                if (error) {
                    console.log(error);

                }
            })
            return res.json(parse);

        })
    })


    //read file db.json , adding id prop before posting new note(inside post ) , don't have to do on front end 
    //manually change whats on db.json or clear out and start fresh , locate file that has the same id as the one that was clicked 
    //


    //postedNotes will equal noteInput which also equals getNotes in index.js
    //the array noteInput will be reduced to 
    //The accumulator accumulates callback's return values, if not callback first item in array will be init value  
    //The current element being processed in the array.

    // const postedNOtes = noteInput.reduce((accumlator, currentValue) => {
    //     if(currentValue.id !== noteId) accumlator.push(curr);
    //     return accumlator;
    // }, []);





    //write function 

    // const writeIt = (type) => {

    //     let jsonParse = JSON.parse
    //    fs.writeFile('./db/db.json',JSON.stringify(jsonParse), err => {
    //                 if (err) throw err;
    //                 return true;
    //             }

    //         );
    //         return console.log(`jsonParse ${type}`);

    //     }}

    // )

    // })
    //listener to start server 

    app.listen(PORT, function () {
        console.log("App is listening on PORT: " + PORT);
    });


