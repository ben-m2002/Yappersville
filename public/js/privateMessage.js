// the way this will work is I will get the 2 names and sort them alphabetically, and then hash it
// that way the dms can be unique and stored

let user = localStorage.getItem("user");
let usersDiv = document.querySelector("#allUsers");
let chatTitle = document.querySelector("#chatTitle-private");
let chatFrame = document.querySelector("#chatFrame-private");
let inputField = document.querySelector("#chatbox-private");
let dm = null;

async function initialize (){
    await updateCurrentDM();
    setUpPage();
}

initialize()

async function updateCurrentDM (){
    let user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
    const dmID = userObject.currentDM; // this is an ID

    try {
        let response = await fetch(`/api/findDM/${dmID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            dm = await response.json();
        }
        else{
            alert("Error finding DM");
        }
    }
    catch (e){
        alert(e);
    }
}


// populate users

function setUpUsers (){
    // get the users
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
    let messages = dm.messages;
    for (let message of messages){
        createTextBox(chatFrame, message.author, message.text);
    }
}

function setUpPage (){
    let userObject = JSON.parse(user);
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

async function onSubmit () {
    let message = inputField.value;

    if (message === "" || checkForWhiteSpace(message)) {
        alert("Please enter a real message");
        return;
    }

    let userObject = JSON.parse(user);
    let author = userObject.name;

    message = await parseMessage(message);

    createTextBox(chatFrame, author, message);

    // Now we save it to local storage

    let chat = {
        author : author,
        time : 0,
        text : message,
    }

    // save the chats
    dm.messages.push(chat);
    //const id = dm.id
    updateDM(dm).then(r => (r.status === 200) ? console.log("success") : console.log("error"));
}

inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})
