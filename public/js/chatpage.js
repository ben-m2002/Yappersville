let user = localStorage.getItem("user");
let currentGroup = null;
const usersDiv = document.querySelector("#allUsers");
const ChatText = document.querySelector("#chatTitle");
const userTextBox = document.querySelector("#chatbox");
const userTextSubmit = document.querySelector("#userSubmitButton");
const chatFrame = document.querySelector("#chatFrame");
const allGroups = JSON.parse(localStorage.getItem("groups"));
const DMSDiv = document.querySelector("#allDMS");

async function initialize(){
    // optimization tip in the future, get all the users and hit the server and get all possible dms that can come from this server
    await updateCurrentGroup();
    await setUpPage();
}

initialize();

async function updateCurrentGroup (){
    let user = localStorage.getItem("user");
    const userObject = JSON.parse(user);

    // check if user exists
     if (userObject == null){
        alert("Go login or register");
        window.location.href = "index.html";
        return
    }

    const currentGroupID = userObject.currentGroup; // this is an ID

    try {
        let response = await fetch(`/api/findGroup/${currentGroupID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            // continue
            currentGroup = await response.json();
        }
        else{
            alert("Error finding group");
        }
    }
    catch (e){
        alert(e);
    }
}



function setUpUsers (currentGroup){
    // get the users
    const members = currentGroup.members;
    // add the users to the page
    displayMembers(members, usersDiv);
}

async function setUpChats (){
    // clear the chat frame
    let elements = chatFrame.getElementsByClassName("textfield")
    let previousChats = null;

    if (currentGroup !== null){
        previousChats = currentGroup.allChats;
    }

    while (elements[0]){
        chatFrame.removeChild(elements[0]);
    }
    // update the chats
    try{
        let response = await fetch(`/api/findGroup/${currentGroup.id}`, {
            method : "Get",
            headers : {
                'Content-Type' : 'application/json'
            },
        });
        if (response.status === 200){
            currentGroup = await response.json();
            let allChats = currentGroup.allChats;
                for (let chat of allChats){
                 createTextBox(chatFrame,chat.author, chat.text);
             }
        }
        else{
            alert("Error finding group");
        }
    }catch (e){
        alert(e);
    }
}


async function setUpOpenDMs (){
    const user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
    // userObject has to exist by now
    try{
        let response = await fetch(`/api/getUserDMS/${userObject.name}`, {
            method : "Get",
            headers : {
                'Content-Type' : 'application/json'
            },
        });
        if (response.status === 200){
            const openDMS = await response.json();
            console.log(openDMS)
            let members = []
            for (let dm of openDMS){
                let names = dm.members;
                for (let name of names){
                    if (name === userObject.name){
                        members.push(name);
                    }
                }
            }
            displayMembers(members, DMSDiv);
        }
        else{
           console.log("User has no open dms")
        }
    }
    catch (e){
        alert(e)
    }
}


async function setUpPage (){
    let userObject = JSON.parse(localStorage.getItem("user"));

    // set the title
    ChatText.textContent = currentGroup.groupName;

    // were going to set up the users box
    setUpUsers(currentGroup);
    await setUpChats();
    await setUpOpenDMs()
}

async function onSubmit () {
    let message = userTextBox.value;

    if (message === "" || checkForWhiteSpace(message)) {
        alert("Please enter a real message");
        return;
    }

    let userObject = JSON.parse(user);
    let author = userObject.name;

    // parse a message here because we can replace message with joke

    message = await parseMessage(message);

    createTextBox(chatFrame, author, message)

    // Now we gotta save it

    let chat = {
        author : author,
        time : Math.floor(Date.now() / 1000),
        text : message,
    }

    // updates
    currentGroup.allChats.push(chat);
    updateGroup(currentGroup).then(r => (r.status === 200) ? console.log("success") : console.log("error"));
    setUpChats();
}

userTextBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})

// maybe set up tell a Joke API

