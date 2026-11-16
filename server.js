console.log("Server log - start again");
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// Not sure that the next 3 lines are actually needed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public'));


//from chatgpt on 2/10/2025 so that can see what's stored in SQLite d/b on render server.
// Debug route: show all data in your table
app.get("/show-data", (req, res) => {
  db.all("SELECT * FROM person", [], (err, rows) => {
    if (err) {
      console.error("DB error:", err.message);
      res.status(500).send("Database error");
      return;
    }
    res.json(rows); // Send back all rows as JSON
  });
});



// This is called when the app is first started
app.get('/', function(request, response) {
console.log("In app.get (/)");
response.sendFile(__dirname + '/views/index.html');
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
console.log('Your app is listening on port ' +
listener.address().port);
});

// Create the database object
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('DEMODB'); // database name


app.post("/putData", function (request, response) {
  console.log("In app.post (/putData)");
  const { Iban, Deposit } = request.body;

  
  if (!/^\d{4}$/.test(PIN || "")) {
    return response.status(400).send("A four-digit PIN is required.");
  }

  if (!Iban || Deposit === undefined || Deposit === "") {
    return response.status(400).send("IBAN and deposit amount are required.");
  }

  db.run(
    "INSERT INTO person (Iban, Deposit) VALUES (?, ?)",
    [Iban, Number(Deposit)],
    function (err) {
      if (err) {
        console.error("DB error:", err.message);
        return response.status(500).send("Could not save entry.");
      }
      response.sendStatus(201);
    }
  );
});

// Process the HTTP GET request for /getData
app.get('/getData', function(request, response) {
console.log("In app.get (/getData)");
db.all('SELECT * from person', function(err, rows) {
  if (err) {
    console.error("DB error:", err.message);
    return response.status(500).send("Could not load entries.");
  }
  response.json(rows);
});
});
