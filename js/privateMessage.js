// the way this will work is I will get the 2 names and sort them alphabetically, and then hash it
// that way the dms can be unique and stored

let user = localStorage.getItem("user");
let dms = localStorage.getItem("privateMessages");

let allUsers = document.querySelector("#allUsers");
let chatTitle = document.querySelector("#chatTitle-private");
let chatFrame = document.querySelector("#chatFrame-private");
let inputField = document.querySelector("#chatbox-private");
let sumbitButton = document.querySelector("#userSubmitButton-private");


function setUpPage (){
    let userObject = JSON.parse(user);
    let dMObject = JSON.parse(dms);
    let dmID = userObject.currentDM;
    let dm = dMObject[dmID];
    let members = dm.members;


    // set the title

    for (let member of members){
        if (member !== userObject.name){
            chatTitle.textContent = member;
        }
    }

    // populate the users



}

function onSubmit () {
    let message = inputField.value;

    if (message === "" || checkForWhiteSpace(message)) {
        alert("Please enter a real message");
        return;
    }

    let userObject = JSON.parse(user);
    let author = userObject.name;

    createTextBox(chatFrame, author, message);

    // Now we save it to local storage

    let currentGroup = returnCurrentGroup();

    let chat = {
        author : author,
        time : 0,
        text : message,
    }
}

userTextBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})
