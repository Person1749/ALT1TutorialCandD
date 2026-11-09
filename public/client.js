console.log("Client-side log HOK");
const btn = document.getElementById("submit-btn");
btn.addEventListener("click", submitDataToServer);

// Submit the form data to the server.
function submitDataToServer(event) {
  event.preventDefault();

  const dataObj = {
    Iban: document.getElementById("IBAN").value,
    Pin: document.getElementById("PIN").value,
    Dep_amount: document.getElementById("DepAm").value,
  };

  const requestMsg = new XMLHttpRequest();
  requestMsg.open("post", "/putData", true);
  requestMsg.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  requestMsg.addEventListener("load", function () {
    if (requestMsg.status < 200 || requestMsg.status >= 300) {
      console.error("Could not save entry:", requestMsg.responseText);
      alert("Could not save the entry. Please try again.");
      return;
    }
    getDataFromServer();
  });
  requestMsg.addEventListener("error", function () {
    console.error("Network error while saving entry.");
    alert("Could not reach the server. Please try again.");
  });
  requestMsg.send(JSON.stringify(dataObj));
}

// Load and display the latest entries.
getDataFromServer();
function getDataFromServer() {
  const requestMsg = new XMLHttpRequest();
  requestMsg.addEventListener("load", function () {
    if (requestMsg.status < 200 || requestMsg.status >= 300) {
      console.error("Could not load entries:", requestMsg.responseText);
      return;
    }
    displayData(requestMsg.responseText);
  });
  requestMsg.addEventListener("error", function () {
    console.error("Network error while loading entries.");
  });
  requestMsg.open("get", "/getData");
  requestMsg.send();
}

function displayData(responseText) {
  const entryList = document.getElementById("Entries");
  entryList.innerHTML = "";

  let entries;
  try {
    entries = JSON.parse(responseText);
  } catch (error) {
    console.error("Invalid response from server:", error);
    return;
  }

  entries.forEach(function (row) {
    const listItem = document.createElement("li");
    listItem.textContent = `${row.Iban} — €${row.Dep_amount}`;
    entryList.appendChild(listItem);
  });
}
