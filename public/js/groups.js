const join_text = document.querySelector('#join-group');
const join_button = document.querySelector('#join-button');

const create_text = document.querySelector('#create-group');
const create_button = document.querySelector('#create-button');

const image_label = document.querySelector('#image_upload');
let imageData = null;


function generateUniqueID(){
    return (Date.now().toString(36) + Math.random().toString(36).substring(2, 5)).toUpperCase().substring(0, 8)
}

function createGroupButtonElement (name, image, altText, id){
    const div = document.createElement('div');
    div.classList.add("group-card");

    const button = document.createElement('button');
    const img =  document.createElement('img');

    img.src = image;
    img.alt = altText;
    img.width = 50;
    img.height = 50;
    img.className = "group-button-image";

    button.appendChild(img); // make the image a child of the button
    button.appendChild(document.createTextNode(name)); // make the name a child of the button

    button.onclick = function (){
        let userJson = localStorage.getItem("user");
        let userObject = JSON.parse(userJson);
        userObject.currentGroup = id;
        localStorage.setItem("user", JSON.stringify(userObject));
        window.location.href = "chatpage.html";
    }

    div.appendChild(button); // make the button a child of the div

    document.querySelector('#groups-grid').appendChild(div); // make the div a child of the group-buttons div
}

function getRawImage (event){
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        imageData = file; // 'imageData' should be a global variable
    }
    else {
        alert("Please upload an image file");
    }
}


async function onCreate (){
    let userJson = localStorage.getItem("user");
    let userObject = JSON.parse(userJson);

    const groupId = generateUniqueID();
    const groupName = create_text.value;


    if (groupName === "" || checkForWhiteSpace(groupName)){
        alert("Please a real group name!");
        return;
    }

    if (imageData === null){
        alert("Please upload an image for the group");
    }

    // make sure the userObject exists

    if (userObject === null){
        alert("Please login or register");
        return;
    }

    let group = {
        id : groupId,
        groupName : groupName,
        creator : userObject.name, // in the future we will use a join so that if it updates in one place it updates in all places
        dateCreated : Date.now(),
        profilePic : "", // This will be s3 url
        allChats : [
            {
                author : "Admin",
                time : 0,
                text : "This is just texter text",
            }
        ],
        members : [userObject.name], // in the future we will use a join so that if it updates in one place it updates in all places
        admins : [userObject.name], // in the future we will use a join so that if it updates in one place it updates in all places
    }

    // were going to send a group object to the server
    // and were not going to work with all groups in the local storage, just the designated one

    try{
        const formData = new FormData();
        formData.append("profilePic", imageData);
        formData.append('group', JSON.stringify(group));

        let response = await fetch("/api/createGroup", {
            method : "POST",
            body : formData,
        });

        if (response.status === 200){
            // update image
            let data = await response.json();
            group.profilePic = data.imageURL;
            // update the user object on client
            userObject.groups.push(group.id);
            userObject.currentGroup = group.id;
            localStorage.setItem("user", JSON.stringify(userObject));
            localStorage.setItem("currentGroup", JSON.stringify(group));

            // update the user object on server, async

            let response2 = await updateUser(userObject);

            if (response2.status === 200){
                window.location.href = "chatpage.html";
                console.log("user updated and group created")
            }
            else{
                alert("Error updating user, make sure you're logged in");
            }
        }
        else{
            alert("Error creating group");
        }
    }catch (e){
        alert(e);
    }

}

async function onJoin (){
    const user = localStorage.getItem("user");
    let userObject = JSON.parse(user);
    const groupId = join_text.value;

    // make sure the userObject exists
    if (userObject === null){
        alert("Please login or register");
        return;
    }

    // make sure the group id is valid
    if (groupId === "" || checkForWhiteSpace(groupId)){
        alert("Please a real group id!");
        return;
    }

    // look for the group on the server

    let joinedGroup = null;

    try{
        let response = await fetch(`/api/findGroup?${currentGroup.id}`, {
            method : "Get",
            headers : {
                'Content-Type' : 'application/json'
            },
        });
        if (response.status === 200){
            joinedGroup = await response.json();
        }
        else{
            alert("Error finding group");
            return;
        }
    }catch (e){
        alert(e);
        return;
    }

    // alert user if group doesnt exit

    if (joinedGroup === null) {
        alert("Group not found");
        return;
    }

    // update values
    joinedGroup.members.push(userObject.name);
    userObject.groups.push(joinedGroup.id);
    userObject.currentGroup = joinedGroup.id;

    // update the server
    let response = await updateUser(userObject);
    let response2 = await updateGroup(joinedGroup);

    if (response.status === 200 && response2.status === 200){
        window.location.href = "chatpage.html";
    }
    else{
        alert("Error updating user or group")
    }
    // update the local storage
    localStorage.setItem("user", JSON.stringify(userObject));
}

async function populateGroups (){
    let userObject = JSON.parse(localStorage.getItem("user"));
    if (userObject == null){
        alert("Go login or register");
        window.location.href = "index.html";
        return
    }
    let allGroups = null

    try{
        let response = await fetch("/api/userGroups?name=" + userObject.name, {
            method : "Get",
            headers : {
                'Content-Type' : 'application/json'
            },
        });
        if (response.status === 200){
            allGroups = await response.json();
        }
        else{
            alert("Error finding the users groups");
            return;
        }
    }catch (e){
        alert(e);
        return;
    }
    for (let group of allGroups){
        for (let member of group.members){
            if (member === userObject.name){
                createGroupButtonElement(group.groupName, group.profilePic, group.groupName, group.id);
            }
        }
    }
}

image_label.addEventListener('change', getRawImage);
populateGroups();
