let user = localStorage.getItem("user");
const usersDiv = document.querySelector("#allUsers");
const ChatText = document.querySelector("#chatTitle");
const userTextBox = document.querySelector("#chatbox");
const userTextSubmit = document.querySelector("#userSubmitButton");
const chatFrame = document.querySelector("#chatFrame");
const allGroups = JSON.parse(localStorage.getItem("groups"));

function setUpUsers (currentGroup){
    // get the users
    const members = currentGroup.members;

    // add the users to the page

    for (let member of members){
        let userDiv = document.createElement("div");
        userDiv.className = "userBox";

        let button = document.createElement("button");
        button.className = "userBoxButton";
        button.textContent = member;

        userDiv.appendChild(button);
        usersDiv.appendChild(userDiv);
    }

}

function returnCurrentGroup (){
    // get userObject
    const userObject = JSON.parse(user);
    const currentGroupID = userObject.currentGroup; // this is an ID
    let currentGroup = null;

    // get the group
    for (let group of allGroups){
        if (group.id === currentGroupID){
            currentGroup = group;
        }
    }

    return currentGroup
}

function setUpPage (){
    let currentGroup = returnCurrentGroup();

    // set the title

    ChatText.textContent = currentGroup.groupName;

    // were going to set up the users box
    setUpUsers(currentGroup);
}

function setUpChats (){

}

// next we will create the chat function

function createTextBox (author, message){
     let div = document.createElement("div");
    div.className = "textfield";

    let p1 = document.createElement("p");
    p1.className = "textfield-name";

    let p2 = document.createElement("p");
    p2.className = "textfield-text";

    p1.textContent = author;
    p2.textContent = message;

    div.appendChild(p1);
    div.appendChild(p2);

    chatFrame.appendChild(div);
}

function onSubmit () {
    let message = userTextBox.value;

    if (message === "" || checkForWhiteSpace(message)) {
        alert("Please enter a real message");
        return;
    }

    let userObject = JSON.parse(user);
    let author = userObject.name;

    createTextBox(author, message);

    // Now we gotta save it

    let currentGroup = returnCurrentGroup();

    let chat = {
        author : author,
        time : 0,
        text : message,
    }


    // now we gotta save it to local storage
    currentGroup.allChats.push(chat);
    localStorage.setItem("groups", JSON.stringify(allGroups));

}

userTextBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})

// maybe set up tell a Joke API

setUpPage();