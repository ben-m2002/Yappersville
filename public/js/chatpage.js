let user = localStorage.getItem("user");
let currentGroup = null;
const usersDiv = document.querySelector("#allUsers");
const ChatText = document.querySelector("#chatTitle");
const userTextBox = document.querySelector("#chatbox");
const userTextSubmit = document.querySelector("#userSubmitButton");
const chatFrame = document.querySelector("#chatFrame");
const allGroups = JSON.parse(localStorage.getItem("groups"));


async function initialize(){
    // optimization tip in the future, get all the users and hit the server and get all possible dms that can come from this server
    await updateCurrentGroup();
    setUpPage();
}

initialize();


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

        button.onclick = async function () {
            let userObject = JSON.parse(user);
            let namesArray = [userObject.name, member];
            let sortedNamesString = namesArray.sort().join('');
            let dmID = hashString(sortedNamesString);

            // check if dm exists, if not create it

            let DM = null

            try {
                let response = await fetch(`/api/findDM/${dmID}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 200){
                    DM = await response.json();
                }
            }catch (e){
                alert(e);
                return
            }

            if (DM == null){
                DM = {
                    members: [userObject.name, member],
                    messages: [],
                    id: dmID,
                }
                // put dm on server
                try {
                    let response = await fetch("/api/create_dm", {
                        method : "POST",
                        headers : {
                            "Content-Type": "application/json",
                        },
                        body : JSON.stringify(DM),
                    });
                    if (response.status === 200){
                        console.log("DM created");
                    }
                    else{
                        alert("Error creating DM");
                        return;
                    }
                }catch (e){
                    alert(e);
                    return;
                }
            }
            // make this persist on the server
            userObject.currentDM = dmID;
            localStorage.setItem("user", JSON.stringify(userObject));
            await updateUser(userObject); // server update
            window.location.href = "private.html";
        }

        userDiv.appendChild(button);
        usersDiv.appendChild(userDiv);
    }

}

async function updateCurrentGroup (){
    let user = localStorage.getItem("user");
    const userObject = JSON.parse(user);
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

function setUpPage (){
    // set the title

    ChatText.textContent = currentGroup.groupName;

    // were going to set up the users box
    setUpUsers(currentGroup);
    setUpChats();
}

function setUpChats (){
    let allChats = currentGroup.allChats;
    for (let chat of allChats){
        createTextBox(chatFrame,chat.author, chat.text);
    }
}

// next we will create the chat function



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
        time : 0,
        text : message,
    }

    currentGroup.allChats.push(chat);
    // we have to update this group on the back end

    updateGroup(currentGroup).then(r => (r.status === 200) ? console.log("success") : console.log("error"));
}

userTextBox.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        onSubmit();
    }
})

// maybe set up tell a Joke API

