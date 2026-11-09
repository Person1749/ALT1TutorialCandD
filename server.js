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
let db = new sqlite3.Database('bank.db'); // database name

function initDatabase() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS person (
        Iban TEXT,
        Pin TEXT,
        Dep_amount REAL
      )
    `, (err) => {
      if (err) {
        console.error("Create table error:", err.message);
      }
    });

    db.all("PRAGMA table_info(person)", [], (err, columns) => {
      if (err) {
        console.error("Schema check error:", err.message);
        return;
      }

      if (!columns || columns.length === 0) return;

      const currentColumns = columns.map((col) => col.name);
      const hasNewColumns = currentColumns.includes('Iban') && currentColumns.includes('Pin') && currentColumns.includes('Dep_amount');

      if (!hasNewColumns && currentColumns.includes('first_name') && currentColumns.includes('surname')) {
        console.log("Migrating legacy person table to the new field names.");

        db.run("ALTER TABLE person RENAME TO person_legacy", (renameErr) => {
          if (renameErr) {
            console.error("Legacy rename error:", renameErr.message);
            return;
          }

          db.run(`
            CREATE TABLE person (
              Iban TEXT,
              Pin TEXT,
              Dep_amount REAL
            )
          `, (createErr) => {
            if (createErr) {
              console.error("Create migrated table error:", createErr.message);
              return;
            }

            db.run(
              "INSERT INTO person (Iban, Pin, Dep_amount) SELECT first_name, surname, 0 FROM person_legacy",
              (copyErr) => {
                if (copyErr) {
                  console.error("Copy legacy data error:", copyErr.message);
                }
              }
            );
          });
        });
      }
    });
  });
}

initDatabase();

// Process the HTTP POST request for /putData
app.post("/putData", function (request, response) {
  console.log("In app.post (/putData)");

  // These property names match the object sent by public/client.js.
  const { Iban, Pin, Dep_amount } = request.body;
  db.run(
    "INSERT INTO person (Iban, Pin, Dep_amount) VALUES (?, ?, ?)",
    [Iban, Pin, Dep_amount],
    function (err) {
      if (err) {
        console.error("DB error:", err.message);
        response.status(500).send("Database error");
        return;
      }
      response.sendStatus(201);
    }
  );
});

// Process the HTTP GET request for /getData
app.get('/getData', function(request, response) {
console.log("In app.get (/getData)");
db.all('SELECT Iban, Pin, Dep_amount FROM person', function(err, rows) {
  if (err) {
    console.error("DB error:", err.message);
    response.status(500).send("Database error");
    return;
  }
  response.send(JSON.stringify(rows));
});
});
