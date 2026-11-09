console.log("Client-side log HOK");
const btn = document.getElementById("submit-btn");
btn.addEventListener("click", submitDataToServer);

// Submit clicked so post the data to the server
function submitDataToServer() {
  console.log("SUBMIT clicked!!!"); // display a message
  // create an object to post to the server
  // IMPORTANT: ONE NAME - VALUE PAIR FOR EACH FIELD
  let dataObj = {
    Iban: document.getElementById("IBAN").value,
    Pin: document.getElementById("PIN").value,
    Dep_amount: document.getElementById("DepAm").value,
  };
  // JUST USE THESE LINES AS THEY ARE - NO NEED TO CHANGE
  event.preventDefault(); // prevents 2 calls to this function!!
  const requestMsg = new XMLHttpRequest();
  requestMsg.open("post", "/putData", true); // open a HTTP post request
  requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  requestMsg.send(JSON.stringify(dataObj));
}

// Make sure to call this function to get latest data
getDataFromServer();
// Send a request to the server to query the db and send the data back
function getDataFromServer() {
  console.log("getData()"); // display a debug message
  // request the data from the database
  const requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load", displayData); // attach a listener
  requestMsg.open("get", "/getData"); // open a HTTP GET request
  requestMsg.send();
}

function displayData() {
  console.log("displayData()");
  // define variables that reference elements on our page
  const rowList = document.getElementById("users");
  rowList.innerHTML = ""; // clear all the list items
  // parse our response to convert to JSON
  let users = JSON.parse(this.responseText);
  // iterate through every row and add it to our page
  users.forEach(function (row) {
    const newListItem = document.createElement("li");
    newListItem.innerHTML = row["first_name"] + " " + row["surname"];
    rowList.appendChild(newListItem);
  });
}
