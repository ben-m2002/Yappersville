// the way this will work is I will get the 2 names and sort them alphabetically, and then hash it
// that way the dms can be unique and stored

let user = localStorage.getItem("user");
let dms = localStorage.getItem("privateMessages");

let usersDiv = document.querySelector("#allUsers");
let chatTitle = document.querySelector("#chatTitle-private");
let chatFrame = document.querySelector("#chatFrame-private");
let inputField = document.querySelector("#chatbox-private");


function returnDM (){
    let userObject = JSON.parse(user);
    let dMObject = JSON.parse(dms);
    let dmID = userObject.currentDM;
    return dMObject[dmID];
}


// populate users

function setUpUsers (){
    // get the users
    let dm = returnDM();
    let userObject = JSON.parse(user);
    const members = dm.members
    // add the users to the page
    for (let member of members){
        if (member === userObject.name){
            continue;
        }
        let userDiv = document.createElement("div");
        userDiv.className = "userBox";
        let button = document.createElement("button");
        button.className = "userBoxButton";
        button.textContent = member;
        button.disabled = true;
        userDiv.appendChild(button);
        usersDiv.appendChild(userDiv);
    }
}

function setMessages (){
    let dm = returnDM();
    let messages = dm.messages;
    for (let message of messages){
        createTextBox(chatFrame, message.author, message.text);
    }
}

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
    // set the users
    setUpUsers();
    // set the stored messages
    setMessages();
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

    // save the chats
    dm = returnDM();
    dm.messages.push(chat);
    dms.push(dm);
    localStorage.setItem("privateMessages", JSON.stringify(dm));
}

inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})


setUpPage();